// Global State
let currentScene = 1;
const CORRECT_PASS = '13072000';
let currentPass = '';

/**
 * Haptic Vibration Feedback for iOS / Android mobile touch interaction
 */
function triggerHaptic(duration = 15) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
            navigator.vibrate(duration);
        } catch (e) {
            // Ignore if vibration is restricted by browser policy
        }
    }
}

/**
 * ============================================================================
 * 📖 TEMPLATE MẪU VÀ DANH SÁCH BÀI VIẾT NHẬT KÝ (DEFAULT_DIARY_ENTRIES)
 * ============================================================================
 */
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
            "Anhhhhhhhhh, hỏng ổn :< ",
            "Cóoo chứ, em có hỏi anh 100 lần hay 1000 lần, anh vẫn luôn trả lời là có, có thích em, có nhớ em, nhiều lắmmm, không 1 ngày nào anh không nhớ em hết.",
            "Tại sao em lại bước vào cuộc đời của anh? Bây giờ anh tiêu cực quá à:< anh hong thích anh chút nào hết, lúc nào anh cũng dày vò bản thân anh hết. Anh không cảm nhận được cuộc sống mình đang sống, anh không thấy dui dì hết, kì cục ạ, hạnh phúc mà em muốn anh có là gì?",
            "Anh nhớ emm!"
        ],
        signature: "Mặt trời của em ☀"
    },
    {
        id: "entry-2",
        date: "Ngày 09 Tháng 08 Năm 2026",
        title: "Hôm nay của em như thế nào? 🐻",
        mood: "🐻",
        images: ["img/ye1.jpg", "img/ye2.jpg"],
        paragraphs: [
            "Trời ơi em biết dì hong, thằng Nguyễn Quốc Phiền, nóoooo coi thường Yến Phương ă, tức ghê luôn muốn méc emmmmmmmmmmmmmmmmmm, hồi trước thì nó ăn hiếp em, thằng này giờ nó lọng hành dữ lắm rồi",
            "*Icon phẩn nộ*"
        ],
        signature: "Thằng nhóc của em 🐻"
    },
    {
        id: "entry-3",
        date: "Ngày 10 Tháng 08 Năm 2026",
        title: "Kỷ niệm 🌸",
        mood: "✨",
        images: ["img/Group1.png"],
        paragraphs: [],
        signature: "Đ"
    },
    {
        id: "entry-5",
        date: "Ngày 12 Tháng 08 Năm 2026",
        title: "Tại sao chỉ dừng lại ở việc muốn mà không phải là có hay được nhỉ?",
        mood: "💭",
        images: ["img/Group2.png","img/Group3.png","img/Group4.png"],
        paragraphs: [],
        signature: "Đ"
    },
    {
        id: "entry-7",
        date: "Ngày 14 Tháng 08 Năm 2026",
        title: "Tại sao em lại bước vào cuộc đời của anh?",
        mood: "☕",
        images: [],
        paragraphs: [
            "Câu này hay lắm nèe, Trước đến giờ uống cà phê không thấy đắng, em cho anh kẹo, ăn kẹo của em vào và uống lại cà phê thì nó đắng nghét. Ở đây không nói đến kẹo hay cà phê."
        ],
        signature: "Đ"
    },
    {
        id: "entry-8",
        date: "Ngày 15 Tháng 08 Năm 2026",
        title: "Xin hãy làm phiền anh điiiiiiiiiiiiiiiiiiiiiiiiiiii",
        mood: "🥺",
        images: [],
        paragraphs: [],
        signature: "Đ"
    },
    {
        id: "entry-9",
        date: "",
        title: "Vãiiiiiiiiiiiiiiiii",
        mood: "😲",
        images: [],
        paragraphs: [
            "Em quen Ku Hưng hã??????????????????????"
        ],
        signature: "Đ"
    },
    {
        id: "entry-10",
        date: "Ngày 16 Tháng 08 Năm 2026",
        title: "THE LAST MEETING THEORY",
        mood: "🌙",
        images: [],
        paragraphs: [
            "Khi một người đã hoàn thành vai trò của họ trong cuộc đời bạn, 2 người sẽ không bao giờ gặp nhau nữa. Nghe có lẻ hỏng tin được đúng hong? Bởi trái đất này nó tròn lắm, 2 người vẫn có thể sống cùng 1 thành phố, đi qua những con đường quen thuộc, có chung vài người bạn hoặc đồng nghiệp, thậm chí đã từng xuất hiện trong cuộc sống của nhau mỗi ngày, nhưng rồi từ 1 thời điểm nào đó, mọi giao điểm có thể biến mất, như chưa từng tồn tại.",
            "Có người đến để cho ta biết cảm giác được yêu thương, hạnh phúc là gì.",
            "Có người sẽ khiến cho ta trưởng thành sau những lần tổn thương.",
            "Cũng có người chỉ xuất hiện vài tháng ngắn ngủi mà có thể thay đổi cách mà ta nhìn cuộc đời suốt nhiều năm sau đó.",
            "Theo giả thuyết này, khi cuộc gặp gỡ định mệnh này kết thúc, sứ mệnh của nhau đã hoàn thành, nhiệm vụ của cả 2 đã hoàn tất, từ đó không cần thiết phải gặp nhau nữa, cũng không nhất thiết phải ghét nhau, cũng chưa có lời chia tay nào to lớn, chỉ làa từ đó về sau cuộc đời của 2 người không còn đi chung 1 đường nữa.",
            "Có thể là do duyên số, có thể là do định mệnh, có thể là do số phận, có thể là do ông trời, có thể là do bất cứ điều gì khác, nhưng dù là gì đi nữa, thì 2 người cũng sẽ không bao giờ gặp nhau nữa.",
            "Có lẽ một vài người xuất hiện trong đời ta không phải để ở lại, mà chỉ để dạy cho ta biết cách yêu thương, cách trưởng thành, cách đối diện với cuộc sống, cách yêu bản thân mình hơn, cách trân trọng những gì mình đang có, cách biết ơn những gì mình đã nhận được, cách tha thứ cho những lỗi lầm của bản thân và của người khác, cách buông bỏ những gì không còn thuộc về mình, cách chấp nhận những gì không thể thay đổi, cách mỉm cười khi đối diện với khó khăn, cách đứng dậy sau vấp ngã, cách mạnh mẽ hơn sau những tổn thương, cách yêu đời hơn sau những mất mát, cách sống trọn vẹn hơn mỗi ngày.",
            "Sống tốt nhé! *Kiểu gì cũng được, hạnh phúc nhé!*"
        ],
        signature: "Đ"
    }
];

// Trực tiếp sử dụng mảng tĩnh trong code làm Nguồn Dữ Liệu Duy Nhất
function getDiaryEntries() {
    return DEFAULT_DIARY_ENTRIES;
}

// Global variables for Diary state
let diaryEntries = getDiaryEntries();
let activeDiaryIndex = 0;
let currentTypingTimer = null;
let currentRenderId = 0; // Session token triệt tiêu race condition gõ chữ

function nextScene() {
    const currentEl = document.getElementById(`scene${currentScene}`);
    if (currentEl) currentEl.classList.remove('active');
    
    setTimeout(() => {
        if (currentEl) currentEl.classList.add('hidden');
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
    triggerHaptic(12);
    if(currentPass.length < 8) {
        currentPass += num;
        passDisplay.innerText = currentPass;
    }
}

function clearPassword() {
    triggerHaptic(20);
    currentPass = '';
    passDisplay.innerText = '_';
}

function checkPassword() {
    triggerHaptic(25);
    if (currentPass === CORRECT_PASS) {
        passDisplay.classList.remove('bg-red-500/50');
        passDisplay.classList.add('bg-green-500/50');
        setTimeout(() => {
            startLetterFlow();
        }, 300);
    } else {
        wrongAttempts++;
        passDisplay.classList.add('bg-red-500/50', 'animate-pulse');

        const hintEl = document.getElementById('password-hint');
        if (hintEl && wrongAttempts >= 1) {
            hintEl.classList.remove('hidden');
        }

        setTimeout(() => {
            passDisplay.classList.remove('bg-red-500/50', 'animate-pulse');
            clearPassword();
        }, 600);
    }
}

function startLetterFlow() {
    const scene1 = document.getElementById('scene1');
    const scene2 = document.getElementById('scene2');
    const sceneLetter = document.getElementById('scene-letter');

    if (scene1) {
        scene1.classList.remove('active');
        scene1.classList.add('hidden');
    }
    if (scene2) {
        scene2.classList.remove('active');
        scene2.classList.add('hidden');
    }

    if (sceneLetter) {
        sceneLetter.classList.remove('hidden');
        void sceneLetter.offsetWidth;
        sceneLetter.classList.add('active');
    }
    
    initLetterScene();
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
    triggerHaptic(15);
    if (activeDiaryIndex > 0) {
        switchDiaryEntry(activeDiaryIndex - 1);
    }
}

function nextDiaryEntry() {
    triggerHaptic(15);
    if (activeDiaryIndex < diaryEntries.length - 1) {
        switchDiaryEntry(activeDiaryIndex + 1);
    }
}

function toggleDateDropdown(event) {
    triggerHaptic(10);
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
                    <div class="truncate">${entry.title || entry.date || 'Nhật ký'}</div>
                    <div class="text-[10px] ${isActive ? 'text-pink-100' : 'text-gray-400'} font-mono">${entry.date || ''}</div>
                </div>
            </div>
            ${isActive ? '<span class="text-xs shrink-0">✓</span>' : ''}
        `;

        dropdown.appendChild(itemBtn);
    });
}

function switchDiaryEntry(index) {
    if (index < 0 || index >= diaryEntries.length) return;
    triggerHaptic(15);
    activeDiaryIndex = index;
    renderDateDropdownMenu();
    renderActiveDiaryEntry(index);
}

function renderActiveDiaryEntry(index) {
    const entry = diaryEntries[index] || diaryEntries[0];
    if (!entry) return;

    // Reset scroll container to top for long entries
    const sceneLetter = document.getElementById('scene-letter');
    if (sceneLetter) sceneLetter.scrollTop = 0;

    // Increment renderId token to instantly invalidate any previous typing loops or setTimeouts!
    const renderId = ++currentRenderId;

    // Clear typing timer if user switches quickly
    if (currentTypingTimer) {
        clearInterval(currentTypingTimer);
        currentTypingTimer = null;
    }

    const paragraphs = Array.isArray(entry.paragraphs) ? entry.paragraphs : [];
    const images = Array.isArray(entry.images) ? entry.images : [];

    // Set Date, Mood, Counter, Title
    const dateEl = document.getElementById('letter-date');
    const moodEl = document.getElementById('letter-mood');
    const titleEl = document.getElementById('letter-title');
    const counterEl = document.getElementById('diary-entry-counter');
    const prevBtn = document.getElementById('btn-prev-diary');
    const nextBtn = document.getElementById('btn-next-diary');

    if (dateEl) dateEl.innerText = entry.date || 'Nhật ký';
    if (moodEl) moodEl.innerText = entry.mood || '💖';
    
    if (titleEl) {
        if (entry.title && entry.title.trim() !== '') {
            titleEl.innerText = entry.title;
            titleEl.classList.remove('hidden');
        } else {
            titleEl.innerText = '';
            titleEl.classList.add('hidden');
        }
    }

    if (counterEl) counterEl.innerText = `${index + 1} / ${diaryEntries.length}`;

    // Enable/disable page flip buttons
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === diaryEntries.length - 1;

    // Render Polaroid Photos Showcase
    renderPolaroidPhotos(images);

    // Render Body Paragraphs with Typing Effect
    const bodyContainer = document.getElementById('letter-body');
    const signatureEl = document.getElementById('letter-signature');

    if (!bodyContainer || !signatureEl) return;

    bodyContainer.innerHTML = '';
    signatureEl.classList.add('opacity-0');
    signatureEl.innerText = entry.signature || '';

    if (paragraphs.length === 0) {
        if (entry.signature) {
            signatureEl.classList.remove('opacity-0');
        }
        return;
    }

    let pIndex = 0;

    function typeNextParagraph() {
        if (renderId !== currentRenderId) return;

        if (pIndex >= paragraphs.length) {
            setTimeout(() => {
                if (renderId !== currentRenderId) return;
                signatureEl.classList.remove('opacity-0');
            }, 300);
            return;
        }

        const pText = paragraphs[pIndex] || '';
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
        card.className = 'polaroid-card w-24 sm:w-28 md:w-36 h-32 sm:h-36 md:h-44 cursor-pointer transform';
        card.style.transform = `rotate(${rot}deg)`;
        card.onclick = () => {
            triggerHaptic(10);
            openLightbox(imgSrc, `Ảnh kỷ niệm ${idx + 1}`);
        };

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
