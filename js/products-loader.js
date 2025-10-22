/* =========================================================
   Ambawatta's Pizzeria - Product Loading Logic 
   (Local Storage වෙතින් දත්ත කියවා UI වෙත පෙන්වයි)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Data Setup (Admin Dashboard එකේ sample data)
    const defaultProducts = [
        { id: 1, name: "Signature Chicken Tikka", category: "Pizza", price: 2500, img: "chickentikka.jpg" },
        { id: 2, name: "Family Feast Package", category: "Package", price: 6500, img: "family.jpg" },
        { id: 3, name: "Cheesy Garlic Bread", category: "Sides", price: 850, img: "garlicbread.jpg" },
        { id: 4, name: "Tropical Veggie Pizza", category: "Pizza", price: 2200, img: "veggie.jpg" }
    ];

    // Local Storage වෙතින් දත්ත Load කරන්න.
    let currentProducts = JSON.parse(localStorage.getItem('adminProducts'));

    // Local Storage හි දත්ත නොමැති නම්, default data භාවිතා කරන්න.
    if (!currentProducts || currentProducts.length === 0) {
        currentProducts = defaultProducts;
        // මුල් වරට Local Storage එකට Save කිරීම
        localStorage.setItem('adminProducts', JSON.stringify(defaultProducts)); 
    }
    
    // 2. Product List එක HTML වෙත Load කරන Function එක
    function loadProductsToUI(products) {
        const productContainer = document.querySelector('.products-grid'); 
        const noProductsMessage = document.getElementById('no-products-message'); 
        
        if (!productContainer) return; 

        productContainer.innerHTML = ''; // පැරණි Hard-coded Product එක ඉවත් කිරීම

        if (products.length === 0) {
            noProductsMessage.style.display = 'block';
            return;
        }

        noProductsMessage.style.display = 'none';

        products.forEach(product => {
            // පින්තූරයේ නිවැරදි ලිපිනය (Path) මෙහිදී සකසා ඇත. (images/ folder එක උපකල්පනය කර ඇත)
            const imagePath = `images/${product.img}`; 
            
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${imagePath}" alt="${product.name}" class="product-img">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-category">${product.category}</p>
                    <p class="product-price">LKR ${product.price.toFixed(2)}</p>
                    <button class="btn-primary add-to-cart-btn" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> කරත්තයට එක් කරන්න
                    </button>
                </div>
            `;
            productContainer.appendChild(productCard);
        });
        
        // Cart Logic සඳහා event listeners මෙහිදී Add කළ හැකිය (නැතහොත් js/cart.js තුලට).
    }
    
    // 3. Page එක Load වූ විට Products Load කිරීම
    loadProductsToUI(currentProducts);
});
