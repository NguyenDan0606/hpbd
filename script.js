// Global State
let currentScene = 1;
const CORRECT_PASS = '13072000';
let currentPass = '';
let bgMusic = document.getElementById('bg-music');

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

// ================= SCENE 1 =================
const passDisplay = document.getElementById('password-display');
const passHint = document.getElementById('password-hint');
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
        setTimeout(nextScene, 1000);
    } else {
        wrongAttempts++;
        passDisplay.classList.add('bg-red-500/50', 'animate-pulse');
        
        // Update hint dynamically based on wrong attempts
        passHint.classList.add('text-red-200', 'font-bold');
        if (wrongAttempts === 1) {
            passHint.innerText = "Đán cũng không nhớ nữa, nhập ngày sinh Ye đi😁";
        } else if (wrongAttempts === 2) {
            passHint.innerText = "Thêm năm sinh dô ikkkkk";
        } else if (wrongAttempts >= 3) {
            passHint.innerText = "Gợi ý: 13/07/2000 :))";
        }

        setTimeout(() => {
            passDisplay.classList.remove('bg-red-500/50', 'animate-pulse');
            clearPassword();
        }, 600);
    }
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
