// modal.js - Обновленная версия с загрузкой контента из скрытых блоков

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // === МОДАЛЬНОЕ ОКНО СОДЕРЖАНИЯ (правый логотип) ===
    const menuTrigger = document.querySelector('.fixed-logo.right-logo');
    const hiddenContent = document.getElementById('hidden-content-modal'); // Исправлено: теперь ID совпадает с HTML
    
    // Создаем модальное окно для содержания, если его нет
    let contentModal = document.getElementById('content-modal');
    if (!contentModal && hiddenContent) {
        contentModal = document.createElement('div');
        contentModal.id = 'content-modal';
        contentModal.className = 'modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content content-modal-content';
        
        const closeBtn = document.createElement('span');
        closeBtn.className = 'modal-close content-close';
        closeBtn.innerHTML = '&times;';
        
        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body content-modal-body';
        
        // Берем контент из скрытого блока
        const contentData = hiddenContent.querySelector('.content-modal-data');
        if (contentData) {
            modalBody.appendChild(contentData.cloneNode(true));
        }
        
        modalContent.appendChild(closeBtn);
        modalContent.appendChild(modalBody);
        contentModal.appendChild(modalContent);
        document.body.appendChild(contentModal);
        
        // Закрытие по крестику
        closeBtn.addEventListener('click', function() {
            contentModal.style.display = 'none';
        });
    }
    
    // Обработчик клика на правый логотип
    if (menuTrigger && contentModal) {
        menuTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            contentModal.style.display = 'block';
        });
        
        // Убираем hover-эффекты, оставляем только pointer
        menuTrigger.style.cursor = 'pointer';
    }
    
    // Закрытие по клику вне модального окна
    window.addEventListener('click', function(e) {
        if (contentModal && e.target === contentModal) {
            contentModal.style.display = 'none';
        }
    });

    // 1. ОСНОВНОЕ МОДАЛЬНОЕ ОКНО (для data-person)
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const closeBtn = modal?.querySelector('.modal-close');
    
    // Получаем скрытые контенты
    const hiddenModalContent = document.getElementById('hidden-modal-content');
    
    // Создаем карту контента для быстрого доступа
    const contentMap = new Map();
    if (hiddenModalContent) {
        const items = hiddenModalContent.querySelectorAll('[data-person]');
        items.forEach(item => {
            const personId = item.getAttribute('data-person');
            const imageSrc = item.querySelector('.modal-image-src')?.getAttribute('data-image') || '';
            const title = item.querySelector('.modal-title-src')?.textContent || '';
            const description = item.querySelector('.modal-description-src')?.innerHTML || '';
            
            contentMap.set(personId, {
                image: imageSrc,
                title: title,
                description: description
            });
        });
    }
    
    // Обработчик для всех кликабельных ссылок
    document.querySelectorAll('.clickable-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const personId = this.getAttribute('data-person');
            const data = contentMap.get(personId);
            
            if (data && modal) {
                modalTitle.textContent = data.title;
                modalDescription.innerHTML = data.description;
                
                if (data.image) {
                    modalImage.style.backgroundImage = `url('${data.image}')`;
                    modalImage.style.backgroundSize = 'cover';
                    modalImage.style.backgroundPosition = 'center';
                } else {
                    modalImage.style.backgroundImage = 'none';
                    modalImage.style.backgroundColor = '#2a2a2a';
                }
                
                modal.style.display = 'block';
            }
        });
    });
    
    // Закрытие основного модального окна
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // 2. ГАЛЕРЕЯ
    const galleryModal = document.getElementById('gallery-modal');
    const galleryGrid = document.getElementById('gallery-grid');
    const galleryCloseBtn = galleryModal?.querySelector('.gallery-close');
    const galleryBtn = document.getElementById('gallery-btn');
    const hiddenGalleryContent = document.getElementById('hidden-gallery-content');

    // Функция для загрузки изображений в галерею
    function loadGallery() {
        if (!galleryGrid || !hiddenGalleryContent) return;
        galleryGrid.innerHTML = ''; // Очищаем перед загрузкой
        
        const galleryItems = hiddenGalleryContent.querySelectorAll('.gallery-item-src');
        
        galleryItems.forEach(item => {
            const imageDiv = item.querySelector('.gallery-image-src');
            const caption = item.querySelector('.gallery-caption-src')?.textContent || '';
            const imageSrc = imageDiv?.getAttribute('data-src') || '';
            
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            const imgDiv = document.createElement('div');
            imgDiv.className = 'gallery-item-image';
            imgDiv.style.backgroundImage = `url('${imageSrc}')`;
            imgDiv.style.backgroundSize = 'cover';
            imgDiv.style.backgroundPosition = 'center';
            
            const captionDiv = document.createElement('div');
            captionDiv.className = 'gallery-item-caption';
            captionDiv.textContent = caption;
            
            galleryItem.appendChild(imgDiv);
            galleryItem.appendChild(captionDiv);
            galleryGrid.appendChild(galleryItem);
        });
    }

    // Открытие галереи
    if (galleryBtn && galleryModal) {
        galleryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loadGallery();
            galleryModal.style.display = 'block';
        });
    }

    // Закрытие галереи
    if (galleryCloseBtn && galleryModal) {
        galleryCloseBtn.addEventListener('click', function() {
            galleryModal.style.display = 'none';
        });
    }

    // 3. ИНФОРМАЦИОННЫЕ МОДАЛЬНЫЕ ОКНА (Материалы и Контакты)
    const infoModal = document.getElementById('info-modal');
    const infoModalTitle = document.getElementById('info-modal-title');
    const infoModalText = document.getElementById('info-modal-text');
    const infoCloseBtn = infoModal?.querySelector('.info-close');
    const sourcesBtn = document.getElementById('sources-btn');
    const contactsBtn = document.getElementById('contacts-btn');
    
    const hiddenSourcesContent = document.getElementById('hidden-sources-content');
    const hiddenContactsContent = document.getElementById('hidden-contacts-content');

    // Функция для заполнения информационного окна
    function fillInfoModal(contentElement) {
        if (!infoModalText || !infoModalTitle || !contentElement) return;
        
        const title = contentElement.querySelector('.info-title')?.textContent || '';
        const textContent = contentElement.querySelector('.info-text')?.innerHTML || '';
        
        infoModalTitle.textContent = title;
        infoModalText.innerHTML = textContent;
    }

    // Открытие модального окна "Материалы и источники"
    if (sourcesBtn && infoModal) {
        sourcesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (hiddenSourcesContent) {
                fillInfoModal(hiddenSourcesContent);
                infoModal.style.display = 'block';
            }
        });
    }

    // Открытие модального окна "Контакты и авторство"
    if (contactsBtn && infoModal) {
        contactsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (hiddenContactsContent) {
                fillInfoModal(hiddenContactsContent);
                infoModal.style.display = 'block';
            }
        });
    }

    // Закрытие информационного модального окна
    if (infoCloseBtn && infoModal) {
        infoCloseBtn.addEventListener('click', function() {
            infoModal.style.display = 'none';
        });
    }

    // Общая функция закрытия модалок по клику вне окна и по Escape
    window.addEventListener('click', function(e) {
        if (modal && e.target === modal) {
            modal.style.display = 'none';
        }
        if (galleryModal && e.target === galleryModal) {
            galleryModal.style.display = 'none';
        }
        if (infoModal && e.target === infoModal) {
            infoModal.style.display = 'none';
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (modal && modal.style.display === 'block') {
                modal.style.display = 'none';
            }
            if (galleryModal && galleryModal.style.display === 'block') {
                galleryModal.style.display = 'none';
            }
            if (infoModal && infoModal.style.display === 'block') {
                infoModal.style.display = 'none';
            }
            if (contentModal && contentModal.style.display === 'block') {
                contentModal.style.display = 'none';
            }
        }
    });

    // === МОДАЛЬНОЕ ОКНО ДЛЯ УВЕЛИЧЕНИЯ ИЗОБРАЖЕНИЙ ===
    // Создаем модальное окно для изображений
    const imageModal = document.createElement('div');
    imageModal.className = 'modal image-view-modal';
    imageModal.id = 'image-view-modal';
    imageModal.innerHTML = `
        <div class="modal-content image-modal-content">
            <span class="modal-close image-modal-close">&times;</span>
            <div class="image-modal-body">
                <img src="" alt="" class="image-modal-img" id="expanded-image">
                <div class="image-modal-caption" id="image-caption"></div>
            </div>
        </div>
    `;
    document.body.appendChild(imageModal);

    const imageModalImg = document.getElementById('expanded-image');
    const imageCaption = document.getElementById('image-caption');
    const imageCloseBtn = imageModal.querySelector('.image-modal-close');

    // Функция для извлечения подписи из атрибута data-caption или создания на основе пути
    function getImageCaption(imgElement) {
        if (imgElement.dataset.caption) {
            return imgElement.dataset.caption;
        }
        
        const src = imgElement.src || '';
        if (src.includes('section_images/')) {
            const fileName = src.split('/').pop().split('.').slice(0, -1).join('.');
            return fileName.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim();
        }
        
        return '';
    }

    // Добавляем обработчики на все изображения в секциях
    document.querySelectorAll('.section-image-placeholder img').forEach(img => {
        img.style.cursor = 'pointer';
        img.style.transition = 'opacity 0.3s ease';
        
        img.addEventListener('mouseenter', () => {
            img.style.opacity = '0.9';
        });
        
        img.addEventListener('mouseleave', () => {
            img.style.opacity = '1';
        });

        img.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            imageModalImg.src = this.src;
            imageModalImg.alt = this.alt || 'Увеличенное изображение';
            
            const caption = getImageCaption(this);
            if (caption) {
                imageCaption.textContent = caption;
                imageCaption.style.display = 'block';
            } else {
                imageCaption.style.display = 'none';
            }
            
            imageModal.style.display = 'block';
        });
    });

    // Закрытие модального окна изображений
    if (imageCloseBtn) {
        imageCloseBtn.addEventListener('click', function() {
            imageModal.style.display = 'none';
        });
    }

    imageModal.addEventListener('click', function(e) {
        if (e.target === imageModal) {
            imageModal.style.display = 'none';
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && imageModal.style.display === 'block') {
            imageModal.style.display = 'none';
        }
    });

    // Добавляем data-caption к изображениям в section_images
    const sectionImages = document.querySelectorAll('.section-image-placeholder img[src*="section_images/"]');
    const imageCaptions = {
        'destab.png': 'Военный переворот в Грузии, декабрь 1992 года',
        'tuchi.png': 'Михаил Саакашвили, президент Грузии (2004-2013)',
        'nato.png': 'Американские военнослужащие в Грузии в рамках программы GSSOP',
        'domoi.png': 'Вывод российских военных баз из Грузии, 2005 год',
        'gssop.png': 'Выступление посла США в Грузии, 2007',
        'dengi.PNG': 'Т-72, закупленные Грузией на Украине',
        'plan.png': 'Карта города Цхинвали',
        '1vistrely.png': 'Грузинские военнослужащие на танках Т-72 перед началом операции',
        '1boy.png': 'Деревня Приси (Прис) - место первого боя 7 августа 2008',
        '1proriv.png': 'Село Хетагурово, западнее Цхинвала',
        '1proval.PNG': 'Подбитые грузинские танки Т-72 на пересечении Московской и Привокзальной улиц Цхинвала',
        '2proval.PNG': 'Уничтоженный бронетранспортер "Кобра" на улице Сталина',
        '1obstrel.png': 'Казарма миротворцев России после обстрела',
        '2obstrel.PNG': 'Уничтоженная техника российских миротворцев',
        'stavka.png': 'Колонна 58-й армии России проходит через Рокский тоннель',
        'razgrom.PNG': 'Генерал Анатолий Хрулёв в Южной Осетии, 9 августа 2008',
        'desant.PNG': 'Разведчики ВДВ в порту Поти, 12 августа 2008',
        'poteri.png': 'Траур в память жертв боевых действий в Южной Осетии'
    };

    sectionImages.forEach(img => {
        const src = img.src;
        for (const [filename, caption] of Object.entries(imageCaptions)) {
            if (src.includes(filename)) {
                img.dataset.caption = caption;
                break;
            }
        }
    });
    
    // === ДОПОЛНЕНИЕ: Открытие изображений из галереи в увеличенном виде ===
    // Добавляем обработчики для изображений в галерее
    function addGalleryImageClickHandlers() {
        const galleryItems = document.querySelectorAll('.gallery-item-image');
        
        galleryItems.forEach((item, index) => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Получаем фоновое изображение
                const bgImage = this.style.backgroundImage;
                const imageUrl = bgImage.slice(5, -2); // Убираем url(" и ")
                
                // Получаем подпись
                const caption = this.nextElementSibling?.textContent || '';
                
                // Устанавливаем в модальное окно
                const imageModal = document.getElementById('image-view-modal');
                const imageModalImg = document.getElementById('expanded-image');
                const imageCaption = document.getElementById('image-caption');
                
                if (imageModal && imageModalImg) {
                    imageModalImg.src = imageUrl;
                    imageModalImg.alt = caption || 'Изображение из галереи';
                    
                    if (caption) {
                        imageCaption.textContent = caption;
                        imageCaption.style.display = 'block';
                    } else {
                        imageCaption.style.display = 'none';
                    }
                    
                    imageModal.style.display = 'block';
                }
            });
        });
    }

    // Модифицируем функцию loadGallery для добавления обработчиков после загрузки
    const originalLoadGallery = loadGallery;
    loadGallery = function() {
        if (!galleryGrid || !hiddenGalleryContent) return;
        galleryGrid.innerHTML = ''; // Очищаем перед загрузкой
        
        const galleryItems = hiddenGalleryContent.querySelectorAll('.gallery-item-src');
        
        galleryItems.forEach(item => {
            const imageDiv = item.querySelector('.gallery-image-src');
            const caption = item.querySelector('.gallery-caption-src')?.textContent || '';
            const imageSrc = imageDiv?.getAttribute('data-src') || '';
            
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            const imgDiv = document.createElement('div');
            imgDiv.className = 'gallery-item-image';
            imgDiv.style.backgroundImage = `url('${imageSrc}')`;
            imgDiv.style.backgroundSize = 'cover';
            imgDiv.style.backgroundPosition = 'center';
            
            const captionDiv = document.createElement('div');
            captionDiv.className = 'gallery-item-caption';
            captionDiv.textContent = caption;
            
            galleryItem.appendChild(imgDiv);
            galleryItem.appendChild(captionDiv);
            galleryGrid.appendChild(galleryItem);
        });
        
        // Добавляем обработчики для новых изображений
        addGalleryImageClickHandlers();
    };

    // Также добавляем обработчики при открытии галереи, если изображения уже загружены
    if (galleryBtn && galleryModal) {
        galleryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loadGallery();
            galleryModal.style.display = 'block';
            
            // Добавляем обработчики после загрузки (на всякий случай)
            setTimeout(addGalleryImageClickHandlers, 100);
        });
    }
});