/* =========================================
   Ambawatta's Pizzeria - Site Settings Manager
   ========================================= */

// 1. Default Data
const defaultSettings = {
    contactPhone: "0779459609",
    feedbackEmail: "paveeshathenuwanmoon@gmail.com",
    storeStatus: "open", // 'open' or 'closed'
    social: {
        facebook: "https://www.facebook.com/",
        tiktok: "https://www.tiktok.com/",
        whatsapp: "https://wa.me/94779459609"
    },
    heroSlider: [
        { 
            title: "සති අන්තයේ විශේෂ දීමනාව", 
            text: "ඕනෑම Large Pizza 2ක් සඳහා 20%ක වට්ටමක්!", 
            img: "offer1.jpg" 
        },
        { 
            title: "නව Spicy Seafood Delight", 
            text: "මුහුදු ආහාර ලෝලීන් සඳහා!", 
            img: "offer2.jpg" 
        }
    ],
    galleryImages: [
        "images/gallery/g1.jpg",
        "images/gallery/g2.jpg",
        "images/gallery/g3.jpg"
    ],
    siteTitle: "Ambawatta's Pizzeria | Online Order",
    deliveryZoneText: "අපි Imaduwa සහ Wanchawala අවට ප්‍රදේශවලට බෙදාහැරීම් සිදු කරන්නෙමු."
};

// 2. Get Settings from LocalStorage
function getSiteSettings() {
    const settings = localStorage.getItem('pizzeriaSettings');
    return settings ? JSON.parse(settings) : defaultSettings;
}

// 3. Save Settings to LocalStorage (Used by Admin)
function saveSiteSettings(settings) {
    localStorage.setItem('pizzeriaSettings', JSON.stringify(settings));
    alert("වෙබ් අඩවි සැකසුම් (Site Settings) සාර්ථකව සුරැකිණි!");
}

// 4. Apply Settings to index.html
function applySiteSettings() {
    const settings = getSiteSettings();

    // 4.1. Site Title
    document.title = settings.siteTitle || defaultSettings.siteTitle;

    // 4.2. Store Status
    const statusBar = document.getElementById('store-status-bar');
    const statusText = document.getElementById('store-status-text');
    if (settings.storeStatus === 'closed') {
        if (statusBar) {
            statusText.textContent = "කණගාටුයි, අපි දැනට ඇණවුම් භාර නොගනිමු. (Currently Closed)";
            statusBar.style.display = 'block';
        }
        // This status will be checked by product-loader.js to disable buttons
    } else {
        if (statusBar) statusBar.style.display = 'none';
    }

    // 4.3. Contact Phone
    document.querySelectorAll('.contact-number-link').forEach(a => {
        a.href = `tel:${settings.contactPhone}`;
        if (!a.classList.contains('icon-btn')) { // Footer link text
             a.textContent = settings.contactPhone;
        }
    });

    // 4.4. Feedback Email
    const feedbackLink = document.querySelector('.feedback-email-link');
    if (feedbackLink) {
        feedbackLink.href = `mailto:${settings.feedbackEmail}`;
        feedbackLink.textContent = settings.feedbackEmail;
    }

    // 4.5. Social Media
    const fbIcon = document.querySelector('.facebook-icon');
    if (fbIcon) fbIcon.href = settings.social.facebook;
    const tiktokIcon = document.querySelector('.tiktok-icon');
    if (tiktokIcon) tiktokIcon.href = settings.social.tiktok;
    const whatsappIcon = document.querySelector('.whatsapp-icon');
    if (whatsappIcon) whatsappIcon.href = settings.social.whatsapp;

    // 4.6. Delivery Zone Text
    const deliveryZoneTextElement = document.getElementById('delivery-zone-text');
    if (deliveryZoneTextElement) {
        deliveryZoneTextElement.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${settings.deliveryZoneText}`;
    }
    const deliveryZoneFooterTextElement = document.getElementById('delivery-zone-footer-text');
    if (deliveryZoneFooterTextElement) {
        deliveryZoneFooterTextElement.textContent = settings.deliveryZoneText;
    }

    // 4.7. Load Hero Slider
    const sliderContainer = document.getElementById('hero-slider');
    if (sliderContainer) {
        sliderContainer.innerHTML = '';
        settings.heroSlider.forEach((slide, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = `slide ${index === 0 ? 'active' : ''}`;
            // පින්තූර 'images/offers/' ෆෝල්ඩරයෙන් ලබා ගනී
            slideDiv.style.backgroundImage = `url('images/offers/${slide.img}')`;
            slideDiv.innerHTML = `
                <div class="caption">
                    <h2>${slide.title}</h2>
                    <p>${slide.text}</p>
                </div>
            `;
            sliderContainer.appendChild(slideDiv);
        });
        // main.js හි ඇති slider animation එක ක්‍රියාත්මක වීමට සලස්වයි
        if (window.initializeHeroSlider) {
            window.initializeHeroSlider();
        }
    }

    // 4.8. Load Gallery
    const galleryContainer = document.getElementById('gallery-grid');
    if (galleryContainer) {
        galleryContainer.innerHTML = ''; 
        if (settings.galleryImages && settings.galleryImages.length > 0) {
            settings.galleryImages.forEach(imgUrl => {
                if (imgUrl.trim() !== "") { 
                    const div = document.createElement('div');
                    div.className = 'gallery-item';
                    // පින්තූරයේ සම්පූර්ණ path එක admin එකෙන් එන නිසා imgUrl.trim() භාවිත කරයි
                    div.innerHTML = `<img src="${imgUrl.trim()}" alt="Pizza Gallery Image">`;
                    galleryContainer.appendChild(div);
                }
            });
            // Add click listener for lightbox
            initializeGalleryLightbox();
        } else {
            galleryContainer.innerHTML = '<p>ගැලරියට තවම පින්තූර එක් කර නොමැත.</p>';
        }
    }
}

// 5. Gallery Lightbox Click Events
function initializeGalleryLightbox() {
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const galleryGrid = document.getElementById('gallery-grid');
    const closeLightbox = document.querySelector('.close-lightbox');

    if (!galleryGrid) return;

    galleryGrid.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG') {
            lightbox.style.display = 'block';
            lightboxImg.src = e.target.src;
        }
    });

    closeLightbox.onclick = () => {
        lightbox.style.display = 'none';
    }
    
    lightbox.onclick = (e) => {
        if (e.target.id === 'gallery-lightbox') { // Click on background
             lightbox.style.display = 'none';
        }
    }
}
