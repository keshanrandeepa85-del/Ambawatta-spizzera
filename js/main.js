/* =========================================
   Ambawatta's Pizzeria - Main JavaScript
   (Animations & Interactions)
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- 1. Hero Slider Animation ---------- */
    // මෙම function එක settings.js මගින් call කරනු ලැබේ
    window.initializeHeroSlider = () => {
        const slides = document.querySelectorAll('.hero-section .slide');
        if (slides.length === 0) return;
        
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
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        // පවතින Interval එකක් ඇත්නම් clear කිරීම
        if (window.sliderInterval) {
            clearInterval(window.sliderInterval);
        }
        
        showSlide(currentSlide);
        window.sliderInterval = setInterval(nextSlide, 5000); 
    }

    /* ---------- 2. Scroll Animations (Fade-in Products) ---------- */
    // (මෙම කොටස වෙනසක් නැත)
    const observerOptions = { root: null, threshold: 0.1 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `fadeInUp 0.8s ease forwards`;
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // .product-card සඳහා මෙම observe කිරීම product-loader.js වෙත ගෙන ගොස් ඇත
    // නමුත් අනෙකුත් අංග සඳහා මෙහි තබමු
    const itemsToAnimate = document.querySelectorAll('.categories-section h2, .product-list-section h2, .gallery-section h2, .contact-section');
    itemsToAnimate.forEach(item => {
        observer.observe(item);
    });
    
    // product-loader.js මගින් product cards observe කිරීමට ඉඩ දීම
    window.observeElement = (element) => {
        observer.observe(element);
    };

});
