/* =========================================
   Ambawatta's Pizzeria - Cart System
   (Updated to work with product-loader.js)
   ========================================= */

// DOM Elements
const cartModal = document.getElementById('cart-modal');
const cartCountDisplay = document.querySelector('.cart-count');
const cartItemsList = document.getElementById('cart-items-list');
const cartTotalPriceDisplay = document.getElementById('cart-total-price');

// Global Cart Variable (loads from localStorage)
let cart = JSON.parse(localStorage.getItem('pizzaCart')) || [];

// 1. Cart දත්ත LocalStorage හි යාවත්කාලීන කිරීම
function updateCart() {
    localStorage.setItem('pizzaCart', JSON.stringify(cart));
    renderCartItems();
    calculateTotal();
}

// 2. Cart Items HTML වලට Render කිරීම
function renderCartItems() {
    cartItemsList.innerHTML = ''; 
    const checkoutBtn = document.getElementById('checkout-btn');

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p class="cart-empty-msg">ඔබගේ කරත්තය හිස්ය.</p>';
        if (checkoutBtn) checkoutBtn.disabled = true;
        cartCountDisplay.textContent = 0;
        return;
    }
    
    if (checkoutBtn) checkoutBtn.disabled = false;
    cartCountDisplay.textContent = cart.length;

    cart.forEach(item => {
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="item-details">
                <span class="item-name">${item.name}</span>
                <span class="item-price">LKR ${item.price.toFixed(2)}</span>
            </div>
            <div class="item-quantity-controls">
                <button class="qty-btn decrease-qty" data-id="${item.id}">-</button>
                <span class="item-qty">${item.quantity}</span>
                <button class="qty-btn increase-qty" data-id="${item.id}">+</button>
                <button class="remove-item-btn" data-id="${item.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
            <div class="item-subtotal">LKR ${(item.price * item.quantity).toFixed(2)}</div>
        `;
        cartItemsList.appendChild(li);
    });
    
    // Quantity and Remove Event Listeners
    attachCartControlListeners();
}

// 3. Cart එකේ මුළු මුදල ගණනය කිරීම
function calculateTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalPriceDisplay.textContent = `LKR ${total.toFixed(2)}`;
}

// 4. Cart එකේ ඇති භාණ්ඩවල ප්‍රමාණය වෙනස් කිරීම සහ ඉවත් කිරීම
function attachCartControlListeners() {
    document.querySelectorAll('.increase-qty').forEach(btn => {
        btn.onclick = (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            const item = cart.find(i => i.id === id);
            if (item) {
                item.quantity += 1;
                updateCart();
            }
        };
    });

    document.querySelectorAll('.decrease-qty').forEach(btn => {
        btn.onclick = (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            const item = cart.find(i => i.id === id);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                updateCart();
            } else if (item && item.quantity === 1) {
                // Quantity 1 නම්, එය ඉවත් කරන්න
                removeItem(id);
            }
        };
    });

    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.onclick = (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            removeItem(id);
        };
    });
}

// Remove Item Helper
function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// 5. Product Cards වල "Add to Cart" බොත්තම් සඳහා Event Listeners (product-loader.js මගින් call වේ)

/**
 * product-loader.js මගින් ග්‍රිඩ් එකට භාණ්ඩ Load කිරීමෙන් පසු,
 * අලුතින් සාදන ලද "Add to Cart" බොත්තම් සඳහා Listener එක් කරයි.
 */
window.attachCartListeners = function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
        // එකම listener එක දෙපාරක් add වීම වැළැක්වීමට
        if (button.dataset.listenerAttached) return; 

        button.addEventListener('click', (e) => {
            if (e.currentTarget.disabled) return; // Store Closed නම් ක්‍රියාත්මක නොවීම

            const productId = parseInt(e.currentTarget.dataset.id);
            // allProducts යනු product-loader.js හි ගෝලීය විචල්‍යයයි
            if (typeof allProducts !== 'undefined') {
                const product = allProducts.find(p => p.id === productId); 
                
                if (product) {
                    addToCart(product);
                    showAddToCartAnimation(e.currentTarget);
                }
            } else {
                 console.error("Error: allProducts is not defined. Check product-loader.js loading.");
            }
        });
        button.dataset.listenerAttached = 'true';
    });
}

function addToCart(product) {
    // Cart එකේ දැනටමත් මෙම product එක තිබේදැයි සෙවීම
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1; 
    } else {
        // product-loader.js එකෙන් සම්පූර්ණ product object එකම ලබා ගනී
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            // image path එක නිවැරදිව ලබා ගැනීමට 'images/' සමඟ එක් කරයි
            img: `images/${product.img}`, 
            quantity: 1
        });
    }
    
    updateCart(); // Cart එක යාවත්කාලීන කිරීම
}
    
// 6. "Add to cart" animation එක
function showAddToCartAnimation(button) {
    // Store closed නම් animation එක පෙන්වන්නේ නැත
    if (button.disabled) return; 
    
    const originalText = button.innerHTML;
    const originalBackground = button.style.background;
    
    button.innerHTML = '<i class="fas fa-check"></i> එකතු කරන ලදි!';
    button.style.background = 'var(--accent-color)';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = originalBackground;
    }, 1500);
}

// 7. Cart Modal Controls
const closeCartModal = document.querySelector('#cart-modal .close-modal');

if (closeCartModal) {
    closeCartModal.onclick = () => cartModal.style.display = 'none';
}

const cartBtn = document.querySelector('.cart-btn');
if (cartBtn) {
    cartBtn.onclick = () => {
        cartModal.style.display = 'block';
    };
}

window.onclick = (event) => {
    if (event.target == cartModal) {
        cartModal.style.display = 'none';
    }
}

// 8. Checkout Button
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert("කරුණාකර ඇණවුමක් කිරීමට භාණ්ඩයක් තෝරන්න.");
        return;
    }
    
    cartModal.style.display = 'none'; 
    document.getElementById('checkout-form-modal').style.display = 'block';
});


// 9. පිටුව Load වන විට Cart එක යාවත්කාලීන කිරීම
updateCart();
