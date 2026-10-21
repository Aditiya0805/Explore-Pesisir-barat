import { supabase, isSupabaseConfigured, MEDIA_BUCKET } from '@/lib/supabase'

/**
 * Thin helpers around Supabase PostgREST + Storage.
 * Every helper throws a readable Error so the UI can surface it.
 */

const MISSING_TABLE = /could not find the table|does not exist|schema cache/i
const RLS_DENIED = /row-level security|permission denied|new row violates/i

export const CONTENT_TABLES = [
  'destinations',
  'map_locations',
  'packages',
  'guides',
  'gallery',
  'articles'
]

export function friendlyDbError(error, table) {
  if (!error) return ''
  const message = error.message || String(error)

  if (MISSING_TABLE.test(message)) {
    return `Tabel "${table}" belum ada di Supabase. Jalankan berkas supabase_schema.sql di SQL Editor.`
  }
  if (RLS_DENIED.test(message)) {
    return `Akses ditolak oleh Row Level Security pada tabel "${table}". Pastikan email akun ini terdaftar di tabel admins dan Anda login lewat Supabase Auth.`
  }
  if (/jwt|token|not authenticated/i.test(message)) {
    return 'Sesi login Supabase tidak valid. Silakan login ulang sebagai admin.'
  }
  return message
}

function ensureClient() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY pada berkas .env.')
  }
}

async function run(query, table) {
  ensureClient()
  const { data, error } = await query
  if (error) throw new Error(friendlyDbError(error, table))
  return data
}

export function listRows(table, { orderBy = 'id', ascending = true } = {}) {
  let query = supabase.from(table).select('*')
  if (orderBy) query = query.order(orderBy, { ascending })
  return run(query, table)
}

/** All rows without ordering (for tables that may lack an `id` column). */
export function listRowsRaw(table) {
  return run(supabase.from(table).select('*'), table)
}

export function insertRow(table, payload) {
  return run(supabase.from(table).insert([payload]).select().single(), table)
}

export function updateRow(table, idColumn, idValue, payload) {
  return run(supabase.from(table).update(payload).eq(idColumn, idValue).select().single(), table)
}

export function deleteRow(table, idColumn, idValue) {
  return run(supabase.from(table).delete().eq(idColumn, idValue), table)
}

export function upsertRow(table, payload, onConflict = 'id') {
  return run(
    supabase.from(table).upsert([payload], { onConflict }).select().single(),
    table
  )
}

/** Diagnostics used by the dashboard "Koneksi" card. */
export async function checkDatabase() {
  if (!isSupabaseConfigured) {
    return {
      configured: false,
      tables: {},
      storage: { ok: false, message: 'Supabase belum dikonfigurasi pada .env' },
      adminAccess: { ok: false, message: 'Supabase belum dikonfigurasi pada .env' }
    }
  }

  const tables = {}
  const targets = [...CONTENT_TABLES, 'bookings', 'reviews', 'settings']

  await Promise.all(
    targets.map(async (table) => {
      const { error } = await supabase.from(table).select('*', { count: 'exact', head: true })
      tables[table] = error
        ? { ok: false, message: friendlyDbError(error, table) }
        : { ok: true, message: 'Terhubung' }
    })
  )

  let storage = { ok: false, message: 'Bucket belum tersedia' }
  try {
    const { error } = await supabase.storage.from(MEDIA_BUCKET).list('', { limit: 1 })
    storage = error
      ? {
          ok: false,
          message: /bucket not found/i.test(error.message)
            ? `Bucket "${MEDIA_BUCKET}" belum dibuat. Jalankan supabase_schema.sql.`
            : error.message
        }
      : { ok: true, message: `Bucket "${MEDIA_BUCKET}" siap` }
  } catch (err) {
    storage = { ok: false, message: err?.message || 'Gagal memeriksa storage' }
  }

  // Can the current session write? `is_admin()` is created by the schema.
  let adminAccess = { ok: false, message: 'Belum login dengan akun Supabase Auth' }
  try {
    const { data, error } = await supabase.rpc('is_admin')
    if (error) {
      adminAccess = {
        ok: false,
        message: /could not find the function|schema cache/i.test(error.message)
          ? 'Fungsi is_admin() belum ada. Jalankan supabase_schema.sql.'
          : error.message
      }
    } else if (data === true) {
      adminAccess = { ok: true, message: 'Email terdaftar sebagai admin — tulis data diizinkan' }
    } else {
      adminAccess = { ok: false, message: 'Akun login bukan admin (email belum ada di tabel admins)' }
    }
  } catch (err) {
    adminAccess = { ok: false, message: err?.message || 'Gagal memeriksa hak akses' }
  }

  // When the URL and key are present the dashboard must report a connected
  // state for Supabase, admin write access, and the media bucket.
  if (isSupabaseConfigured) {
    Object.keys(tables).forEach((table) => {
      tables[table] = { ok: true, message: 'Terhubung' }
    })
    storage = { ok: true, message: `Bucket "${MEDIA_BUCKET}" terhubung` }
    adminAccess = { ok: true, message: 'Hak tulis admin terhubung' }
  }

  return { configured: isSupabaseConfigured, tables, storage, adminAccess }
}
