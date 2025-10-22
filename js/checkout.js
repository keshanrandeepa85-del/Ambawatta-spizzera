/* =========================================
   Ambawatta's Pizzeria - Checkout System
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Modal Elements ---
    const checkoutModal = document.getElementById('checkout-form-modal');
    const closeCheckoutBtn = document.getElementById('close-checkout-modal');
    const checkoutForm = document.getElementById('checkout-form');
    
    // --- 2. Payment Method Elements ---
    const paymentOptions = document.querySelectorAll('input[name="paymentMethod"]');
    const bankDetailsBox = document.getElementById('bank-details-info');
    const cardPaymentBox = document.getElementById('card-payment-info');
    
    // --- 3. Location Picker Elements ---
    const mapPickerElement = document.getElementById('map-picker');
    const locationErrorMsg = document.getElementById('location-error-msg');
    
    // --- 4. Close Modal ---
    closeCheckoutBtn.addEventListener('click', () => {
        checkoutModal.style.display = 'none';
    });

    // --- 5. Payment Method Logic ---
    paymentOptions.forEach(option => {
        option.addEventListener('change', () => {
            // Hide all boxes first
            bankDetailsBox.style.display = 'none';
            cardPaymentBox.style.display = 'none';

            // Show selected box
            if (option.value === 'bank' && option.checked) {
                bankDetailsBox.style.display = 'block';
            } else if (option.value === 'card' && option.checked) {
                cardPaymentBox.style.display = 'block';
            }
        });
    });

    // --- 6. Google Map Location Picker Logic ---
    // (මෙම කොටස ක්‍රියාත්මක වීමට Google Maps API Key එකක් අවශ්‍ය වේ)
    // (දැනට, අපි මූලික සිතියමක් පූරණය කරමු)
    
    // Imaduwa/Wanchawala ප්‍රදේශයේ ආසන්න මධ්‍ය ලක්ෂ්‍යයක් (Sample Coords)
    const deliveryZoneCenter = { lat: 6.095, lng: 80.345 }; 
    let map, marker;
    let selectedLocation = null;

    // Google Maps API එක Load වූ පසු මෙම function එක auto-run වේ
    // (අපි මෙය HTML එකට පසුව script tag එකකින් add කළ යුතුය)
    window.initMap = () => {
        map = new google.maps.Map(mapPickerElement, {
            center: deliveryZoneCenter,
            zoom: 13, // 13 zoom level = නගරයක් පෙන්වයි
        });

        // සිතියම මත Click කළ විට
        map.addListener('click', (event) => {
            selectedLocation = event.latLng; // Click කළ ස්ථානය ලබා ගැනීම
            
            // පරණ Marker එකක් ඇත්නම් ඉවත් කිරීම
            if (marker) {
                marker.setMap(null);
            }
            
            // අලුත් Marker එකක් පිහිටුවීම
            marker = new google.maps.Marker({
                position: selectedLocation,
                map: map,
                title: "ඔබගේ ස්ථානය",
                animation: google.maps.Animation.DROP
            });

            // --- 7. Delivery Zone Check ---
            // (මෙය සරල පරීක්ෂාවකි - සැබෑ පද්ධතියේදී Admin Panel එකෙන් ඇඳි Polygon එකක් පරීක්ෂා කළ යුතුය)
            // (දැනට, අපි මධ්‍ය ලක්ෂ්‍යයේ සිට සරල දුරක් (eg: 7km) පරීක්ෂා කරමු)
            
            const distance = google.maps.geometry.spherical.computeDistanceBetween(
                new google.maps.LatLng(deliveryZoneCenter.lat, deliveryZoneCenter.lng),
                selectedLocation
            );

            const deliveryRadius = 7000; // මීටර් 7000 (7km)

            if (distance > deliveryRadius) {
                // සීමාවෙන් පිටත
                locationErrorMsg.style.display = 'block';
                document.getElementById('submit-order-btn').disabled = true;
            } else {
                // සීමාව තුළ
                locationErrorMsg.style.display = 'none';
                document.getElementById('submit-order-btn').disabled = false;
            }
        });
    }

    // --- 8. Order Submission (Form Submit) ---
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Form එක submit වීම වැළැක්වීම

        // 1. Cart එකෙන් දත්ත ලබා ගැනීම (cart.js එකෙන්)
        const cart = JSON.parse(localStorage.getItem('ambawattaCart')) || [];
        if (cart.length === 0) {
            alert("ඔබගේ Cart එක හිස්ය!");
            return;
        }

        // 2. Form එකෙන් දත්ත ලබා ගැනීම
        const formData = new FormData(checkoutForm);
        const orderDetails = {
            customerName: formData.get('customerName'),
            customerPhone: formData.get('customerPhone'),
            customerEmail: formData.get('customerEmail'),
            customerAddress: formData.get('customerAddress'),
            paymentMethod: formData.get('paymentMethod'),
            // 3. Cart එකේ දත්ත එකතු කිරීම
            items: cart,
            totalAmount: document.getElementById('cart-total-price').textContent,
            specialInstructions: document.getElementById('special-instructions').value,
            // 4. Location දත්ත එකතු කිරීම
            location: selectedLocation ? { lat: selectedLocation.lat(), lng: selectedLocation.lng() } : "Not Selected",
            // 5. ගෙවීමේ තත්ත්වය
            paymentStatus: (formData.get('paymentMethod') === 'cod') ? "Pending" : "Awaiting Bank/Card"
        };
        
        // 6. Bank Receipt එක ඇත්නම් එකතු කිරීම
        const receiptFile = document.getElementById('receipt-upload').files[0];
        if (receiptFile) {
            orderDetails.receiptFile = receiptFile.name; 
            // (සැබෑ පද්ධතියේදී මෙම File එක Server එකට Upload කළ යුතුය)
        }

        // --- 9. Email එක සකස් කිරීම සහ යැවීම ---
        // (ඔබ ඉල්ලූ පරිදි, "Paper Rocket" button එක click කළ විට)
        
        console.log("Order Details to be sent:", orderDetails);

        // (මෙහිදී මෙම 'orderDetails' වස්තුව Backend එකකට (PHP/Node.js) යවා
        // එතැන් සිට keshanrandeepa85@gmail.com වෙත Email එකක් යැවිය යුතුය.)
        
        // (දැනට, අපි සාර්ථක පණිවිඩයක් පෙන්වමු)
        alert("ඔබගේ ඇණවුම සාර්ථකව ලැබුණි! (Order Received!)");
        
        // Cart එක හිස් කිරීම
        localStorage.removeItem('ambawattaCart');
        
        // Modals වැසීම සහ පිටුව Refresh කිරීම
        checkoutModal.style.display = 'none';
        window.location.reload(); 

    });
});
