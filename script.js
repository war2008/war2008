// Оптимизированный script.js
document.addEventListener('DOMContentLoaded', function() {
    const logo = document.querySelector('.fixed-logo');
    const footer = document.querySelector('.footer');
    
    if (!logo || !footer) return;
    
    // Используем requestAnimationFrame для оптимизации производительности
    let ticking = false;
    let lastScrollY = window.scrollY;
    
    function checkFooterVisibility() {
        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (footerRect.top < windowHeight) {
            logo.classList.add('hidden');
        } else {
            logo.classList.remove('hidden');
        }
    }
    
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
    
    // Используем пассивный слушатель для улучшения производительности скролла
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Проверяем сразу после загрузки
    checkFooterVisibility();
});