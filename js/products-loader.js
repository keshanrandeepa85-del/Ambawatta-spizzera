/* =========================================================
   Ambawatta's Pizzeria - Product Loading & Filtering
   ========================================================= */

// Global variable to hold all products from localStorage
let allProducts = [];
let currentStoreStatus = "open";

document.addEventListener('DOMContentLoaded', () => {
    // 1. Get settings and products from localStorage
    const settings = getSiteSettings(); // from settings.js
    currentStoreStatus = settings.storeStatus || "open";
    
    const storedProducts = localStorage.getItem('adminProducts');
    const defaultProducts = [
        { id: 1, name: "Signature Chicken Tikka", category: "Pizza", price: 2500, img: "chickentikka.jpg" },
        { id: 2, name: "Family Feast Package", category: "Package", price: 6500, img: "family.jpg" },
    ];
    
    if (storedProducts) {
        allProducts = JSON.parse(storedProducts);
    } else {
        allProducts = defaultProducts;
        localStorage.setItem('adminProducts', JSON.stringify(defaultProducts)); 
    }
    
    // 2. Initial render of all products
    renderFilteredProducts();
});

// 3. This function initializes the search and category filter buttons
function initializeProductFiltering() {
    // Search Input Listener
    const searchInput = document.getElementById('product-search');
    if (searchInput) {
        searchInput.addEventListener('keyup', () => {
            renderFilteredProducts();
        });
    }

    // Category Button Listeners
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Set active class
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Re-render products
            renderFilteredProducts();
        });
    });
}

// 4. The main function to render products based on filters
function renderFilteredProducts() {
    // Get current filter values
    const searchTerm = document.getElementById('product-search').value.toLowerCase();
    const activeCategoryBtn = document.querySelector('.category-btn.active');
    const activeCategory = activeCategoryBtn ? activeCategoryBtn.dataset.category : 'all';

    // Filter the 'allProducts' list
    const filteredProducts = allProducts.filter(product => {
        // Check 1: Category filter
        const categoryMatch = (activeCategory === 'all' || product.category === activeCategory);
        // Check 2: Search filter
        const searchMatch = product.name.toLowerCase().includes(searchTerm);
        
        return categoryMatch && searchMatch;
    });

    // 5. Load filtered products into the correct UI grids
    loadProductsToUI(filteredProducts);
}


// 6. This function just handles the HTML rendering
function loadProductsToUI(products) {
    const packagesContainer = document.getElementById('packages-grid');
    const productsContainer = document.getElementById('products-grid');
    const noProductsMessage = document.getElementById('no-products-message');
    
    // Clear existing content
    if (packagesContainer) packagesContainer.innerHTML = '';
    if (productsContainer) productsContainer.innerHTML = '';

    if (products.length === 0) {
        noProductsMessage.style.display = 'block';
    } else {
        noProductsMessage.style.display = 'none';
    }

    products.forEach(product => {
        // පින්තූරය 'images/' ෆෝල්ඩරයෙන් ලබා ගනී
        const imagePath = `images/${product.img}`; 
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Check store status to disable button
        const isClosed = (currentStoreStatus === 'closed');
        
        productCard.innerHTML = `
            <img src="${imagePath}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">LKR ${product.price.toFixed(2)}</p>
                <button class="btn-primary add-to-cart-btn" 
                        data-id="${product.id}" 
                        ${isClosed ? 'disabled' : ''}>
                    <i class="fas ${isClosed ? 'fa-lock' : 'fa-shopping-cart'}"></i>
                    ${isClosed ? 'වසා ඇත' : 'කරත්තයට එක් කරන්න'}
                </button>
            </div>
        `;

        // Add to correct grid
        if (product.category === 'Package' && packagesContainer) {
            packagesContainer.appendChild(productCard);
        } else if (productsContainer) {
            productsContainer.appendChild(productCard);
        }
    });

    // Attach event listeners for the newly created 'Add to Cart' buttons
    // This is crucial because cart.js runs before these buttons exist
    if (window.attachCartListeners) {
        window.attachCartListeners();
    }
}
