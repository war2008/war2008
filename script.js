/* ---------- DOM ELEMENTS ---------- */
document.addEventListener('DOMContentLoaded', function() {
    const logo = document.querySelector('.fixed-logo');
    const footer = document.querySelector('.footer');
    
    if (!logo || !footer) return;

    let ticking = false;
    let lastScrollY = window.scrollY;

    /* ---------- FOOTER VISIBILITY CHECK ---------- */
    function checkFooterVisibility() {
        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (footerRect.top < windowHeight) {
            logo.classList.add('hidden');
        } else {
            logo.classList.remove('hidden');
        }
    }

    /* ---------- SCROLL HANDLER ---------- */
    function onScroll() {
        lastScrollY = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                checkFooterVisibility();
                ticking = false;
            });
            
            ticking = true;
        }
    }

    /* ---------- EVENT LISTENERS ---------- */
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---------- INITIAL CHECK ---------- */
    checkFooterVisibility();
});