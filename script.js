// Global State
let currentScene = 1;
const CORRECT_PASS = '13072000';
let currentPass = '';
let bgMusic = document.getElementById('bg-music');

// Cấu hình Mặc Định Nhật Ký Theo Ngày
const DEFAULT_DIARY_ENTRIES = [
    {
        id: "entry-1",
        date: "Ngày 08 Tháng 08 Năm 2026",
        title: "Gửi Đến Người Đặc Biệt 💌",
        mood: "💖",
        images: ["img/ye.jpg"],
        paragraphs: [
            "Chào em,",
            "Em ổn không? Em có sao không? Cuộc sống em dạo này thế nào? Anh luôn muốn biết 1 ngày của em như thế nào? Vuii hay buồn? Có ai ăn hiếp bảo bối của anh không?",
            "Anhhh, hỏng ổn :< ",
            "Cóoo chứ, em có hỏi anh 100 lần hay 1000 lần, anh vẫn luôn trả lời là có, có thích em, có nhớ em, nhiều lắmmm, không 1 ngày nào anh không nhớ em hết.",
            "Tại sao em lại bước vào cuộc đời của anh? Bây giờ anh tiêu cực quá à:< anh hong thích anh chút nào hết, lúc nào anh cũng dày vò bản thân anh hết. Anh không cảm nhận được cuộc sống mình đang sống, anh không thấy dui dì hết, kì cục ạ, hạnh phúc mà em muốn anh có là gì?",
            "Anh nhớ emm!"
        ],
        signature: "Mặt trời của em ☀"
    },
    {
        id: "entry-2",
        date: "Ngày 12 Tháng 08 Năm 2026",
        title: "Chúc Mừng Sinh Nhật Yeee 🎂",
        mood: "🎂",
        images: ["img/ye1.jpg", "img/ye2.jpg"],
        paragraphs: [
            "Happy Birthday Người Đẹp Đặc Biệt, Dễ Thương Nhất Trên Thế Giới!",
            "Hôm nay là một ngày thực sự rất đặc biệt. Mong em lúc nào cũng phải cười thật tươi và hạnh phúc nhé.",
            "Bởi vì đối với anh, em luôn là điều đặc biệt nhất!"
        ],
        signature: "Thằng nhóc của em 🐻"
    }
];

// Quản lý dữ liệu LocalStorage cho Nhật ký
function getDiaryEntries() {
    try {
        const stored = localStorage.getItem('hpbd_diary_entries');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {
        console.error('Lỗi đọc diary entries từ localStorage:', e);
    }
    return DEFAULT_DIARY_ENTRIES;
}

function saveDiaryEntriesToStorage(entries) {
    try {
        localStorage.setItem('hpbd_diary_entries', JSON.stringify(entries));
    } catch (e) {
        console.error('Lỗi lưu diary entries vào localStorage:', e);
    }
}

// Global variables for Diary state
let diaryEntries = getDiaryEntries();
let activeDiaryIndex = 0;
let currentTypingTimer = null;
let currentRenderId = 0; // Session token triệt tiêu race condition gõ chữ
let selectedNewPhotosBase64 = [];
let currentEditingExistingImages = [];

// Autoplay Music Hack for modern browsers
document.body.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play().catch(e => console.log('Audio play prevented by browser'));
    }
}, { once: true });

function nextScene() {
    const currentEl = document.getElementById(`scene${currentScene}`);
    currentEl.classList.remove('active');
    
    setTimeout(() => {
        currentEl.classList.add('hidden');
        currentScene++;
        
        const nextEl = document.getElementById(`scene${currentScene}`);
        if(nextEl) {
            nextEl.classList.remove('hidden');
            // Force reflow for CSS transition
            void nextEl.offsetWidth;
            nextEl.classList.add('active');
            
            // Init logic for new scene
            if(currentScene === 3) initScene3();
            if(currentScene === 4) initScene4();
            if(currentScene === 5) initScene5();
        }
    }, 800); // match CSS transition duration
}

// ================= SCENE 1 & MODE SELECTION =================
const passDisplay = document.getElementById('password-display');
let wrongAttempts = 0;

function enterDigit(num) {
    if(currentPass.length < 8) {
        currentPass += num;
        passDisplay.innerText = currentPass;
    }
}

function clearPassword() {
    currentPass = '';
    passDisplay.innerText = '_';
}

function checkPassword() {
    if (currentPass === CORRECT_PASS) {
        passDisplay.classList.add('bg-green-500/50');
        setTimeout(() => {
            showModeModal();
        }, 600);
    } else {
        wrongAttempts++;
        passDisplay.classList.add('bg-red-500/50', 'animate-pulse');

        setTimeout(() => {
            passDisplay.classList.remove('bg-red-500/50', 'animate-pulse');
            clearPassword();
        }, 600);
    }
}

// Modal & Navigation Logic
function showModeModal() {
    const modal = document.getElementById('mode-modal');
    modal.classList.remove('hidden');
    void modal.offsetWidth;
    modal.classList.remove('opacity-0');
}

function hideModeModal() {
    const modal = document.getElementById('mode-modal');
    modal.classList.add('opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 500);
}

function selectMode(mode) {
    hideModeModal();
    setTimeout(() => {
        if (mode === 'birthday') {
            startBirthdayFlow();
        } else if (mode === 'letter') {
            startLetterFlow();
        }
    }, 500);
}

function startBirthdayFlow() {
    const scene1 = document.getElementById('scene1');
    const sceneLetter = document.getElementById('scene-letter');
    scene1.classList.remove('active');
    if (sceneLetter) sceneLetter.classList.remove('active');
    
    setTimeout(() => {
        scene1.classList.add('hidden');
        if (sceneLetter) sceneLetter.classList.add('hidden');
        currentScene = 2;
        const scene2 = document.getElementById('scene2');
        scene2.classList.remove('hidden');
        void scene2.offsetWidth;
        scene2.classList.add('active');
    }, 800);
}

function startLetterFlow() {
    const scene1 = document.getElementById('scene1');
    const scene2 = document.getElementById('scene2');
    scene1.classList.remove('active');
    if (scene2) scene2.classList.remove('active');
    
    setTimeout(() => {
        scene1.classList.add('hidden');
        if (scene2) scene2.classList.add('hidden');
        
        const sceneLetter = document.getElementById('scene-letter');
        sceneLetter.classList.remove('hidden');
        void sceneLetter.offsetWidth;
        sceneLetter.classList.add('active');
        
        initLetterScene();
    }, 800);
}

function backToModeSelect() {
    const sceneLetter = document.getElementById('scene-letter');
    sceneLetter.classList.remove('active');
    setTimeout(() => {
        sceneLetter.classList.add('hidden');
        showModeModal();
    }, 500);
}

// ================= SCENE DIARY / LETTER =================
function initLetterScene() {
    diaryEntries = getDiaryEntries();
    if (activeDiaryIndex < 0 || activeDiaryIndex >= diaryEntries.length) {
        activeDiaryIndex = 0;
    }
    renderDateDropdownMenu();
    renderActiveDiaryEntry(activeDiaryIndex);
}

function prevDiaryEntry() {
    if (activeDiaryIndex > 0) {
        switchDiaryEntry(activeDiaryIndex - 1);
    }
}

function nextDiaryEntry() {
    if (activeDiaryIndex < diaryEntries.length - 1) {
        switchDiaryEntry(activeDiaryIndex + 1);
    }
}

function toggleDateDropdown(event) {
    if (event) event.stopPropagation();
    const dropdown = document.getElementById('diary-date-dropdown');
    if (!dropdown) return;
    const isHidden = dropdown.classList.contains('hidden');
    if (isHidden) {
        renderDateDropdownMenu();
        dropdown.classList.remove('hidden');
    } else {
        dropdown.classList.add('hidden');
    }
}

function closeDateDropdown(event) {
    const dropdown = document.getElementById('diary-date-dropdown');
    if (!dropdown || dropdown.classList.contains('hidden')) return;

    const dateBtn = document.getElementById('letter-date-btn');
    if (event && (dropdown.contains(event.target) || (dateBtn && dateBtn.contains(event.target)))) {
        return;
    }
    dropdown.classList.add('hidden');
}

function renderDateDropdownMenu() {
    const dropdown = document.getElementById('diary-date-dropdown');
    if (!dropdown) return;

    dropdown.innerHTML = '';

    const titleHeader = document.createElement('div');
    titleHeader.className = 'text-[11px] font-bold text-gray-400 uppercase px-3 py-1 border-b mb-1';
    titleHeader.innerText = 'Danh Sách Nhật Ký';
    dropdown.appendChild(titleHeader);

    diaryEntries.forEach((entry, idx) => {
        const isActive = idx === activeDiaryIndex;
        const itemBtn = document.createElement('button');
        itemBtn.className = `w-full text-left px-3 py-2 rounded-xl flex items-center justify-between text-xs md:text-sm font-medium transition-all ${
            isActive
                ? 'bg-pink-500 text-white font-bold shadow-sm'
                : 'hover:bg-pink-50 text-gray-700'
        }`;

        itemBtn.onclick = (e) => {
            e.stopPropagation();
            switchDiaryEntry(idx);
            dropdown.classList.add('hidden');
        };

        itemBtn.innerHTML = `
            <div class="flex items-center gap-2 truncate">
                <span class="text-base shrink-0">${entry.mood || '📝'}</span>
                <div class="truncate">
                    <div class="truncate">${entry.title}</div>
                    <div class="text-[10px] ${isActive ? 'text-pink-100' : 'text-gray-400'} font-mono">${entry.date}</div>
                </div>
            </div>
            ${isActive ? '<span class="text-xs shrink-0">✓</span>' : ''}
        `;

        dropdown.appendChild(itemBtn);
    });
}

function switchDiaryEntry(index) {
    if (index < 0 || index >= diaryEntries.length) return;
    activeDiaryIndex = index;
    renderDateDropdownMenu();
    renderActiveDiaryEntry(index);
}

function renderActiveDiaryEntry(index) {
    const entry = diaryEntries[index] || diaryEntries[0];
    if (!entry) return;

    // Increment renderId token to instantly invalidate any previous typing loops or setTimeouts!
    const renderId = ++currentRenderId;

    // Clear typing timer if user switches quickly
    if (currentTypingTimer) {
        clearInterval(currentTypingTimer);
        currentTypingTimer = null;
    }

    // Set Date, Mood, Counter, Title
    const dateEl = document.getElementById('letter-date');
    const moodEl = document.getElementById('letter-mood');
    const titleEl = document.getElementById('letter-title');
    const counterEl = document.getElementById('diary-entry-counter');
    const prevBtn = document.getElementById('btn-prev-diary');
    const nextBtn = document.getElementById('btn-next-diary');

    if (dateEl) dateEl.innerText = entry.date;
    if (moodEl) moodEl.innerText = entry.mood || '💖';
    if (titleEl) titleEl.innerText = entry.title;
    if (counterEl) counterEl.innerText = `${index + 1} / ${diaryEntries.length}`;

    // Enable/disable page flip buttons
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === diaryEntries.length - 1;

    // Render Polaroid Photos Showcase
    renderPolaroidPhotos(entry.images || []);

    // Render Body Paragraphs with Typing Effect
    const bodyContainer = document.getElementById('letter-body');
    const signatureEl = document.getElementById('letter-signature');

    if (!bodyContainer || !signatureEl) return;

    bodyContainer.innerHTML = '';
    signatureEl.classList.add('opacity-0');
    signatureEl.innerText = entry.signature || '';

    let pIndex = 0;

    function typeNextParagraph() {
        // If a newer render was triggered, cancel cleanly!
        if (renderId !== currentRenderId) return;

        if (pIndex >= entry.paragraphs.length) {
            setTimeout(() => {
                if (renderId !== currentRenderId) return;
                signatureEl.classList.remove('opacity-0');
            }, 300);
            return;
        }

        const pText = entry.paragraphs[pIndex];
        const pEl = document.createElement('p');
        pEl.className = 'opacity-0 transform translate-y-2 transition-all duration-500 font-sans';
        bodyContainer.appendChild(pEl);

        setTimeout(() => {
            if (renderId !== currentRenderId) return;
            pEl.classList.remove('opacity-0', 'translate-y-2');
        }, 40);

        let charIndex = 0;
        pEl.classList.add('typing-cursor');

        currentTypingTimer = setInterval(() => {
            if (renderId !== currentRenderId) {
                clearInterval(currentTypingTimer);
                currentTypingTimer = null;
                return;
            }

            if (charIndex < pText.length) {
                pEl.textContent += pText.charAt(charIndex);
                charIndex++;
            } else {
                clearInterval(currentTypingTimer);
                currentTypingTimer = null;
                pEl.classList.remove('typing-cursor');
                pIndex++;
                setTimeout(() => {
                    if (renderId !== currentRenderId) return;
                    typeNextParagraph();
                }, 250);
            }
        }, 25);
    }

    typeNextParagraph();
}

// Lắng nghe phím mũi tên bàn phím để lật trang nhật ký
document.addEventListener('keydown', (e) => {
    const sceneLetter = document.getElementById('scene-letter');
    if (!sceneLetter || sceneLetter.classList.contains('hidden')) return;

    // Bỏ qua nếu đang gõ trong form hoặc modal
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

    if (e.key === 'ArrowLeft') {
        prevDiaryEntry();
    } else if (e.key === 'ArrowRight') {
        nextDiaryEntry();
    }
});


function renderPolaroidPhotos(images) {
    const photosContainer = document.getElementById('diary-photos-container');
    if (!photosContainer) return;

    photosContainer.innerHTML = '';
    if (!images || images.length === 0) {
        photosContainer.classList.add('hidden');
        return;
    }

    photosContainer.classList.remove('hidden');

    const rotations = [-3, 2, -2, 4, -4];

    images.forEach((imgSrc, idx) => {
        const rot = rotations[idx % rotations.length];
        const card = document.createElement('div');
        card.className = 'polaroid-card w-28 md:w-36 h-36 md:h-44 cursor-pointer transform';
        card.style.transform = `rotate(${rot}deg)`;
        card.onclick = () => openLightbox(imgSrc, `Ảnh kỷ niệm ${idx + 1}`);

        card.innerHTML = `
            <div class="polaroid-tape"></div>
            <div class="w-full h-full overflow-hidden rounded bg-gray-100 flex items-center justify-center">
                <img src="${imgSrc}" alt="Diary photo ${idx + 1}" loading="lazy" class="w-full h-full object-cover">
            </div>
        `;

        photosContainer.appendChild(card);
    });
}

// Lightbox modal logic
function openLightbox(imgSrc, caption = '') {
    const lightbox = document.getElementById('photo-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');

    if (!lightbox || !lightboxImg) return;

    lightboxImg.src = imgSrc;
    if (lightboxCaption) lightboxCaption.innerText = caption;

    lightbox.classList.remove('hidden');
    void lightbox.offsetWidth;
    lightbox.classList.remove('opacity-0');
}

function closeLightbox(event) {
    if (event && event.target && event.target.id !== 'photo-lightbox' && event.target.id !== 'close-lightbox-btn') {
        return;
    }
    const lightbox = document.getElementById('photo-lightbox');
    if (!lightbox) return;

    lightbox.classList.add('opacity-0');
    setTimeout(() => {
        lightbox.classList.add('hidden');
    }, 300);
}

// Add / Edit Diary Entry Modal logic
function openAddDiaryModal() {
    const modal = document.getElementById('add-diary-modal');
    if (!modal) return;

    // Reset Edit State
    document.getElementById('input-diary-edit-id').value = '';
    const modalIcon = document.getElementById('modal-diary-icon');
    const modalHeading = document.getElementById('modal-diary-heading');
    if (modalIcon) modalIcon.innerText = '📝';
    if (modalHeading) modalHeading.innerText = 'Viết Trang Nhật Ký Mới';

    // Hide existing photos container
    currentEditingExistingImages = [];
    renderExistingPhotosForEdit();

    // Reset Form & Photo Preview
    const form = document.getElementById('add-diary-form');
    if (form) form.reset();

    selectedNewPhotosBase64 = [];
    const previewContainer = document.getElementById('photo-preview-container');
    if (previewContainer) previewContainer.innerHTML = '';

    // Pre-fill today's date formatted
    const dateInput = document.getElementById('input-diary-date');
    if (dateInput) {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        dateInput.value = `Ngày ${dd} Tháng ${mm} Năm ${yyyy}`;
    }

    modal.classList.remove('hidden');
    void modal.offsetWidth;
    modal.classList.remove('opacity-0');
}

function openEditDiaryModal() {
    const entry = diaryEntries[activeDiaryIndex];
    if (!entry) return;

    const modal = document.getElementById('add-diary-modal');
    if (!modal) return;

    // Set Edit Mode State
    document.getElementById('input-diary-edit-id').value = entry.id;
    const modalIcon = document.getElementById('modal-diary-icon');
    const modalHeading = document.getElementById('modal-diary-heading');
    if (modalIcon) modalIcon.innerText = '✏️';
    if (modalHeading) modalHeading.innerText = 'Chỉnh Sửa Trang Nhật Ký';

    // Pre-fill form fields
    document.getElementById('input-diary-date').value = entry.date || '';
    document.getElementById('input-diary-title').value = entry.title || '';
    document.getElementById('input-diary-mood').value = entry.mood || '💖';
    document.getElementById('input-diary-signature').value = entry.signature || '';
    document.getElementById('input-diary-content').value = (entry.paragraphs || []).join('\n');

    // Populate existing images
    currentEditingExistingImages = [...(entry.images || [])];
    renderExistingPhotosForEdit();

    // Reset new selected files input & preview
    const fileInput = document.getElementById('input-diary-photos');
    if (fileInput) fileInput.value = '';
    selectedNewPhotosBase64 = [];
    const previewContainer = document.getElementById('photo-preview-container');
    if (previewContainer) previewContainer.innerHTML = '';

    modal.classList.remove('hidden');
    void modal.offsetWidth;
    modal.classList.remove('opacity-0');
}

function renderExistingPhotosForEdit() {
    const wrapper = document.getElementById('existing-photos-wrapper');
    const container = document.getElementById('existing-photos-container');
    if (!wrapper || !container) return;

    container.innerHTML = '';
    if (!currentEditingExistingImages || currentEditingExistingImages.length === 0) {
        wrapper.classList.add('hidden');
        return;
    }

    wrapper.classList.remove('hidden');

    currentEditingExistingImages.forEach((imgSrc, idx) => {
        const item = document.createElement('div');
        item.className = 'relative w-14 h-14 group border rounded-md overflow-hidden shadow-sm';

        item.innerHTML = `
            <img src="${imgSrc}" class="w-full h-full object-cover">
            <button type="button" onclick="removeExistingPhoto(${idx})" class="absolute top-0.5 right-0.5 bg-red-500 hover:bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] shadow">
                ✕
            </button>
        `;
        container.appendChild(item);
    });
}

function removeExistingPhoto(index) {
    if (index >= 0 && index < currentEditingExistingImages.length) {
        currentEditingExistingImages.splice(index, 1);
        renderExistingPhotosForEdit();
    }
}

function closeAddDiaryModal() {
    const modal = document.getElementById('add-diary-modal');
    if (!modal) return;

    modal.classList.add('opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

function previewSelectedImages(event) {
    const files = event.target.files;
    const previewContainer = document.getElementById('photo-preview-container');
    if (!previewContainer) return;

    previewContainer.innerHTML = '';
    selectedNewPhotosBase64 = [];

    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target.result;
            selectedNewPhotosBase64.push(base64);

            const imgThumb = document.createElement('img');
            imgThumb.src = base64;
            imgThumb.className = 'w-12 h-12 object-cover rounded-md border border-pink-200 shadow-sm';
            previewContainer.appendChild(imgThumb);
        };
        reader.readAsDataURL(file);
    });
}

function handleSaveDiary(event) {
    event.preventDefault();

    const editId = document.getElementById('input-diary-edit-id').value;
    const dateVal = document.getElementById('input-diary-date').value.trim();
    const titleVal = document.getElementById('input-diary-title').value.trim();
    const moodVal = document.getElementById('input-diary-mood').value;
    const signatureVal = document.getElementById('input-diary-signature').value.trim() || 'Mặt trời của em ☀';
    const contentVal = document.getElementById('input-diary-content').value.trim();

    if (!dateVal || !titleVal || !contentVal) {
        alert('Vui lòng điền đầy đủ Ngày, Tiêu đề và Nội dung nhật ký!');
        return;
    }

    const paragraphs = contentVal.split('\n').map(p => p.trim()).filter(p => p.length > 0);
    const finalImages = [...currentEditingExistingImages, ...selectedNewPhotosBase64];

    if (editId) {
        // Mode EDIT: Update entry by id
        const targetIdx = diaryEntries.findIndex(item => item.id === editId);
        if (targetIdx !== -1) {
            diaryEntries[targetIdx] = {
                ...diaryEntries[targetIdx],
                date: dateVal,
                title: titleVal,
                mood: moodVal,
                images: finalImages,
                paragraphs: paragraphs,
                signature: signatureVal
            };
        }
    } else {
        // Mode CREATE: Add new entry
        const newEntry = {
            id: `entry-${Date.now()}`,
            date: dateVal,
            title: titleVal,
            mood: moodVal,
            images: finalImages,
            paragraphs: paragraphs,
            signature: signatureVal
        };
        diaryEntries.push(newEntry);
        activeDiaryIndex = diaryEntries.length - 1;
    }

    saveDiaryEntriesToStorage(diaryEntries);
    closeAddDiaryModal();

    renderDateDropdownMenu();
    renderActiveDiaryEntry(activeDiaryIndex);
}





// ================= SCENE 2 =================
let isBookOpen = false;
let popupStep = 1;

function openBook() {
    if (isBookOpen) return;
    isBookOpen = true;
    document.getElementById('book-container').classList.add('open');
    
    // Show continue button after cover is fully flipped
    setTimeout(() => {
        const btn = document.getElementById('btn-scene2-continue');
        btn.classList.remove('opacity-0', 'pointer-events-none');
    }, 1200);
}

function showPopup(step) {
    popupStep = step;
    const overlay = document.getElementById('popup-overlay');
    const popupBox = document.getElementById('popup-box');
    const text = document.getElementById('popup-text');
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    
    if (step === 1) {
        text.innerText = "Bà có nhớ thằng nhóc này không?";
        btnYes.innerText = "Có";
        btnNo.innerText = "Không";
        
        overlay.classList.remove('hidden');
        setTimeout(() => {
            popupBox.classList.remove('scale-90');
            popupBox.classList.add('scale-100');
        }, 10);
    } else if (step === 2) {
        // Change text for second question and buttons
        text.innerText = "Đang làm cái dì ạ? Cơm nước tắm dửa đái ỉa dì chưa? Hôm nay đi làm có mệt hong? Tui không có quên bà đâu, bà dặn tui là đừng quên bà mà, Bà quên tui rồi đúng không :v";
        btnYes.innerText = "Đúng 🥲"; 
        btnNo.innerText = "Kệ Kao 😏"; 
        
        // Reset No button position in case it ran away
        currentNoX = 0;
        currentNoY = 0;
        gsap.to('#btn-no-wrapper', { x: 0, y: 0, duration: 0.3 });
    }
}

function handleYes() {
    if (popupStep === 1) {
        // Show second popup question
        showPopup(2);
    } else {
        // Second yes clicked, proceed to next scene
        const overlay = document.getElementById('popup-overlay');
        const popupBox = document.getElementById('popup-box');
        
        popupBox.classList.remove('scale-100');
        popupBox.classList.add('scale-90');
        
        setTimeout(() => {
            overlay.classList.add('hidden');
            nextScene();
        }, 300);
    }
}

// Runaway No button Logic
let currentNoX = 0;
let currentNoY = 0;

document.addEventListener('mousemove', (e) => {
    const overlay = document.getElementById('popup-overlay');
    // Only run if popup is active
    if (overlay.classList.contains('hidden')) return;

    const btnNoWrapper = document.getElementById('btn-no-wrapper');
    const btnYes = document.getElementById('btn-yes');
    
    const noRect = btnNoWrapper.getBoundingClientRect();
    const yesRect = btnYes.getBoundingClientRect();
    
    // Center of No button
    const noCenterX = noRect.left + noRect.width / 2;
    const noCenterY = noRect.top + noRect.height / 2;
    
    // Distance from mouse to center of button
    const distX = noCenterX - e.clientX;
    const distY = noCenterY - e.clientY;
    const distance = Math.sqrt(distX * distX + distY * distY);
    
    // Trigger runaway if mouse is within 100px
    const triggerDistance = 100;
    
    if (distance < triggerDistance) {
        // Vector calculation to move away
        const moveDist = 80;
        let vecX = (distX / distance) * moveDist;
        let vecY = (distY / distance) * moveDist;
        
        // Add slight randomness to avoid getting cornered easily
        vecX += (Math.random() - 0.5) * 40;
        vecY += (Math.random() - 0.5) * 40;
        
        let newX = currentNoX + vecX;
        let newY = currentNoY + vecY;
        
        // Boundary limit relative to starting position
        const maxRadius = 150;
        const currentDistFromOrigin = Math.sqrt(newX * newX + newY * newY);
        if (currentDistFromOrigin > maxRadius) {
            newX = (newX / currentDistFromOrigin) * maxRadius;
            newY = (newY / currentDistFromOrigin) * maxRadius;
        }

        // Avoid Yes Button overlap
        const predictedLeft = noRect.left + (newX - currentNoX);
        const predictedTop = noRect.top + (newY - currentNoY);
        const predictedRight = predictedLeft + noRect.width;
        const predictedBottom = predictedTop + noRect.height;
        
        const pad = 15;
        const isOverlapping = !(
            predictedRight < yesRect.left - pad ||
            predictedLeft > yesRect.right + pad ||
            predictedBottom < yesRect.top - pad ||
            predictedTop > yesRect.bottom + pad
        );
        
        if (isOverlapping) {
            // Push vertically away if overlapping horizontally
            newY += (noCenterY < yesRect.top + yesRect.height/2) ? -50 : 50;
        }

        currentNoX = newX;
        currentNoY = newY;
        
        // Smooth GSAP inertia movement
        gsap.to(btnNoWrapper, {
            x: currentNoX,
            y: currentNoY,
            duration: 0.4,
            ease: "power3.out",
            overwrite: true
        });
    }
});

// Also handle touch devices
document.getElementById('btn-no-wrapper').addEventListener('touchstart', (e) => {
    e.preventDefault(); // prevent click
    currentNoX += (Math.random() - 0.5) * 100;
    currentNoY += (Math.random() - 0.5) * 100;
    gsap.to('#btn-no-wrapper', { x: currentNoX, y: currentNoY, duration: 0.4, ease: "power3.out" });
});

// ================= SCENE 3 =================
function initScene3() {
    const tl = gsap.timeline({
        onComplete: () => {
            setTimeout(nextScene, 1500); 
        }
    });

    const seqs = document.querySelectorAll('.v2-seq');
    
    // 1st text
    tl.to(seqs[0], { opacity: 1, duration: 1 })
      .to(seqs[0], { opacity: 0, duration: 1, delay: 2 });
    
    // 2nd text
    tl.to(seqs[1], { opacity: 1, duration: 1 })
      .to(seqs[1], { opacity: 0, duration: 1, delay: 2 });
      
    // 3rd text (Chatbox)
    tl.to(seqs[2], { opacity: 1, y: -20, duration: 1, onComplete: () => {
        tl.pause(); // Pause timeline to wait for typing to finish
        new Typed('#chatbox-typed', {
            strings: ['Birthday Yeee! Chúc Ye lúc nào cũng happy, lúc nào cũng hạnh phúc, lúc nào cũng cườiiii, Ye cười dễ thương lắm, nên là đừng có buồn nha, làm mặt buồn hong có ngầu đâu, Đán trân trọng Ye lắm nhưng mà hỏng biết thể hiện sao hết huhu, Có thíchhh, có nhớ, nhớ nhiều lắmmmmmmmmmmm blah blah...'],
            typeSpeed: 30,
            showCursor: true,
            cursorChar: '|',
            preStringTyped: (arrayPos, self) => {
                // Tự động cuộn xuống khi đang gõ
                const scrollBox = document.getElementById('chat-scroll');
                self.scrollInterval = setInterval(() => {
                    if(scrollBox) scrollBox.scrollTop = scrollBox.scrollHeight;
                }, 50);
            },
            onComplete: (self) => {
                clearInterval(self.scrollInterval); // Dừng cuộn
                // Animate Gửi button click
                gsap.to('#btn-chat-send', {
                    scale: 0.85,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    onComplete: () => {
                        // Resume timeline after a short delay
                        setTimeout(() => tl.resume(), 400);
                    }
                });
            }
        });
    }})
      .to(seqs[2], { opacity: 0, duration: 1 });
      
    // 4th text (Ideas stacking)
    tl.to(seqs[3], { opacity: 1, duration: 0.5 });
    const ideas = seqs[3].querySelectorAll('.v2-idea');
    ideas.forEach((idea, i) => {
        // Fade in
        tl.to(idea, { opacity: 1, duration: 0.8, y: -10, ease: "power2.out" });
        
        // If not the last idea, fade it out
        if (i < ideas.length - 1) {
            tl.to(idea, { opacity: 0, duration: 0.5, delay: 1 });
        } else {
            // Hiệu ứng xoay mặt cười :)
            tl.to('#smiley-icon', { rotation: 90, duration: 0.5, ease: "back.out(2)", delay: 0.5 });
            tl.to(idea, { delay: 1.5 }); // Wait before transitioning scene
        }
    });
}

// ================= SCENE 4 =================
function initScene4() {
    // Typed.js
    new Typed('#typed-output', {
        stringsElement: '#typed-strings',
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 1000,
        loop: false,
        showCursor: true,
        cursorChar: '|',
        onComplete: () => {
            gsap.to(['#s4-instruction', '#btn-scene4-continue'], {
                opacity: 1,
                duration: 1,
                onComplete: () => {
                    document.getElementById('btn-scene4-continue').classList.remove('pointer-events-none');
                }
            });
        }
    });

    // Fireworks
    const fireworksContainer = document.getElementById('v2-fireworks');
    for(let i=0; i<9; i++) {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 40 40");
        svg.setAttribute("class", "absolute w-4 h-4 opacity-0 text-pink-500 fill-current");
        
        svg.style.left = (10 + Math.random() * 80) + '%';
        svg.style.top = (10 + Math.random() * 80) + '%';
        
        let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", "20");
        circle.setAttribute("cy", "20");
        circle.setAttribute("r", "20");
        
        svg.appendChild(circle);
        fireworksContainer.appendChild(svg);
        
        gsap.to(svg, {
            opacity: 0,
            scale: 40 + Math.random() * 40,
            repeat: -1,
            repeatDelay: 0.5 + Math.random() * 1.5,
            duration: 1 + Math.random(),
            delay: Math.random() * 2,
            onStart: function() { this.targets()[0].style.opacity = 0.6; }
        });
    }
}

// ================= SCENE 5 =================
function initScene5() {
    // Profile Slide up
    gsap.to('#s5-profile', {
        y: 0,
        duration: 1.5,
        ease: "back.out(1.5)"
    });

    // Hat slide down
    gsap.fromTo('#s5-hat', 
        { x: -52, y: -150, opacity: 0 }, // Vị trí bắt đầu rơi
        { x: -52, y: -45, opacity: 1, duration: 1.2, ease: "bounce.out", delay: 1.2 } // Vị trí kết thúc
    );

    // Balloons Animation (from bottom to top)
    const balloonContainer = document.getElementById('balloons-container');
    const balloonSources = ['v2/img/ballon1.svg', 'v2/img/ballon2.svg', 'v2/img/ballon3.svg'];
    
    for (let i = 0; i < 30; i++) {
        let img = document.createElement('img');
        img.src = balloonSources[Math.floor(Math.random() * balloonSources.length)];
        img.className = 'absolute w-10 md:w-16';
        img.style.left = Math.random() * 90 + '%';
        img.style.bottom = '-100px';
        balloonContainer.appendChild(img);
        
        gsap.to(img, {
            y: -(window.innerHeight + 200),
            x: (Math.random() - 0.5) * 150,
            duration: 4 + Math.random() * 5,
            ease: "power1.inOut",
            delay: Math.random() * 2
        });
    }

    // Snowflakes / Fireworks Effect
    setTimeout(() => {
        new Snowflakes({
            color: '#ff69b4',
            count: 60,
            minOpacity: 0.4,
            maxOpacity: 0.9,
            minSize: 10,
            maxSize: 25,
            speed: 1.5
        });
    }, 1000);
}
