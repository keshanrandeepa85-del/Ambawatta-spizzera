/* =========================================
   Ambawatta's Pizzeria - Cart System
   ========================================= */

// DOMContentLoaded: HTML එක සම්පූර්ණයෙන් load වූ පසු මෙම කේතය ක්‍රියාත්මක වේ
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. මූලික නියැදි නිෂ්පාදන දත්ත (Sample Products) ---
    // (සැබෑ වෙබ් අඩවියේදී, මෙය Admin Dashboard එකෙන් පැමිණිය යුතුය)
    const sampleProducts = {
        1: { name: "Signature Chicken Tikka", price: 2500, img: "images/pizzas/chickentikka.jpg" },
        2: { name: "Spicy Seafood Delight", price: 2800, img: "images/pizzas/seafood.jpg" },
        3: { name: "Classic Margherita (Veg)", price: 1800, img: "images/pizzas/margherita.jpg" },
        4: { name: "Family Feast Package", price: 6500, img: "images/packages/family.jpg" },
        5: { name: "Cheesy Garlic Bread", price: 850, img: "images/sides/garlicbread.jpg" },
        6: { name: "French Fries (Large)", price: 700, img: "images/sides/fries.jpg" }
    };
    
    // --- 2. HTML Elements තෝරා ගැනීම ---
    const productGrid = document.querySelector('.products-grid');
    const cartBtn = document.querySelector('.cart-btn');
    const cartCountElement = document.querySelector('.cart-count');
    const cartModal = document.getElementById('cart-modal');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalElement = document.getElementById('cart-total-price');
    const closeModalBtn = document.querySelector('.close-modal');
    const specialInstructionsBox = document.getElementById('special-instructions');

    // --- 3. Cart දත්ත ගබඩා කිරීම (localStorage) ---
    // (පිටුව refresh කළත් Cart එකේ දේවල් මතක තබා ගැනීමට)
    let cart = JSON.parse(localStorage.getItem('ambawattaCart')) || [];

    // --- 4. නියැදි නිෂ්පාදන (Sample Products) පූරණය කිරීම (Load) ---
    function loadProducts() {
        // (ඔබ කලින් ඉල්ලූ පරිදි, දත්ත නොමැති නම් පණිවිඩයක් පෙන්වීම)
        if (!Object.keys(sampleProducts).length) {
            document.getElementById('no-products-message').style.display = 'block';
            productGrid.innerHTML = '';
            return;
        }

        productGrid.innerHTML = ''; // Clear existing
        for (const id in sampleProducts) {
            const product = sampleProducts[id];
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.img}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">LKR ${product.price.toFixed(2)}</p>
                <button class="add-to-cart-btn" data-product-id="${id}">
                    <i class="fas fa-shopping-cart"></i> කරත්තයට එක් කරන්න
                </button>
            `;
            productGrid.appendChild(productCard);
            
            // Animation සඳහා observer වෙත එක් කිරීම (main.js එකෙන්)
             if (window.observer) {
                 window.observer.observe(productCard);
             }
        }
    }

    // --- 5. Cart එකට Product එකතු කිරීම ---
    productGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = e.target.dataset.productId;
            addToCart(productId);
            showAddToCartAnimation(e.target);
        }
    });

    function addToCart(productId) {
        // Cart එකේ දැනටමත් මෙම product එක තිබේදැයි සෙවීම
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1; // තිබේ නම්, ප්‍රමාණය (quantity) 1ක් වැඩි කිරීම
        } else {
            // නැතිනම්, අලුත් item එකක් ලෙස ඇතුළත් කිරීම
            cart.push({
                id: productId,
                name: sampleProducts[productId].name,
                price: sampleProducts[productId].price,
                img: sampleProducts[productId].img,
                quantity: 1
            });
        }
        
        updateCart(); // Cart එක යාවත්කාලීන කිරීම
    }
    
    // "Add to cart" animation එක
    function showAddToCartAnimation(button) {
        button.innerHTML = '<i class="fas fa-check"></i> Added!';
        button.style.background = 'var(--accent-color)';
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-shopping-cart"></i> කරත්තයට එක් කරන්න';
            button.style.background = 'var(--secondary-color)';
        }, 1500); // තත්පර 1.5කට පසු නැවත යථා තත්ත්වයට පත් කිරීම
    }

    // --- 6. Cart එක යාවත්කාලීන කිරීම (Update) ---
    function updateCart() {
        // Cart Modal එකේ List එක පෙන්වීම
        renderCartItems();
        
        // මුළු මුදල ගණනය කිරීම
        calculateTotal();
        
        // Header එකේ ඇති Cart Icon එකේ ගණන (Count) යාවත්කාලීන කිරීම
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        
        // localStorage එකේ Cart එක Save කිරීම
        localStorage.setItem('ambawattaCart', JSON.stringify(cart));
    }
    
    // --- 7. Cart Modal එකේ Items පෙන්වීම ---
    function renderCartItems() {
        cartItemsList.innerHTML = ''; // Clear list
        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p class="cart-empty-msg">ඔබගේ කරත්තය හිස්ය.</p>';
            return;
        }

        cart.forEach(item => {
            const li = document.createElement('li');
            li.className = 'cart-item';
            li.innerHTML = `
                <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-price">LKR ${item.price.toFixed(2)}</T_LKR>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                    <button class="remove-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            cartItemsList.appendChild(li);
        });
    }
    
    // --- 8. Cart එකේ මුළු මුදල (Total) ගණනය කිරීම ---
    function calculateTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalElement.textContent = `LKR ${total.toFixed(2)}`;
    }

    // --- 9. Cart Modal එක පාලනය කිරීම (Open/Close) ---
    cartBtn.addEventListener('click', () => {
        cartModal.style.display = 'block'; // Modal එක පෙන්වීම
        updateCart(); // පෙන්වූ සැනින් Cart එක update කිරීම
    });

    closeModalBtn.addEventListener('click', () => {
        cartModal.style.display = 'none'; // Modal එක වැසීම
    });

    window.addEventListener('click', (e) => {
        if (e.target === cartModal) { // Modal එකෙන් පිටත click කළ විට
            cartModal.style.display = 'none';
        }
    });

    // --- 10. Cart Item එකක ප්‍රමාණය (Quantity) වෙනස් කිරීම / ඉවත් කිරීම ---
    cartItemsList.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        if (!id) return;

        if (e.target.classList.contains('increase-btn')) {
            const item = cart.find(i => i.id === id);
            item.quantity++;
        } 
        else if (e.target.classList.contains('decrease-btn')) {
            const item = cart.find(i => i.id === id);
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                // ප්‍රමාණය 1 නම්, decrease කළ විට ඉවත් කිරීම
                cart = cart.filter(i => i.id !== id);
            }
        }
        else if (e.target.classList.contains('remove-btn') || e.target.parentElement.classList.contains('remove-btn')) {
            cart = cart.filter(i => i.id !== id);
        }
        
        updateCart(); // යාවත්කාලීන කිරීම
    });

    // --- 11. පිටුව Load වන විටම Products සහ Cart එක පූරණය කිරීම ---
    loadProducts();
    updateCart();
    
    // --- 12. Checkout Button (Order Submit) ---
    // (මෙම කොටස ඊළඟ පියවරේදී සම්පූර්ණ කෙරේ)
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) {
            alert("කරුණාකර ඇණවුමක් කිරීමට භාණ්ඩයක් තෝරන්න.");
            return;
        }
        
        const instructions = specialInstructionsBox.value;
        console.log("Checkout processing...");
        console.log("Special Instructions:", instructions);
        
        // ඊළඟ පියවර: Checkout Form එක පෙන්වීම
        // (අපි මෙය ඊළඟට නිර්මාණය කරමු)
        
        cartModal.style.display = 'none'; // Cart modal එක වැසීම
        document.getElementById('checkout-form-modal').style.display = 'block'; // Checkout form එක පෙන්වීම
    });
});
