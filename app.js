/* ==========================================================================
   DESA WISATA TANJUNG SETIA - PORTAL LOGIC & INTERACTIONS
   SPA Router, Booking Wizard, Admin Dashboard, Auth Simulation
   ========================================================================== */

// 1. DATA STORES
const DESTINATIONS = [
  {
    id: 1,
    name: "Pantai Karang Nyimbor",
    location: "Pesisir Selatan, Lampung",
    price: 15000,
    rating: "4.9 / 5.0 (Rating Peselancar)",
    hours: "Buka 24 Jam",
    category: "Pantai & Surfing Kelas Dunia",
    description: "Surga peselancar dunia dengan gulungan ombak legendaris Ujung Bocur.",
    longDescription: "Pantai Karang Nyimbor adalah pusat utama kegiatan surfing internasional di Tanjung Setia. Pantai ini memiliki salah satu ombak kidal (left-hander) terpanjang dan paling konsisten di dunia yang dikenal sebagai 'Ujung Bocur Wave'. Gulungan ombaknya bisa mencapai ketinggian 6 hingga 7 meter di musim puncak (Mei - Oktober). Selain untuk berselancar, pantai ini menawarkan panorama karang laut eksotis, deretan gazebo tradisional untuk bersantai, serta pasir putih keemasan yang menawan saat senja tiba.",
    coverImg: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=1200&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=400&q=80"
    ],
    facilities: ["Parkir Luas & Aman", "Toilet & Shower", "Surf Camp & Resorts", "Penyewaan Board", "Warung Kuliner Seafood"]
  },
  {
    id: 2,
    name: "Pantai Way Jambu",
    location: "Way Jambu, Lampung Barat",
    price: 10000,
    rating: "4.8 / 5.0 (Sangat Asri)",
    hours: "06:00 - 18:30 WIB",
    category: "Pantai & Konservasi Alam",
    description: "Dikenal sebagai 'The Pipeline' Lampung dengan ombak barrel yang menantang.",
    longDescription: "Pantai Way Jambu menyuguhkan pemandangan pantai tropis klasik dengan deretan pohon kelapa rimbun yang berjejer di sepanjang tepian pasir pantai. Ombak di Way Jambu bertipe barel cepat dan tajam di atas batu karang dangkal, menjadikannya destinasi favorit bagi peselancar profesional tingkat lanjut. Bagi non-peselancar, Way Jambu menawarkan suasana damai yang jauh dari keramaian kota, kebersihan yang sangat terjaga, serta pemandangan sunset berlatar ombak besar yang memecah karang.",
    coverImg: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=1200&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=400&q=80"
    ],
    facilities: ["Area Camping Ground", "Toilet Bersih", "Gazebo Teduh", "Toko Asesoris Pantai", "Pemandu Lokal Berlisensi"]
  },
  {
    id: 3,
    name: "Pantai Biha & Pesisir",
    location: "Biha, Lampung Barat",
    price: 10000,
    rating: "4.7 / 5.0 (Ramah Keluarga)",
    hours: "06:00 - 20:00 WIB",
    category: "Wisata Bahari & Keluarga",
    description: "Pantai berpasir putih keemasan yang tenang, cocok untuk wisata kuliner.",
    longDescription: "Pantai Biha memiliki karakteristik garis pantai yang landai dengan ombak sedang, menjadikannya destinasi wisata paling aman untuk keluarga dan anak-anak yang ingin bermain air. Di sekitar pantai, pengunjung dapat menyaksikan langsung hilir mudik perahu nelayan tradisional 'Jukung' yang membawa hasil tangkapan laut segar. Pantai ini terkenal sebagai pusat kuliner ikan bakar khas Lampung Pesisir dengan racikan bumbu tradisional sambal seruit yang menggugah selera.",
    coverImg: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80"
    ],
    facilities: ["Warung Makan Seruit", "Sewa Ban Renang", "Mushola", "Spot Foto Landmark", "Pusat Oleh-oleh Kain Tapis"]
  }
];

const PACKAGES = {
  surf: { name: "Paket Surfing Adventure", price: 2450000, desc: "Homestay premium, papan selancar, pelatih profesional & antar jemput spot" },
  beach: { name: "Paket Explore Beach", price: 1200000, desc: "Vila, pemandu lokal, sewa motor & dokumentasi lengkap" },
  sunset: { name: "Paket Sunset & Culture", price: 450000, desc: "Kuliner seafood, keliling desa adat & tenun Tapis" },
  family: { name: "Paket Wisata Keluarga", price: 1850000, desc: "Vila privat, konservasi penyu & pesta BBQ" }
};

// Initial Mock Bookings for Admin Dashboard
const MOCK_BOOKINGS = [
  {
    code: "TS-2608-001",
    name: "John Doe",
    phone: "081288889999",
    email: "john@example.com",
    packageId: "surf",
    packageName: "Paket Surfing Adventure",
    date: "2026-08-15",
    guests: 2,
    notes: "Request intermediate surf board",
    guideAddon: true,
    photoAddon: false,
    status: "confirmed",
    total: 5250000
  },
  {
    code: "TS-2608-002",
    name: "Siti Aminah",
    phone: "085611112222",
    email: "siti.aminah@gmail.com",
    packageId: "sunset",
    packageName: "Paket Sunset & Culture",
    date: "2026-08-12",
    guests: 4,
    notes: "Alergi makanan seafood diganti ayam bakar",
    guideAddon: false,
    photoAddon: true,
    status: "pending",
    total: 2050000
  },
  {
    code: "TS-2608-003",
    name: "David Miller",
    phone: "+61400222111",
    email: "david.m@surf.com.au",
    packageId: "surf",
    packageName: "Paket Surfing Adventure",
    date: "2026-08-20",
    guests: 1,
    notes: "Airport pick up requested from Bandar Lampung",
    guideAddon: true,
    photoAddon: true,
    status: "confirmed",
    total: 3050000
  },
  {
    code: "TS-2608-004",
    name: "Keluarga Handoko",
    phone: "081388887777",
    email: "handoko@company.id",
    packageId: "family",
    packageName: "Paket Wisata Keluarga",
    date: "2026-09-01",
    guests: 5,
    notes: "Ramah lansia",
    guideAddon: false,
    photoAddon: true,
    status: "pending",
    total: 9500000
  }
];

// Initialize localStorage if empty
if (!localStorage.getItem('bookings')) {
  localStorage.setItem('bookings', JSON.stringify(MOCK_BOOKINGS));
}

// 2. STATE MANAGEMENT
let bookingState = {
  packageId: 'surf',
  packageName: 'Paket Surfing Adventure',
  packagePrice: 2450000,
  guideAddon: false,
  photoAddon: false,
  name: '',
  phone: '',
  email: '',
  date: '',
  guests: 1,
  notes: '',
  totalPrice: 2450000
};

let currentStep = 1;
let isAdminLoggedIn = false;

// 3. ROUTER / SPA CONTROLLER
function initRouter() {
  const handleRouting = () => {
    const hash = window.location.hash || '#home';
    const menuLinks = document.querySelectorAll('.nav-link');
    
    // Reset active nav state
    menuLinks.forEach(link => link.classList.remove('active'));

    // Handle sections routing
    if (hash.startsWith('#home')) {
      showView('view-home');
      showHeaderFooter(true);
      
      // Scroll to specific section if sub-hash present (e.g. #home#destinasi)
      const parts = hash.split('#');
      if (parts.length > 2) {
        const sectionId = parts[2];
        const sectionEl = document.getElementById(sectionId);
        if (sectionEl) {
          // Delay slightly to allow SPA view transition
          setTimeout(() => {
            sectionEl.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
        
        // Highlight correct navbar link
        const activeLink = document.querySelector(`.nav-link[data-target="${sectionId}"]`);
        if (activeLink) activeLink.classList.add('active');
      } else {
        // Highlight Beranda link
        const homeLink = document.querySelector('.nav-link[data-target="home"]');
        if (homeLink) homeLink.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } 
    else if (hash.startsWith('#detail/')) {
      const id = parseInt(hash.split('/')[1]);
      renderDestinationDetail(id);
      showView('view-detail');
      showHeaderFooter(true);
      window.scrollTo({ top: 0 });
    } 
    else if (hash === '#booking') {
      initBookingWizard();
      showView('view-booking');
      showHeaderFooter(true);
      window.scrollTo({ top: 0 });
    } 
    else if (hash === '#auth') {
      showView('view-auth');
      showHeaderFooter(true);
      window.scrollTo({ top: 0 });
    } 
    else if (hash.startsWith('#admin')) {
      // Check login session
      if (!isAdminLoggedIn) {
        window.location.hash = '#auth';
        showToast('loginToast', 'Silakan login sebagai admin terlebih dahulu!', 'error');
        return;
      }
      showView('view-admin');
      showHeaderFooter(false); // Hide default navbar/footer in Admin
      renderAdminDashboard();
    }
  };

  window.addEventListener('hashchange', handleRouting);
  // Run once on load
  handleRouting();
}

function showView(viewId) {
  document.querySelectorAll('.spa-view').forEach(view => {
    view.classList.add('hidden');
  });
  const targetView = document.getElementById(viewId);
  if (targetView) targetView.classList.remove('hidden');
}

function showHeaderFooter(isVisible) {
  const header = document.getElementById('header');
  const footer = document.getElementById('footer');
  if (isVisible) {
    header.classList.remove('hidden');
    footer.classList.remove('hidden');
  } else {
    header.classList.add('hidden');
    footer.classList.add('hidden');
  }
}

// 4. HEADER & NAVIGATION BEHAVIORS
function initHeaderBehaviors() {
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    if (navMenu.classList.contains('active')) {
      icon.className = 'fa-solid fa-xmark';
    } else {
      icon.className = 'fa-solid fa-bars';
    }
  });

  // Close mobile menu on click nav link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      menuToggle.querySelector('i').className = 'fa-solid fa-bars';
    });
  });
}

// 5. DETAIL DESTINASI WISATA VIEW RENDERING
function renderDestinationDetail(id) {
  const dest = DESTINATIONS.find(d => d.id === id);
  if (!dest) {
    window.location.hash = '#home';
    return;
  }

  // Populate data
  document.getElementById('detailTitle').textContent = dest.name;
  document.getElementById('detailPrice').innerHTML = `Rp ${dest.price.toLocaleString('id-ID')} <span>/ org</span>`;
  document.getElementById('detailLocation').textContent = dest.location;
  document.getElementById('detailRating').textContent = dest.rating;
  document.getElementById('detailHours').textContent = `Operasional: ${dest.hours}`;
  document.getElementById('detailHeroImg').src = dest.coverImg;
  document.getElementById('detailHeroImg').alt = dest.name;
  document.getElementById('detailLongDesc').textContent = dest.longDescription;
  document.getElementById('detailCategory').textContent = dest.category;

  // Facilities
  const facilitiesBox = document.getElementById('detailAmenities');
  facilitiesBox.innerHTML = '';
  dest.facilities.forEach(fac => {
    const card = document.createElement('div');
    card.className = 'detail-amenity-card';
    card.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${fac}`;
    facilitiesBox.appendChild(card);
  });

  // Gallery Thumbs
  const thumbsBox = document.getElementById('detailGalleryThumbs');
  thumbsBox.innerHTML = '';
  dest.thumbs.forEach((t, index) => {
    const thumb = document.createElement('div');
    thumb.className = 'detail-gallery-thumb';
    thumb.innerHTML = `<img src="${t}" alt="Gallery ${dest.name} ${index + 1}">`;
    thumb.addEventListener('click', () => {
      document.getElementById('detailHeroImg').src = t;
    });
    thumbsBox.appendChild(thumb);
  });

  // Related Packages list
  const relatedBox = document.getElementById('detailRelatedPackages');
  relatedBox.innerHTML = '';
  
  // Inject package recommendation
  const targetPackageKey = id === 1 ? 'surf' : (id === 2 ? 'beach' : 'family');
  const pkgData = PACKAGES[targetPackageKey];
  
  const pkgCard = document.createElement('div');
  pkgCard.className = 'package-card popular';
  pkgCard.innerHTML = `
    <span class="popular-ribbon"><i class="fa-solid fa-thumbs-up"></i> Rekomendasi Destinasi</span>
    <div class="package-img-container">
      <img src="${dest.coverImg}" alt="${pkgData.name}" class="package-img">
    </div>
    <div class="package-content">
      <h3 class="package-title">${pkgData.name}</h3>
      <div class="package-meta-row">
        <div class="package-meta-item"><i class="fa-solid fa-clock"></i> 3 Hari 2 Malam</div>
        <div class="package-meta-item"><i class="fa-solid fa-user-group"></i> Min. 2 Orang</div>
      </div>
      <p style="font-size:0.85rem; color:var(--color-text-medium); margin-bottom:1.5rem;">Fasilitas lengkap menginap & transportasi terintegrasi dengan kunjungan ke ${dest.name}.</p>
      <div class="package-price-box">
        <span class="price-label">Tarif Mulai</span>
        <div class="price">Rp ${pkgData.price.toLocaleString('id-ID')} <span>/ pax</span></div>
      </div>
      <button class="btn btn-primary btn-block select-package-booking" data-package="${targetPackageKey}">Pesan Paket Ini</button>
    </div>
  `;
  relatedBox.appendChild(pkgCard);

  // Set sidebar button action to open booking with current package
  document.getElementById('detailBookNowBtn').onclick = () => {
    selectPackageAndGo(targetPackageKey);
  };

  // Bind new package triggers
  pkgCard.querySelector('.select-package-booking').onclick = () => {
    selectPackageAndGo(targetPackageKey);
  };
}

// Helper to select package and navigate to booking
function selectPackageAndGo(packageKey) {
  bookingState.packageId = packageKey;
  const pkg = PACKAGES[packageKey];
  bookingState.packageName = pkg.name;
  bookingState.packagePrice = pkg.price;
  window.location.hash = '#booking';
}

// 6. BOOKING WIZARD PROCESSOR
function initBookingWizard() {
  currentStep = 1;
  updateBookingWizardUI();

  // Reset form checks and inputs if needed, or pull from search bar
  const searchDest = document.getElementById('search-dest').value;
  const searchDate = document.getElementById('search-date').value;
  const searchGuests = parseInt(document.getElementById('search-guests').value);

  if (searchDest && PACKAGES[searchDest]) {
    bookingState.packageId = searchDest;
    bookingState.packageName = PACKAGES[searchDest].name;
    bookingState.packagePrice = PACKAGES[searchDest].price;
  }
  if (searchDate) {
    bookingState.date = searchDate;
    document.getElementById('book-date').value = searchDate;
  }
  if (searchGuests) {
    bookingState.guests = searchGuests;
    document.getElementById('book-guests').value = searchGuests;
  }

  // Pre-select radio button corresponding to bookingState.packageId
  const radio = document.getElementById(`svc-${bookingState.packageId}`);
  if (radio) {
    radio.checked = true;
    document.querySelectorAll('.service-select-card').forEach(c => c.classList.remove('selected'));
    radio.closest('.service-select-card').classList.add('selected');
  }

  calculateTotalPayment();
}

function initBookingWizardEvents() {
  const serviceCards = document.querySelectorAll('.service-select-card');
  const chkGuide = document.getElementById('chk-guide');
  const chkPhoto = document.getElementById('chk-photo');
  const btnNext = document.getElementById('btn-next');
  const btnPrev = document.getElementById('btn-prev');
  const numGuests = document.getElementById('book-guests');

  // Service Card select listener
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      const radio = card.querySelector('input[type="radio"]');
      radio.checked = true;
      serviceCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      
      const val = radio.value;
      bookingState.packageId = val;
      bookingState.packageName = PACKAGES[val].name;
      bookingState.packagePrice = PACKAGES[val].price;

      calculateTotalPayment();
    });
  });

  // Checkbox add-ons listeners
  chkGuide.addEventListener('change', () => {
    bookingState.guideAddon = chkGuide.checked;
    calculateTotalPayment();
  });

  chkPhoto.addEventListener('change', () => {
    bookingState.photoAddon = chkPhoto.checked;
    calculateTotalPayment();
  });

  // Guest count input listener
  numGuests.addEventListener('input', () => {
    let val = parseInt(numGuests.value) || 1;
    if (val < 1) val = 1;
    bookingState.guests = val;
    calculateTotalPayment();
  });

  // Step buttons navigation
  btnNext.addEventListener('click', () => {
    if (currentStep === 1) {
      currentStep = 2;
      updateBookingWizardUI();
    } else if (currentStep === 2) {
      if (validateStep2()) {
        currentStep = 3;
        renderReviewStep();
        updateBookingWizardUI();
      }
    } else if (currentStep === 3) {
      submitBookingReservation();
    }
  });

  btnPrev.addEventListener('click', () => {
    if (currentStep > 1 && currentStep < 4) {
      currentStep--;
      updateBookingWizardUI();
    }
  });
}

function calculateTotalPayment() {
  let packageSubtotal = bookingState.packagePrice * bookingState.guests;
  let addonsTotal = 0;

  // Add-ons pricing
  if (bookingState.guideAddon) {
    addonsTotal += 350000 * bookingState.guests; // Guide per person basis
    document.getElementById('sum-addon-guide-row').style.display = 'flex';
    document.getElementById('sum-addon-guide').textContent = `Rp ${(350000 * bookingState.guests).toLocaleString('id-ID')}`;
  } else {
    document.getElementById('sum-addon-guide-row').style.display = 'none';
  }

  if (bookingState.photoAddon) {
    addonsTotal += 250000; // Flat fee
    document.getElementById('sum-addon-photo-row').style.display = 'flex';
    document.getElementById('sum-addon-photo').textContent = `Rp 250.000`;
  } else {
    document.getElementById('sum-addon-photo-row').style.display = 'none';
  }

  bookingState.totalPrice = packageSubtotal + addonsTotal;

  // Render to Order Summary
  document.getElementById('sum-pkg-name').textContent = bookingState.packageName;
  document.getElementById('sum-pkg-price').textContent = `Rp ${bookingState.packagePrice.toLocaleString('id-ID')}`;
  document.getElementById('sum-guests').textContent = `${bookingState.guests} Orang`;
  document.getElementById('sum-pkg-subtotal').textContent = `Rp ${packageSubtotal.toLocaleString('id-ID')}`;
  document.getElementById('sum-total').textContent = `Rp ${bookingState.totalPrice.toLocaleString('id-ID')}`;
}

function validateStep2() {
  let isValid = true;

  const nameInput = document.getElementById('book-name');
  const phoneInput = document.getElementById('book-phone');
  const emailInput = document.getElementById('book-email');
  const dateInput = document.getElementById('book-date');

  // Reset states
  document.querySelectorAll('.form-error-msg').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.form-control').forEach(el => el.classList.remove('error-state'));

  // Validate Name
  if (!nameInput.value.trim()) {
    document.getElementById('err-name').classList.remove('hidden');
    nameInput.classList.add('error-state');
    isValid = false;
  } else {
    bookingState.name = nameInput.value.trim();
  }

  // Validate Phone
  const phonePattern = /^[0-9+ ]{8,15}$/;
  if (!phonePattern.test(phoneInput.value.trim())) {
    document.getElementById('err-phone').classList.remove('hidden');
    phoneInput.classList.add('error-state');
    isValid = false;
  } else {
    bookingState.phone = phoneInput.value.trim();
  }

  // Validate Email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailInput.value.trim())) {
    document.getElementById('err-email').classList.remove('hidden');
    emailInput.classList.add('error-state');
    isValid = false;
  } else {
    bookingState.email = emailInput.value.trim();
  }

  // Validate Date
  if (!dateInput.value) {
    document.getElementById('err-date').classList.remove('hidden');
    dateInput.classList.add('error-state');
    isValid = false;
  } else {
    bookingState.date = dateInput.value;
  }

  bookingState.notes = document.getElementById('book-notes').value.trim();

  return isValid;
}

function renderReviewStep() {
  document.getElementById('conf-package').textContent = bookingState.packageName;
  document.getElementById('conf-base-price').textContent = `Rp ${bookingState.packagePrice.toLocaleString('id-ID')} / pax`;

  // Render addons summaries
  const addonsBox = document.getElementById('conf-addons-list');
  addonsBox.innerHTML = '';
  let activeAddons = [];
  if (bookingState.guideAddon) {
    activeAddons.push(`Jasa Pemandu Surfing Eksklusif (+ Rp ${(350000 * bookingState.guests).toLocaleString('id-ID')} untuk ${bookingState.guests} tamu)`);
  }
  if (bookingState.photoAddon) {
    activeAddons.push(`Dokumentasi Video Drone Sinematik (+ Rp 250.000)`);
  }

  if (activeAddons.length > 0) {
    addonsBox.innerHTML = activeAddons.map(a => `• ${a}`).join('<br>');
  } else {
    addonsBox.textContent = 'Tidak ada layanan tambahan terpilih';
  }

  // Personal data
  document.getElementById('conf-name').textContent = bookingState.name;
  document.getElementById('conf-phone').textContent = bookingState.phone;
  document.getElementById('conf-email').textContent = bookingState.email;
  
  // Format Date for Indonesian locale
  const formattedDate = new Date(bookingState.date).toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  document.getElementById('conf-date').textContent = formattedDate;
  document.getElementById('conf-guests').textContent = `${bookingState.guests} Orang`;
  
  document.getElementById('conf-notes').textContent = bookingState.notes ? `"${bookingState.notes}"` : 'Tidak ada catatan tambahan';
}

function updateBookingWizardUI() {
  // Toggle forms visibility
  document.getElementById('booking-step-1').classList.add('hidden');
  document.getElementById('booking-step-2').classList.add('hidden');
  document.getElementById('booking-step-3').classList.add('hidden');

  if (currentStep === 1 || currentStep === 2 || currentStep === 3) {
    document.getElementById(`booking-step-${currentStep}`).classList.remove('hidden');
    document.getElementById('bookingMainLayout').classList.remove('hidden');
    document.getElementById('bookingSuccessScreen').classList.add('hidden');
  }

  // Update navigation buttons status
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');

  if (currentStep === 1) {
    btnPrev.disabled = true;
    btnNext.innerHTML = 'Lanjutkan <i class="fa-solid fa-arrow-right"></i>';
  } else if (currentStep === 2) {
    btnPrev.disabled = false;
    btnNext.innerHTML = 'Lanjutkan <i class="fa-solid fa-arrow-right"></i>';
  } else if (currentStep === 3) {
    btnPrev.disabled = false;
    btnNext.innerHTML = '<i class="fa-solid fa-check"></i> Konfirmasi Booking';
  }

  // Progress Bar percentage
  const percent = ((currentStep - 1) / 3) * 100;
  document.getElementById('bookingStepsProgress').style.width = `${percent}%`;

  // Step item active classes
  document.querySelectorAll('.booking-step-item').forEach(item => {
    const stepNum = parseInt(item.getAttribute('data-step'));
    item.classList.remove('active', 'completed');
    if (stepNum === currentStep) {
      item.classList.add('active');
    } else if (stepNum < currentStep) {
      item.classList.add('completed');
    }
  });
}

function submitBookingReservation() {
  // Generate random booking code
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const dateObj = new Date();
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const code = `TS-${year}${month}-${randNum}`;

  // Assemble full booking record
  const bookingRecord = {
    code: code,
    name: bookingState.name,
    phone: bookingState.phone,
    email: bookingState.email,
    packageId: bookingState.packageId,
    packageName: bookingState.packageName,
    date: bookingState.date,
    guests: bookingState.guests,
    notes: bookingState.notes,
    guideAddon: bookingState.guideAddon,
    photoAddon: bookingState.photoAddon,
    status: 'pending',
    total: bookingState.totalPrice
  };

  // Push to localStorage
  const currentList = JSON.parse(localStorage.getItem('bookings')) || [];
  currentList.push(bookingRecord);
  localStorage.setItem('bookings', JSON.stringify(currentList));

  // Swap to success screen
  currentStep = 4;
  updateBookingWizardUI();
  document.getElementById('bookingMainLayout').classList.add('hidden');
  document.getElementById('bookingSuccessScreen').classList.remove('hidden');
  document.getElementById('bookingSuccessCode').textContent = code;
}

// 7. AUTHENTICATION & LOGIN PROCESSOR
function initAuthPortal() {
  const goRegisterBtn = document.getElementById('authGoRegister');
  const goLoginBtn = document.getElementById('authGoLogin');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  const loginBox = document.getElementById('auth-login-box');
  const registerBox = document.getElementById('auth-register-box');

  goRegisterBtn.onclick = (e) => {
    e.preventDefault();
    loginBox.classList.add('hidden');
    registerBox.classList.remove('hidden');
  };

  goLoginBtn.onclick = (e) => {
    e.preventDefault();
    registerBox.classList.add('hidden');
    loginBox.classList.remove('hidden');
  };

  // Login handler
  loginForm.onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-password').value;

    if (email === 'admin@tanjungsetia.com' && pass === 'admin123') {
      isAdminLoggedIn = true;
      showToast('loginToast', 'Login Admin berhasil! Membuka dashboard...', 'success');
      
      // Delay before redirecting to dashboard
      setTimeout(() => {
        // Reset inputs
        loginForm.reset();
        window.location.hash = '#admin';
      }, 1200);
    } else {
      showToast('loginToast', 'Email atau kata sandi Anda salah!', 'error');
    }
  };

  // Register handler
  registerForm.onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    showToast('registerToast', 'Pendaftaran Akun Simulasi Berhasil!', 'success');
    
    setTimeout(() => {
      registerForm.reset();
      registerBox.classList.add('hidden');
      loginBox.classList.remove('hidden');
    }, 1500);
  };
}

// 8. ADMIN DASHBOARD OPERATIONS
function renderAdminDashboard() {
  const bookings = JSON.parse(localStorage.getItem('bookings')) || [];

  // Calculate statistics
  const totalBookings = bookings.length;
  
  // Calculate today's bookings
  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookingsCount = bookings.filter(b => b.date === todayStr || b.code.startsWith(`TS-${todayStr.replace(/-/g, '').slice(0,6)}`)).length;

  // Calculate confirmed earnings revenue
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.total, 0);

  // Update stat metrics
  document.getElementById('stat-total-booking').textContent = totalBookings;
  document.getElementById('stat-today-booking').textContent = todayBookingsCount;
  document.getElementById('stat-total-revenue').textContent = `Rp ${totalRevenue.toLocaleString('id-ID')}`;
  document.getElementById('adminBadgePemesanan').textContent = bookings.filter(b => b.status === 'pending').length;

  // Render overview dynamic list (dashboard recent table, capped at 4)
  const dashboardTbody = document.getElementById('adminDashboardTableBody');
  dashboardTbody.innerHTML = '';
  
  const recentBookings = [...bookings].reverse().slice(0, 4);

  if (recentBookings.length === 0) {
    dashboardTbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">Tidak ada data pemesanan.</td></tr>`;
  } else {
    recentBookings.forEach(b => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong style="color:var(--color-ocean-blue);">${b.code}</strong></td>
        <td><strong>${b.name}</strong><br><span style="font-size:0.75rem; color:var(--color-text-light);">${b.email}</span></td>
        <td>${b.packageName}</td>
        <td>${b.date}</td>
        <td>${b.guests} Pax</td>
        <td><strong>Rp ${b.total.toLocaleString('id-ID')}</strong></td>
        <td><span class="booking-status-badge ${b.status}">${b.status === 'confirmed' ? 'Disetujui' : (b.status === 'cancelled' ? 'Batal' : 'Pending')}</span></td>
        <td>
          <div class="admin-actions-cell">
            ${b.status === 'pending' ? `
              <button class="admin-action-btn approve" data-code="${b.code}" title="Setujui Pemesanan"><i class="fa-solid fa-check"></i></button>
              <button class="admin-action-btn reject" data-code="${b.code}" title="Batalkan Pemesanan"><i class="fa-solid fa-xmark"></i></button>
            ` : `<span style="font-size:0.8rem; color:var(--color-text-light);">-</span>`}
          </div>
        </td>
      `;
      dashboardTbody.appendChild(row);
    });
  }

  // Render full bookings page table
  const fullBookingsTbody = document.getElementById('adminFullBookingsTableBody');
  fullBookingsTbody.innerHTML = '';

  if (bookings.length === 0) {
    fullBookingsTbody.innerHTML = `
      <tr>
        <td colspan="9">
          <div class="table-empty-state">
            <i class="fa-solid fa-folder-open"></i>
            <h4>Belum Ada Reservasi</h4>
            <p>Pemesanan dari website pariwisata akan muncul di list ini.</p>
          </div>
        </td>
      </tr>`;
  } else {
    [...bookings].reverse().forEach(b => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong style="color:var(--color-ocean-blue);">${b.code}</strong></td>
        <td><strong>${b.name}</strong></td>
        <td><a href="https://wa.me/${b.phone.replace(/[^0-9]/g, '')}" target="_blank" style="color:var(--color-success); font-weight:700;"><i class="fa-brands fa-whatsapp"></i> ${b.phone}</a></td>
        <td>
          <strong>${b.packageName}</strong><br>
          <span style="font-size:0.75rem; color:var(--color-text-light);">Addons: ${b.guideAddon ? 'Guide' : ''} ${b.photoAddon ? 'Video' : ''} ${!b.guideAddon && !b.photoAddon ? 'Tanpa addons' : ''}</span>
        </td>
        <td>${b.date}</td>
        <td>${b.guests} Pax</td>
        <td><strong>Rp ${b.total.toLocaleString('id-ID')}</strong></td>
        <td><span class="booking-status-badge ${b.status}">${b.status === 'confirmed' ? 'Disetujui' : (b.status === 'cancelled' ? 'Batal' : 'Pending')}</span></td>
        <td>
          <div class="admin-actions-cell">
            ${b.status === 'pending' ? `
              <button class="admin-action-btn approve" data-code="${b.code}" title="Setujui"><i class="fa-solid fa-check"></i> Setujui</button>
              <button class="admin-action-btn reject" data-code="${b.code}" title="Batalkan"><i class="fa-solid fa-xmark"></i> Batalkan</button>
            ` : `<span style="font-size:0.8rem; color:var(--color-text-light);">Selesai</span>`}
          </div>
        </td>
      `;
      fullBookingsTbody.appendChild(row);
    });
  }

  // Bind operational approve / cancel actions
  document.querySelectorAll('.admin-action-btn.approve').forEach(btn => {
    btn.onclick = () => updateBookingStatus(btn.getAttribute('data-code'), 'confirmed');
  });

  document.querySelectorAll('.admin-action-btn.reject').forEach(btn => {
    btn.onclick = () => updateBookingStatus(btn.getAttribute('data-code'), 'cancelled');
  });
}

function updateBookingStatus(bookingCode, status) {
  const currentList = JSON.parse(localStorage.getItem('bookings')) || [];
  const item = currentList.find(b => b.code === bookingCode);
  if (item) {
    item.status = status;
    localStorage.setItem('bookings', JSON.stringify(currentList));
    // Re-render dashboard
    renderAdminDashboard();
  }
}

function initAdminDashboardTabs() {
  const sidebarNavItems = document.querySelectorAll('.admin-nav-item');
  const tabContents = document.querySelectorAll('.admin-tab-content');

  sidebarNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = item.getAttribute('data-tab');

      // Update active nav styling
      sidebarNavItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      // Toggle tab contents visibility
      tabContents.forEach(content => content.classList.add('hidden'));
      document.getElementById(`admin-tab-${targetTab}`).classList.remove('hidden');

      // Update Top Title header content
      const tabTitle = item.querySelector('a').textContent.trim();
      document.getElementById('adminTabTitle').textContent = `Kelola ${tabTitle}`;
      
      if (targetTab === 'dashboard') {
        document.getElementById('adminTabTitle').textContent = `Overview Dashboard`;
        document.getElementById('adminTabSubtitle').textContent = `Statistik umum dan manajemen data Desa Wisata Tanjung Setia.`;
        renderAdminDashboard();
      } else {
        document.getElementById('adminTabSubtitle').textContent = `Modifikasi database panel ${tabTitle.toLowerCase()} pariwisata.`;
      }
    });
  });

  // Shortcut redirections inside tables
  document.getElementById('adminGoToPemesananTab').onclick = () => {
    const tabLink = document.querySelector('.admin-nav-item[data-tab="pemesanan"]');
    if (tabLink) tabLink.click();
  };

  document.getElementById('adminLogoutBtn').onclick = () => {
    isAdminLoggedIn = false;
    window.location.hash = '#home';
  };
}

// 9. HELPER UI UTILITIES
function showToast(elementId, message, type = 'success') {
  const toast = document.getElementById(elementId);
  toast.textContent = message;
  toast.className = `auth-toast ${type}`;
  toast.classList.remove('hidden');
  
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3500);
}

// 10. GALLERIES & INTERACTIVE TRIGGERS
function initInteractiveTriggers() {
  // Main gallery filtering logic
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        if (filterVal === 'all' || item.getAttribute('data-category') === filterVal) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // "Lihat Semua Galeri" trigger alert
  document.getElementById('seeAllGalleryBtn').onclick = () => {
    alert("Galeri wisata penuh akan dimuat saat integrasi backend cloud storage tersambung!");
  };

  // Search/Reservation search bar button click
  document.getElementById('searchBarBtn').onclick = () => {
    const searchDest = document.getElementById('search-dest').value;
    if (searchDest) {
      window.location.hash = '#booking';
    } else {
      alert("Silakan pilih destinasi / paket yang ingin Anda telusuri terlebih dahulu.");
    }
  };

  // View detail buttons click (landing page cards)
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('view-detail-trigger')) {
      const id = parseInt(e.target.getAttribute('data-id'));
      window.location.hash = `#detail/${id}`;
    }

    if (e.target.classList.contains('select-package-booking')) {
      const key = e.target.getAttribute('data-package');
      selectPackageAndGo(key);
    }

    if (e.target.classList.contains('book-guide-trigger')) {
      const guideName = e.target.getAttribute('data-guide');
      bookingState.guideAddon = true;
      document.getElementById('chk-guide').checked = true;
      window.location.hash = '#booking';
    }
  });
}

// 11. INITIALIZATION ON DOM CONTENT LOADED
document.addEventListener('DOMContentLoaded', () => {
  initRouter();
  initHeaderBehaviors();
  initBookingWizardEvents();
  initAuthPortal();
  initAdminDashboardTabs();
  initInteractiveTriggers();
});
