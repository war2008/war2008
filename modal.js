/* ---------- DOM CONTENT LOADED ---------- */
document.addEventListener('DOMContentLoaded', function() {

    /* ---------- RIGHT LOGO CONTENT MODAL ---------- */
    const menuTrigger = document.querySelector('.fixed-logo.right-logo');
    const hiddenContent = document.getElementById('hidden-content-modal');
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

        const contentData = hiddenContent.querySelector('.content-modal-data');
        if (contentData) modalBody.appendChild(contentData.cloneNode(true));

        modalContent.appendChild(closeBtn);
        modalContent.appendChild(modalBody);
        contentModal.appendChild(modalContent);
        document.body.appendChild(contentModal);

        closeBtn.addEventListener('click', function() {
            contentModal.style.display = 'none';
        });
    }

    if (menuTrigger && contentModal) {
        menuTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            contentModal.style.display = 'block';
            addContentLinksHandlers(contentModal);
        });
        menuTrigger.style.cursor = 'pointer';
    }

    function addContentLinksHandlers(modal) {
        const links = modal.querySelectorAll('.content-links-list a');
        links.forEach(link => {
            link.removeEventListener('click', handleContentLinkClick);
            link.addEventListener('click', handleContentLinkClick);
        });
    }

    function handleContentLinkClick(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            const targetSection = document.getElementById(href.substring(1));
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                if (contentModal) contentModal.style.display = 'none';
            }
        }
    }

    window.addEventListener('click', function(e) {
        if (contentModal && e.target === contentModal) contentModal.style.display = 'none';
    });

    /* ---------- MAIN MODAL (DATA-PERSON) ---------- */
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const closeBtn = modal?.querySelector('.modal-close');
    const hiddenModalContent = document.getElementById('hidden-modal-content');
    const contentMap = new Map();

    if (hiddenModalContent) {
        hiddenModalContent.querySelectorAll('[data-person]').forEach(item => {
            const personId = item.getAttribute('data-person');
            contentMap.set(personId, {
                image: item.querySelector('.modal-image-src')?.getAttribute('data-image') || '',
                title: item.querySelector('.modal-title-src')?.textContent || '',
                description: item.querySelector('.modal-description-src')?.innerHTML || ''
            });
        });
    }

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

    if (closeBtn) closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });

    /* ---------- GALLERY MODAL ---------- */
    const galleryModal = document.getElementById('gallery-modal');
    const galleryGrid = document.getElementById('gallery-grid');
    const galleryCloseBtn = galleryModal?.querySelector('.gallery-close');
    const galleryBtn = document.getElementById('gallery-btn');
    const hiddenGalleryContent = document.getElementById('hidden-gallery-content');

    function loadGallery() {
        if (!galleryGrid || !hiddenGalleryContent) return;
        galleryGrid.innerHTML = '';
        hiddenGalleryContent.querySelectorAll('.gallery-item-src').forEach(item => {
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
        addGalleryImageClickHandlers();
    }

    if (galleryBtn && galleryModal) {
        galleryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loadGallery();
            galleryModal.style.display = 'block';
            setTimeout(addGalleryImageClickHandlers, 100);
        });
    }

    if (galleryCloseBtn) galleryCloseBtn.addEventListener('click', () => { galleryModal.style.display = 'none'; });

    /* ---------- INFO MODALS (SOURCES & CONTACTS) ---------- */
    const infoModal = document.getElementById('info-modal');
    const infoModalTitle = document.getElementById('info-modal-title');
    const infoModalText = document.getElementById('info-modal-text');
    const infoCloseBtn = infoModal?.querySelector('.info-close');
    const sourcesBtn = document.getElementById('sources-btn');
    const contactsBtn = document.getElementById('contacts-btn');
    const hiddenSourcesContent = document.getElementById('hidden-sources-content');
    const hiddenContactsContent = document.getElementById('hidden-contacts-content');

    function fillInfoModal(contentElement) {
        if (!infoModalText || !infoModalTitle || !contentElement) return;
        infoModalTitle.textContent = contentElement.querySelector('.info-title')?.textContent || '';
        infoModalText.innerHTML = contentElement.querySelector('.info-text')?.innerHTML || '';
    }

    if (sourcesBtn) {
        sourcesBtn.addEventListener('click', e => {
            e.preventDefault();
            if (hiddenSourcesContent) { fillInfoModal(hiddenSourcesContent); infoModal.style.display = 'block'; }
        });
    }
    if (contactsBtn) {
        contactsBtn.addEventListener('click', e => {
            e.preventDefault();
            if (hiddenContactsContent) { fillInfoModal(hiddenContactsContent); infoModal.style.display = 'block'; }
        });
    }
    if (infoCloseBtn) infoCloseBtn.addEventListener('click', () => { infoModal.style.display = 'none'; });

    /* ---------- GLOBAL MODAL CLOSING ---------- */
    window.addEventListener('click', e => {
        if (modal && e.target === modal) modal.style.display = 'none';
        if (galleryModal && e.target === galleryModal) galleryModal.style.display = 'none';
        if (infoModal && e.target === infoModal) infoModal.style.display = 'none';
        if (contentModal && e.target === contentModal) contentModal.style.display = 'none';
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            [modal, galleryModal, infoModal, contentModal].forEach(m => { if (m && m.style.display === 'block') m.style.display = 'none'; });
        }
    });

    /* ---------- IMAGE VIEW MODAL ---------- */
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

    function getImageCaption(imgElement) {
        if (imgElement.dataset.caption) return imgElement.dataset.caption;
        const src = imgElement.src || '';
        if (src.includes('section_images/')) {
            const fileName = src.split('/').pop().split('.').slice(0, -1).join('.');
            return fileName.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim();
        }
        return '';
    }

    document.querySelectorAll('.section-image-placeholder img').forEach(img => {
        img.style.cursor = 'pointer';
        img.style.transition = 'opacity 0.3s ease';
        img.addEventListener('mouseenter', () => img.style.opacity = '0.9');
        img.addEventListener('mouseleave', () => img.style.opacity = '1');
        img.addEventListener('click', function(e) {
            e.preventDefault(); e.stopPropagation();
            imageModalImg.src = this.src;
            imageModalImg.alt = this.alt || 'Увеличенное изображение';
            const caption = getImageCaption(this);
            if (caption) { imageCaption.textContent = caption; imageCaption.style.display = 'block'; }
            else imageCaption.style.display = 'none';
            imageModal.style.display = 'block';
        });
    });

    if (imageCloseBtn) imageCloseBtn.addEventListener('click', () => { imageModal.style.display = 'none'; });
    imageModal.addEventListener('click', e => { if (e.target === imageModal) imageModal.style.display = 'none'; });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && imageModal.style.display === 'block') imageModal.style.display = 'none'; });

    /* ---------- IMAGE CAPTIONS SETUP ---------- */
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
            if (src.includes(filename)) { img.dataset.caption = caption; break; }
        }
    });

    /* ---------- GALLERY IMAGE CLICK HANDLERS ---------- */
    function addGalleryImageClickHandlers() {
        document.querySelectorAll('.gallery-item-image').forEach(item => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', function(e) {
                e.preventDefault(); e.stopPropagation();
                const imageUrl = this.style.backgroundImage.slice(5, -2);
                const caption = this.nextElementSibling?.textContent || '';
                const imageModal = document.getElementById('image-view-modal');
                const imageModalImg = document.getElementById('expanded-image');
                const imageCaption = document.getElementById('image-caption');
                if (imageModal && imageModalImg) {
                    imageModalImg.src = imageUrl;
                    imageModalImg.alt = caption || 'Изображение из галереи';
                    if (caption) { imageCaption.textContent = caption; imageCaption.style.display = 'block'; }
                    else imageCaption.style.display = 'none';
                    imageModal.style.display = 'block';
                }
            });
        });
    }
});