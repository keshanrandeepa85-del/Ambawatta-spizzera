/* =========================================
   Ambawatta's Pizzeria - Admin Dashboard System
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Element Selection & Initial Setup ---
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Sample Data (සැබෑ පද්ධතියේදී Database එකෙන් පැමිණිය යුතුය)
    let adminProducts = [
        { id: 1, name: "Signature Chicken Tikka", category: "Pizza", price: 2500, img: "chickentikka.jpg" },
        { id: 2, name: "Family Feast Package", category: "Package", price: 6500, img: "family.jpg" },
        { id: 3, name: "Cheesy Garlic Bread", category: "Sides", price: 850, img: "garlicbread.jpg" },
    ];
    let adminOrders = [
        { id: "A1005", customer: "කේෂාන්", phone: "0771234567", items: "1 Chicken Tikka, 1 Fries", total: 3200, status: "Pending", payment: "COD" },
        { id: "A1004", customer: "රන්දීප", phone: "0719876543", items: "1 Seafood Delight", total: 2800, status: "Preparing", payment: "Card" },
        { id: "A1003", customer: "නිලූකා", phone: "0771122334", items: "2 Margherita", total: 3600, status: "Out for Delivery", payment: "Bank" },
        { id: "A1002", customer: "දිනුක", phone: "0774455667", items: "1 Family Feast", total: 6500, status: "Delivered", payment: "COD" },
    ];
    
    // --- 2. Sidebar Navigation Switching ---
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

            // Load specific data when tabs are clicked
            if (targetTab === 'orders') {
                loadOrdersAdmin('Pending'); // Load Pending orders by default
            } else if (targetTab === 'products') {
                loadProductsAdmin();
            } else if (targetTab === 'settings') {
                initAdminMap(); // Delivery Zone Map
            }
        });
    });

    // --- 3. Orders Management Logic ---
    const filterBtns = document.querySelectorAll('.order-filter-bar .filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            loadOrdersAdmin(e.target.dataset.status);
        });
    });

    function loadOrdersAdmin(status) {
        const ordersListElement = document.getElementById('orders-list-admin');
        ordersListElement.innerHTML = '';
        
        const filteredOrders = adminOrders.filter(order => order.status === status);

        if (filteredOrders.length === 0) {
            ordersListElement.innerHTML = '<div class="no-data-msg" style="text-align: center; padding: 50px;">මෙම තත්ත්වයේ ඇණවුම් නොමැත.</div>';
            return;
        }

        filteredOrders.forEach(order => {
            const div = document.createElement('div');
            div.className = `order-item-admin ${order.status.toLowerCase().replace(/\s/g, '-')}`;
            div.innerHTML = `
                <div class="order-details-admin">
                    <p><strong>ID: ${order.id}</strong> | Total: LKR ${order.total.toFixed(2)}</p>
                    <p>Customer: ${order.customer} (${order.phone})</p>
                    <p>Items: ${order.items}</p>
                </div>
                <div class="order-actions-admin">
                    <select class="status-selector" data-order-id="${order.id}">
                        <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending (නව)</option>
                        <option value="Preparing" ${order.status === 'Preparing' ? 'selected' : ''}>Preparing (සකස් කරන)</option>
                        <option value="Out for Delivery" ${order.status === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
                        <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered (අවසන්)</option>
                    </select>
                    <button class="btn-action view-order-btn" data-order-id="${order.id}"><i class="fas fa-eye"></i> View</button>
                </div>
            `;
            ordersListElement.appendChild(div);
        });
        
        // Status Change Event Listener
        ordersListElement.querySelectorAll('.status-selector').forEach(selector => {
            selector.addEventListener('change', (e) => {
                const orderId = e.target.dataset.orderId;
                const newStatus = e.target.value;
                updateOrderStatus(orderId, newStatus);
            });
        });
    }
    
    function updateOrderStatus(orderId, newStatus) {
        const orderIndex = adminOrders.findIndex(o => o.id === orderId);
        if (orderIndex > -1) {
            adminOrders[orderIndex].status = newStatus;
            alert(`Order ${orderId} තත්ත්වය '${newStatus}' ලෙස වෙනස් විය.`);
            // Reload the current view to show the change
            const activeStatus = document.querySelector('.filter-btn.active').dataset.status;
            loadOrdersAdmin(activeStatus); 
            // *සැබෑ පද්ධතියේදී මෙහිදී Customer ට Email/SMS එකක් යැවිය යුතුය*
        }
    }


    // --- 4. Products Management Logic ---
    function loadProductsAdmin() {
        const tableBody = document.querySelector('#product-table tbody');
        tableBody.innerHTML = '';

        adminProducts.forEach(product => {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>LKR ${product.price.toFixed(2)}</td>
                <td>
                    <button class="btn-action edit-product-btn" data-id="${product.id}"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn-action delete-product-btn" data-id="${product.id}"><i class="fas fa-trash"></i> Delete</button>
                </td>
            `;
        });
    }
    
    // --- 5. Content Management (සියලු වචන වෙනස් කිරීමේ හැකියාව) ---
    document.querySelector('.update-content-btn').addEventListener('click', () => {
        const homepageTitle = document.getElementById('text-homepage-title').value;
        const cartBtnText = document.getElementById('text-cart-btn').value;
        const deliveryZoneText = document.getElementById('text-delivery-zone').value;
        const siteTitle = document.getElementById('text-site-title').value;
        
        // *සැබෑ පද්ධතියේදී මෙම සියලු data Server එකට යවා Database එකේ Save කළ යුතුය*
        
        alert(`වෙබ් අඩවියේ වචන සුරැකිණි!\nනව මාතෘකාව: ${homepageTitle}`);
        console.log("New Content Saved:", {homepageTitle, cartBtnText, deliveryZoneText, siteTitle});
    });


    // --- 6. Delivery Zone Management (Google Maps Admin) ---
    // *Google Maps API Key එකක් නැවත අවශ්‍ය වේ*
    let adminMap, deliveryCircle;
    const defaultCenter = { lat: 6.095, lng: 80.345 };
    let currentRadius = 7000; // 7km

    window.initAdminMap = () => {
        const mapElement = document.getElementById('admin-map-zone');
        if (!mapElement || !window.google) return; // Google API එක load වී නොමැති නම් නවතින්න

        adminMap = new google.maps.Map(mapElement, {
            center: defaultCenter,
            zoom: 13,
        });
        
        // Delivery Circle එක නිර්මාණය කිරීම
        deliveryCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: adminMap,
            center: defaultCenter,
            radius: currentRadius, // මීටර වලින්
            editable: true, // පරිපාලකයාට ඇදීම සඳහා
            draggable: true
        });

        // Circle එකේ විස්තර වෙනස් වූ විට Update කිරීම
        deliveryCircle.addListener('center_changed', updateZoneInfo);
        deliveryCircle.addListener('radius_changed', updateZoneInfo);
    }
    
    function updateZoneInfo() {
        const center = deliveryCircle.getCenter();
        const radius = deliveryCircle.getRadius();
        
        document.getElementById('current-center').textContent = `${center.lat().toFixed(3)}, ${center.lng().toFixed(3)}`;
        document.getElementById('current-radius').textContent = `${(radius / 1000).toFixed(1)} km`;
        
        currentRadius = radius;
        // *මෙම නව Center සහ Radius දත්ත Database එකට Save කළ යුතුය*
    }

    // Zone Save Button
    document.querySelector('.update-settings-btn').addEventListener('click', () => {
        // සැබෑ පද්ධතියේදී, මෙහිදී නව Center/Radius දත්ත Server එකට යවනු ලැබේ
        alert(`නව Delivery Zone සීමාව: ${(currentRadius / 1000).toFixed(1)} km ලෙස සුරැකිණි.`);
    });
    
    // --- Initial Dashboard Load ---
    document.getElementById('new-orders-count').textContent = adminOrders.filter(o => o.status === 'Pending').length;
    
    // Dashboad Overview තොරතුරු Load කිරීම (Sample)
    // (මෙම කොටස මුලින්ම පෙනෙන පරිදි active class එක යොදා ඇත)

});

// =========================================================
// 1. DOM Elements සහ Modal Variables නිර්වචනය කිරීම
// =========================================================

const editModal = document.getElementById('edit-product-modal');
const editForm = document.getElementById('edit-product-form');
const closeEditModalBtn = document.getElementById('close-edit-modal');

// Modal එක වසන්න
if (closeEditModalBtn) {
    closeEditModalBtn.onclick = function() {
        editModal.style.display = 'none';
    };
}


// =========================================================
// 2. PRODUCT DELETE FUNCTION
// =========================================================

function deleteProduct(id) {
    if (confirm(`ඔබට ID ${id} සහිත මෙම නිෂ්පාදනය ස්ථිරවම මකා දැමීමට අවශ්‍යද?`)) {
        // Local Storage එකෙන් සියලු products ලබා ගන්න (නැතිනම් Sample Data)
        let products = JSON.parse(localStorage.getItem('adminProducts')) || adminProducts;
        
        // Delete කිරීමට අවශ්‍ය product එක හැර අනෙකුත් products තෝරා ගන්න
        let updatedProducts = products.filter(p => p.id !== id);
        
        // යාවත්කාලීන කළ ලැයිස්තුව Local Storage එකේ Save කරන්න
        localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
        
        alert(`නිෂ්පාදනය ID ${id} සාර්ථකව මකා දැමිණි.`);
        
        // Product List එක නැවත පූරණය කරන්න
        loadAdminProducts(); 
    }
}


// =========================================================
// 3. PRODUCT EDIT FUNCTION
// =========================================================

function editProduct(id) {
    let products = JSON.parse(localStorage.getItem('adminProducts')) || adminProducts;
    let productToEdit = products.find(p => p.id === id);

    if (productToEdit) {
        // 1. Modal එකේ ක්ෂේත්‍ර වලට දැනට පවතින දත්ත පූරණය කිරීම (Populate Form)
        document.getElementById('edit-product-id').value = productToEdit.id;
        document.getElementById('edit-product-name').value = productToEdit.name;
        document.getElementById('edit-product-category').value = productToEdit.category;
        document.getElementById('edit-product-price').value = productToEdit.price;
        document.getElementById('edit-product-img').value = productToEdit.img;
        
        // 2. Modal එක දර්ශනය කිරීම
        editModal.style.display = 'block';
    }
}


// =========================================================
// 4. Edit Form එක Submit කළ විට දත්ත Save කිරීම
// =========================================================

if (editForm) {
    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 1. යාවත්කාලීන කළ දත්ත ලබා ගැනීම
        const id = parseInt(document.getElementById('edit-product-id').value);
        const newName = document.getElementById('edit-product-name').value;
        const newCategory = document.getElementById('edit-product-category').value;
        const newPrice = parseFloat(document.getElementById('edit-product-price').value);
        const newImg = document.getElementById('edit-product-img').value;

        let products = JSON.parse(localStorage.getItem('adminProducts')) || adminProducts;
        
        // 2. ලැයිස්තුවේ ඇති product එක සොයාගෙන යාවත්කාලීන කිරීම
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index].name = newName;
            products[index].category = newCategory;
            products[index].price = newPrice;
            products[index].img = newImg;
        }

        // 3. යාවත්කාලීන කළ ලැයිස්තුව Local Storage එකේ Save කිරීම
        localStorage.setItem('adminProducts', JSON.stringify(products));
        
        alert(`නිෂ්පාදනය ID ${id} සාර්ථකව යාවත්කාලීන කරන ලදි.`);

        // 4. Modal එක වසා, ලැයිස්තුව නැවත පූරණය කිරීම
        editModal.style.display = 'none';
        loadAdminProducts(); // Product list එක යාවත්කාලීන කරන්න
        
    });
}


