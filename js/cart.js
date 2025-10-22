/* =========================================================
   Ambawatta's Pizzeria - Cart System (Database-less / Formspree Integration)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // PIZZA_PRODUCTS සහ CONFIG object එක products.js වෙතින් ලබා ගනී
    if (typeof PIZZA_PRODUCTS === 'undefined' || typeof CONFIG === 'undefined') {
        console.error("products.js ගොනුව load වී නොමැත. කරුණාකර එය index.html හි නිවැරදිව ඇතුළත් කරන්න.");
        return;
    }
    
    // products.js හි ඇති Product Array එක Object එකක් බවට පත් කිරීම (වඩාත් පහසුවෙන් ප්‍රවේශ වීමට)
    const productMap = PIZZA_PRODUCTS.reduce((map, product) => {
        map[product.id] = product;
        return map;
    }, {});

    // --- 1. HTML Elements තෝරා ගැනීම ---
    const productGrid = document.getElementById('products-grid');
    const cartBtn = document.querySelector('.cart-btn');
    const cartCountElement = document.querySelector('.cart-count');
    const cartModal = document.getElementById('cart-modal');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalElement = document.getElementById('cart-total-price');
    const specialInstructionsBox = document.getElementById('special-instructions');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    const checkoutModal = document.getElementById('checkout-form-modal');
    const checkoutForm = document.getElementById('checkout-form');
    const closeCheckoutBtn = document.getElementById('close-checkout-modal');
    const closeCartModalBtn = cartModal.querySelector('.close-modal');

    // Suggestion Modal Elements
    const suggestionModal = document.getElementById('suggestion-modal');
    const showSuggestionModalBtn = document.getElementById('show-suggestion-modal-btn');
    const closeSuggestionModalBtn = document.getElementById('close-suggestion-modal');
    
    // --- 2. Cart දත්ත ගබඩා කිරීම (localStorage) ---
    let cart = JSON.parse(localStorage.getItem('ambawattaCart')) || [];

    // --- 3. Cart එකට Product එකතු කිරීම ---
    if (productGrid) {
        productGrid.addEventListener('click', (e) => {
            const targetButton = e.target.closest('.add-to-cart-btn');
            if (targetButton) {
                const productId = parseInt(targetButton.dataset.id);
                addToCart(productId);
                showAddToCartAnimation(targetButton);
            }
        });
    }

    function addToCart(productId) {
        const product = productMap[productId];
        if (!product) return;

        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1; 
        } else {
            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                img: product.img,
                quantity: 1
            });
        }
        
        updateCart(); 
    }
    
    // "Add to cart" animation එක
    function showAddToCartAnimation(button) {
        button.innerHTML = '<i class="fas fa-check"></i> එකතු කළා!';
        button.style.background = 'var(--accent-color)';
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-shopping-cart"></i> කරත්තයට එක් කරන්න';
            button.style.background = 'var(--secondary-color)';
        }, 1500); 
    }

    // --- 4. Cart එක යාවත්කාලීන කිරීම (Update) ---
    function updateCart() {
        renderCartItems();
        calculateTotal();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        localStorage.setItem('ambawattaCart', JSON.stringify(cart));
        
        checkoutBtn.disabled = cart.length === 0;
        checkoutBtn.textContent = cart.length === 0 ? "කරත්තය හිස්ය" : "ඇණවුම් විස්තර ඇතුළු කරන්න (Checkout)";
    }
    
    // --- 5. Cart Modal එකේ Items පෙන්වීම ---
    function renderCartItems() {
        cartItemsList.innerHTML = '';
        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p class="cart-empty-msg">ඔබගේ කරත්තය හිස්ය.</p>';
            return;
        }

        cart.forEach(item => {
            const imagePath = `images/${productMap[item.id].img}`;
            const li = document.createElement('li');
            li.className = 'cart-item';
            li.innerHTML = `
                <img src="${imagePath}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-price">LKR ${(item.price * item.quantity).toFixed(2)} (${item.price.toFixed(2)} x ${item.quantity})</p>
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
    
    // --- 6. Cart එකේ මුළු මුදල (Total) ගණනය කිරීම ---
    function calculateTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalElement.textContent = `LKR ${total.toFixed(2)}`;
        return total.toFixed(2);
    }

    // --- 7. Cart Item එකක ප්‍රමාණය වෙනස් කිරීම / ඉවත් කිරීම ---
    cartItemsList.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
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
                cart = cart.filter(i => i.id !== id);
            }
        }
        else if (e.target.classList.contains('remove-btn') || e.target.parentElement.classList.contains('remove-btn')) {
            cart = cart.filter(i => i.id !== id);
        }
        
        updateCart();
    });

    // --- 8. Modals පාලනය කිරීම ---
    cartBtn.addEventListener('click', () => {
        cartModal.style.display = 'block';
        updateCart(); 
    });
    closeCartModalBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
    closeCheckoutBtn.addEventListener('click', () => {
        checkoutModal.style.display = 'none';
    });

    // --- 9. Checkout Process (Cart -> Form) ---
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert("කරුණාකර ඇණවුමක් කිරීමට භාණ්ඩයක් තෝරන්න.");
            return;
        }
        
        // 1. Cart Modal එක වසා Checkout Form එක පෙන්වීම
        cartModal.style.display = 'none'; 
        checkoutModal.style.display = 'block';
        
        // 2. විශේෂ උපදෙස් (Special Instructions) Checkout Form එකේ Hidden Field එකට ලබා දීම
        document.getElementById('hidden-special-instructions').value = specialInstructionsBox.value || "කිසිදු විශේෂ උපදෙසක් නොමැත.";

        // 3. මුළු මුදල (Total Amount) Checkout Form එකේ Hidden Field එකට ලබා දීම
        document.getElementById('hidden-total-amount').value = cartTotalElement.textContent;

        // 4. ඇණවුම් විස්තර (Order Items) HTML Format එකට සකස් කර Hidden Field එකට ලබා දීම
        //    (මෙමගින් Email එක කියවීමට පහසු වේ)
        let itemsHTML = cart.map(item => 
            `<li>${item.quantity} x ${item.name} (LKR ${item.price.toFixed(2)} each) - Sub Total: LKR ${(item.price * item.quantity).toFixed(2)}</li>`
        ).join('');
        
        const finalOrderHTML = `
            <h3>ඇණවුමේ අයිතම (Order Items)</h3>
            <ul style="list-style: none; padding-left: 0;">
                ${itemsHTML}
            </ul>
            <p><strong>මුළු මුදල (Total): ${cartTotalElement.textContent}</strong></p>
        `;
        document.getElementById('order-items-html').value = finalOrderHTML; // Formspree Email වෙත යැවීමට
    });
    
    // --- 10. Order Form Submission (Formspree Redirect) ---
    // (index.html හි Formspree action සහ success redirect හරහා මෙය පාලනය වේ)
    checkoutForm.addEventListener('submit', (e) => {
        // Formspree වෙත යැවීමට පෙර Cart එක හිස් කිරීම
        localStorage.removeItem('ambawattaCart');
        // updateCart(); // UI update කිරීමට අවශ්‍ය නැත, redirect වන නිසා
        
        // Formspree මගින් සාර්ථකව යැවූ පසු index.html?success=true වෙත redirect වේ
    });
    
    // --- 11. Suggestion Modal Logic ---
    showSuggestionModalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        suggestionModal.style.display = 'block';
    });

    closeSuggestionModalBtn.addEventListener('click', () => {
        suggestionModal.style.display = 'none';
    });

    // Initial Load
    updateCart();
});
