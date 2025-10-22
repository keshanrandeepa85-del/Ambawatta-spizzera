/* =========================================
   Ambawatta's Pizzeria - Admin Dashboard System
   ========================================= */

// Global Sample Data (if localStorage is empty)
let adminProducts = [
    { id: 1, name: "Signature Chicken Tikka", category: "Pizza", price: 2500, img: "chickentikka.jpg" },
    { id: 2, name: "Family Feast Package", category: "Package", price: 6500, img: "family.jpg" },
    { id: 3, name: "Cheesy Garlic Bread", category: "Sides", price: 850, img: "garlicbread.jpg" },
];

// DOM Elements
const editModal = document.getElementById('edit-product-modal');
const editForm = document.getElementById('edit-product-form');
const closeEditModalBtn = document.getElementById('close-edit-modal');


document.addEventListener('DOMContentLoaded', () => {

    loadAdminData(); // Load all data on startup
    
    // --- 1. Sidebar Navigation ---
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const targetTab = item.dataset.tab;
            tabContents.forEach(content => {
                content.style.display = 'none';
                if (content.id === targetTab) {
                    content.style.display = 'block';
                }
            });
            
            if (targetTab === 'products') {
                loadProductsAdmin();
            }
        });
    });

    // --- 2. Products Management ---
    window.loadProductsAdmin = function () { 
        const tableBody = document.querySelector('#product-table tbody');
        tableBody.innerHTML = '';
        
        const products = JSON.parse(localStorage.getItem('adminProducts')) || adminProducts;
        adminProducts = products; // Update global variable

        products.forEach(product => {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>LKR ${product.price.toFixed(2)}</td>
                <td>${product.img}</td>
                <td>
                    <button class="btn-action" onclick="editProduct(${product.id})"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn-action delete" onclick="deleteProduct(${product.id})"><i class="fas fa-trash"></i> Delete</button>
                </td>
            `;
        });
    }
    
    // --- 3. Add New Product Button ---
    document.getElementById('add-product-btn').addEventListener('click', () => {
        const newId = adminProducts.length > 0 ? Math.max(...adminProducts.map(p => p.id)) + 1 : 1;
        
        document.getElementById('modal-title').textContent = "නව නිෂ්පාදනයක් එක් කිරීම";
        document.getElementById('edit-product-id').value = newId;
        editForm.reset(); // Clear form fields
        document.getElementById('edit-product-category').value = "Pizza"; // Default
        
        editModal.style.display = 'block';
    });

    // --- 4. Gallery & Settings Save Buttons ---
    
    // Save Gallery
    document.getElementById('save-gallery-btn').addEventListener('click', () => {
        const settings = getSiteSettings(); 
        const galleryText = document.getElementById('gallery-image-list').value;
        settings.galleryImages = galleryText.split('\n').filter(url => url.trim() !== "");
        saveSiteSettings(settings);
    });

    // Save Hero Slider
    document.getElementById('save-slider-btn').addEventListener('click', () => {
        const settings = getSiteSettings();
        
        settings.heroSlider = [
            {
                title: document.getElementById('slider1-title').value,
                text: document.getElementById('slider1-text').value,
                img: document.getElementById('slider1-img').value
            },
            {
                title: document.getElementById('slider2-title').value,
                text: document.getElementById('slider2-text').value,
                img: document.getElementById('slider2-img').value
            }
        ];
        
        saveSiteSettings(settings);
    });

    // Save General Settings
    document.getElementById('save-settings-btn').addEventListener('click', () => {
        const settings = getSiteSettings(); 

        settings.storeStatus = document.getElementById('setting-store-status').value;
        settings.contactPhone = document.getElementById('setting-phone').value;
        settings.feedbackEmail = document.getElementById('setting-feedback-email').value;
        settings.social.facebook = document.getElementById('setting-social-fb').value;
        settings.social.tiktok = document.getElementById('setting-social-tiktok').value;
        settings.social.whatsapp = document.getElementById('setting-social-whatsapp').value;
        settings.siteTitle = document.getElementById('text-site-title').value;
        settings.deliveryZoneText = document.getElementById('text-delivery-zone').value;
        
        saveSiteSettings(settings); // settings.js හි ඇති function එක
    });
    
});

// =========================================================
// Global Functions (Admin)
// =========================================================

// --- Load all data into Admin Panel forms ---
function loadAdminData() {
    // 1. Load Products
    const storedProducts = localStorage.getItem('adminProducts');
    if (storedProducts) {
        adminProducts = JSON.parse(storedProducts);
    } else {
        localStorage.setItem('adminProducts', JSON.stringify(adminProducts));
    }
    loadProductsAdmin(); 

    // 2. Load Settings (from settings.js)
    const settings = getSiteSettings();
    
    // Gallery Tab
    document.getElementById('gallery-image-list').value = settings.galleryImages.join('\n');
    
    // Hero Slider Tab
    if (settings.heroSlider[0]) {
        document.getElementById('slider1-title').value = settings.heroSlider[0].title;
        document.getElementById('slider1-text').value = settings.heroSlider[0].text;
        document.getElementById('slider1-img').value = settings.heroSlider[0].img;
    }
    if (settings.heroSlider[1]) {
        document.getElementById('slider2-title').value = settings.heroSlider[1].title;
        document.getElementById('slider2-text').value = settings.heroSlider[1].text;
        document.getElementById('slider2-img').value = settings.heroSlider[1].img;
    }

    // Settings Tab
    document.getElementById('setting-store-status').value = settings.storeStatus;
    document.getElementById('setting-phone').value = settings.contactPhone;
    document.getElementById('setting-feedback-email').value = settings.feedbackEmail;
    document.getElementById('setting-social-fb').value = settings.social.facebook;
    document.getElementById('setting-social-tiktok').value = settings.social.tiktok;
    document.getElementById('setting-social-whatsapp').value = settings.social.whatsapp;
    document.getElementById('text-site-title').value = settings.siteTitle;
    document.getElementById('text-delivery-zone').value = settings.deliveryZoneText;
}


// --- Modal Controls ---
if (closeEditModalBtn) {
    closeEditModalBtn.onclick = () => editModal.style.display = 'none';
}
window.onclick = (event) => {
    if (event.target == editModal) {
        editModal.style.display = 'none';
    }
}

// --- PRODUCT CRUD (Create/Read/Update/Delete) ---

// DELETE
window.deleteProduct = function(id) { 
    if (confirm(`ඔබට ID ${id} සහිත මෙම නිෂ්පාදනය ස්ථිරවම මකා දැමීමට අවශ්‍යද?`)) {
        let products = JSON.parse(localStorage.getItem('adminProducts')) || adminProducts;
        let updatedProducts = products.filter(p => p.id !== id);
        localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
        loadProductsAdmin(); 
    }
}

// EDIT (Load data to modal)
window.editProduct = function(id) { 
    let products = JSON.parse(localStorage.getItem('adminProducts')) || adminProducts;
    let productToEdit = products.find(p => p.id === id);

    if (productToEdit) {
        document.getElementById('modal-title').textContent = "නිෂ්පාදනය සංස්කරණය කිරීම";
        document.getElementById('edit-product-id').value = productToEdit.id;
        document.getElementById('edit-product-name').value = productToEdit.name;
        document.getElementById('edit-product-category').value = productToEdit.category;
        document.getElementById('edit-product-price').value = productToEdit.price;
        // path එකේ 'images/' කොටස නොමැතිව file name එක පමණක් save කරන්න
        document.getElementById('edit-product-img').value = productToEdit.img.replace("images/", "");
        editModal.style.display = 'block';
    }
}

// SAVE (Update or Create New)
if (editForm) {
    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const id = parseInt(document.getElementById('edit-product-id').value);
        const newProductData = {
            id: id,
            name: document.getElementById('edit-product-name').value,
            category: document.getElementById('edit-product-category').value,
            price: parseFloat(document.getElementById('edit-product-price').value),
            img: document.getElementById('edit-product-img').value
        };

        let products = JSON.parse(localStorage.getItem('adminProducts')) || adminProducts;
        const index = products.findIndex(p => p.id === id);
        
        if (index !== -1) {
            // Update
            products[index] = newProductData;
            alert(`නිෂ්පාදනය ID ${id} සාර්ථකව යාවත්කාලීන කරන ලදි.`);
        } else {
            // Add New
            products.push(newProductData);
            alert(`නව නිෂ්පාදනය ID ${id} සාර්ථකව එක් කරන ලදි.`);
        }

        localStorage.setItem('adminProducts', JSON.stringify(products));
        editModal.style.display = 'none';
        loadProductsAdmin(); 
    });
}
