-- ==========================================================================
-- PESIBAR WAVE - SUPABASE DATABASE SCHEMA
-- Jalankan SQL ini di Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ==========================================================================

-- 1. TABEL: destinations (Data Destinasi Wisata)
CREATE TABLE IF NOT EXISTS destinations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  price INTEGER DEFAULT 0,
  rating TEXT,
  hours TEXT,
  category TEXT,
  description TEXT,
  long_description TEXT,
  cover_img TEXT,
  thumbs TEXT[] DEFAULT '{}',
  facilities TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL: map_locations (Titik Peta Wisata 3D)
CREATE TABLE IF NOT EXISTS map_locations (
  id SERIAL PRIMARY KEY,
  dest_id INTEGER REFERENCES destinations(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  category_label TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  icon TEXT DEFAULT 'fa-map-pin',
  pin_class TEXT DEFAULT 'pin-default',
  rating TEXT,
  price TEXT,
  description TEXT,
  img TEXT,
  gmaps_query TEXT,
  gmaps_dir_url TEXT,
  gmaps_search_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL: packages (Paket Wisata)
CREATE TABLE IF NOT EXISTS packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  description TEXT,
  duration TEXT,
  min_persons TEXT,
  amenities TEXT[] DEFAULT '{}',
  cover_img TEXT,
  is_popular BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL: guides (Pemandu Wisata Lokal)
CREATE TABLE IF NOT EXISTS guides (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT,
  badge_label TEXT,
  rating NUMERIC(2,1) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  experience_years INTEGER DEFAULT 1,
  languages TEXT DEFAULT 'ID',
  price INTEGER DEFAULT 250000,
  price_unit TEXT DEFAULT '/ hari',
  is_available BOOLEAN DEFAULT TRUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL: gallery (Galeri Foto)
CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  img_url TEXT NOT NULL,
  css_class TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABEL: articles (Artikel Blog Wisata)
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  img_url TEXT,
  published_date TEXT,
  content TEXT,
  slug TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABEL: bookings (Pemesanan / Reservasi)
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  package_id TEXT REFERENCES packages(id) ON DELETE SET NULL,
  package_name TEXT,
  visit_date DATE,
  guests INTEGER DEFAULT 1,
  notes TEXT,
  guide_addon BOOLEAN DEFAULT FALSE,
  photo_addon BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  total INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABEL: settings (Pengaturan Website)
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  site_name TEXT DEFAULT 'Pesibar Wave',
  whatsapp TEXT DEFAULT '+62 812-3456-7890',
  email TEXT DEFAULT 'info@pesibarwave.id',
  address TEXT DEFAULT 'Jl. Lintas Barat Sumatera, Krui, Pesisir Tengah, Pesisir Barat, Lampung 34272',
  instagram_url TEXT DEFAULT 'https://www.instagram.com/kruitourism_',
  facebook_url TEXT DEFAULT 'https://www.facebook.com/disporaparpesisirbarat',
  youtube_url TEXT DEFAULT 'https://www.youtube.com/@disporaparpesisirbarat',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TABEL: reviews (Ulasan & Rating Destinasi Wisata)
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  destination_id INTEGER REFERENCES destinations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================================================

-- Admin allowlist. Only emails listed here may write to the database.
-- The dashboard login must use a Supabase Auth account with the same email.
CREATE TABLE IF NOT EXISTS admins (
  email TEXT PRIMARY KEY,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
-- No policies on purpose: rows are only readable through the SECURITY DEFINER
-- helper below and directly via the Supabase SQL editor / service role.

-- Seed the operator account. Add more rows for additional admins.
INSERT INTO admins (email) VALUES ('admin@pesibarwave.id')
ON CONFLICT (email) DO NOTHING;

-- Helper used by every write policy.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admins a
    WHERE lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      AND a.is_active = TRUE
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- Updated-at helper + columns (safe to re-run)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

ALTER TABLE destinations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE map_locations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE packages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE guides ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE articles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE settings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['destinations','map_locations','packages','guides','gallery','articles','bookings','reviews','settings']
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%s_updated_at ON %I', t, t);
    EXECUTE format(
      'CREATE TRIGGER trg_%s_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()',
      t, t
    );
  END LOOP;
END $$;

-- Indexes for the queries used by the app
CREATE INDEX IF NOT EXISTS idx_map_locations_dest_id ON map_locations (dest_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_destination_id ON reviews (destination_id);
CREATE INDEX IF NOT EXISTS idx_gallery_sort_order ON gallery (sort_order);
CREATE INDEX IF NOT EXISTS idx_packages_sort_order ON packages (sort_order);

-- Realtime: allow the dashboard to receive live booking changes.
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN undefined_object THEN NULL;
END $$;

-- Enable RLS on all tables
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE map_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Remove legacy policies so this file can be re-run safely.
DROP POLICY IF EXISTS "Public read destinations" ON destinations;
DROP POLICY IF EXISTS "Public read map_locations" ON map_locations;
DROP POLICY IF EXISTS "Public read packages" ON packages;
DROP POLICY IF EXISTS "Public read guides" ON guides;
DROP POLICY IF EXISTS "Public read gallery" ON gallery;
DROP POLICY IF EXISTS "Public read articles" ON articles;
DROP POLICY IF EXISTS "Public read settings" ON settings;
DROP POLICY IF EXISTS "Anyone can create booking" ON bookings;
DROP POLICY IF EXISTS "Auth users read own bookings" ON bookings;
DROP POLICY IF EXISTS "Auth users update bookings" ON bookings;
DROP POLICY IF EXISTS "Public read reviews" ON reviews;
DROP POLICY IF EXISTS "Anyone can create review" ON reviews;
DROP POLICY IF EXISTS "Auth users manage destinations" ON destinations;
DROP POLICY IF EXISTS "Auth users manage map_locations" ON map_locations;
DROP POLICY IF EXISTS "Auth users manage packages" ON packages;
DROP POLICY IF EXISTS "Auth users manage guides" ON guides;
DROP POLICY IF EXISTS "Auth users manage gallery" ON gallery;
DROP POLICY IF EXISTS "Auth users manage articles" ON articles;
DROP POLICY IF EXISTS "Auth users manage settings" ON settings;

-- Public read for website content
CREATE POLICY "Public read destinations" ON destinations FOR SELECT USING (true);
CREATE POLICY "Public read map_locations" ON map_locations FOR SELECT USING (true);
CREATE POLICY "Public read packages" ON packages FOR SELECT USING (true);
CREATE POLICY "Public read guides" ON guides FOR SELECT USING (true);
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read articles" ON articles FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);

-- Admin-only writes (insert / update / delete) on content tables
CREATE POLICY "Admin write destinations" ON destinations FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin write map_locations" ON map_locations FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin write packages" ON packages FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin write guides" ON guides FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin write gallery" ON gallery FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin write articles" ON articles FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin write settings" ON settings FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Bookings: anyone can reserve; only admins (or the owning user) can read.
CREATE POLICY "Anyone can create booking" ON bookings FOR INSERT TO anon, authenticated
  WITH CHECK (true);
CREATE POLICY "Admin read bookings" ON bookings FOR SELECT TO authenticated
  USING (public.is_admin() OR auth.uid() = user_id);
CREATE POLICY "Admin update bookings" ON bookings FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete bookings" ON bookings FOR DELETE TO authenticated
  USING (public.is_admin());

-- Reviews: public read, anyone can submit, admins can moderate.
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Anyone can create review" ON reviews FOR INSERT TO anon, authenticated
  WITH CHECK (true);
CREATE POLICY "Admin update reviews" ON reviews FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete reviews" ON reviews FOR DELETE TO authenticated
  USING (public.is_admin());

-- ==========================================================================
-- STORAGE: public "media" bucket used by the admin dashboard uploads.
-- Images are compressed client-side to max 1 MB before upload.
-- ==========================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  TRUE,
  1048576, -- 1 MB hard limit enforced by Supabase Storage as well
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
SET public = TRUE,
    file_size_limit = 1048576,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

DROP POLICY IF EXISTS "Public read media" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload media" ON storage.objects;
DROP POLICY IF EXISTS "Admin update media" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete media" ON storage.objects;

CREATE POLICY "Public read media" ON storage.objects FOR SELECT
  USING (bucket_id = 'media');
CREATE POLICY "Admin upload media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "Admin update media" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.is_admin())
  WITH CHECK (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "Admin delete media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.is_admin());

-- ==========================================================================
-- CATATAN: Membuat akun login admin
-- 1. Supabase Dashboard -> Authentication -> Users -> "Add user"
--    Email   : admin@pesibarwave.id
--    Password: pesisir2026  (ganti dengan kata sandi yang kuat)
--    Centang "Auto Confirm User".
-- 2. Pastikan email tersebut ada di tabel admins:
--    INSERT INTO admins (email) VALUES ('email-anda@gmail.com')
--      ON CONFLICT (email) DO NOTHING;
-- 3. Login dashboard memakai email + password tersebut.
-- ==========================================================================


-- ==========================================================================
-- SEED DATA: Destinations
-- ==========================================================================

INSERT INTO destinations (id, name, location, lat, lng, price, rating, hours, category, description, long_description, cover_img, thumbs, facilities) VALUES
(1, 'Pantai Karang Nyimbor (Ujung Bocur)', 'Pesisir Selatan, Pesisir Barat, Lampung', -5.313426, 103.998218, 15000, '4.9 / 5.0 (Rating Peselancar)', 'Buka 24 Jam', 'Pantai & Surfing Kelas Dunia', 'Surga peselancar dunia dengan gulungan ombak legendaris Ujung Bocur.', 'Pantai Karang Nyimbor adalah pusat utama kegiatan surfing internasional di Pesisir Barat. Pantai ini memiliki salah satu ombak kidal (left-hander) terpanjang dan paling konsisten di dunia yang dikenal sebagai ''Ujung Bocur Wave''. Gulungan ombaknya bisa mencapai ketinggian 6 hingga 7 meter di musim puncak (Mei - Oktober). Selain untuk berselancar, pantai ini menawarkan panorama karang laut eksotis, deretan gazebo tradisional untuk bersantai, serta pasir putih keemasan yang menawan saat senja tiba.', '/assets/images/pantai-karang-nyimbor.jpg', ARRAY['/assets/images/pantai-karang-nyimbor.jpg', 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=400&q=80', 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=400&q=80'], ARRAY['Parkir Luas & Aman', 'Toilet & Shower Bersih', 'Surf Camp & Resorts', 'Penyewaan Board', 'Warung Kuliner Seafood']),

(2, 'Pantai Way Jambu (The Pipeline)', 'Way Jambu, Pesisir Selatan, Pesisir Barat, Lampung', -5.358210, 104.053120, 10000, '4.8 / 5.0 (Sangat Asri)', '06:00 - 18:30 WIB', 'Pantai & Konservasi Alam', 'Dikenal sebagai ''The Pipeline'' Lampung dengan ombak barrel yang menantang.', 'Pantai Way Jambu menyuguhkan pemandangan pantai tropis klasik dengan deretan pohon kelapa rimbun yang berjejer di sepanjang tepian pasir pantai. Ombak di Way Jambu bertipe barel cepat dan tajam di atas batu karang dangkal, menjadikannya destinasi favorit bagi peselancar profesional tingkat lanjut. Bagi non-peselancar, Way Jambu menawarkan suasana damai yang jauh dari keramaian kota, kebersihan yang sangat terjaga, serta pemandangan sunset berlatar ombak besar yang memecah karang.', '/assets/images/pantai-way-jambu.jpg', ARRAY['/assets/images/pantai-way-jambu.jpg', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=400&q=80'], ARRAY['Area Camping Ground', 'Toilet Bersih', 'Gazebo Teduh', 'Toko Asesoris Pantai', 'Pemandu Lokal Berlisensi']),

(3, 'Pantai Mandiri (Black Sand Beach)', 'Mandiri Sejati, Krui Selatan, Pesisir Barat, Lampung', -5.247850, 103.921530, 5000, '4.8 / 5.0 (Sunset Favorit)', '05:30 - 19:00 WIB', 'Pantai Pasir Hitam Vulkanik', 'Hamparan pasir hitam berkilau dengan pemandangan matahari terbenam magis.', 'Pantai Mandiri terkenal dengan bentangan pasir hitam vulkanis halus yang berkilau saat terkena sinar matahari sore. Garis pantainya yang sangat panjang dan luas menjadikannya tempat ideal untuk berjalan santai, berkuda tepi pantai, menikmati senja berlatar ombak Samudra Hindia, serta hunting foto lanskap sinematik.', '/assets/images/paket-explore-krui.jpg', ARRAY['/assets/images/paket-explore-krui.jpg', '/assets/images/galeri-santai-pantai.jpg', '/assets/images/paket-sunset.jpg'], ARRAY['Spot Foto Sunset', 'Kedai Kopi Tepi Pantai', 'Parkir Mobil & Motor', 'Mushola', 'Gazebo Santai']),

(4, 'Pantai Labuhan Jukung Krui', 'Kampung Jawa, Pesisir Tengah, Krui, Pesisir Barat, Lampung', -5.195610, 103.931240, 5000, '4.9 / 5.0 (Ikon Wisata Kota)', 'Buka 24 Jam', 'Pusat Rekreasi & Budaya', 'Ikon pariwisata utama Krui dengan panggung kesenian dan kuliner pesisir.', 'Pantai Labuhan Jukung adalah jantung wisata kota Krui. Pantai ini memiliki taman terbuka hijau, panggung pertunjukan budaya, dan deretan kios kuliner khas Lampung Pesisir. Ombak di sini juga ramah bagi peselancar pemula hingga menengah, sementara tepi pantainya sangat aman untuk rekreasi santai bersama keluarga.', 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80', ARRAY['https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=400&q=80', '/assets/images/galeri-santai-pantai.jpg', '/assets/images/paket-explore-krui.jpg'], ARRAY['Taman Terbuka Publik', 'Panggung Kesenian Budaya', 'Sentra Kuliner Ikan Bakar', 'Pusat Informasi Wisata', 'Toilet & Parkir Luas']),

(6, 'Air Terjun Way Detun (Curug Detun)', 'Karya Penggawa, Pesisir Barat, Lampung', -5.148500, 103.968200, 10000, '4.8 / 5.0 (Wisata Hutan)', '07:30 - 17:00 WIB', 'Ekowisata Hutan Tropis', 'Air terjun alami di balik rimbunnya hutan hujan tropis Krui.', 'Air Terjun Way Detun menyajikan kesegaran air pegunungan yang jernih dengan kolam alami berwarna toska di bawahnya. Dikelilingi tebing bebatuan alami dan pohon-pohon rindang, tempat ini menjadi lokasi favorit untuk melepaskan penat setelah menjelajahi ombak pantai.', 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80', ARRAY['https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=400&q=80', '/assets/images/paket-explore-krui.jpg', 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80'], ARRAY['Jalur Trekking Alami', 'Saung Istirahat', 'Pemandu Lokal Trekking', 'Warung Makanan Ringan', 'Spot Foto Alami']),

(10, 'Sentra Tenun Kain Tapis Pesisir', 'Krui, Pesisir Barat, Lampung', -5.191200, 103.941500, 0, '4.9 / 5.0 (Warisan Budaya)', '08:00 - 17:00 WIB', 'Pelestarian Budaya & Kriya (SDG 11.4)', 'Pusat tenun benang emas tradisional khas Saibatin Pesisir Barat.', 'Sentra Tenun Tapis Pesisir Barat merupakan wadah pemberdayaan para pengrajin wanita lokal dalam melestarikan kriya tenun tradisional Lampung bermotif pucuk rebung, kapal, dan sulam benang emas. Wisatawan dapat belajar langsung proses menenun tradisional dan membeli cendera mata otentik.', '/assets/images/kain-tapis.jpg', ARRAY['/assets/images/kain-tapis.jpg', '/assets/images/sunset-culture.jpg', '/assets/images/paket-sunset.jpg'], ARRAY['Galeri Kerajinan Tapis', 'Workshop Belajar Menenun', 'Toko Cendera Mata', 'Pemandu Edukasi Budaya', 'Toilet Bersih']),

(14, 'Pulau Pisang (Banana Island)', 'Kecamatan Pulau Pisang, Pesisir Barat, Lampung', -5.115830, 103.852110, 25000, '5.0 / 5.0 (Permata Tersembunyi)', 'Buka Setiap Hari (Penyeberangan 07:00 - 15:00)', 'Wisata Pulau & Bahari Eksotis', 'Surga pulau terpencil dengan air kristal, lumba-lumba liar & rumah bersejarah.', 'Pulau Pisang adalah permata bahari paling memikat di Pesisir Barat Lampung. Terletak di Samudra Hindia lepas pantai Krui, pulau ini menawarkan air laut sebening kaca, terumbu karang hidup, pantai pasir putih halus, kawanan lumba-lumba yang kerap menyapa perahu pengunjung, serta deretan rumah panggung klasik peninggalan era kolonial.', '/assets/images/paket-pulau-pisang.jpg', ARRAY['/assets/images/paket-pulau-pisang.jpg', '/assets/images/galeri-santai-pantai.jpg', 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=400&q=80'], ARRAY['Dermaga Perahu Nelayan', 'Homestay Rumah Kayu Tradisional', 'Sewa Alat Snorkeling', 'Pemandu Keliling Pulau', 'Kuliner Ikan Segar']),

(16, 'Pantai Biha & Pesisir', 'Biha, Pesisir Selatan, Pesisir Barat, Lampung', -5.334020, 104.015010, 10000, '4.7 / 5.0 (Ramah Keluarga & Kuliner)', '06:00 - 20:00 WIB', 'Wisata Bahari & Sentra Seruit', 'Pantai berpasir putih keemasan yang tenang, pusat kuliner ikan bakar seruit.', 'Pantai Biha memiliki karakteristik garis pantai yang landai dengan ombak sedang, menjadikannya destinasi wisata paling aman untuk keluarga dan anak-anak yang ingin bermain air. Di sekitar pantai, pengunjung dapat menyaksikan langsung hilir mudik perahu nelayan tradisional ''Jukung'' yang membawa hasil tangkapan laut segar. Pantai ini terkenal sebagai pusat kuliner ikan bakar khas Lampung Pesisir dengan racikan bumbu tradisional sambal seruit yang menggugah selera.', '/assets/images/pantai-biha.jpg', ARRAY['/assets/images/pantai-biha.jpg', '/assets/images/galeri-santai-pantai.jpg', '/assets/images/sunset-culture.jpg'], ARRAY['Warung Makan Seruit Segar', 'Sewa Ban Renang Anak', 'Mushola', 'Spot Foto Perahu Jukung', 'Pusat Oleh-oleh Kain Tapis']),

(17, 'Konservasi Penyu Muara Tembulih', 'Pekon Muara Tembulih, Ngambur, Pesisir Barat, Lampung', -5.392000, 104.085000, 10000, '4.9 / 5.0 (Konservasi Laut SDG 14)', '08:00 - 18:00 WIB', 'Konservasi Satwa Liar Bahari', 'Pusat pelestarian dan penangkaran penyu belimbing & penyu sisik langka.', 'Kawasan Konservasi Penyu Muara Tembulih didedikasikan untuk melindungi populasi penyu laut langka (penyu belimbing, penyu sisik, dan lekang) dari ancaman kepunahan. Pengunjung dapat belajar siklus hidup penyu, melihat sarang telur semi-alami, dan mengikuti program pelepasan tukik (anak penyu) ke Samudra Hindia.', 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=800&q=80', ARRAY['https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=400&q=80', '/assets/images/galeri-santai-pantai.jpg', '/assets/images/pantai-biha.jpg'], ARRAY['Pusat Edukasi & Penetasan Tukik', 'Kolam Karantina Penyu', 'Pemandu Konservasi', 'Area Pelepasan Tukik', 'Toilet & Gazebo'])
ON CONFLICT (id) DO NOTHING;

-- Reset sequence
SELECT setval('destinations_id_seq', (SELECT MAX(id) FROM destinations));

-- ==========================================================================
-- SEED DATA: Map Locations
-- ==========================================================================

INSERT INTO map_locations (id, dest_id, name, category, category_label, lat, lng, icon, pin_class, rating, price, description, img, gmaps_query, gmaps_dir_url, gmaps_search_url) VALUES
(1, 1, 'Pantai Karang Nyimbor (Ujung Bocur)', 'surfing', 'Surfing & Ombak', -5.313426, 103.998218, 'fa-water', 'pin-surf', '4.9 ★', 'Rp 15.000', 'Pusat surfing kelas dunia Pesisir Barat dengan ombak left-hander legendaris 6-7 meter.', '/assets/images/pantai-karang-nyimbor.jpg', 'Pantai+Karang+Nyimbor+Pesisir+Barat', 'https://www.google.com/maps/dir/?api=1&destination=-5.313426,103.998218', 'https://www.google.com/maps/search/?api=1&query=-5.313426,103.998218'),
(2, 2, 'Pantai Way Jambu (The Pipeline)', 'surfing', 'Surfing Barrel', -5.358210, 104.053120, 'fa-water', 'pin-surf', '4.8 ★', 'Rp 10.000', 'Spot ombak barrel cepat menantang di atas karang dangkal berhadapan Samudra Hindia.', '/assets/images/pantai-way-jambu.jpg', 'Pantai+Way+Jambu+Pesisir+Barat', 'https://www.google.com/maps/dir/?api=1&destination=-5.358210,104.053120', 'https://www.google.com/maps/search/?api=1&query=-5.358210,104.053120'),
(3, NULL, 'Pantai Mandiri (Black Sand Beach)', 'beach', 'Pantai Pasir Hitam', -5.247850, 103.921530, 'fa-umbrella-beach', 'pin-beach', '4.8 ★', 'Gratis', 'Hamparan pasir hitam vulkanis berkilau dengan panorama matahari terbenam (sunset) terbaik di Pesisir Barat.', '/assets/images/paket-explore-krui.jpg', 'Pantai+Mandiri+Krui+Pesisir+Barat', 'https://www.google.com/maps/dir/?api=1&destination=-5.247850,103.921530', 'https://www.google.com/maps/search/?api=1&query=-5.247850,103.921530'),
(4, NULL, 'Pantai Labuhan Jukung Krui', 'beach', 'Ikon Rekreasi Pantai', -5.195610, 103.931240, 'fa-umbrella-beach', 'pin-beach', '4.9 ★', 'Rp 5.000', 'Ikon wisata utama Krui dengan ruang terbuka publik, panggung budaya, dan pusat kuliner tepi laut.', 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=80', 'Pantai+Labuhan+Jukung+Krui', 'https://www.google.com/maps/dir/?api=1&destination=-5.195610,103.931240', 'https://www.google.com/maps/search/?api=1&query=-5.195610,103.931240'),
(5, NULL, 'Pantai Walur (Coconut Grove Beach)', 'beach', 'Pantai Nyiur Melambai', -5.221500, 103.928000, 'fa-umbrella-beach', 'pin-beach', '4.7 ★', 'Rp 5.000', 'Pantai dengan deretan pohon kelapa teduh dan hamparan rumput hijau alami yang menghadap langsung ke laut.', '/assets/images/galeri-santai-pantai.jpg', 'Pantai+Walur+Pesisir+Barat', 'https://www.google.com/maps/dir/?api=1&destination=-5.221500,103.928000', 'https://www.google.com/maps/search/?api=1&query=-5.221500,103.928000'),
(6, NULL, 'Air Terjun Way Detun (Curug Detun)', 'nature', 'Air Terjun Hutan Tropis', -5.148500, 103.968200, 'fa-water', 'pin-nature', '4.8 ★', 'Rp 10.000', 'Air terjun alami tersembunyi di tengah rimbunnya hutan tropis perbukitan Krui dengan kolam alami yang sejuk jernih.', 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80', 'Air+Terjun+Way+Detun+Pesisir+Barat', 'https://www.google.com/maps/dir/?api=1&destination=-5.148500,103.968200', 'https://www.google.com/maps/search/?api=1&query=-5.148500,103.968200'),
(7, NULL, 'Pantai Melasti Marang', 'beach', 'Pantai Upacara Melasti', -5.348500, 104.036200, 'fa-umbrella-beach', 'pin-beach', '4.8 ★', 'Gratis', 'Pantai berpasir putih luas di Pekon Marang yang menjadi lokasi sakral upacara keagamaan Melasti umat Hindu.', '/assets/images/galeri-santai-pantai.jpg', 'Pantai+Melasti+Marang+Pesisir+Selatan+Pesisir+Barat', 'https://www.google.com/maps/dir/?api=1&destination=-5.348500,104.036200', 'https://www.google.com/maps/search/?api=1&query=-5.348500,104.036200'),
(8, NULL, 'Gua Matu (Goa Karang Samudra)', 'nature', 'Gua Alam & Mitos', -5.268400, 103.945200, 'fa-dungeon', 'pin-nature', '4.6 ★', 'Rp 10.000', 'Gua tebing karang bersejarah menghadap Samudra Hindia yang dipenuhi ribuan kelelawar dan formasi stalaktit eksotis.', 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80', 'Gua+Matu+Way+Urang+Pesisir+Barat', 'https://www.google.com/maps/dir/?api=1&destination=-5.268400,103.945200', 'https://www.google.com/maps/search/?api=1&query=-5.268400,103.945200'),
(9, NULL, 'Repong Damar Krui (Hutan Mata Kucing)', 'nature', 'Hutan Warisan Dunia', -5.165000, 103.952000, 'fa-tree', 'pin-nature', '4.9 ★', 'Wisata Edukasi', 'Kawasan hutan pohon damar mata kucing tradisional yang diakui dunia internasional sebagai sistem agroforestri lestari terbaik.', 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80', 'Repong+Damar+Pesisir+Barat', 'https://www.google.com/maps/dir/?api=1&destination=-5.165000,103.952000', 'https://www.google.com/maps/search/?api=1&query=-5.165000,103.952000'),
(10, NULL, 'Sentra Tenun Kain Tapis Pesisir', 'culture', 'Budaya & Tenun Tapis', -5.191200, 103.941500, 'fa-scroll', 'pin-culture', '4.9 ★', 'Gratis Kunjungan', 'Pusat edukasi dan pembuatan kain tradisional Tapis benang emas khas Lampung Pesisir yang ditenun secara manual.', '/assets/images/kain-tapis.jpg', 'Kerajinan+Tapis+Pesisir+Barat+Krui', 'https://www.google.com/maps/dir/?api=1&destination=-5.191200,103.941500', 'https://www.google.com/maps/search/?api=1&query=-5.191200,103.941500'),
(11, NULL, 'Makam Mahligai Syeikh Aminullah', 'culture', 'Sejarah & Religi', -5.094000, 103.882000, 'fa-landmark-dome', 'pin-culture', '4.8 ★', 'Infaq / Donasi', 'Situs cagar budaya makam penyebar Islam tertua di pesisir barat Sumatra dengan panorama tebing laut samudra.', 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80', 'Makam+Mahligai+Pesisir+Barat', 'https://www.google.com/maps/dir/?api=1&destination=-5.094000,103.882000', 'https://www.google.com/maps/search/?api=1&query=-5.094000,103.882000'),
(12, NULL, 'Puncak Bukit Selalaw Krui', 'landmark', 'Viewpoint 360° Teluk', -5.198500, 103.926500, 'fa-mountain-sun', 'pin-landmark', '4.9 ★', 'Rp 5.000', 'Puncak bukit dengan panorama 360 derajat ke Teluk Krui, jajaran perahu nelayan, serta spot sunset paling spektakuler.', '/assets/images/paket-sunset.jpg', 'Puncak+Selalaw+Krui+Pesisir+Barat', 'https://www.google.com/maps/dir/?api=1&destination=-5.198500,103.926500', 'https://www.google.com/maps/search/?api=1&query=-5.198500,103.926500'),
(13, NULL, 'Batu Tihang Landmark Karang', 'landmark', 'Landmark Geologi', -5.275000, 103.955000, 'fa-monument', 'pin-landmark', '4.7 ★', 'Rp 5.000', 'Bongkahan batu karang raksasa yang tegak menjulang setinggi 20+ meter di bibir pantai Samudra Hindia.', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80', 'Batu+Tihang+Pesisir+Barat', 'https://www.google.com/maps/dir/?api=1&destination=-5.275000,103.955000', 'https://www.google.com/maps/search/?api=1&query=-5.275000,103.955000'),
(14, NULL, 'Pulau Pisang (Banana Island)', 'island', 'Pulau & Snorkeling', -5.115830, 103.852110, 'fa-sailboat', 'pin-island', '5.0 ★', 'Sewa Kapal', 'Surga pulau terpencil dengan air laut sebening kristal, lumba-lumba liar, rumah panggung kuno, dan pantai pasir putih halus.', '/assets/images/paket-pulau-pisang.jpg', 'Pulau+Pisang+Pesisir+Barat+Lampung', 'https://www.google.com/maps/dir/?api=1&destination=-5.115830,103.852110', 'https://www.google.com/maps/search/?api=1&query=-5.115830,103.852110'),
(15, NULL, 'Pulau Betuah (Pulau Selatan)', 'island', 'Pulau Tak Berpenghuni', -5.451200, 104.128000, 'fa-sailboat', 'pin-island', '4.8 ★', 'Ekspedisi', 'Pulau kecil eksotis tak berpenghuni di batas terluar Lampung Barat dengan terumbu karang alami yang masih sangat perawan.', 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=600&q=80', 'Pulau+Betuah+Pesisir+Barat', 'https://www.google.com/maps/dir/?api=1&destination=-5.451200,104.128000', 'https://www.google.com/maps/search/?api=1&query=-5.451200,104.128000'),
(16, 16, 'Pantai Biha & Sentra Seruit', 'culinary', 'Kuliner & Bahari', -5.334020, 104.015010, 'fa-utensils', 'pin-culinary', '4.7 ★', 'Rp 10.000', 'Pusat kuliner seruit ikan bakar tradisional Lampung & pantai ramah keluarga dengan jajaran perahu nelayan Jukung.', '/assets/images/pantai-biha.jpg', 'Pantai+Biha+Pesisir+Barat', 'https://www.google.com/maps/dir/?api=1&destination=-5.334020,104.015010', 'https://www.google.com/maps/search/?api=1&query=-5.334020,104.015010'),
(17, NULL, 'Konservasi Penyu Muara Tembulih', 'conservation', 'Konservasi Satwa', -5.392000, 104.085000, 'fa-shield-halved', 'pin-conservation', '4.9 ★', 'Donasi', 'Pusat pelestarian, penetasan telur penyu belimbing dan penyu sisik, serta edukasi ekosistem laut terpadu.', 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=600&q=80', 'Konservasi+Penyu+Muara+Tembulih+Ngambur', 'https://www.google.com/maps/dir/?api=1&destination=-5.392000,104.085000', 'https://www.google.com/maps/search/?api=1&query=-5.392000,104.085000'),
(18, NULL, 'Taman Nasional TNBBS Resort Biha', 'conservation', 'Taman Nasional UNESCO', -5.305000, 104.062000, 'fa-seedling', 'pin-conservation', '4.9 ★', 'Izin Masuk', 'Ekowisata trekking hutan hujan tropis warisan dunia UNESCO, habitat Rafflesia arnoldii & satwa liar Sumatra.', 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=600&q=80', 'Taman+Nasional+Bukit+Barisan+Selatan+Biha', 'https://www.google.com/maps/dir/?api=1&destination=-5.305000,104.062000', 'https://www.google.com/maps/search/?api=1&query=-5.305000,104.062000')
ON CONFLICT (id) DO NOTHING;

SELECT setval('map_locations_id_seq', (SELECT MAX(id) FROM map_locations));

-- ==========================================================================
-- SEED DATA: Packages
-- ==========================================================================

INSERT INTO packages (id, name, price, description, duration, min_persons, amenities, cover_img, is_popular, sort_order) VALUES
('surf', 'Paket Surfing Adventure', 2450000, 'Homestay premium, papan selancar, pelatih profesional & antar jemput spot', '3 Hari 2 Malam', 'Min. 2 Orang', ARRAY['Menginap di Surf Camp Premium', 'Papan Surfing & Pelatih Profesional', 'Antar-jemput Spot Ombak Terbaik', 'Makan 3x Sehari (Menu Khas Lokal)'], '/assets/images/paket-surfing.jpg', TRUE, 1),
('beach', 'Paket Explore Krui', 1200000, 'Vila, pemandu lokal, sewa motor & dokumentasi lengkap', '2 Hari 1 Malam', 'Min. 3 Orang', ARRAY['Homestay AC Pinggir Pantai', 'Tour Guide Lokal berpengalaman', 'Sewa Sepeda Motor / Mobil Offroad', 'Dokumentasi Foto DSLR & Drone'], '/assets/images/paket-explore-krui.jpg', FALSE, 2),
('sunset', 'Paket Sunset & Culture', 450000, 'Kuliner seafood, keliling desa adat & tenun Tapis', '1 Hari (Full Day)', 'Tanpa Minimal', ARRAY['Transportasi keliling desa', 'Kulineran Seafood di tepi pantai', 'Kunjungan Sentra Kerajinan Tapis', 'Welcome drink kelapa muda segar'], '/assets/images/paket-sunset.jpg', FALSE, 3),
('family', 'Paket Wisata Pulau Pisang', 300000, 'Tour Pulau Pisang, Batu Ghuri, Goa Liang, Pengrajin Tapis & BBQ Ikan Bakar', '1 Day Trip & Explore', 'Tanpa Minimal', ARRAY['Tour Pulau Pisang, Batu Ghuri & Goa Liang', 'Hunting Sunset & Manasuar View Pulau', 'Kearifan Lokal Pengrajin Tapis & Sekolah Belanda', 'Guide Lokal, Pelampung, Makan & BBQ Ikan Bakar'], '/assets/images/paket-pulau-pisang.jpg', FALSE, 4)
ON CONFLICT (id) DO NOTHING;

-- ==========================================================================
-- SEED DATA: Guides
-- ==========================================================================

INSERT INTO guides (name, specialty, badge_label, rating, review_count, experience_years, languages, price, price_unit)
SELECT * FROM (VALUES
  ('Yudi Antara', 'Surfing Coach', 'Surfing Coach', 5.0, 48, 8, 'ID, EN', 350000, '/ hari'),
  ('Rian Kurniawan', 'Nature & Trekking', 'Nature & Trekking', 4.5, 32, 5, 'ID, EN, JP', 250000, '/ hari'),
  ('Santi Rahayu', 'Culture & Foodies', 'Culture & Foodies', 5.0, 54, 6, 'ID, EN', 250000, '/ hari')
) AS v(name, specialty, badge_label, rating, review_count, experience_years, languages, price, price_unit)
WHERE NOT EXISTS (SELECT 1 FROM guides);

-- ==========================================================================
-- SEED DATA: Gallery
-- ==========================================================================

INSERT INTO gallery (title, category, img_url, css_class, sort_order)
SELECT * FROM (VALUES
('Menembus Ombak Ujung Bocur', 'surfing', 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=500&q=80', 'tall', 1),
('Matahari Terbenam Keemasan di Pesisir Barat', 'sunset', '/assets/images/paket-sunset.jpg', 'wide', 2),
('Pohon Kelapa Teduh Way Jambu', 'pantai', '/assets/images/pantai-way-jambu.jpg', '', 3),
('Menyusuri Pasir Putih Bersama Pasangan', 'aktivitas', '/assets/images/galeri-santai-pantai.jpg', '', 4),
('Perahu Nelayan Tradisional di Biha', 'pantai', '/assets/images/pantai-biha.jpg', '', 5),
('Eksplorasi Keindahan Laut Bawah Air', 'surfing', 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80', 'wide', 6)
) AS v(title, category, img_url, css_class, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM gallery);

-- ==========================================================================
-- SEED DATA: Articles
-- ==========================================================================

INSERT INTO articles (title, description, category, img_url, published_date, slug) VALUES
('Panduan Lengkap Backpacker ke Pesisir Barat dari Jakarta', 'Ingin liburan murah ke pesisir barat? Simak rute perjalanan bus, kapal penyeberangan, hingga penginapan backpacker hemat.', 'Tips Wisata', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=500&q=80', '10 Agustus 2026', 'panduan-backpacker-pesisir-barat'),
('Musim Ombak Terbaik di Pesisir Barat untuk Peselancar Pemula', 'Jangan salah bulan berkunjung! Ketahui grafik pasang surut air laut dan bulan-bulan terbaik untuk berselancar aman bagi pemula.', 'Surfing', '/assets/images/musim-ombak.jpg', '28 Juli 2026', 'musim-ombak-terbaik'),
('Mengenal Tradisi Kerajinan Kain Tapis Khas Pesisir Barat', 'Eksplorasi nilai historis di balik tenunan emas kain tradisional Tapis Pesisir barat yang dibuat secara manual dengan penuh kesabaran.', 'Budaya', '/assets/images/kain-tapis.jpg', '15 Juli 2026', 'tradisi-kain-tapis')
ON CONFLICT (slug) DO NOTHING;

-- ==========================================================================
-- SEED DATA: Bookings (Demo)
-- ==========================================================================

INSERT INTO bookings (code, name, phone, email, package_id, package_name, visit_date, guests, notes, guide_addon, photo_addon, status, total) VALUES
('PW-2026-0001', 'John Doe', '081288889999', 'john@example.com', 'surf', 'Paket Surfing Adventure', '2026-08-15', 2, 'Request intermediate surf board', TRUE, FALSE, 'confirmed', 5250000),
('PW-2026-0002', 'Siti Aminah', '085611112222', 'siti.aminah@gmail.com', 'sunset', 'Paket Sunset & Culture', '2026-08-12', 4, 'Alergi makanan seafood diganti ayam bakar', FALSE, TRUE, 'pending', 2050000),
('PW-2026-0003', 'David Miller', '+61400222111', 'david.m@surf.com.au', 'surf', 'Paket Surfing Adventure', '2026-08-20', 1, 'Airport pick up requested from Bandar Lampung', TRUE, TRUE, 'confirmed', 3050000),
('PW-2026-0004', 'Keluarga Handoko', '081388887777', 'handoko@company.id', 'family', 'Paket Wisata Pulau Pisang', '2026-09-01', 5, 'Tour pulau & hunting sunset', FALSE, TRUE, 'pending', 1750000)
ON CONFLICT (code) DO NOTHING;

-- ==========================================================================
-- SEED DATA: Settings
-- ==========================================================================

INSERT INTO settings (site_name, whatsapp, email, address)
SELECT 'Pesibar Wave', '+62-822-8942-4809', 'Adityapratama2292@gmail.com', 'Krui, Pesisir Tengah, Pesisir Barat, Lampung 34272'
WHERE NOT EXISTS (SELECT 1 FROM settings);
