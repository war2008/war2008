// preloader.js - Работает только при первом открытии
(function() {
    // Проверяем, был ли уже прелоадер показан
    const hasVisited = localStorage.getItem('preloaderShown');
    
    // Если уже посещали - ничего не делаем
    if (hasVisited) {
        return;
    }

    // Настройки прелоадера
    const config = {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        circleColor: 'rgba(255, 255, 255, 0.3)',
        stripeColor: '#ff4444',
        circleSize: '80px',
        stripeWidth: '4px',
        animationSpeed: '1.2s',
        fadeOutTime: 500,
        minDisplayTime: 3000 // Искусственная задержка 3 секунды
    };

    class Preloader {
        constructor(config) {
            this.config = config;
            this.preloader = null;
            this.startTime = Date.now();
        }

        create() {
            // Основной контейнер
            this.preloader = document.createElement('div');
            this.preloader.id = 'preloader';
            this.preloader.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: ${this.config.backgroundColor};
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                transition: opacity ${this.config.fadeOutTime}ms ease;
                backdrop-filter: blur(3px);
            `;

            // Контейнер для анимации
            const loaderContainer = document.createElement('div');
            loaderContainer.style.cssText = `
                position: relative;
                width: ${this.config.circleSize};
                height: ${this.config.circleSize};
            `;

            // Белая окружность (фон)
            const circle = document.createElement('div');
            circle.style.cssText = `
                position: absolute;
                width: 100%;
                height: 100%;
                border: ${this.config.stripeWidth} solid ${this.config.circleColor};
                border-radius: 50%;
                box-sizing: border-box;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
            `;

            // Красная полоска (анимированная)
            const redStripe = document.createElement('div');
            redStripe.style.cssText = `
                position: absolute;
                width: 100%;
                height: 100%;
                border: ${this.config.stripeWidth} solid transparent;
                border-top-color: ${this.config.stripeColor};
                border-radius: 50%;
                box-sizing: border-box;
                animation: preloader-spin ${this.config.animationSpeed} linear infinite;
                filter: drop-shadow(0 0 6px ${this.config.stripeColor});
            `;

            // Добавляем ключевые кадры анимации
            this.addAnimationStyles();

            // Собираем прелоадер
            loaderContainer.appendChild(circle);
            loaderContainer.appendChild(redStripe);
            this.preloader.appendChild(loaderContainer);
            
            return this.preloader;
        }

        addAnimationStyles() {
            const styleId = 'preloader-animation-styles';
            if (document.getElementById(styleId)) return;

            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                @keyframes preloader-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }

        waitForElements() {
            return new Promise((resolve) => {
                const images = Array.from(document.images);
                const totalImages = images.length;
                
                if (totalImages === 0) {
                    resolve();
                    return;
                }

                let loadedImages = 0;
                
                function imageLoaded() {
                    loadedImages++;
                    if (loadedImages === totalImages) {
                        resolve();
                    }
                }

                images.forEach(img => {
                    if (img.complete) {
                        imageLoaded();
                    } else {
                        img.addEventListener('load', imageLoaded);
                        img.addEventListener('error', imageLoaded);
                    }
                });
            });
        }

        async init() {
            // Создаем и добавляем прелоадер
            const preloader = this.create();
            document.body.appendChild(preloader);
            
            // Ждем загрузки всех изображений
            await this.waitForElements();
            
            // Ждем полной загрузки страницы
            return new Promise((resolve) => {
                window.addEventListener('load', () => {
                    // Вычисляем сколько времени прошло
                    const elapsedTime = Date.now() - this.startTime;
                    const remainingTime = Math.max(0, this.config.minDisplayTime - elapsedTime);
                    
                    // Если прошло меньше 3 секунд, ждем оставшееся время
                    setTimeout(() => {
                        // Плавно скрываем прелоадер
                        preloader.style.opacity = '0';
                        
                        // Удаляем прелоадер из DOM
                        setTimeout(() => {
                            if (preloader.parentNode) {
                                preloader.parentNode.removeChild(preloader);
                            }
                            
                            // Сохраняем в localStorage что прелоадер был показан
                            try {
                                localStorage.setItem('preloaderShown', 'true');
                            } catch(e) {
                                // Если localStorage недоступен, игнорируем
                                console.warn('localStorage not available');
                            }
                            
                            resolve();
                        }, this.config.fadeOutTime);
                    }, remainingTime);
                });
            });
        }
    }

    // Инициализация
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new Preloader(config).init();
        });
    } else {
        new Preloader(config).init();
    }
})();// preloader.js (улучшенная версия)
(function() {
    // Настройки прелоадера (можно легко изменить)
    const config = {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        circleColor: 'rgba(255, 255, 255, 0.3)',
        stripeColor: '#ff4444',
        circleSize: '80px',
        stripeWidth: '4px',
        animationSpeed: '1.2s',
        fadeOutTime: 500
    };

    class Preloader {
        constructor(config) {
            this.config = config;
            this.preloader = null;
        }

        create() {
            // Основной контейнер
            this.preloader = document.createElement('div');
            this.preloader.id = 'preloader';
            this.preloader.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: ${this.config.backgroundColor};
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                transition: opacity ${this.config.fadeOutTime}ms ease;
                backdrop-filter: blur(3px);
            `;

            // Контейнер для анимации
            const loaderContainer = document.createElement('div');
            loaderContainer.style.cssText = `
                position: relative;
                width: ${this.config.circleSize};
                height: ${this.config.circleSize};
            `;

            // Белая окружность (фон)
            const circle = document.createElement('div');
            circle.style.cssText = `
                position: absolute;
                width: 100%;
                height: 100%;
                border: ${this.config.stripeWidth} solid ${this.config.circleColor};
                border-radius: 50%;
                box-sizing: border-box;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
            `;

            // Красная полоска (анимированная)
            const redStripe = document.createElement('div');
            redStripe.style.cssText = `
                position: absolute;
                width: 100%;
                height: 100%;
                border: ${this.config.stripeWidth} solid transparent;
                border-top-color: ${this.config.stripeColor};
                border-radius: 50%;
                box-sizing: border-box;
                animation: preloader-spin ${this.config.animationSpeed} linear infinite;
                filter: drop-shadow(0 0 6px ${this.config.stripeColor});
            `;

            // Добавляем ключевые кадры анимации
            this.addAnimationStyles();

            // Собираем прелоадер
            loaderContainer.appendChild(circle);
            loaderContainer.appendChild(redStripe);
            this.preloader.appendChild(loaderContainer);
            
            return this.preloader;
        }

        addAnimationStyles() {
            const styleId = 'preloader-animation-styles';
            if (document.getElementById(styleId)) return;

            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                @keyframes preloader-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }

        waitForElements() {
            return new Promise((resolve) => {
                const images = Array.from(document.images);
                const totalImages = images.length;
                
                if (totalImages === 0) {
                    resolve();
                    return;
                }

                let loadedImages = 0;
                
                function imageLoaded() {
                    loadedImages++;
                    if (loadedImages === totalImages) {
                        resolve();
                    }
                }

                images.forEach(img => {
                    if (img.complete) {
                        imageLoaded();
                    } else {
                        img.addEventListener('load', imageLoaded);
                        img.addEventListener('error', imageLoaded);
                    }
                });
            });
        }

        async init() {
            // Создаем и добавляем прелоадер
            const preloader = this.create();
            document.body.appendChild(preloader);
            
            // Ждем загрузки всех изображений
            await this.waitForElements();
            
            // Ждем полной загрузки страницы
            return new Promise((resolve) => {
                window.addEventListener('load', () => {
                    // Плавно скрываем прелоадер
                    preloader.style.opacity = '0';
                    
                    // Удаляем прелоадер из DOM
                    setTimeout(() => {
                        if (preloader.parentNode) {
                            preloader.parentNode.removeChild(preloader);
                        }
                        resolve();
                    }, this.config.fadeOutTime);
                });
            });
        }
    }

    // Альтернативный вариант: наблюдаем за изменениями в DOM
    function observeDOM() {
        const preloader = new Preloader(config);
        
        // Создаем MutationObserver для отслеживания добавления новых изображений
        const observer = new MutationObserver((mutations) => {
            let hasNewImages = false;
            
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeName === 'IMG' || 
                            (node.nodeType === 1 && node.querySelectorAll('img').length > 0)) {
                            hasNewImages = true;
                        }
                    });
                }
            });
            
            if (hasNewImages && !document.getElementById('preloader')) {
                preloader.init();
            }
        });
        
        // Начинаем наблюдение
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        return observer;
    }

    // Инициализация
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new Preloader(config).init();
        });
    } else {
        new Preloader(config).init();
    }

    // Для динамически загружаемого контента можно раскомментировать:
    // observeDOM();
})();