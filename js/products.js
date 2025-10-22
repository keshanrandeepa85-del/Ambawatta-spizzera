/* =========================================================
   Ambawatta's Pizzeria - Products & Global Config Data 
   (Database-less - සියලුම දත්ත මෙහි වෙනස් කළ හැක)
   ========================================================= */

// සිංහල විස්තරය: වෙබ් අඩවියේ ප්‍රධාන මාතෘකා සහ සම්බන්ධතා විස්තර මෙහි වෙනස් කරන්න.
const CONFIG = {
    // 1. ඇණවුම් පිටුවේ ප්‍රධාන මාතෘකාව
    PRODUCT_LIST_TITLE: "අපගේ රසවත්ම නිර්මාණ සහ වට්ටම් පැකේජ", 
    
    // 2. ඇණවුම් හා සම්බන්ධතා විස්තර (Order Email: keshanrandeepa85@gmail.com)
    ORDER_EMAIL_FORM_ID: "https://formspree.io/f/mldpyjzd", 
    CONTACT_PHONE: "077 945 9609", 
    
    // 3. යෝජනා/පැමිණිලි විස්තර (Suggestion Email: paveeshathenuwanmoon@gmail.com)
    SUGGESTION_EMAIL_FORM_ID: "https://formspree.io/f/xgvnjaqz", 
    
    // 4. බෙදාහැරීමේ විස්තරය (Delivery Zone Message)
    DELIVERY_MESSAGE: "අපි Imaduwa සහ Wanchawala අවට ප්‍රදේශවලට බෙදාහැරීම් සිදු කරන්නෙමු.", 
    
    // 5. සමාජ මාධ්‍ය සබැඳි (Social Media Links)
    SOCIAL_LINKS: {
        facebook: "https://www.facebook.com/yourpage", // ඔබේ Facebook Page Link එක
        whatsapp_channel: "https://whatsapp.com/channel/yourchannel", // ඔබේ WhatsApp Channel Link එක
        tiktok: "https://www.tiktok.com/@youraccount", // ඔබේ TikTok Link එක
        // whatsapp_business: "https://wa.me/94779459609" // WhatsApp Business Chat Link එක
    }
};

// සිංහල විස්තරය: වෙබ් අඩවියේ සියලුම නිෂ්පාදන දත්ත මෙහි වෙනස් කරන්න. 
// (ID එක අනුක්‍රමිකව වෙනස් කරන්න. img එකේ ගොනු නම (e.g., cheesymushroom.jpg) යොදන්න)
const PIZZA_PRODUCTS = [
    { 
        id: 1, 
        name: "Signature Chicken Tikka Pizza", 
        category: "Pizza", 
        price: 2500, 
        img: "pizzas/chickentikka.jpg",
        description: "සුවිශේෂී Chicken Tikka රසය. මධ්‍යස්ථ සැරයි."
    },
    { 
        id: 2, 
        name: "Spicy Seafood Delight", 
        category: "Pizza", 
        price: 2800, 
        img: "pizzas/seafood.jpg",
        description: "පොකිරිස්සන්, දැල්ලන් සහ මාළු මස් වලින් සමන්විතයි."
    },
    { 
        id: 3, 
        name: "Classic Margherita (Veg)", 
        category: "Pizza", 
        price: 1800, 
        img: "pizzas/margherita.jpg",
        description: "පිරිසිදු චීස් සහ තක්කාලි රසය."
    },
    { 
        id: 4, 
        name: "Family Feast Package", 
        category: "Package", 
        price: 6500, 
        img: "packages/family.jpg",
        description: "Large Pizza 2ක් සහ Side Item 2ක්. (විශේෂ වට්ටම)"
    },
    { 
        id: 5, 
        name: "Weekend Offer - Large Pizza 2", 
        category: "Package", 
        price: 4999, 
        img: "packages/offer3.jpg",
        description: "ඕනෑම Large Pizza දෙකක් එකට."
    },
    { 
        id: 6, 
        name: "Cheesy Garlic Bread", 
        category: "Sides", 
        price: 850, 
        img: "sides/garlicbread.jpg",
        description: "අමතර ආහාරයක්."
    },
    { 
        id: 7, 
        name: "Chicken & Mushroom Pizza", 
        category: "Pizza", 
        price: 2350, 
        img: "pizzas/chickenmushroom.jpg",
        description: "කුකුළු මස් සහ බිම්මල් එකතුව."
    }
];

// Product Loading Logic - වෙනස් කිරීමට අවශ්‍ය නැත
document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.querySelector('.products-grid'); 
    const categoryList = document.getElementById('category-list');
    const deliveryInfo = document.querySelector('.delivery-info p');
    const phoneLink = document.querySelector('.contact-number-link');
    const mainPhoneBtn = document.querySelector('.user-actions .contact-btn');
    const productListTitle = document.getElementById('product-list-title');

    // 1. Config යාවත්කාලීන කිරීම
    if (deliveryInfo) deliveryInfo.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${CONFIG.DELIVERY_MESSAGE}`;
    if (phoneLink) phoneLink.textContent = CONFIG.CONTACT_PHONE;
    if (phoneLink) phoneLink.href = `tel:${CONFIG.CONTACT_PHONE.replace(/\s/g, '')}`;
    if (mainPhoneBtn) mainPhoneBtn.href = `tel:${CONFIG.CONTACT_PHONE.replace(/\s/g, '')}`;
    if (productListTitle) productListTitle.textContent = CONFIG.PRODUCT_LIST_TITLE;
    
    // 2. Social Media Links යාවත්කාලීන කිරීම
    document.querySelector('.social-icon.facebook-icon').href = CONFIG.SOCIAL_LINKS.facebook;
    document.querySelector('.social-icon.whatsapp-icon').href = CONFIG.SOCIAL_LINKS.whatsapp_channel;
    document.querySelector('.social-icon.tiktok-icon').href = CONFIG.SOCIAL_LINKS.tiktok;
    
    // 3. Category Buttons ජනනය කිරීම
    const categories = [...new Set(PIZZA_PRODUCTS.map(p => p.category))];
    categoryList.innerHTML = '';
    
    // All Products button
    const allBtn = document.createElement('button');
    allBtn.className = 'category-btn active';
    allBtn.dataset.category = 'all';
    allBtn.innerHTML = `<i class="fas fa-list-ul"></i> සියලුම වර්ග`;
    categoryList.appendChild(allBtn);

    categories.forEach(cat => {
        const icon = cat === 'Pizza' ? 'fa-pizza-slice' : cat === 'Package' ? 'fa-box-open' : 'fa-utensils';
        const button = document.createElement('button');
        button.className = 'category-btn';
        button.dataset.category = cat;
        button.innerHTML = `<i class="fas ${icon}"></i> ${cat}`;
        categoryList.appendChild(button);
    });

    // 4. Products UI වෙත Load කිරීම
    window.loadProductsToUI = (products) => {
        productContainer.innerHTML = '';
        if (products.length === 0) {
            document.getElementById('no-products-message').style.display = 'block';
            return;
        }

        document.getElementById('no-products-message').style.display = 'none';

        products.forEach(product => {
            // පින්තූරයේ නිවැරදි ලිපිනය (images/ folder එක උපකල්පනය කර ඇත)
            const imagePath = `images/${product.img}`; 
            
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${imagePath}" alt="${product.name}" class="product-img">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-category">${product.category}</p>
                    <p class="product-description">${product.description}</p>
                    <p class="product-price">LKR ${product.price.toFixed(2)}</p>
                    <button class="btn-primary add-to-cart-btn" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> කරත්තයට එක් කරන්න
                    </button>
                </div>
            `;
            productContainer.appendChild(productCard);
            
            // Animation සඳහා (main.js හි ඇති observer)
            if (window.observer) {
                 window.observer.observe(productCard);
             }
        });
        
        // Cart Logic සඳහා event listeners (cart.js වෙත යොමු කෙරේ)
    };
    
    // 5. Initial Load
    window.loadProductsToUI(PIZZA_PRODUCTS);
    
    // 6. Filtering Logic
    categoryList.addEventListener('click', (e) => {
        if (e.target.classList.contains('category-btn')) {
            const selectedCategory = e.target.dataset.category;
            
            // Active class වෙනස් කිරීම (main.js හිද ඇත, නමුත් මෙහිදී filter කිරීමටද අවශ්‍ය වේ)
            categoryList.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            let filteredProducts = PIZZA_PRODUCTS;
            if (selectedCategory !== 'all') {
                filteredProducts = PIZZA_PRODUCTS.filter(p => p.category === selectedCategory);
            }
            window.loadProductsToUI(filteredProducts);
        }
    });
    
    // 7. Search Logic
    document.getElementById('product-search').addEventListener('keyup', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const searchResults = PIZZA_PRODUCTS.filter(p => 
            p.name.toLowerCase().includes(searchTerm) || 
            p.description.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm)
        );
        window.loadProductsToUI(searchResults);
    });
});
