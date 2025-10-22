/* =========================================
   Ambawatta's Pizzeria - Admin Dashboard Logic
   (Relies on js/settings.js to load initial data)
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Data Load
    // settings.js මගින් allProducts, galleryImages, heroSlides, සහ siteSettings Global Variables Load කර ඇතැයි උපකල්පනය කරයි
    loadInitialAdminData();
    
    // 2. Event Listeners
    setupTabListeners();
    setupProductListeners();
    setupGalleryListeners();
    
    // 3. Save All Button
    document.getElementById('save-all-changes-btn').addEventListener('click', saveAdminSettings);

    // 4. Modal Closer
    document.querySelectorAll('.modal .close-modal').forEach(closer => {
        closer.onclick = (e) => e.target.closest('.modal').style.display = 'none';
    });
});

// ===============================================
// 1. DATA LOAD AND RENDERING
// ===============================================

function loadInitialAdminData() {
    // 1. General Settings
    document.getElementById('admin-store-status').value = siteSettings.storeOpen ? 'open' : 'closed';
    document.getElementById('admin-store-message').value = siteSettings.storeMessage || '';
    document.getElementById('admin-contact-phone').value = siteSettings.contact.phone || '';
    document.getElementById('admin-contact-email').value = siteSettings.contact.email || '';

    // 2. Products and Gallery Lists
    renderProductsTable();
    renderGalleryTable();
}

// Products Table Render
function renderProductsTable() {
    const tableBody = document.getElementById('products-table-body');
    tableBody.innerHTML = '';
    
    if (typeof allProducts === 'undefined' || allProducts.length === 0) return;

    allProducts.forEach(product => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = product.id;
        row.insertCell(1).textContent = product.name;
        row.insertCell(2).textContent = product.category;
        row.insertCell(3).textContent = `LKR ${product.price.toFixed(2)}`;
        row.insertCell(4).textContent = product.isSpecial ? '✅ ඔව්' : '❌ නැත';
        
        const actionsCell = row.insertCell(5);
        actionsCell.className = 'action-btns';
        actionsCell.innerHTML = `
            <button class="edit-btn" data-id="${product.id}"><i class="fas fa-edit"></i></button>
            <button class="delete-btn" data-id="${product.id}"><i class="fas fa-trash-alt"></i></button>
        `;
    });
    
    // Attach event listeners after rendering
    attachProductActionListeners();
}

// Gallery Table Render
function renderGalleryTable() {
    const tableBody = document.getElementById('gallery-table-body');
    tableBody.innerHTML = '';
    
    if (typeof galleryImages === 'undefined' || galleryImages.length === 0) return;

    galleryImages.forEach(item => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = item.id;
        row.insertCell(1).textContent = item.img;
        row.insertCell(2).textContent = item.caption;
        
        const actionsCell = row.insertCell(3);
        actionsCell.className = 'action-btns';
        actionsCell.innerHTML = `
            <button class="edit-gallery-btn" data-id="${item.id}"><i class="fas fa-edit"></i></button>
            <button class="delete-gallery-btn" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
        `;
    });
    
    // Attach event listeners after rendering
    attachGalleryActionListeners();
}


// ===============================================
// 2. TAB NAVIGATION
// ===============================================

function setupTabListeners() {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Remove active class from all buttons and contents
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active class to selected button and content
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}


// ===============================================
// 3. PRODUCT MANAGEMENT LOGIC
// ===============================================

function setupProductListeners() {
    document.getElementById('add-new-product-btn').addEventListener('click', () => openProductModal());
    document.getElementById('product-form').addEventListener('submit', handleProductSubmit);
}

function attachProductActionListeners() {
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => openProductModal(parseInt(e.currentTarget.dataset.id)));
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => deleteProduct(parseInt(e.currentTarget.dataset.id)));
    });
}

function openProductModal(productId = null) {
    const modal = document.getElementById('product-modal');
    const form = document.getElementById('product-form');
    form.reset();
    
    if (productId !== null) {
        const product = allProducts.find(p => p.id === productId);
        if (product) {
            document.getElementById('product-id').value = product.id;
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-category').value = product.category;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-description').value = product.description;
            document.getElementById('product-img').value = product.img;
            document.getElementById('product-is-special').checked = product.isSpecial;
        }
    } else {
        document.getElementById('product-id').value = '';
    }
    
    modal.style.display = 'block';
}

function handleProductSubmit(e) {
    e.preventDefault();
    const productId = document.getElementById('product-id').value ? parseInt(document.getElementById('product-id').value) : null;
    
    const newProduct = {
        id: productId || getNextId(allProducts),
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        price: parseFloat(document.getElementById('product-price').value),
        description: document.getElementById('product-description').value,
        img: document.getElementById('product-img').value,
        isSpecial: document.getElementById('product-is-special').checked
    };

    if (productId) {
        // Edit existing product
        const index = allProducts.findIndex(p => p.id === productId);
        if (index > -1) {
            allProducts[index] = newProduct;
        }
    } else {
        // Add new product
        allProducts.push(newProduct);
    }

    document.getElementById('product-modal').style.display = 'none';
    renderProductsTable();
    alert("නිෂ්පාදන වෙනස්කම් තාවකාලිකව සුරකිණි. 'සියලු වෙනස්කම් සුරකින්න' බොත්තම ඔබන්න.");
}

function deleteProduct(productId) {
    if (confirm("ඔබට මෙම නිෂ්පාදනය ඉවත් කිරීමට අවශ්‍ය බව ස්ථිරද?")) {
        allProducts = allProducts.filter(p => p.id !== productId);
        renderProductsTable();
        alert("නිෂ්පාදනය ඉවත් කරන ලදි. 'සියලු වෙනස්කම් සුරකින්න' බොත්තම ඔබන්න.");
    }
}


// ===============================================
// 4. GALLERY MANAGEMENT LOGIC
// ===============================================

function setupGalleryListeners() {
    document.getElementById('add-new-gallery-btn').addEventListener('click', () => openGalleryModal());
    document.getElementById('gallery-form').addEventListener('submit', handleGallerySubmit);
}

function attachGalleryActionListeners() {
    document.querySelectorAll('.edit-gallery-btn').forEach(btn => {
        btn.addEventListener('click', (e) => openGalleryModal(parseInt(e.currentTarget.dataset.id)));
    });

    document.querySelectorAll('.delete-gallery-btn').forEach(btn => {
        btn.addEventListener('click', (e) => deleteGalleryItem(parseInt(e.currentTarget.dataset.id)));
    });
}

function openGalleryModal(galleryId = null) {
    const modal = document.getElementById('gallery-modal');
    const form = document.getElementById('gallery-form');
    form.reset();
    
    if (galleryId !== null) {
        const item = galleryImages.find(i => i.id === galleryId);
        if (item) {
            document.getElementById('gallery-id').value = item.id;
            document.getElementById('gallery-img-name').value = item.img;
            document.getElementById('gallery-caption').value = item.caption;
        }
    } else {
        document.getElementById('gallery-id').value = '';
    }
    
    modal.style.display = 'block';
}

function handleGallerySubmit(e) {
    e.preventDefault();
    const galleryId = document.getElementById('gallery-id').value ? parseInt(document.getElementById('gallery-id').value) : null;
    
    const newGalleryItem = {
        id: galleryId || getNextId(galleryImages),
        img: document.getElementById('gallery-img-name').value,
        caption: document.getElementById('gallery-caption').value,
    };

    if (galleryId) {
        // Edit existing item
        const index = galleryImages.findIndex(i => i.id === galleryId);
        if (index > -1) {
            galleryImages[index] = newGalleryItem;
        }
    } else {
        // Add new item
        galleryImages.push(newGalleryItem);
    }

    document.getElementById('gallery-modal').style.display = 'none';
    renderGalleryTable();
    alert("ගැලරි වෙනස්කම් තාවකාලිකව සුරකිණි. 'සියලු වෙනස්කම් සුරකින්න' බොත්තම ඔබන්න.");
}

function deleteGalleryItem(galleryId) {
    if (confirm("ඔබට මෙම ගැලරි පින්තූරය ඉවත් කිරීමට අවශ්‍ය බව ස්ථිරද?")) {
        galleryImages = galleryImages.filter(i => i.id !== galleryId);
        renderGalleryTable();
        alert("පින්තූරය ඉවත් කරන ලදි. 'සියලු වෙනස්කම් සුරකින්න' බොත්තම ඔබන්න.");
    }
}

// ===============================================
// 5. GLOBAL SAVE FUNCTION (Final Step)
// ===============================================

/**
 * සියලුම වෙනස්කම් LocalStorage වෙත JSON ආකාරයෙන් සුරකියි.
 */
function saveAdminSettings() {
    // 1. General Settings යාවත්කාලීන කිරීම
    siteSettings.storeOpen = document.getElementById('admin-store-status').value === 'open';
    siteSettings.storeMessage = document.getElementById('admin-store-message').value.trim();
    siteSettings.contact.phone = document.getElementById('admin-contact-phone').value.trim();
    siteSettings.contact.email = document.getElementById('admin-contact-email').value.trim();
    
    // 2. Products, Gallery, Slider (settings.js හි ඇති Global Vars) යාවත්කාලීන කිරීම
    // allProducts, galleryImages, heroSlides මේ වන විටත් Add/Edit මගින් යාවත්කාලීන වී ඇත.

    const finalSettings = {
        ...siteSettings, // General settings
        products: allProducts,
        gallery: galleryImages,
        slider: heroSlides // heroSlides වෙනස් කරන්නේ නැතිනම් පෙර තිබූ ආකාරයටම තබා ගනී
    };

    // 3. LocalStorage හි සුරැකීම
    try {
        localStorage.setItem('siteSettings', JSON.stringify(finalSettings));
        
        console.log("Admin දත්ත සාර්ථකව LocalStorage හි සුරකිණි:", finalSettings);
        alert("සියලු සැකසුම් සාර්ථකව සුරකිණි. ප්‍රධාන පිටුවට ගොස් පරීක්ෂා කරන්න.");
        
        // සාර්ථකව සුරකීමෙන් පසු පිටුව නැවත Load කරන්න
        window.location.reload(); 

    } catch (error) {
        console.error("Local Storage හි දත්ත සුරැකීමේදී දෝෂයක්:", error);
        alert("දත්ත සුරැකීමේ දෝෂයක් සිදුවිය! Console එක පරීක්ෂා කරන්න.");
    }
}

// Helper Function: නව ID එකක් ලබා ගැනීම
function getNextId(array) {
    if (!array || array.length === 0) return 1;
    const maxId = array.reduce((max, item) => (item.id && item.id > max ? item.id : max), 0);
    return maxId + 1;
}
