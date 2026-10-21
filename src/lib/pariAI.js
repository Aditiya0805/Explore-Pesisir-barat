/**
 * Pari AI — On-device rule-based travel assistant engine.
 *
 * Design goals:
 *  - Zero external API keys required (fully offline & privacy friendly).
 *  - Reads REAL data from the site (packages, guides, destinations) instead of
 *    hard-coded copy, so answers always stay in sync with the data layer.
 *  - Understands budget, number of guests and traveler interests and produces
 *    compare-able package recommendations.
 *  - Returns structured replies `{ text, actions }` so the UI can render direct
 *    call-to-action buttons (e.g. "Book this package").
 *  - Bilingual (Indonesian / English).
 *  - Never throws and never surfaces technical errors to the user.
 */

// ---------------------------------------------------------------------------
// Interest taxonomy
// ---------------------------------------------------------------------------
const INTEREST_KEYWORDS = {
  surf: ['surf', 'selancar', 'ombak', 'wave', 'barrel', 'board', 'peselancar', 'left-hander', 'pipeline', 'berselancar'],
  family: ['keluarga', 'anak', 'family', 'children', 'kid', 'ramah anak', 'family-friendly', 'parents', 'orang tua'],
  culture: ['budaya', 'culture', 'tapis', 'tenun', 'saibatin', 'adat', 'heritage', 'sejarah', 'traditional', 'weaving', 'craft', 'kriya'],
  culinary: ['kuliner', 'makan', 'makanan', 'food', 'seruit', 'seafood', 'ikan bakar', 'dish', 'cuisine', 'restaurant', 'grill', 'street food', 'oleh-oleh', 'souvenir', 'lalapan'],
  island: ['pulau', 'island', 'lumba', 'dolphin', 'snorkel', 'banana', 'kapal', 'boat', 'penyeberangan'],
  nature: ['air terjun', 'waterfall', 'hutan', 'trekking', 'alam', 'nature', 'gunung', 'camping', 'forest', 'curug'],
  budget: ['hemat', 'murah', 'budget', 'cheap', 'affordable', 'ekonomis', 'low cost', 'irit', 'terjangkau'],
  guide: ['pemandu', 'guide', 'instructor', 'pelatih', 'coach', 'tour guide', 'instruktur']
}

// Which interests each package is tailored for.
const PACKAGE_INTERESTS = {
  surf: ['surf'],
  beach: ['family', 'culinary', 'nature', 'culture'],
  sunset: ['culture', 'culinary', 'family'],
  family: ['island', 'family', 'culinary', 'nature']
}

// Minimum travellers each package is designed for.
const PACKAGE_MIN_PERSONS = {
  surf: 1,
  beach: 2,
  sunset: 2,
  family: 4
}

// Interests mapped to destination ids (Real site destinations).
const INTEREST_DESTINATIONS = {
  surf: [1, 2, 4, 5],
  family: [3, 4, 7, 16, 17, 18],
  culinary: [4, 16],
  island: [14, 18],
  culture: [10, 12, 13],
  nature: [6, 7, 9, 13, 17],
  landmark: [8, 11, 15]
}

const INTEREST_LABEL = {
  id: {
    surf: 'surfing', family: 'wisata keluarga', culture: 'budaya & tenun',
    culinary: 'kuliner', island: 'wisata pulau', nature: 'alam & ekowisata',
    budget: 'hemat biaya', guide: 'pemandu'
  },
  en: {
    surf: 'surfing', family: 'family travel', culture: 'culture & weaving',
    culinary: 'culinary', island: 'island hopping', nature: 'nature & eco',
    budget: 'budget friendly', guide: 'guided tours'
  }
}

// ---------------------------------------------------------------------------
// Parsing helpers
// ---------------------------------------------------------------------------

/** Extract an approximate budget in IDR from free text. */
function parseBudget(raw) {
  const q = String(raw || '').toLowerCase()
  // Normalise Indonesian thousands separators inside plain large numbers.
  const compact = q.replace(/(\d)\.(?=\d{3}\b)/g, '$1')

  const suffixMatch = compact.match(/(\d+(?:[.,]\d+)?)\s*(jt|juta|jutaan|ribu|rb|k\b|million|mio)/)
  if (suffixMatch) {
    const num = parseFloat(suffixMatch[1].replace(',', '.'))
    const unit = suffixMatch[2]
    if (isNaN(num)) return null
    if (/jt|juta|million|mio/.test(unit)) return Math.round(num * 1_000_000)
    if (/ribu|rb|k/.test(unit)) return Math.round(num * 1_000)
  }

  const plain = compact.match(/\b(\d{6,})\b/)
  if (plain) return parseInt(plain[1], 10)

  return null
}

/** Detect how many travellers the user mentions. */
function parseGuests(raw) {
  const q = String(raw || '').toLowerCase()
  const m = q.match(/(\d+)\s*(orang|pax|people|person|persons|guest|guests|adults|dewasa|peserta|tamu)/)
  if (m) return parseInt(m[1], 10)

  const forM = q.match(/\bfor\s+(\d+)\b/)
  if (forM) return parseInt(forM[1], 10)

  return null
}

/** Detect a set of interests present in the query. */
function parseInterests(raw) {
  const q = String(raw || '').toLowerCase()
  const found = new Set()
  for (const [key, words] of Object.entries(INTEREST_KEYWORDS)) {
    if (words.some(w => q.includes(w))) found.add(key)
  }
  return found
}

// ---------------------------------------------------------------------------
// Recommendation scoring
// ---------------------------------------------------------------------------
function recommendPackages({ packages, interests, budget, guests, isEn }) {
  const scored = packages.map(pkg => {
    let score = 0
    const profile = PACKAGE_INTERESTS[pkg.id] || []

    // Interest overlap
    for (const interest of interests) {
      if (interest === 'budget' || interest === 'guide') continue
      if (profile.includes(interest)) score += 2
    }

    // Budget fit (compare unit price against the stated budget)
    let budgetNote = null
    if (budget) {
      if (pkg.price <= budget) {
        score += 2
        budgetNote = 'fit'
      } else if (pkg.price <= budget * 1.15) {
        score += 0
        budgetNote = 'stretch'
      } else {
        score -= 5
        budgetNote = 'over'
      }
    }

    // Budget-minded users get a small nudge toward cheaper options.
    if (interests.has('budget')) {
      score += Math.max(0, 3 - pkg.price / 1_000_000)
    }

    // Guest-count fit
    const minP = PACKAGE_MIN_PERSONS[pkg.id] || 1
    if (!guests || guests >= minP) score += 0.5
    if (guests && guests >= 4 && pkg.id === 'family') score += 1.5
    if (guests && guests <= 2 && pkg.id !== 'family') score += 0.5

    return { pkg, score, budgetNote }
  })

  scored.sort((a, b) => b.score - a.score)
  return scored
}

// ---------------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------------
function pkgLine(pkg, isEn, fmt) {
  const unit = pkg.id === 'family'
    ? (isEn ? 'group' : 'pack')
    : (isEn ? 'pax' : 'pax')
  return `<li style="margin-bottom:0.35rem;"><strong>${pkg.name}</strong> — ${fmt(pkg.price)} / ${unit}` +
    `<br><span style="color:var(--color-text-light); font-size:0.82rem;">${pkg.duration || ''}${pkg.description ? ' • ' + pkg.description : ''}</span></li>`
}

function guideLine(g, isEn, fmt) {
  const langText = isEn ? 'Languages' : 'Bahasa'
  return `<li style="margin-bottom:0.35rem;"><strong>${g.name}</strong> — ${g.specialty}` +
    `<br><span style="color:var(--color-text-light); font-size:0.82rem;">${fmt(g.price)}${g.price_unit || (isEn ? ' / day' : ' / hari')} • ★ ${g.rating} • ${langText}: ${g.languages || '-'}</span></li>`
}

function destLine(dest, isEn, fmt) {
  const priceLabel = dest.price ? `${fmt(dest.price)}${isEn ? ' / person' : ' / orang'}` : (isEn ? 'Free' : 'Gratis')
  return `<li style="margin-bottom:0.35rem;"><strong>${dest.name}</strong> — ${dest.category || ''}` +
    `<br><span style="color:var(--color-text-light); font-size:0.82rem;">${priceLabel} • ★ ${(dest.rating || '').split(' ')[0] || '4.8'}</span></li>`
}

// ---------------------------------------------------------------------------
// Reply builders
// ---------------------------------------------------------------------------
function buildGreeting(isEn) {
  return {
    text: isEn
      ? `<p>Hi Traveler! 👋 I'm <strong>Pari AI</strong>, the smart guide of <strong>Pesibar Wave</strong>. Tell me your <em>interests</em>, your <em>budget</em> and <em>how many people</em> are travelling, and I'll match the perfect package for you.</p><p>Try something like: <em>"Family trip for 4 people, budget 1.5 million"</em> or <em>"beginner surfing, 2 people"</em>.</p>`
      : `<p>Halo Traveler! 👋 Saya <strong>Pari AI</strong>, pemandu cerdas <strong>Pesibar Wave</strong>. Sebutkan <em>minat</em>, <em>budget</em>, dan <em>jumlah orang</em> Anda, nanti saya carikan paket yang paling cocok.</p><p>Contoh: <em>"Liburan keluarga 4 orang budget 1,5 juta"</em> atau <em>"surfing pemula ber-2"</em>.</p>`,
    actions: []
  }
}

function buildRecommendation(ctx) {
  const { isEn, fmt, interests, budget, guests, destinations } = ctx
  const ranked = recommendPackages(ctx)
  const top = ranked[0]
  const second = ranked[1]

  const labelMap = INTEREST_LABEL[isEn ? 'en' : 'id']
  const interestList = [...interests]
    .filter(i => i !== 'budget' && i !== 'guide')
    .map(i => labelMap[i])
    .filter(Boolean)

  const criteria = []
  if (interestList.length) criteria.push((isEn ? 'interests: ' : 'minat: ') + interestList.join(', '))
  if (guests) criteria.push((isEn ? 'travellers: ' : 'jumlah: ') + guests + (isEn ? ' people' : ' orang'))
  if (budget) criteria.push((isEn ? 'budget: ' : 'budget: ') + fmt(budget))

  const criteriaText = criteria.length
    ? criteria.join(' • ')
    : (isEn ? 'your upcoming trip' : 'perjalanan Anda')

  const header = isEn
    ? `<p>Great! Here's my recommendation for ${criteriaText}:</p>`
    : `<p>Siap! Berikut rekomendasi terbaik dari saya untuk ${criteriaText}:</p>`

  const pkg = top.pkg
  const unit = pkg.id === 'family' ? (isEn ? 'group' : 'pack') : 'pax'
  const estimated = (pkg.id === 'family' || !guests) ? pkg.price : pkg.price * guests
  const budgetFitText = (() => {
    if (!budget) return ''
    if (top.budgetNote === 'over') {
      return isEn
        ? `<p style="font-size:0.85rem; color:var(--color-sunset-orange);">💡 Slightly above your budget — ask us about flexible instalments & off-season discounts.</p>`
        : `<p style="font-size:0.85rem; color:var(--color-sunset-orange);">💡 Sedikit di atas budget — tanyakan skema cicilan fleksibel & diskon low season.</p>`
    }
    return isEn
      ? `<p style="font-size:0.85rem; color:var(--color-success);">✅ Fits comfortably within your budget.</p>`
      : `<p style="font-size:0.85rem; color:var(--color-success);">✅ Pas dan masih di dalam anggaran Anda.</p>`
  })()

  let text = header
  text += `<div style="margin:0.5rem 0; padding:0.75rem; border-radius:12px; background:rgba(8,126,164,0.07); border:1px solid rgba(8,126,164,0.15);">`
  text += `<strong style="color:var(--color-ocean-blue); font-size:1rem;">${pkg.name}</strong><br>`
  text += `<span style="font-size:0.9rem;">${pkg.description || ''}</span><br>`
  text += `<span style="font-size:0.9rem; font-weight:700; color:var(--color-deep-navy);">${fmt(pkg.price)} / ${unit}</span>`
  if (guests && pkg.id !== 'family') {
    text += `<br><span style="font-size:0.82rem; color:var(--color-text-light);">${isEn ? 'Estimated for' : 'Estimasi untuk'} ${guests} ${isEn ? 'people' : 'orang'}: <strong>${fmt(estimated)}</strong></span>`
  }
  text += `</div>`
  text += budgetFitText

  if (second && !budget) {
    text += isEn
      ? `<p style="font-size:0.85rem; margin-top:0.5rem;">Also worth considering: <strong>${second.pkg.name}</strong> (${fmt(second.pkg.price)} / ${second.pkg.id === 'family' ? 'group' : 'pax'}).</p>`
      : `<p style="font-size:0.85rem; margin-top:0.5rem;">Alternatif menarik: <strong>${second.pkg.name}</strong> (${fmt(second.pkg.price)} / ${second.pkg.id === 'family' ? 'pack' : 'pax'}).</p>`
  }

  // Suggest destinations aligned with the interests.
  const destIds = new Set()
  for (const interest of interests) {
    (INTEREST_DESTINATIONS[interest] || []).forEach(id => destIds.add(id))
    if (destIds.size >= 3) break
  }
  const suggested = [...destIds]
    .map(id => destinations.find(d => Number(d.id) === Number(id)))
    .filter(Boolean)
    .slice(0, 3)

  if (suggested.length) {
    text += isEn
      ? `<p style="margin-top:0.5rem;">📍 Top spots for you:</p><ul style="padding-left:1.1rem; margin:0.25rem 0;">`
      : `<p style="margin-top:0.5rem;">📍 Destinasi yang cocok untukmu:</p><ul style="padding-left:1.1rem; margin:0.25rem 0;">`
    suggested.forEach(d => { text += destLine(d, isEn, fmt) })
    text += `</ul>`
  }

  const actions = [
    { type: 'book', packageId: pkg.id, label: isEn ? `Book ${pkg.name}` : `Pesan ${pkg.name}` }
  ]
  if (second && !budget) {
    actions.push({
      type: 'book',
      packageId: second.pkg.id,
      label: isEn ? `Book ${second.pkg.name}` : `Pesan ${second.pkg.name}`
    })
  }
  if (suggested[0]) {
    actions.push({
      type: 'detail',
      destinationId: suggested[0].id,
      label: isEn ? `Explore ${suggested[0].name}` : `Lihat ${suggested[0].name}`
    })
  }

  return { text, actions }
}

function buildPricing(ctx) {
  const { isEn, fmt, packages, interests } = ctx
  let text = isEn
    ? `<p>💰 Here are our verified package rates, straight from the booking system:</p><ul style="padding-left:1.1rem; margin:0.4rem 0;">`
    : `<p>💰 Berikut tarif paket resmi kami, langsung dari sistem pemesanan:</p><ul style="padding-left:1.1rem; margin:0.4rem 0;">`
  packages.forEach(p => { text += pkgLine(p, isEn, fmt) })
  text += `</ul>`
  text += isEn
    ? `<p style="font-size:0.85rem;">🧭 Add-ons: exclusive surf guide <strong>${fmt(250000)}/day</strong> • cinematic drone video <strong>${fmt(100000)}</strong>.</p>`
    : `<p style="font-size:0.85rem;">🧭 Layanan tambahan: pemandu surfing eksklusif <strong>${fmt(250000)}/hari</strong> • dokumentasi drone <strong>${fmt(100000)}</strong>.</p>`

  // If we also detected an interest, append a tailored rec.
  const actions = []
  if (interests && [...interests].some(i => !['budget', 'guide'].includes(i))) {
    const rec = buildRecommendation(ctx)
    text += `<hr style="border:none; border-top:1px dashed var(--color-border); margin:0.5rem 0;">` + rec.text
    return { text, actions: rec.actions }
  }
  actions.push({ type: 'route', route: '/booking', label: isEn ? 'Open booking form' : 'Buka form pemesanan' })
  return { text, actions }
}

function buildGuides(ctx) {
  const { isEn, fmt, guides } = ctx
  if (!guides || !guides.length) {
    return {
      text: isEn ? `<p>Our licensed local guides are available on request for every package.</p>` : `<p>Pemandu lokal berlisensi kami tersedia sesuai permintaan untuk setiap paket.</p>`,
      actions: [{ type: 'route', route: '/booking', label: isEn ? 'Book with a guide' : 'Pesan bersama pemandu' }]
    }
  }
  let text = isEn
    ? `<p>🧑‍🏫 Licensed local guides ready to accompany your trip:</p><ul style="padding-left:1.1rem; margin:0.4rem 0;">`
    : `<p>🧑‍🏫 Pemandu lokal berlisensi yang siap menemani perjalanan Anda:</p><ul style="padding-left:1.1rem; margin:0.4rem 0;">`
  guides.forEach(g => { text += guideLine(g, isEn, fmt) })
  text += `</ul>`
  text += isEn
    ? `<p style="font-size:0.85rem;">You can add the exclusive guide option during booking for <strong>${fmt(250000)}/day</strong>.</p>`
    : `<p style="font-size:0.85rem;">Anda dapat menambahkan opsi pemandu eksklusif saat pemesanan seharga <strong>${fmt(250000)}/hari</strong>.</p>`
  return {
    text,
    actions: [{ type: 'route', route: '/booking', label: isEn ? 'Add a guide to my booking' : 'Tambah pemandu di pemesanan' }]
  }
}

function buildDestinations(ctx) {
  const { isEn, fmt, destinations, interests } = ctx
  let picks = destinations
  if (interests && interests.size) {
    const ids = new Set()
    for (const interest of interests) (INTEREST_DESTINATIONS[interest] || []).forEach(id => ids.add(id))
    if (ids.size) {
      picks = [...ids].map(id => destinations.find(d => Number(d.id) === Number(id))).filter(Boolean)
    }
  }
  if (!picks.length) picks = destinations.slice(0, 5)
  picks = picks.slice(0, 5)

  let text = isEn
    ? `<p>🗺️ Must-visit destinations in Pesisir Barat:</p><ul style="padding-left:1.1rem; margin:0.4rem 0;">`
    : `<p>🗺️ Destinasi wajib dikunjungi di Pesisir Barat:</p><ul style="padding-left:1.1rem; margin:0.4rem 0;">`
  picks.forEach(d => { text += destLine(d, isEn, fmt) })
  text += `</ul>`

  const actions = picks.slice(0, 2).map(d => ({
    type: 'detail',
    destinationId: d.id,
    label: isEn ? `Explore ${d.name}` : `Lihat ${d.name}`
  }))
  return { text, actions }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate a structured reply for a user query.
 *
 * @param {string} rawQuery
 * @param {object} ctx
 * @param {boolean} ctx.isEn
 * @param {(n:number)=>string} ctx.fmt        currency formatter
 * @param {Array} ctx.packages                real packages data
 * @param {Array} ctx.guides                  real guides data
 * @param {Array} ctx.destinations            localized destinations data
 * @returns {{ text: string, actions: Array }}
 */
export function generatePariReply(rawQuery, ctx) {
  try {
    const query = String(rawQuery || '').toLowerCase().trim()
    const isEn = ctx.isEn
    const interests = parseInterests(query)
    const budget = parseBudget(query)
    const guests = parseGuests(query)

    const enriched = { ...ctx, interests, budget, guests }

    // Greetings / help
    if (/^(hi|hai|halo|hello|hey|help|bantu|pagi|siang|malam)\b/.test(query) && query.length < 20) {
      return buildGreeting(isEn)
    }

    const askPackage = /(pas?ket|package|tour|liburan|vacation|itinerary|honeymoon)/
    const askPrice = /(harga|biaya|tarif|price|cost|rate|berapa|budget|cheap|murah|hemat)/
    const askGuide = /(pemandu|guide|instructor|pelatih|coach|instruktur)/
    const askDestination = /(destinasi|destination|tempat|spot|wisata|rekomendasi|recommend|kemana|where|pantai|beach|liburan)/
    const hasInterest = [...interests].some(i => !['budget', 'guide'].includes(i))

    const isAskingPrice = askPrice.test(query)
    const isAskingGuide = askGuide.test(query)

    // Explicit pricing and/or guide questions. If the user also quantifies a
    // budget or a group size, we skip this and give a tailored recommendation.
    if (!hasInterest && !budget && !guests && (isAskingPrice || isAskingGuide)) {
      const parts = []
      const actions = []
      if (isAskingPrice) {
        const p = buildPricing(enriched)
        parts.push(p.text)
        actions.push(...p.actions)
      }
      if (isAskingGuide) {
        const g = buildGuides(enriched)
        parts.push(g.text)
        actions.push(...g.actions)
      }
      const seen = new Set()
      const uniqueActions = actions.filter(a => {
        const k = a.type + ':' + (a.route || a.packageId || a.destinationId || '')
        if (seen.has(k)) return false
        seen.add(k)
        return true
      })
      return {
        text: parts.join('<hr style="border:none; border-top:1px dashed var(--color-border); margin:0.6rem 0;">'),
        actions: uniqueActions.slice(0, 3)
      }
    }

    // Recommendation: whenever user gives interests / budget / guests, or asks
    // for a package/destination recommendation.
    if (hasInterest || budget || guests || askPackage.test(query) || askDestination.test(query)) {
      return buildRecommendation(enriched)
    }

    // Fallback: friendly overview + suggestions
    return buildDestinations(enriched)
  } catch (err) {
    // Absolute safety net: never surface errors to the user.
    const isEn = ctx && ctx.isEn
    return {
      text: isEn
        ? `<p>I'd love to help you plan your trip with Pesibar Wave! Tell me your interests, budget and number of travellers.</p>`
        : `<p>Saya siap membantu merencanakan liburan Anda bersama Pesibar Wave! Sebutkan minat, budget, dan jumlah orang.</p>`,
      actions: [{ type: 'route', route: '/booking', label: isEn ? 'Open booking form' : 'Buka form pemesanan' }]
    }
  }
}

export const PARI_AI_INTEREST_KEYWORDS = INTEREST_KEYWORDS
