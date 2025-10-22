/* =========================================
   Ambawatta's Pizzeria - Account & User Dashboard System
   ========================================= */

// නියැදි User සහ Order දත්ත (සැබෑ පද්ධතියේදී Server එකෙන් පැමිණිය යුතුය)
let currentUser = null; // Login වූ User ගේ විස්තර ගබඩා කරයි
const sampleUsers = [
    { id: 1, name: "ප්‍රිය පාරිභෝගික", email: "user@test.com", password: "password", phone: "0771234567" }
];

// ඇණවුම් නියැදිය
const sampleOrders = [
    { 
        id: "A1001", 
        userId: 1, 
        date: "2025-09-15", 
        total: 5800, 
        items: [{name: "Chicken Tikka", qty: 1}, {name: "Garlic Bread", qty: 1}],
        status: "Delivered", // Delivered, Preparing, Out for Delivery
        trackingHistory: [
            { time: "10:30", status: "Order Placed" },
            { time: "10:45", status: "Accepted & Payment Confirmed" },
            { time: "11:30", status: "Preparing" },
            { time: "12:00", status: "Out for Delivery" },
            { time: "12:35", status: "Delivered" }
        ]
    },
    { 
        id: "A1002", 
        userId: 1, 
        date: "2025-10-22", 
        total: 7200, 
        items: [{name: "Family Feast", qty: 1}],
        status: "Preparing", // වත්මන් ඇණවුම
        trackingHistory: [
            { time: "11:00", status: "Order Placed" },
            { time: "11:15", status: "Accepted & Payment Confirmed" },
            { time: "11:45", status: "Preparing" }
        ]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Element Selection ---
    const accountBtn = document.querySelector('.user-actions .icon-btn:first-child');
    const accountModal = document.getElementById('account-modal');
    const dashboardModal = document.getElementById('user-dashboard-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    const showRegisterBtn = document.getElementById('show-register-btn');
    const showLoginBtn = document.getElementById('show-login-btn');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    
    const dashboardTabs = document.querySelectorAll('.dashboard-tabs .tab-btn');
    const dashboardContents = document.querySelectorAll('.tab-content');
    const pastOrdersList = document.getElementById('past-orders-list');
    const trackingTabContent = document.getElementById('tracking-tab-content');
    
    // --- 2. Modal Open/Close Logic ---
    accountBtn.addEventListener('click', () => {
        // User Login වී ඇත්දැයි පරීක්ෂා කිරීම
        if (currentUser) {
            openDashboard();
        } else {
            accountModal.style.display = 'block';
            showLoginView(); // මුලින්ම Login View එක පෙන්වීමට
        }
    });

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            accountModal.style.display = 'none';
            dashboardModal.style.display = 'none';
        });
    });

    // --- 3. Login/Register View Switching ---
    showRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterView();
    });

    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginView();
    });
    
    function showLoginView() {
        loginView.style.display = 'block';
        registerView.style.display = 'none';
    }
    
    function showRegisterView() {
        loginView.style.display = 'none';
        registerView.style.display = 'block';
    }

    // --- 4. Login Process (Sample) ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Sample Authentication
        const user = sampleUsers.find(u => u.email === email && u.password === password);

        if (user) {
            currentUser = user; // User Login කිරීම
            accountModal.style.display = 'none';
            openDashboard();
        } else {
            alert("අවලංගු Email හෝ මුරපදය. නැවත උත්සාහ කරන්න.");
        }
    });

    // --- 5. Logout Process ---
    logoutBtn.addEventListener('click', () => {
        currentUser = null; // User Logout කිරීම
        dashboardModal.style.display = 'none';
        alert("ඔබ සාර්ථකව පිට විය.");
        // Redirect to homepage or refresh
        window.location.reload(); 
    });

    // --- 6. Open Dashboard & Load Data ---
    function openDashboard() {
        if (!currentUser) return;
        
        document.getElementById('welcome-user-name').textContent = `ප්‍රිය ${currentUser.name} මහත්මයාණනි!`;
        dashboardModal.style.display = 'block';
        
        // මුලින්ම Orders tab එක activate කිරීම
        activateTab('orders'); 
        loadOrders();
        loadTrackingInfo();
    }
    
    // --- 7. Load Orders ---
    function loadOrders() {
        pastOrdersList.innerHTML = '';
        
        const userOrders = sampleOrders.filter(o => o.userId === currentUser.id);

        if (userOrders.length === 0) {
            pastOrdersList.innerHTML = '<li class="order-item"><p>ඔබ තවමත් කිසිදු ඇණවුමක් කර නොමැත.</p></li>';
            return;
        }

        userOrders.forEach(order => {
            const li = document.createElement('li');
            li.className = 'order-item';
            li.innerHTML = `
                <div>
                    <strong>ඇණවුම් අංකය:</strong> ${order.id}
                    <br>
                    <strong>දිනය:</strong> ${order.date}
                </div>
                <div>
                    <strong>මුළු මුදල:</strong> LKR ${order.total.toFixed(2)}
                </div>
                <div>
                    <strong>තත්ත්වය:</strong> <span style="color: ${order.status === 'Delivered' ? 'var(--accent-color)' : 'var(--primary-color)'}; font-weight: 700;">${order.status}</span>
                </div>
                <button class="btn-tracking" data-order-id="${order.id}">තත්ත්වය නිරීක්ෂණය</button>
            `;
            pastOrdersList.appendChild(li);
        });
        
        // Tracking button click event
        pastOrdersList.querySelectorAll('.btn-tracking').forEach(btn => {
            btn.addEventListener('click', (e) => {
                activateTab('tracking');
                showTrackingDetails(e.target.dataset.orderId);
            });
        });
    }

    // --- 8. Order Tracking Details (Main Logic) ---
    function loadTrackingInfo() {
        trackingTabContent.innerHTML = '<h3>වත්මන් ඇණවුම් තත්ත්වය</h3>';
        
        // Active orders සොයා ගැනීම (Delivered නොවන orders)
        const activeOrders = sampleOrders.filter(o => o.userId === currentUser.id && o.status !== 'Delivered');

        if (activeOrders.length === 0) {
            trackingTabContent.innerHTML += '<p style="padding: 2rem; text-align: center;">දැනට කිසිදු සක්‍රිය (Active) ඇණවුමක් නොමැත.</p>';
            return;
        }

        // වත්මන් ඇණවුම් පෙන්වීම
        activeOrders.forEach(order => {
             showTrackingDetails(order.id);
        });
    }
    
    function showTrackingDetails(orderId) {
        const order = sampleOrders.find(o => o.id === orderId);
        if (!order) return;
        
        // Tracking Steps HTML
        let stepsHTML = `<div class="tracking-container" data-order-id="${order.id}"><h4>ඇණවුම් අංකය: ${order.id}</h4><div class="tracking-steps">`;
        const steps = ["Order Placed", "Accepted & Payment Confirmed", "Preparing", "Out for Delivery", "Delivered"];
        
        steps.forEach(step => {
            const isCompleted = order.trackingHistory.some(h => h.status === step);
            const isActive = order.status === step;
            const timeEntry = order.trackingHistory.find(h => h.status === step);
            
            stepsHTML += `
                <div class="step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}">
                    <div class="icon"><i class="fas ${isCompleted ? 'fa-check' : 'fa-circle'}"></i></div>
                    <p class="step-name">${step}</p>
                    <p class="step-time">${timeEntry ? timeEntry.time : ''}</p>
                </div>
            `;
        });
        stepsHTML += '</div>'; // close tracking-steps
        
        // Live Location Tracking (ඔබ ඉල්ලූ පරිදි)
        if (order.status === 'Out for Delivery') {
            stepsHTML += `
                <div class="live-tracking-box">
                    <h5><i class="fas fa-motorcycle"></i> රියැදුරු සජීවීව නිරීක්ෂණය කරන්න</h5>
                    <div id="live-map-${order.id}" style="height: 200px; width: 100%; border-radius: 8px; background: #ddd; margin-top: 10px;">
                        <p style="text-align: center; line-height: 200px;">සජීවී සිතියම් සේවාව ක්‍රියාත්මකයි...</p>
                    </div>
                </div>
            `;
        }
        
        stepsHTML += '</div>'; // close tracking-container
        
        // HTML එකට ඇතුළත් කිරීම
        trackingTabContent.innerHTML = '<h3>වත්මන් ඇණවුම් තත්ත්වය</h3>' + stepsHTML;
        
        // Tracking tab එකට මාරු වීමට (if not already there)
        activateTab('tracking'); 
    }


    // --- 9. Dashboard Tab Switching ---
    dashboardTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            const tabName = e.currentTarget.dataset.tab;
            activateTab(tabName);
        });
    });

    function activateTab(tabName) {
        // Remove 'active' from all buttons and contents
        dashboardTabs.forEach(btn => btn.classList.remove('active'));
        dashboardContents.forEach(content => content.style.display = 'none');

        // Activate the selected tab
        const activeTabBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
        const activeContent = document.getElementById(`${tabName}-tab-content`);

        if (activeTabBtn) activeTabBtn.classList.add('active');
        if (activeContent) activeContent.style.display = 'block';
    }
    
    // Initial Load - If user is logged in (e.g., via session storage in real app)
    // දැනට අපි Login කර නැති බවට උපකල්පනය කරමු
    // if (localStorage.getItem('isLoggedIn')) { openDashboard(); }

});
