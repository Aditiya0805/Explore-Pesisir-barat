/**
 * Storage migration for the Pesibar Wave rebrand.
 *
 * Older builds used localStorage keys prefixed with the retired brand name.
 * This one-time migration copies any existing values to the new "pw_" keys
 * (used by langStore / reviewStore) so users keep their language choice and
 * saved reviews after the rebrand.
 */

const LEGACY_KEY_MAP = {
  // Legacy keys from before the rebrand (kept so existing data can migrate).
  explore_pesisir_lang: 'pw_lang',
  explore_pesisir_reviews: 'pw_reviews'
}

export function migrateLegacyStorage() {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    Object.entries(LEGACY_KEY_MAP).forEach(([legacyKey, newKey]) => {
      const legacyValue = window.localStorage.getItem(legacyKey)
      if (legacyValue === null) return
      // Never overwrite data the user already generated under the new brand.
      if (window.localStorage.getItem(newKey) === null) {
        window.localStorage.setItem(newKey, legacyValue)
      }
      window.localStorage.removeItem(legacyKey)
    })
  } catch (err) {
    console.warn('Legacy storage migration skipped:', err?.message)
  }
}
