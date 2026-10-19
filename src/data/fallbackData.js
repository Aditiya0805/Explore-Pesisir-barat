// Mock / Fallback data when Supabase credentials are not yet configured
export const DESTINATIONS = [
  {
    id: 1,
    name: "Pantai Karang Nyimbor (Ujung Bocur)",
    location: "Pesisir Selatan, Pesisir Barat, Lampung",
    lat: -5.313426,
    lng: 103.998218,
    price: 15000,
    rating: "4.9 / 5.0 (Rating Peselancar)",
    hours: "Buka 24 Jam",
    category: "Pantai & Surfing Kelas Dunia",
    description: "Surga peselancar dunia dengan gulungan ombak legendaris Ujung Bocur.",
    long_description: "Pantai Karang Nyimbor adalah pusat utama kegiatan surfing internasional di Pesisir Barat. Pantai ini memiliki salah satu ombak kidal (left-hander) terpanjang dan paling konsisten di dunia yang dikenal sebagai 'Ujung Bocur Wave'. Gulungan ombaknya bisa mencapai ketinggian 6 hingga 7 meter di musim puncak (Mei - Oktober). Selain untuk berselancar, pantai ini menawarkan panorama karang laut eksotis, deretan gazebo tradisional untuk bersantai, serta pasir putih keemasan yang menawan saat senja tiba.",
    cover_img: "/assets/images/pantai-karang-nyimbor.jpg",
    thumbs: [
      "/assets/images/pantai-karang-nyimbor.jpg",
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=400&q=80"
    ],
    facilities: ["Parkir Luas & Aman", "Toilet & Shower Bersih", "Surf Camp & Resorts", "Penyewaan Board", "Warung Kuliner Seafood"]
  },
  {
    id: 2,
    name: "Pantai Way Jambu (The Pipeline)",
    location: "Way Jambu, Pesisir Selatan, Pesisir Barat, Lampung",
    lat: -5.358210,
    lng: 104.053120,
    price: 10000,
    rating: "4.8 / 5.0 (Sangat Asri)",
    hours: "06:00 - 18:30 WIB",
    category: "Pantai & Konservasi Alam",
    description: "Dikenal sebagai 'The Pipeline' Lampung dengan ombak barrel yang menantang.",
    long_description: "Pantai Way Jambu menyuguhkan pemandangan pantai tropis klasik dengan deretan pohon kelapa rimbun yang berjejer di sepanjang tepian pasir pantai. Ombak di Way Jambu bertipe barel cepat dan tajam di atas batu karang dangkal, menjadikannya destinasi favorit bagi peselancar profesional tingkat lanjut. Bagi non-peselancar, Way Jambu menawarkan suasana damai yang jauh dari keramaian kota, kebersihan yang sangat terjaga, serta pemandangan sunset berlatar ombak besar yang memecah karang.",
    cover_img: "/assets/images/pantai-way-jambu.jpg",
    thumbs: [
      "/assets/images/pantai-way-jambu.jpg",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=400&q=80"
    ],
    facilities: ["Area Camping Ground", "Toilet Bersih", "Gazebo Teduh", "Toko Asesoris Pantai", "Pemandu Lokal Berlisensi"]
  },
  {
    id: 3,
    name: "Pantai Mandiri (Black Sand Beach)",
    location: "Mandiri Sejati, Krui Selatan, Pesisir Barat, Lampung",
    lat: -5.247850,
    lng: 103.921530,
    price: 5000,
    rating: "4.8 / 5.0 (Sunset Favorit)",
    hours: "05:30 - 19:00 WIB",
    category: "Pantai Pasir Hitam Vulkanik",
    description: "Hamparan pasir hitam berkilau dengan pemandangan matahari terbenam magis.",
    long_description: "Pantai Mandiri terkenal dengan bentangan pasir hitam vulkanis halus yang berkilau saat terkena sinar matahari sore. Garis pantainya yang sangat panjang dan luas menjadikannya tempat ideal untuk berjalan santai, berkuda tepi pantai, menikmati senja berlatar ombak Samudra Hindia, serta hunting foto lanskap sinematik.",
    cover_img: "/assets/images/paket-explore-krui.jpg",
    thumbs: [
      "/assets/images/paket-explore-krui.jpg",
      "/assets/images/galeri-santai-pantai.jpg",
      "/assets/images/paket-sunset.jpg"
    ],
    facilities: ["Spot Foto Sunset", "Kedai Kopi Tepi Pantai", "Parkir Mobil & Motor", "Mushola", "Gazebo Santai"]
  },
  {
    id: 4,
    name: "Pantai Labuhan Jukung Krui",
    location: "Kampung Jawa, Pesisir Tengah, Krui, Pesisir Barat, Lampung",
    lat: -5.195610,
    lng: 103.931240,
    price: 5000,
    rating: "4.9 / 5.0 (Ikon Wisata Kota)",
    hours: "Buka 24 Jam",
    category: "Pusat Rekreasi & Budaya",
    description: "Ikon pariwisata utama Krui dengan panggung kesenian dan kuliner pesisir.",
    long_description: "Pantai Labuhan Jukung adalah jantung wisata kota Krui. Pantai ini memiliki taman terbuka hijau, panggung pertunjukan budaya, dan deretan kios kuliner khas Lampung Pesisir. Ombak di sini juga ramah bagi peselancar pemula hingga menengah, sementara tepi pantainya sangat aman untuk rekreasi santai bersama keluarga.",
    cover_img: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=400&q=80",
      "/assets/images/galeri-santai-pantai.jpg",
      "/assets/images/paket-explore-krui.jpg"
    ],
    facilities: ["Taman Terbuka Publik", "Panggung Kesenian Budaya", "Sentra Kuliner Ikan Bakar", "Pusat Informasi Wisata", "Toilet & Parkir Luas"]
  },
  {
    id: 6,
    name: "Air Terjun Way Detun (Curug Detun)",
    location: "Karya Penggawa, Pesisir Barat, Lampung",
    lat: -5.148500,
    lng: 103.968200,
    price: 10000,
    rating: "4.8 / 5.0 (Wisata Hutan)",
    hours: "07:30 - 17:00 WIB",
    category: "Ekowisata Hutan Tropis",
    description: "Air terjun alami di balik rimbunnya hutan hujan tropis Krui.",
    long_description: "Air Terjun Way Detun menyajikan kesegaran air pegunungan yang jernih dengan kolam alami berwarna toska di bawahnya. Dikelilingi tebing bebatuan alami dan pohon-pohon rindang, tempat ini menjadi lokasi favorit untuk melepaskan penat setelah menjelajahi ombak pantai.",
    cover_img: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=400&q=80",
      "/assets/images/paket-explore-krui.jpg",
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80"
    ],
    facilities: ["Jalur Trekking Alami", "Saung Istirahat", "Pemandu Lokal Trekking", "Warung Makanan Ringan", "Spot Foto Alami"]
  },
  {
    id: 10,
    name: "Sentra Tenun Kain Tapis Pesisir",
    location: "Krui, Pesisir Barat, Lampung",
    lat: -5.191200,
    lng: 103.941500,
    price: 0,
    rating: "4.9 / 5.0 (Warisan Budaya)",
    hours: "08:00 - 17:00 WIB",
    category: "Pelestarian Budaya & Kriya (SDG 11.4)",
    description: "Pusat tenun benang emas tradisional khas Saibatin Pesisir Barat.",
    long_description: "Sentra Tenun Tapis Pesisir Barat merupakan wadah pemberdayaan para pengrajin wanita lokal dalam melestarikan kriya tenun tradisional Lampung bermotif pucuk rebung, kapal, dan sulam benang emas. Wisatawan dapat belajar langsung proses menenun tradisional dan membeli cendera mata otentik.",
    cover_img: "/assets/images/kain-tapis.jpg",
    thumbs: [
      "/assets/images/kain-tapis.jpg",
      "/assets/images/sunset-culture.jpg",
      "/assets/images/paket-sunset.jpg"
    ],
    facilities: ["Galeri Kerajinan Tapis", "Workshop Belajar Menenun", "Toko Cendera Mata", "Pemandu Edukasi Budaya", "Toilet Bersih"]
  },
  {
    id: 14,
    name: "Pulau Pisang (Banana Island)",
    location: "Kecamatan Pulau Pisang, Pesisir Barat, Lampung",
    lat: -5.115830,
    lng: 103.852110,
    price: 25000,
    rating: "5.0 / 5.0 (Permata Tersembunyi)",
    hours: "Buka Setiap Hari (Penyeberangan 07:00 - 15:00)",
    category: "Wisata Pulau & Bahari Eksotis",
    description: "Surga pulau terpencil dengan air kristal, lumba-lumba liar & rumah bersejarah.",
    long_description: "Pulau Pisang adalah permata bahari paling memikat di Pesisir Barat Lampung. Terletak di Samudra Hindia lepas pantai Krui, pulau ini menawarkan air laut sebening kaca, terumbu karang hidup, pantai pasir putih halus, kawanan lumba-lumba yang kerap menyapa perahu pengunjung, serta deretan rumah panggung klasik peninggalan era kolonial.",
    cover_img: "/assets/images/paket-pulau-pisang.jpg",
    thumbs: [
      "/assets/images/paket-pulau-pisang.jpg",
      "/assets/images/galeri-santai-pantai.jpg",
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=400&q=80"
    ],
    facilities: ["Dermaga Perahu Nelayan", "Homestay Rumah Kayu Tradisional", "Sewa Alat Snorkeling", "Pemandu Keliling Pulau", "Kuliner Ikan Segar"]
  },
  {
    id: 16,
    name: "Pantai Biha & Pesisir",
    location: "Biha, Pesisir Selatan, Pesisir Barat, Lampung",
    lat: -5.334020,
    lng: 104.015010,
    price: 10000,
    rating: "4.7 / 5.0 (Ramah Keluarga & Kuliner)",
    hours: "06:00 - 20:00 WIB",
    category: "Wisata Bahari & Sentra Seruit",
    description: "Pantai berpasir putih keemasan yang tenang, pusat kuliner ikan bakar seruit.",
    long_description: "Pantai Biha memiliki karakteristik garis pantai yang landai dengan ombak sedang, menjadikannya destinasi wisata paling aman untuk keluarga dan anak-anak yang ingin bermain air. Di sekitar pantai, pengunjung dapat menyaksikan langsung hilir mudik perahu nelayan tradisional 'Jukung' yang membawa hasil tangkapan laut segar. Pantai ini terkenal sebagai pusat kuliner ikan bakar khas Lampung Pesisir dengan racikan bumbu tradisional sambal seruit yang menggugah selera.",
    cover_img: "/assets/images/pantai-biha.jpg",
    thumbs: [
      "/assets/images/pantai-biha.jpg",
      "/assets/images/galeri-santai-pantai.jpg",
      "/assets/images/sunset-culture.jpg"
    ],
    facilities: ["Warung Makan Seruit Segar", "Sewa Ban Renang Anak", "Mushola", "Spot Foto Perahu Jukung", "Pusat Oleh-oleh Kain Tapis"]
  },
  {
    id: 17,
    name: "Konservasi Penyu Muara Tembulih",
    location: "Pekon Muara Tembulih, Ngambur, Pesisir Barat, Lampung",
    lat: -5.392000,
    lng: 104.085000,
    price: 10000,
    rating: "4.9 / 5.0 (Konservasi Laut SDG 14)",
    hours: "08:00 - 18:00 WIB",
    category: "Konservasi Satwa Liar Bahari",
    description: "Pusat pelestarian dan penangkaran penyu belimbing & penyu sisik langka.",
    long_description: "Kawasan Konservasi Penyu Muara Tembulih didedikasikan untuk melindungi populasi penyu laut langka (penyu belimbing, penyu sisik, dan lekang) dari ancaman kepunahan. Pengunjung dapat belajar siklus hidup penyu, melihat sarang telur semi-alami, dan mengikuti program pelepasan tukik (anak penyu) ke Samudra Hindia.",
    cover_img: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=800&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=400&q=80",
      "/assets/images/galeri-santai-pantai.jpg",
      "/assets/images/pantai-biha.jpg"
    ],
    facilities: ["Pusat Edukasi & Penetasan Tukik", "Kolam Karantina Penyu", "Pemandu Konservasi", "Area Pelepasan Tukik", "Toilet & Gazebo"]
  }
];

export const MAP_LOCATIONS = [
  {
    id: 1,
    dest_id: 1,
    name: "Pantai Karang Nyimbor (Ujung Bocur)",
    category: "surfing",
    category_label: "Surfing & Ombak",
    lat: -5.313426,
    lng: 103.998218,
    icon: "fa-water",
    pin_class: "pin-surf",
    rating: "4.9 ★",
    price: "Rp 15.000",
    description: "Pusat surfing kelas dunia Pesisir Barat dengan ombak left-hander legendaris 6-7 meter.",
    img: "/assets/images/pantai-karang-nyimbor.jpg",
    gmaps_query: "Pantai+Karang+Nyimbor+Pesisir+Barat",
    gmaps_dir_url: "https://www.google.com/maps/dir/?api=1&destination=-5.313426,103.998218",
    gmaps_search_url: "https://www.google.com/maps/search/?api=1&query=-5.313426,103.998218"
  },
  {
    id: 2,
    dest_id: 2,
    name: "Pantai Way Jambu (The Pipeline)",
    category: "surfing",
    category_label: "Surfing Barrel",
    lat: -5.358210,
    lng: 104.053120,
    icon: "fa-water",
    pin_class: "pin-surf",
    rating: "4.8 ★",
    price: "Rp 10.000",
    description: "Spot ombak barrel cepat menantang di atas karang dangkal berhadapan Samudra Hindia.",
    img: "/assets/images/pantai-way-jambu.jpg",
    gmaps_query: "Pantai+Way+Jambu+Pesisir+Barat",
    gmaps_dir_url: "https://www.google.com/maps/dir/?api=1&destination=-5.358210,104.053120",
    gmaps_search_url: "https://www.google.com/maps/search/?api=1&query=-5.358210,104.053120"
  },
  {
    id: 3,
    dest_id: 3,
    name: "Pantai Mandiri (Black Sand Beach)",
    category: "beach",
    category_label: "Pantai Pasir Hitam",
    lat: -5.247850,
    lng: 103.921530,
    icon: "fa-umbrella-beach",
    pin_class: "pin-beach",
    rating: "4.8 ★",
    price: "Gratis",
    description: "Hamparan pasir hitam vulkanis berkilau dengan panorama matahari terbenam (sunset) terbaik di Pesisir Barat.",
    img: "/assets/images/paket-explore-krui.jpg",
    gmaps_query: "Pantai+Mandiri+Krui+Pesisir+Barat",
    gmaps_dir_url: "https://www.google.com/maps/dir/?api=1&destination=-5.247850,103.921530",
    gmaps_search_url: "https://www.google.com/maps/search/?api=1&query=-5.247850,103.921530"
  },
  {
    id: 4,
    dest_id: 4,
    name: "Pantai Labuhan Jukung Krui",
    category: "beach",
    category_label: "Ikon Rekreasi Pantai",
    lat: -5.195610,
    lng: 103.931240,
    icon: "fa-umbrella-beach",
    pin_class: "pin-beach",
    rating: "4.9 ★",
    price: "Rp 5.000",
    description: "Ikon wisata utama Krui dengan ruang terbuka publik, panggung budaya, dan pusat kuliner tepi laut.",
    img: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=80",
    gmaps_query: "Pantai+Labuhan+Jukung+Krui",
    gmaps_dir_url: "https://www.google.com/maps/dir/?api=1&destination=-5.195610,103.931240",
    gmaps_search_url: "https://www.google.com/maps/search/?api=1&query=-5.195610,103.931240"
  },
  {
    id: 5,
    dest_id: null,
    name: "Pantai Walur (Coconut Grove Beach)",
    category: "beach",
    category_label: "Pantai Nyiur Melambai",
    lat: -5.221500,
    lng: 103.928000,
    icon: "fa-umbrella-beach",
    pin_class: "pin-beach",
    rating: "4.7 ★",
    price: "Rp 5.000",
    description: "Pantai dengan deretan pohon kelapa teduh dan hamparan rumput hijau alami yang menghadap langsung ke laut.",
    img: "/assets/images/galeri-santai-pantai.jpg",
    gmaps_query: "Pantai+Walur+Pesisir+Barat",
    gmaps_dir_url: "https://www.google.com/maps/dir/?api=1&destination=-5.221500,103.928000",
    gmaps_search_url: "https://www.google.com/maps/search/?api=1&query=-5.221500,103.928000"
  },
  {
    id: 6,
    dest_id: 6,
    name: "Air Terjun Way Detun (Curug Detun)",
    category: "nature",
    category_label: "Air Terjun Hutan Tropis",
    lat: -5.148500,
    lng: 103.968200,
    icon: "fa-water",
    pin_class: "pin-nature",
    rating: "4.8 ★",
    price: "Rp 10.000",
    description: "Air terjun alami tersembunyi di tengah rimbunnya hutan tropis perbukitan Krui dengan kolam alami yang sejuk jernih.",
    img: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80",
    gmaps_query: "Air+Terjun+Way+Detun+Pesisir+Barat",
    gmaps_dir_url: "https://www.google.com/maps/dir/?api=1&destination=-5.148500,103.968200",
    gmaps_search_url: "https://www.google.com/maps/search/?api=1&query=-5.148500,103.968200"
  },
  {
    id: 10,
    dest_id: 10,
    name: "Sentra Tenun Kain Tapis Pesisir",
    category: "culture",
    category_label: "Budaya & Tenun Tapis",
    lat: -5.191200,
    lng: 103.941500,
    icon: "fa-scroll",
    pin_class: "pin-culture",
    rating: "4.9 ★",
    price: "Gratis Kunjungan",
    description: "Pusat edukasi dan pembuatan kain tradisional Tapis benang emas khas Lampung Pesisir yang ditenun secara manual.",
    img: "/assets/images/kain-tapis.jpg",
    gmaps_query: "Kerajinan+Tapis+Pesisir+Barat+Krui",
    gmaps_dir_url: "https://www.google.com/maps/dir/?api=1&destination=-5.191200,103.941500",
    gmaps_search_url: "https://www.google.com/maps/search/?api=1&query=-5.191200,103.941500"
  },
  {
    id: 14,
    dest_id: 14,
    name: "Pulau Pisang (Banana Island)",
    category: "island",
    category_label: "Pulau & Snorkeling",
    lat: -5.115830,
    lng: 103.852110,
    icon: "fa-sailboat",
    pin_class: "pin-island",
    rating: "5.0 ★",
    price: "Sewa Kapal",
    description: "Surga pulau terpencil dengan air laut sebening kristal, lumba-lumba liar, rumah panggung kuno, dan pantai pasir putih halus.",
    img: "/assets/images/paket-pulau-pisang.jpg",
    gmaps_query: "Pulau+Pisang+Pesisir+Barat+Lampung",
    gmaps_dir_url: "https://www.google.com/maps/dir/?api=1&destination=-5.115830,103.852110",
    gmaps_search_url: "https://www.google.com/maps/search/?api=1&query=-5.115830,103.852110"
  },
  {
    id: 16,
    dest_id: 16,
    name: "Pantai Biha & Sentra Seruit",
    category: "culinary",
    category_label: "Kuliner & Bahari",
    lat: -5.334020,
    lng: 104.015010,
    icon: "fa-utensils",
    pin_class: "pin-culinary",
    rating: "4.7 ★",
    price: "Rp 10.000",
    description: "Pusat kuliner seruit ikan bakar tradisional Lampung & pantai ramah keluarga dengan jajaran perahu nelayan Jukung.",
    img: "/assets/images/pantai-biha.jpg",
    gmaps_query: "Pantai+Biha+Pesisir+Barat",
    gmaps_dir_url: "https://www.google.com/maps/dir/?api=1&destination=-5.334020,104.015010",
    gmaps_search_url: "https://www.google.com/maps/search/?api=1&query=-5.334020,104.015010"
  },
  {
    id: 17,
    dest_id: 17,
    name: "Konservasi Penyu Muara Tembulih",
    category: "conservation",
    category_label: "Konservasi Satwa",
    lat: -5.392000,
    lng: 104.085000,
    icon: "fa-shield-halved",
    pin_class: "pin-conservation",
    rating: "4.9 ★",
    price: "Donasi",
    description: "Pusat pelestarian, penetasan telur penyu belimbing dan penyu sisik, serta edukasi ekosistem laut terpadu.",
    img: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=600&q=80",
    gmaps_query: "Konservasi+Penyu+Muara+Tembulih+Ngambur",
    gmaps_dir_url: "https://www.google.com/maps/dir/?api=1&destination=-5.392000,104.085000",
    gmaps_search_url: "https://www.google.com/maps/search/?api=1&query=-5.392000,104.085000"
  }
];

export const PACKAGES = [
  {
    id: "surf",
    name: "Paket Surfing Adventure",
    price: 2450000,
    description: "Homestay premium, papan selancar, pelatih profesional & antar jemput spot ombak terbaik Pesisir Barat.",
    duration: "3 Hari 2 Malam",
    min_persons: "1 Orang",
    amenities: ["Surf Coaching Pro", "Sewa Board", "Homestay AC", "Makan 3x", "Dokumentasi"],
    cover_img: "/assets/images/pantai-karang-nyimbor.jpg",
    is_popular: true,
    sort_order: 1
  },
  {
    id: "beach",
    name: "Paket Explore Krui",
    price: 1200000,
    description: "Vila pinggir pantai, pemandu lokal, sewa motor & tiket masuk destinasi favorit Pesisir Barat.",
    duration: "2 Hari 1 Malam",
    min_persons: "2 Orang",
    amenities: ["Vila Tepi Pantai", "Sewa Motor", "Tiket Wisata", "Tour Guide", "Kuliner Seruit"],
    cover_img: "/assets/images/paket-explore-krui.jpg",
    is_popular: false,
    sort_order: 2
  },
  {
    id: "sunset",
    name: "Paket Sunset & Culture",
    price: 450000,
    description: "Kuliner seafood, keliling desa adat Saibatin & belajar menenun kain Tapis tradisional.",
    duration: "1 Hari Penuh",
    min_persons: "2 Orang",
    amenities: ["Kuliner Ikan Bakar", "Workshop Tapis", "Transport Lokal", "Pemandu Budaya"],
    cover_img: "/assets/images/paket-sunset.jpg",
    is_popular: false,
    sort_order: 3
  },
  {
    id: "family",
    name: "Paket Wisata Pulau Pisang",
    price: 300000,
    description: "Tour perahu Pulau Pisang, Batu Ghuri, Goa Liang, Pengrajin Tapis & BBQ Ikan Bakar segar.",
    duration: "1 Hari Penuh",
    min_persons: "4 Orang",
    amenities: ["Sewa Kapal PP", "Snorkeling Gear", "Makan Siang Ikan Bakar", "Keliling Pulau"],
    cover_img: "/assets/images/paket-pulau-pisang.jpg",
    is_popular: true,
    sort_order: 4
  }
];

export const GUIDES = [
  {
    id: 1,
    name: "Rizal Pratama",
    specialty: "Surfing Instructor & Surf Guide",
    badge_label: "Certified ISA Level 2",
    rating: 5.0,
    review_count: 84,
    experience_years: 8,
    languages: "Indonesia, English",
    price: 350000,
    price_unit: "/ hari",
    is_available: true,
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    name: "Nurul Aini",
    specialty: "Cultural & Heritage Tour Guide",
    badge_label: "Pemandu Adat Krui",
    rating: 4.9,
    review_count: 62,
    experience_years: 6,
    languages: "Indonesia, Lampung, English",
    price: 250000,
    price_unit: "/ hari",
    is_available: true,
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 3,
    name: "Agus Santoso",
    specialty: "Snorkeling & Banana Island Skipper",
    badge_label: "Pemandu Laut Berlisensi",
    rating: 4.9,
    review_count: 95,
    experience_years: 10,
    languages: "Indonesia, English",
    price: 300000,
    price_unit: "/ hari",
    is_available: true,
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
  }
];

export const GALLERY = [
  {
    id: 1,
    title: "Surfing Kelas Dunia di Karang Nyimbor",
    category: "Surfing",
    img_url: "/assets/images/pantai-karang-nyimbor.jpg",
    css_class: "gallery-large"
  },
  {
    id: 2,
    title: "Menenun Kain Tapis Tradisional",
    category: "Budaya",
    img_url: "/assets/images/kain-tapis.jpg",
    css_class: ""
  },
  {
    id: 3,
    title: "Senja Magis di Krui",
    category: "Sunset",
    img_url: "/assets/images/paket-sunset.jpg",
    css_class: ""
  },
  {
    id: 4,
    title: "Eksplorasi Pulau Pisang",
    category: "Pulau",
    img_url: "/assets/images/paket-pulau-pisang.jpg",
    css_class: ""
  },
  {
    id: 5,
    title: "Pantai Pasir Putih Biha",
    category: "Pantai",
    img_url: "/assets/images/pantai-biha.jpg",
    css_class: "gallery-wide"
  }
];

export const ARTICLES = [
  {
    id: 1,
    title: "Panduan Lengkap Surfing di Krui & Pesisir Barat untuk Pemula hingga Pro",
    description: "Pelajari musim ombak terbaik, lokasi penginapan, dan tips keselamatan bermain ombak di pesisir Samudra Hindia.",
    category: "Panduan Wisata",
    img_url: "/assets/images/pantai-karang-nyimbor.jpg",
    published_date: "12 Oktober 2026",
    slug: "panduan-surfing-krui",
    url: "https://thesurfatlas.com/surfing-indonesia/krui-surf/"
  },
  {
    id: 2,
    title: "Menyingkap Pesona Tersembunyi Pulau Pisang: Cara Menuju & Aktivitas Menarik",
    description: "Pulau kecil berpasir putih dengan lumba-lumba liar dan peninggalan bangunan kolonial tempo dulu.",
    category: "Destinasi",
    img_url: "/assets/images/paket-pulau-pisang.jpg",
    published_date: "5 Oktober 2026",
    slug: "pesona-pulau-pisang",
    url: "https://www.beritasatu.com/nusantara/2957318/pesona-pulau-pisang-lampung-surga-tersembunyi-yang-wajib-dikunjungi"
  },
  {
    id: 3,
    title: "Mengenal Tradisi Menenun Kain Tapis Pesisir Barat yang Sarat Filosofi",
    description: "Kain tenun benang emas kebanggaan masyarakat Saibatin yang kini menjadi daya tarik wisata budaya unggulan.",
    category: "Budaya",
    img_url: "/assets/images/kain-tapis.jpg",
    published_date: "28 September 2026",
    slug: "tradisi-tenun-tapis",
    url: "https://wawainews.id/mengenal-kain-tapis-lampung-jenis-motif-makna-filosofis-dan-sejarah-warisan-budaya/"
  }
];

export const MOCK_BOOKINGS = [
  {
    id: 1,
    code: "PW-2026-0001",
    name: "John Doe",
    phone: "081288889999",
    email: "john@example.com",
    package_id: "surf",
    package_name: "Paket Surfing Adventure",
    visit_date: "2026-08-15",
    guests: 2,
    notes: "Request intermediate surf board",
    guide_addon: true,
    photo_addon: false,
    status: "confirmed",
    total: 5250000
  },
  {
    id: 2,
    code: "PW-2026-0002",
    name: "Siti Aminah",
    phone: "085611112222",
    email: "siti.aminah@gmail.com",
    package_id: "sunset",
    package_name: "Paket Sunset & Culture",
    visit_date: "2026-08-12",
    guests: 4,
    notes: "Alergi makanan seafood diganti ayam bakar",
    guide_addon: false,
    photo_addon: true,
    status: "pending",
    total: 2050000
  },
  {
    id: 3,
    code: "PW-2026-0003",
    name: "David Miller",
    phone: "+61400222111",
    email: "david.m@surf.com.au",
    package_id: "surf",
    package_name: "Paket Surfing Adventure",
    visit_date: "2026-08-20",
    guests: 1,
    notes: "Airport pick up requested from Bandar Lampung",
    guide_addon: true,
    photo_addon: true,
    status: "confirmed",
    total: 3050000
  },
  {
    id: 4,
    code: "PW-2026-0004",
    name: "Keluarga Handoko",
    phone: "081388887777",
    email: "handoko@company.id",
    package_id: "family",
    package_name: "Paket Wisata Pulau Pisang",
    visit_date: "2026-09-01",
    guests: 5,
    notes: "Tour pulau & hunting sunset",
    guide_addon: false,
    photo_addon: true,
    status: "pending",
    total: 1750000
  }
];
