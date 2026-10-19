/**
 * Booking proof utilities: printable PDF receipt (jsPDF) + WhatsApp share link.
 * All strings are bilingual and the PDF uses only core fonts (no missing glyphs).
 * jsPDF is loaded lazily so it never bloats the initial app bundle.
 */

// Fallback operator number (digits only, international format).
const DEFAULT_ADMIN_WA = '6281234567890'

export function getAdminWhatsApp() {
  const raw = import.meta.env.VITE_ADMIN_WHATSAPP
  const digits = String(raw || DEFAULT_ADMIN_WA).replace(/[^0-9]/g, '')
  return digits || DEFAULT_ADMIN_WA
}

/** Format a number as Indonesian Rupiah without exotic unicode spaces. */
function rp(value) {
  const n = Number(value) || 0
  return 'Rp ' + n.toLocaleString('id-ID')
}

function formatDate(dateStr, isEn) {
  if (!dateStr) return isEn ? 'To be confirmed' : 'Belum ditentukan'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString(isEn ? 'en-US' : 'id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
}

/**
 * Build an auto-filled WhatsApp deep link for a booking.
 */
export function buildWhatsAppLink(booking, isEn) {
  const phone = getAdminWhatsApp()
  const lines = isEn
    ? [
        `Hello Pesibar Wave! I would like to confirm my booking:`,
        ``,
        `Booking Code: ${booking.code}`,
        `Package: ${booking.packageName}`,
        `Name: ${booking.name}`,
        `Visit Date: ${formatDate(booking.visitDate, true)}`,
        `Guests: ${booking.guests}`,
        booking.guideAddon ? `Add-on: Exclusive Surf Guide` : null,
        booking.photoAddon ? `Add-on: Cinematic Drone Video` : null,
        `Estimated Total: ${rp(booking.total)}`,
        ``,
        `Please advise the next steps. Thank you!`
      ]
    : [
        `Halo Pesibar Wave! Saya ingin konfirmasi pemesanan saya:`,
        ``,
        `Kode Booking: ${booking.code}`,
        `Paket: ${booking.packageName}`,
        `Nama: ${booking.name}`,
        `Tanggal Kunjungan: ${formatDate(booking.visitDate, false)}`,
        `Jumlah Wisatawan: ${booking.guests}`,
        booking.guideAddon ? `Tambahan: Jasa Pemandu Surfing Eksklusif` : null,
        booking.photoAddon ? `Tambahan: Dokumentasi Drone & Video Sinematik` : null,
        `Total Estimasi: ${rp(booking.total)}`,
        ``,
        `Mohon informasi langkah selanjutnya. Terima kasih!`
      ]

  const text = lines.filter(l => l !== null).join('\n')
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}

/**
 * Draw the Pesibar Wave logo mark (tapis diamond + ocean waves) inside a
 * rounded badge using jsPDF vector primitives. Falls back to a "PW" text
 * mark if the vector API is unavailable.
 */
function drawLogoBadge(doc, x, y, size) {
  const radius = size * 0.2
  doc.setFillColor(8, 126, 164)
  doc.roundedRect(x, y, size, size, radius, radius, 'F')
  try {
    const cx = x + size / 2
    const dw = size * 0.085
    const dh = size * 0.11
    const dy = y + size * 0.12

    // Tapis geometric diamond motif
    doc.setFillColor(255, 255, 255)
    doc.lines([[dw, dh], [-dw, dh], [-dw, -dh], [dw, -dh]], cx, dy - dh, [1, 1], 'F', true)
    doc.circle(x + size * 0.28, dy, size * 0.028, 'F')
    doc.circle(x + size * 0.72, dy, size * 0.028, 'F')

    // Ocean waves
    doc.setDrawColor(255, 255, 255)
    const waveX = x + size * 0.15
    const waveW = size * 0.7
    const segs = 12
    const periods = 1.5
    const dx = waveW / segs
    const amp = size * 0.055
    ;[0.5, 0.66, 0.82].forEach((fy, idx) => {
      const baseY = y + size * fy
      const deltas = []
      let prev = 0
      for (let i = 1; i <= segs; i++) {
        const v = Math.sin((i / segs) * Math.PI * 2 * periods) * amp
        deltas.push([dx, v - prev])
        prev = v
      }
      doc.setLineWidth(size * 0.035 * (1 - idx * 0.18))
      doc.lines(deltas, waveX, baseY, [1, 1], 'S', false)
    })
  } catch (err) {
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(size * 0.55)
    doc.text('PW', x + size / 2, y + size * 0.64, { align: 'center' })
  }
}

/**
 * Generate and download a booking receipt PDF (jsPDF loaded on demand).
 */
export async function downloadBookingPdf(booking, isEn) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const margin = 18
  let y = 0

  const T = {
    title: isEn ? 'Booking Confirmation' : 'Bukti Pemesanan',
    subtitle: isEn ? 'Pesibar Wave Tourism Portal' : 'Portal Wisata Pesibar Wave',
    code: isEn ? 'BOOKING CODE' : 'KODE BOOKING',
    details: isEn ? 'Guest & Trip Details' : 'Detail Pemesan & Perjalanan',
    name: isEn ? 'Full Name' : 'Nama Lengkap',
    phone: isEn ? 'WhatsApp' : 'WhatsApp',
    email: isEn ? 'Email' : 'Email',
    pkg: isEn ? 'Tour Package' : 'Paket Wisata',
    date: isEn ? 'Visit Date' : 'Tanggal Kunjungan',
    guests: isEn ? 'Guests' : 'Jumlah Wisatawan',
    notes: isEn ? 'Special Notes' : 'Catatan Tambahan',
    payment: isEn ? 'Payment Breakdown' : 'Rincian Pembayaran',
    unit: isEn ? 'Unit Price' : 'Harga Satuan',
    subtotal: isEn ? 'Package Subtotal' : 'Subtotal Paket',
    guide: isEn ? 'Guide Service' : 'Jasa Pemandu',
    drone: isEn ? 'Drone Documentation' : 'Dokumentasi Drone',
    total: isEn ? 'Total Estimated' : 'Total Estimasi',
    status: isEn ? 'Status' : 'Status',
    pending: isEn ? 'Pending Confirmation' : 'Menunggu Konfirmasi',
    footer: isEn
      ? 'This document is an official reservation proof. Our coordinator will contact you within 24 hours.'
      : 'Dokumen ini merupakan bukti reservasi resmi. Koordinator kami akan menghubungi Anda dalam 24 jam.',
    contact: 'Pesibar Wave - Krui, Lampung, Indonesia'
  }

  // ---- Header band ----
  doc.setFillColor(7, 59, 76)
  doc.rect(0, 0, pageW, 38, 'F')
  doc.setFillColor(24, 183, 176)
  doc.rect(0, 36, pageW, 2, 'F')

  // Pesibar Wave logo badge (tapis diamond + ocean wave mark)
  drawLogoBadge(doc, margin, 9, 20)

  doc.setFontSize(18)
  doc.text(T.title, margin + 27, 18)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(220, 235, 240)
  doc.text(T.subtitle, margin + 27, 25)

  y = 52

  // ---- Booking code card ----
  doc.setDrawColor(8, 126, 164)
  doc.setFillColor(240, 249, 252)
  doc.roundedRect(margin, y, pageW - margin * 2, 20, 3, 3, 'FD')
  doc.setTextColor(120, 140, 150)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text(T.code, margin + 6, y + 8)
  doc.setTextColor(7, 59, 76)
  doc.setFont('courier', 'bold')
  doc.setFontSize(16)
  doc.text(String(booking.code || '-'), margin + 6, y + 16, { charSpace: 0.6 })

  // Status pill
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setFillColor(255, 159, 67)
  doc.roundedRect(pageW - margin - 46, y + 6, 40, 8, 4, 4, 'F')
  doc.setTextColor(255, 255, 255)
  doc.text(T.pending, pageW - margin - 26, y + 11.5, { align: 'center' })

  y += 32

  const row = (label, value) => {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(120, 140, 150)
    doc.text(label, margin + 4, y)
    doc.setTextColor(30, 41, 59)
    doc.setFont('helvetica', 'bold')
    const lines = doc.splitTextToSize(String(value ?? '-'), pageW - margin * 2 - 62)
    doc.text(lines, margin + 58, y)
    y += 7 * lines.length
  }

  const sectionTitle = (label) => {
    doc.setDrawColor(226, 232, 240)
    doc.line(margin, y, pageW - margin, y)
    y += 7
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(8, 126, 164)
    doc.text(label, margin, y)
    y += 8
  }

  sectionTitle(T.details)
  row(T.name, booking.name)
  row(T.phone, booking.phone)
  row(T.email, booking.email)
  row(T.pkg, booking.packageName)
  row(T.date, formatDate(booking.visitDate, isEn))
  row(T.guests, `${booking.guests} ${isEn ? 'person(s)' : 'orang'}`)
  if (booking.notes) row(T.notes, booking.notes)

  y += 3
  sectionTitle(T.payment)
  row(T.unit, rp(booking.packagePrice) + ' / ' + (isEn ? 'pax' : 'pax'))
  row(T.subtotal, rp(booking.subtotal))
  if (booking.guideAddon) row(T.guide, rp(booking.guideAddonPrice))
  if (booking.photoAddon) row(T.drone, rp(booking.photoAddonPrice))

  // Total highlight
  y += 2
  doc.setFillColor(7, 59, 76)
  doc.roundedRect(margin, y, pageW - margin * 2, 16, 3, 3, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text(T.total, margin + 6, y + 10)
  doc.setFontSize(14)
  doc.text(rp(booking.total), pageW - margin - 6, y + 10.5, { align: 'right' })
  y += 26

  // ---- Footer ----
  doc.setDrawColor(226, 232, 240)
  doc.line(margin, y, pageW - margin, y)
  y += 6
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(9)
  doc.setTextColor(100, 116, 139)
  const footerLines = doc.splitTextToSize(T.footer, pageW - margin * 2)
  doc.text(footerLines, margin, y)
  y += footerLines.length * 5 + 4
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(24, 183, 176)
  doc.text(T.contact, margin, y)

  doc.save(`Bukti-Booking-${booking.code || 'PW'}.pdf`)
}
