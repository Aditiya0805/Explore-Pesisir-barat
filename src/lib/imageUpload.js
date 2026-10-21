import { supabase, isSupabaseConfigured, MEDIA_BUCKET } from '@/lib/supabase'

/**
 * Client-side image compression + Supabase Storage upload.
 *
 * Rule of this project: an image that reaches Supabase Storage must be
 * <= 1 MB. Bigger files are compressed automatically in the browser
 * (canvas + JPEG quality/dimension reduction) before the upload starts.
 */

export const MAX_UPLOAD_BYTES = 1024 * 1024 // 1 MB
export const MAX_SOURCE_BYTES = 25 * 1024 * 1024 // sanity limit for originals
export const MAX_DIMENSION = 1800

export function formatBytes(bytes) {
  const value = Number(bytes) || 0
  if (value < 1024) return `${value} B`
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`
  return `${(value / (1024 * 1024)).toFixed(2)} MB`
}

export function isImageFile(file) {
  return Boolean(file && /^image\//i.test(file.type || ''))
}

function loadBitmap(file) {
  if (typeof createImageBitmap === 'function') {
    return createImageBitmap(file)
  }
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Gambar tidak dapat dibaca.'))
    }
    img.src = url
  })
}

function canvasToBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Gagal mengompresi gambar.'))),
      'image/jpeg',
      quality
    )
  })
}

/**
 * Compress an image file until it is <= maxBytes.
 * Returns { file, originalSize, size, quality, width, height, compressed }.
 */
export async function compressImage(file, { maxBytes = MAX_UPLOAD_BYTES, maxDimension = MAX_DIMENSION } = {}) {
  if (!isImageFile(file)) {
    throw new Error('Berkas harus berupa gambar (JPG, PNG, atau WEBP).')
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error(`Ukuran foto asli ${formatBytes(file.size)} terlalu besar. Maksimal ${formatBytes(MAX_SOURCE_BYTES)}.`)
  }

  // Already small enough: keep the original file (preserves PNG transparency).
  if (file.size <= maxBytes) {
    return {
      file,
      originalSize: file.size,
      size: file.size,
      quality: null,
      compressed: false,
      width: null,
      height: null
    }
  }

  const bitmap = await loadBitmap(file)
  const sourceWidth = bitmap.width || bitmap.naturalWidth
  const sourceHeight = bitmap.height || bitmap.naturalHeight

  let scale = Math.min(1, maxDimension / Math.max(sourceWidth, sourceHeight))
  let best = null

  // Two loops: shrink dimensions, then lower JPEG quality.
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const width = Math.max(1, Math.round(sourceWidth * scale))
    const height = Math.max(1, Math.round(sourceHeight * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(bitmap, 0, 0, width, height)

    for (let quality = 0.9; quality >= 0.4; quality -= 0.1) {
      const blob = await canvasToBlob(canvas, quality)
      best = { blob, quality, width, height }
      if (blob.size <= maxBytes) {
        const name = `${(file.name || 'foto').replace(/\.[^.]+$/, '')}.jpg`
        return {
          file: new File([blob], name, { type: 'image/jpeg', lastModified: Date.now() }),
          originalSize: file.size,
          size: blob.size,
          quality: Math.round(quality * 100),
          compressed: true,
          width,
          height
        }
      }
    }
    scale *= 0.75
  }

  throw new Error(
    `Gambar tetap ${formatBytes(best?.blob?.size || file.size)} setelah dikompresi. Maksimal ${formatBytes(maxBytes)} — gunakan foto dengan resolusi lebih kecil.`
  )
}

function safeName(name) {
  return (name || 'foto')
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60) || 'foto'
}

/**
 * Compress (when needed) + upload to the public "media" bucket.
 * Returns { url, path, originalSize, size, compressed }.
 */
export async function uploadImage(file, { folder = 'misc', onProgress } = {}) {
  if (!isSupabaseConfigured) {
    throw new Error('Upload gambar membutuhkan koneksi Supabase. Isi kredensial pada .env lalu login ulang.')
  }

  onProgress?.({ stage: 'compress', message: 'Mengompresi gambar...' })
  const result = await compressImage(file)

  if (result.size > MAX_UPLOAD_BYTES) {
    throw new Error(`Ukuran akhir ${formatBytes(result.size)} melebihi batas 1 MB.`)
  }

  onProgress?.({
    stage: 'upload',
    message: `Mengunggah ${formatBytes(result.size)}...`,
    compression: result
  })

  const extension = (result.file.name.split('.').pop() || 'jpg').toLowerCase()
  const path = `${folder}/${Date.now()}-${safeName(result.file.name.replace(/\.[^.]+$/, ''))}.${extension}`

  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, result.file, {
    cacheControl: '31536000',
    contentType: result.file.type,
    upsert: false
  })

  if (error) {
    if (/bucket not found/i.test(error.message)) {
      throw new Error(`Bucket "${MEDIA_BUCKET}" belum ada. Jalankan supabase_schema.sql untuk membuat bucket & policy storage.`)
    }
    if (/row-level security|permission denied/i.test(error.message)) {
      throw new Error('Upload ditolak. Login sebagai admin Supabase (email terdaftar di tabel admins) lalu coba lagi.')
    }
    throw new Error(error.message)
  }

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path)

  return {
    url: data.publicUrl,
    path,
    originalSize: result.originalSize,
    size: result.size,
    compressed: result.compressed
  }
}
