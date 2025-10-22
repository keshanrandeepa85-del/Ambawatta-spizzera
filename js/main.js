/* =========================================
   Ambawatta's Pizzeria - Main JavaScript
   (Animations & Interactions)
   ========================================= */

// DOMContentLoaded: HTML එක සම්පූර්ණයෙන් load වූ පසු මෙම කේතය ක්‍රියාත්මක වේ
document.addEventListener('DOMContentLoaded', () => {

    /* ---------- 1. Hero Slider Animation ---------- */
    const slides = document.querySelectorAll('.hero-section .slide');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length; // 0, 1, 2, 0, 1...
        showSlide(currentSlide);
    }

    // Slider එක පෙන්වීම ආරම්භ කිරීම
    if (slides.length > 0) {
        showSlide(currentSlide);
        // තත්පර 5කට වරක් ස්වයංක්‍රීයව Slide එක මාරු කිරීම
        setInterval(nextSlide, 5000); 
    }

    /* ---------- 2. Scroll Animations (Fade-in Products) ---------- */
    // Product Cards සහ H2 වැනි අංග Scroll කිරීමේදී පෙන්වීමට
    
    // IntersectionObserver: මෙය කාර්යක්ෂම (efficient) ක්‍රමයකි
    const observerOptions = {
        root: null, // default: viewport
        threshold: 0.1 // 10%ක් පෙනුන විට trigger වේ
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // CSS එකේ ඇති .fadeInUp animation එක එක් කිරීම
                entry.target.style.animation = `fadeInUp 0.8s ease forwards`;
                observer.unobserve(entry.target); // එක වරක් පමණක් animate කරන්න
            }
        });
    }, observerOptions);

    // .product-card සහ .categories-section h2 වැනි අංග නිරීක්ෂණය (Observe) කිරීම
    const itemsToAnimate = document.querySelectorAll('.product-card, .categories-section h2, .product-list-section h2');
    itemsToAnimate.forEach(item => {
        observer.observe(item);
    });

    /* ---------- 3. Active Category Button ---------- */
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // පළමුව අනෙක් සියලුම buttons වලින් 'active' class එක ඉවත් කිරීම
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Click කළ button එකට 'active' class එක එක් කිරීම
            button.classList.add('active');
            
            // (පසුව මෙතනට අදාළ category එකේ products filter කිරීමේ JS කේතය එක් කළ යුතුය)
        });
    });

});
