/**
 * Merry Christmas - Interactive Greeting Card
 * Cleaned, Optimized & Modularized JavaScript
 */

// 1. Phân tích tham số tên người nhận (mặc định: Thạch Phan, hoặc lấy từ ?name=... / ?to=...)
const urlParams = new URLSearchParams(window.location.search);
const recipientName = (urlParams.get('name') || urlParams.get('to') || 'Thạch Phan').trim();
const outsideGreeting = `Merry Christmas, ${recipientName} !!`;
const insideGreeting = `Merry Christmas ${recipientName}! Mùa đông đến rồi, ${recipientName} nhớ mặc áo ấm nha. Chúc em Giáng sinh an lành và luôn hạnh phúc bên anh!`;

// Cập nhật tiêu đề trang
document.title = `Merry Christmas - ${recipientName}!`;

// Cá nhân hóa các tiêu đề và nội dung
function applyPersonalizedTitles() {
    const giftTitle = document.getElementById('giftModalTitle');
    const certTitle = document.getElementById('santaCertTitle');
    const certBody = document.getElementById('santaCertBody');
    const loveLetterTitle = document.getElementById('loveLetterTitle');
    const snowmanBubble = document.getElementById('snowmanBubble');

    if (giftTitle) giftTitle.textContent = `Món Quà Dành Riêng Cho ${recipientName}!`;
    if (certTitle) certTitle.textContent = `Chứng Nhận ${recipientName} Đáng Yêu Nhất!`;
    if (certBody) certBody.textContent = `Ông già Noel xác nhận ${recipientName} đã xuất sắc bắt đủ 5 món quà may mắn và xứng đáng nhận được 1000 cái ôm ấm áp cùng mọi điều ngọt ngào nhất trong mùa đông này! ❤️🎄`;
    if (loveLetterTitle) loveLetterTitle.textContent = `💌 Gửi ${recipientName} Mùa Giáng Sinh 🎄`;
    if (snowmanBubble) snowmanBubble.textContent = `Chào ${recipientName}! Bấm vào tớ để nhận thông điệp Giáng sinh nha ⛄✨`;
}
applyPersonalizedTitles();
window.addEventListener('DOMContentLoaded', applyPersonalizedTitles);

// 2. Render chữ xuất hiện từng ký tự
function renderGreetingText(textContainer, text) {
    if (!textContainer) return;
    textContainer.innerHTML = '';

    let charIndex = 0;
    const words = text.split(' ');

    words.forEach((word, wordIdx) => {
        const wordEle = document.createElement('span');
        wordEle.className = 'word';

        for (let i = 0; i < word.length; i++) {
            charIndex++;
            const spanEle = document.createElement('span');
            spanEle.className = 'char';
            spanEle.style.setProperty('--index', charIndex);
            spanEle.innerText = word[i];
            wordEle.appendChild(spanEle);
        }

        textContainer.appendChild(wordEle);

        if (wordIdx < words.length - 1) {
            charIndex++;
            const spaceEle = document.createElement('span');
            spaceEle.className = 'space';
            spaceEle.style.setProperty('--index', charIndex);
            spaceEle.innerHTML = '&nbsp;';
            textContainer.appendChild(spaceEle);
        }
    });
}

let outsideTextDisplayed = false;
function displayText() {
    if (outsideTextDisplayed) return;
    outsideTextDisplayed = true;
    const textContainer = document.querySelector('.text-container.text-outside-card');
    renderGreetingText(textContainer, outsideGreeting);
    revealViewCardButton();
}

function revealViewCardButton() {
    const viewCardBtn = document.querySelector('.view-card-btn');
    if (!viewCardBtn) return;
    const stage = document.getElementById('memoriesStage');
    if (!stage || !stage.classList.contains('is-visible')) {
        viewCardBtn.style.visibility = 'visible';
        viewCardBtn.style.opacity = '1';
        viewCardBtn.style.pointerEvents = 'auto';
        viewCardBtn.style.transform = 'scale(1)';
        viewCardBtn.style.animation = 'appear 0.8s forwards';
    }
}

// Dự phòng hiện nút mở thiệp nếu vẽ cây thông trễ
setTimeout(() => {
    revealViewCardButton();
}, 8500);

window.renderText = () => {
    const textContainer2 = document.querySelector('.text-container.text-inside-card');
    renderGreetingText(textContainer2, insideGreeting);
};

// 3. Web Audio API Singleton - Tránh leak AudioContext
let sharedAudioCtx = null;
function getSharedAudioContext() {
    if (!sharedAudioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
            sharedAudioCtx = new AudioCtx();
        }
    }
    if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
        sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
}

function playMagicChime() {
    try {
        const ctx = getSharedAudioContext();
        if (!ctx) return;
        const notes = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7
        const now = ctx.currentTime;
        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
            gain.gain.setValueAtTime(0.08, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.55);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.56);
        });
    } catch (_) {}
}

// 4. GSAP Cây Thông Noel
(function initTreeGSAP() {
    if (typeof gsap === 'undefined' || typeof MorphSVGPlugin === 'undefined') return;

    function r(a) {
        gsap.killTweensOf(a, { opacity: true });
        gsap.fromTo(a, { opacity: 1 }, { duration: 0.07, opacity: Math.random(), repeat: -1 });
    }

    let e = true;
    const n = "#E8F6F8 #ACE8F8 #F6FBFE #A2CBDC #B74551 #5DBA72 #910B28 #910B28 #446D39".split(" ");
    const p = ["#star", "#circ", "#cross", "#heart"];
    const l = [];
    let d = 0;
    const m = gsap.utils.random(0.5, 3, 0.001, true);

    function t(a) {
        if (e) {
            a = l[d];
            gsap.set(a, {
                x: gsap.getProperty(".pContainer", "x"),
                y: gsap.getProperty(".pContainer", "y"),
                scale: m()
            });
            gsap.timeline().to(a, {
                duration: gsap.utils.random(0.61, 6),
                physics2D: {
                    velocity: gsap.utils.random(-23, 23),
                    angle: gsap.utils.random(-180, 180),
                    gravity: gsap.utils.random(-6, 50)
                },
                scale: 0,
                rotation: gsap.utils.random(-123, 360),
                ease: "power1",
                onStart: r,
                onStartParams: [a],
                onRepeat: function (b) {
                    gsap.set(b, { scale: m() });
                },
                onRepeatParams: [a]
            });
            d++;
            d = 201 <= d ? 0 : d;
        }
    }

    MorphSVGPlugin.convertToPath("polygon");
    const u = document.querySelector(".mainSVG");
    let c = document.querySelector(".sparkle");

    gsap.set("svg", { visibility: "visible" });
    gsap.set(c, { transformOrigin: "50% 50%", y: -100 });

    const getPathPoints = function (a) {
        const b = [];
        const f = MotionPathPlugin.getRawPath(a)[0];
        f.forEach(function (v, g) {
            const h = {};
            h.x = f[2 * g];
            h.y = f[2 * g + 1];
            if (g % 2) b.push(h);
        });
        return b;
    };

    getPathPoints(".treePath");
    const q = getPathPoints(".treeBottomPath");
    c = gsap.timeline({ delay: 0, repeat: -1 });

    for (let a = 201; -1 < --a;) {
        const template = document.querySelector(p[a % p.length]);
        if (!template) break;
        const b = template.cloneNode(true);
        b.removeAttribute("id");
        u.appendChild(b);
        b.setAttribute("fill", n[a % n.length]);
        b.setAttribute("class", "particle");
        l.push(b);
        gsap.set(b, { x: -100, y: -100, transformOrigin: "50% 50%" });
    }

    const k = gsap.timeline({ onUpdate: t, onComplete: displayText });
    k.to(".pContainer, .sparkle", { duration: 6, motionPath: { path: ".treePath", autoRotate: false }, ease: "linear" })
     .to(".pContainer, .sparkle", { duration: 1, onStart: function () { e = false; }, x: q[0].x, y: q[0].y })
     .to(".pContainer, .sparkle", { duration: 2, onStart: function () { e = true; }, motionPath: { path: ".treeBottomPath", autoRotate: false }, ease: "linear" }, "-=0")
     .from(".treeBottomMask", { duration: 2, drawSVG: "0% 0%", stroke: "#FFF", ease: "linear" }, "-=2");

    c.from([".treePathMask", ".treePotMask"], { drawSVG: "0% 0%", stroke: "#FFF", stagger: { each: 6 }, duration: gsap.utils.wrap([6, 1, 2]), ease: "linear" })
     .from(".treeStar", { duration: 3, scaleY: 0, scaleX: 0.15, transformOrigin: "50% 50%", ease: "elastic(1,0.5)" }, "-=4")
     .to(".sparkle", { duration: 3, opacity: 0, ease: "rough({strength: 2, points: 100, template: linear, taper: both, randomize: true, clamp: false})" }, "-=0")
     .to(".treeStarOutline", { duration: 1, opacity: 1, ease: "rough({strength: 2, points: 16, template: linear, taper: none, randomize: true, clamp: false})" }, "+=1");

    c.add(k, 0);
    gsap.globalTimeline.timeScale(1.5);
    k.eventCallback("onComplete", displayText);
})();

// 5. Tuyết rơi & Tất, Kẹo gậy rơi tự do (Tối ưu hiệu năng)
const stockingSVG = `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path d="M42 8 C46 2, 52 6, 48 14" fill="none" stroke="#2a9d8f" stroke-width="4" stroke-linecap="round"/>
        <path d="M24 16 L46 16 L46 42 C46 50, 40 56, 32 56 L18 56 C11 56, 8 50, 10 44 C12 39, 17 37, 24 37 Z" fill="#e63946"/>
        <path d="M18 56 C11 56, 8 50, 10 44 C11.5 40, 15 38, 20 37.5 C22 43, 21 50, 18 56 Z" fill="#f8f9fa" opacity="0.9"/>
        <path d="M46 38 L46 42 C46 49, 41 55, 34 56 C34 48, 39 41, 46 38 Z" fill="#f8f9fa" opacity="0.9"/>
        <rect x="20" y="10" width="30" height="12" rx="6" fill="#ffffff"/>
        <circle cx="28" cy="16" r="2.5" fill="#e63946"/>
        <circle cx="33" cy="17" r="2.2" fill="#d62828"/>
        <path d="M28 14 C24 10, 21 13, 26 16 Z" fill="#2a9d8f"/>
        <path d="M31 14 C35 10, 38 13, 33 16 Z" fill="#2a9d8f"/>
    </svg>
`;

const candyCaneSVG = `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 24 A11 11 0 0 1 42 24 L42 54" fill="none" stroke="#ffffff" stroke-width="10" stroke-linecap="round"/>
        <path d="M20 24 A11 11 0 0 1 42 24 L42 54" fill="none" stroke="#e63946" stroke-width="10" stroke-dasharray="7 7" stroke-linecap="butt"/>
        <path d="M42 34 C34 29, 34 39, 42 34 C50 29, 50 39, 42 34 Z" fill="#2a9d8f" stroke="#1d6f65" stroke-width="1.5"/>
        <circle cx="42" cy="34" r="2.8" fill="#ffd166"/>
    </svg>
`;

function isMemoriesStageActive() {
    const stage = document.getElementById('memoriesStage');
    return stage && stage.classList.contains('is-visible');
}

function createSnowflake() {
    if (document.hidden) return;
    if (isMemoriesStageActive() && Math.random() > 0.4) return;

    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.style.left = Math.random() * 100 + '%';

    const size = Math.random() * 5 + 2;
    snowflake.style.width = `${size}px`;
    snowflake.style.height = `${size}px`;
    document.body.appendChild(snowflake);

    const duration = Math.random() * 5000 + 3500;
    const animation = snowflake.animate([
        { transform: 'translateY(-10px)', opacity: 0.8 },
        { transform: 'translateY(100vh)', opacity: 0.2 }
    ], {
        duration: duration,
        easing: 'linear',
        fill: 'forwards'
    });

    animation.onfinish = () => snowflake.remove();
}

function createFallingHolidayItem() {
    if (document.hidden || isMemoriesStageActive()) return;

    const item = document.createElement('div');
    item.classList.add('falling-item');

    const isStocking = Math.random() > 0.5;
    item.innerHTML = isStocking ? stockingSVG : candyCaneSVG;
    item.style.left = (Math.random() * 92 + 4) + '%';
    const size = Math.random() * 12 + 24;
    item.style.width = `${size}px`;
    item.style.height = `${size}px`;

    item.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        if (window.catchFallingGift) {
            window.catchFallingGift(e.clientX, e.clientY);
        }
        item.remove();
    });

    document.body.appendChild(item);

    const duration = Math.random() * 4500 + 5000;
    const startRotate = Math.random() * 40 - 20;
    const swayRotate = startRotate + (Math.random() > 0.5 ? 45 : -45);
    const endRotate = startRotate + (Math.random() > 0.5 ? 120 : -120);
    const driftX = Math.random() * 60 - 30;

    const animation = item.animate([
        { transform: `translate(0, -40px) rotate(${startRotate}deg)`, opacity: 0.95 },
        { transform: `translate(${driftX * 0.5}px, 50vh) rotate(${swayRotate}deg)`, opacity: 0.9, offset: 0.5 },
        { transform: `translate(${driftX}px, 105vh) rotate(${endRotate}deg)`, opacity: 0.3 }
    ], {
        duration: duration,
        easing: 'linear',
        fill: 'forwards'
    });

    animation.onfinish = () => item.remove();
}

function startSnowfall() {
    setInterval(createSnowflake, 350); // Tối ưu: 350ms/bông
    setInterval(createFallingHolidayItem, 1800); // Tối ưu: 1800ms/vật phẩm
}
window.addEventListener('load', startSnowfall);

// 6. Bộ 10 tấm ảnh đôi kỷ niệm & Lời nhắn
const couplePhotos = [
    { src: './photos/photo1.jpg', caption: 'Ánh mắt em cười làm cả mùa đông bỗng trở nên ấm áp lạ thường ❤️' },
    { src: './photos/photo2.jpg', caption: 'Che chở cho công chúa nhỏ của anh suốt mọi mùa Giáng sinh nhé 🧣💖' },
    { src: './photos/photo3.jpg', caption: 'Nụ cười rạng rỡ nhất trần đời chính là nụ cười của hai đứa mình ✨' },
    { src: './photos/photo4.jpg', caption: 'Cái ôm thật chặt xua tan mọi giá lạnh của đêm Noel 🤗🎄' },
    { src: './photos/photo5.jpg', caption: 'Ngắm nhìn em hạnh phúc là món quà Giáng sinh tuyệt vời nhất của anh 🎁' },
    { src: './photos/photo6.jpg', caption: 'Mỗi khoảnh khắc bên em đều ngọt ngào hơn cả kẹo gậy Giáng sinh 🍬💕' },
    { src: './photos/photo7.jpg', caption: 'Bình yên nhất là được tựa vào nhau đi qua bao mùa tuyết rơi ❄️❤️' },
    { src: './photos/photo8.jpg', caption: 'Hai đứa mình mãi nhí nhảnh, vui tươi và yêu thương nhau như thế này nhé ✌️🌟' },
    { src: './photos/photo9.jpg', caption: 'Anh nguyện cõng cả thế giới nhỏ của anh đi khắp muôn nơi 🎅💖' },
    { src: './photos/photo10.jpg', caption: 'Merry Christmas! Cảm ơn em vì đã luôn ở bên cạnh anh ❤️🎄' }
];

// 7. Treo 10 Quả Châu Ảnh lên Cây Thông Noel
const ornamentPositions = [
    { x: 408, y: 152, color: '#ff4d6d' },
    { x: 370, y: 205, color: '#ffd166' },
    { x: 446, y: 210, color: '#2ec4b6' },
    { x: 336, y: 270, color: '#ff9f1c' },
    { x: 408, y: 278, color: '#ff4d6d' },
    { x: 480, y: 274, color: '#ffd166' },
    { x: 308, y: 348, color: '#2ec4b6' },
    { x: 380, y: 358, color: '#ffd166' },
    { x: 448, y: 354, color: '#ff4d6d' },
    { x: 514, y: 362, color: '#ff9f1c' }
];

function initTreePhotoOrnaments() {
    const group = document.getElementById('treeOrnamentsGroup');
    if (!group) return;
    const svgNS = 'http://www.w3.org/2000/svg';

    ornamentPositions.forEach((pos, idx) => {
        const g = document.createElementNS(svgNS, 'g');
        g.setAttribute('class', 'tree-ornament');
        g.setAttribute('transform', `translate(${pos.x}, ${pos.y})`);
        g.addEventListener('click', (e) => {
            e.stopPropagation();
            openPhotoLightbox(idx);
        });

        const inner = document.createElementNS(svgNS, 'g');
        inner.setAttribute('class', 'tree-ornament-inner');

        // Dây treo
        const line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', '0');
        line.setAttribute('y1', '-26');
        line.setAttribute('x2', '0');
        line.setAttribute('y2', '-18');
        line.setAttribute('stroke', '#ffd166');
        line.setAttribute('stroke-width', '2');
        inner.appendChild(line);

        // Nắp quả châu
        const cap = document.createElementNS(svgNS, 'rect');
        cap.setAttribute('x', '-4');
        cap.setAttribute('y', '-22');
        cap.setAttribute('width', '8');
        cap.setAttribute('height', '4');
        cap.setAttribute('rx', '1.5');
        cap.setAttribute('fill', '#ffd166');
        inner.appendChild(cap);

        // Viền quả châu
        const rim = document.createElementNS(svgNS, 'circle');
        rim.setAttribute('cx', '0');
        rim.setAttribute('cy', '0');
        rim.setAttribute('r', '20.5');
        rim.setAttribute('fill', '#fff');
        rim.setAttribute('stroke', pos.color);
        rim.setAttribute('stroke-width', '3');
        inner.appendChild(rim);

        // Ảnh đôi
        const img = document.createElementNS(svgNS, 'image');
        img.setAttribute('href', couplePhotos[idx].src);
        img.setAttribute('x', '-18.5');
        img.setAttribute('y', '-22');
        img.setAttribute('width', '37');
        img.setAttribute('height', '46');
        img.setAttribute('preserveAspectRatio', 'xMidYMin slice');
        img.setAttribute('clip-path', 'url(#ornamentPhotoClip)');
        inner.appendChild(img);

        // Phản chiếu ánh sáng
        const gloss = document.createElementNS(svgNS, 'ellipse');
        gloss.setAttribute('cx', '-6');
        gloss.setAttribute('cy', '-9');
        gloss.setAttribute('rx', '5');
        gloss.setAttribute('ry', '2.5');
        gloss.setAttribute('transform', 'rotate(-30 -6 -9)');
        gloss.setAttribute('fill', 'rgba(255,255,255,0.55)');
        inner.appendChild(gloss);

        g.appendChild(inner);
        group.appendChild(g);

        setTimeout(() => {
            g.classList.add('is-ready');
        }, 2600 + idx * 420);
    });
}
window.addEventListener('DOMContentLoaded', initTreePhotoOrnaments);

// 8. Xem ảnh phóng to (Photo Lightbox)
let currentLightboxIdx = 0;

function updateLightboxContent() {
    const item = couplePhotos[currentLightboxIdx];
    const imgEl = document.getElementById('lightboxImg');
    const badgeEl = document.getElementById('lightboxBadge');
    const captionEl = document.getElementById('lightboxCaption');

    if (imgEl) imgEl.src = item.src;
    if (badgeEl) badgeEl.textContent = `🎄 Quả châu kỷ niệm #${currentLightboxIdx + 1} / ${couplePhotos.length}`;
    if (captionEl) captionEl.textContent = item.caption;
}

function openPhotoLightbox(idx) {
    currentLightboxIdx = ((idx % couplePhotos.length) + couplePhotos.length) % couplePhotos.length;
    updateLightboxContent();
    const overlay = document.getElementById('photoLightboxOverlay');
    if (overlay) {
        overlay.classList.add('is-open');
    }
    playMagicChime();
    spawnCelebrationBurst(window.innerWidth / 2, window.innerHeight / 2, 22);
}

function stepPhotoLightbox(delta) {
    currentLightboxIdx = (currentLightboxIdx + delta + couplePhotos.length) % couplePhotos.length;
    updateLightboxContent();
    playMagicChime();
}

function closePhotoLightbox(event) {
    if (event) event.stopPropagation();
    const overlay = document.getElementById('photoLightboxOverlay');
    if (overlay) {
        overlay.classList.remove('is-open');
    }
}

window.addEventListener('keydown', (e) => {
    const overlay = document.getElementById('photoLightboxOverlay');
    if (!overlay || !overlay.classList.contains('is-open')) return;
    if (e.key === 'ArrowRight') stepPhotoLightbox(1);
    if (e.key === 'ArrowLeft') stepPhotoLightbox(-1);
    if (e.key === 'Escape') closePhotoLightbox();
});

// 9. Quả cầu pha lê kỷ niệm bay lơ lửng
let floatingOrbIdx = 0;
function spawnFloatingMemoryOrb() {
    if (document.hidden || isMemoriesStageActive()) return;
    const orb = document.createElement('div');
    orb.className = 'floating-memory-orb';
    const photoIndex = floatingOrbIdx % couplePhotos.length;
    floatingOrbIdx++;

    const img = document.createElement('img');
    img.src = couplePhotos[photoIndex].src;
    img.alt = 'Kỷ niệm';
    orb.appendChild(img);

    const startLeft = Math.random() * 76 + 12;
    orb.style.left = `${startLeft}%`;
    orb.title = 'Chạm vào quả cầu pha lê để xem ảnh & bung mưa trái tim!';

    orb.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        spawnCelebrationBurst(e.clientX, e.clientY, 28);
        openPhotoLightbox(photoIndex);
        orb.remove();
    });

    document.body.appendChild(orb);

    const swayX = Math.random() * 90 - 45;
    const anim = orb.animate([
        { transform: 'translate(-50%, 0) scale(0.6)', opacity: 0 },
        { transform: `translate(calc(-50% + ${swayX * 0.5}px), -30vh) scale(1)`, opacity: 0.95, offset: 0.25 },
        { transform: `translate(calc(-50% - ${swayX * 0.5}px), -70vh) scale(1.05)`, opacity: 0.95, offset: 0.7 },
        { transform: `translate(calc(-50% + ${swayX}px), -112vh) scale(0.7)`, opacity: 0 }
    ], {
        duration: 12500,
        easing: 'ease-in-out',
        fill: 'forwards'
    });

    anim.onfinish = () => orb.remove();
}
setInterval(spawnFloatingMemoryOrb, 6500);
setTimeout(spawnFloatingMemoryOrb, 3000);

// 10. Pháo hoa & Đổi màu cây thông khi bấm Ngôi sao
const colorThemes = [
    { cls: '', name: '🎄 Màu Cổ Điển' },
    { cls: 'theme-rose', name: '🌸 Hồng Lãng Mạn' },
    { cls: 'theme-frozen', name: '❄️ Xanh Băng Giá' },
    { cls: 'theme-gold', name: '✨ Vàng Hoàng Gia' }
];
let currentThemeIdx = 0;

function triggerStarFireworksAndTheme(event) {
    if (event) event.stopPropagation();
    currentThemeIdx = (currentThemeIdx + 1) % colorThemes.length;
    document.body.classList.remove('theme-rose', 'theme-frozen', 'theme-gold');
    if (colorThemes[currentThemeIdx].cls) {
        document.body.classList.add(colorThemes[currentThemeIdx].cls);
    }
    const pillText = document.getElementById('themePillText');
    if (pillText) {
        pillText.textContent = colorThemes[currentThemeIdx].name;
    }

    playMagicChime();
    const bursts = [
        { x: window.innerWidth * 0.3, y: window.innerHeight * 0.25, delay: 0 },
        { x: window.innerWidth * 0.7, y: window.innerHeight * 0.22, delay: 220 },
        { x: window.innerWidth * 0.5, y: window.innerHeight * 0.18, delay: 450 },
        { x: window.innerWidth * 0.4, y: window.innerHeight * 0.3, delay: 680 }
    ];
    bursts.forEach(b => {
        setTimeout(() => spawnCelebrationBurst(b.x, b.y, 26), b.delay);
    });
}

// 11. Bắt quà rơi tích điểm mở Chứng Nhận Noel
let caughtGiftsCount = 0;
const targetCatchCount = 5;

window.catchFallingGift = (x, y) => {
    caughtGiftsCount++;
    playMagicChime();
    spawnCelebrationBurst(x, y, 16);

    const pop = document.createElement('div');
    pop.className = 'floating-score-pop';
    pop.textContent = '+1 🎁';
    pop.style.left = `${x}px`;
    pop.style.top = `${y}px`;
    document.body.appendChild(pop);
    const popAnim = pop.animate([
        { transform: 'translate(-50%, 0) scale(0.8)', opacity: 1 },
        { transform: 'translate(-50%, -45px) scale(1.2)', opacity: 0 }
    ], { duration: 750, easing: 'ease-out', fill: 'forwards' });
    popAnim.onfinish = () => pop.remove();

    const scoreText = document.getElementById('catchScoreText');
    const scorePill = document.getElementById('catchScorePill');
    if (caughtGiftsCount >= targetCatchCount) {
        if (scoreText) scoreText.textContent = `📜 Xem Chứng Nhận (${caughtGiftsCount})`;
        if (scorePill) scorePill.classList.add('unlocked');
        if (caughtGiftsCount === targetCatchCount) {
            openSantaCertModal();
        }
    } else {
        if (scoreText) scoreText.textContent = `Bắt quà rơi: ${caughtGiftsCount}/${targetCatchCount}`;
    }
};

function handleCatchPillClick(event) {
    if (event) event.stopPropagation();
    if (caughtGiftsCount >= targetCatchCount) {
        openSantaCertModal();
    } else {
        playMagicChime();
        const bubble = document.getElementById('snowmanBubble');
        if (bubble) {
            bubble.textContent = `Bấm vào những chiếc Tất & Kẹo gậy đang rơi trên màn hình để bắt đủ ${targetCatchCount} món quà nha! 🧦🍬`;
            bubble.classList.add('is-visible');
            setTimeout(() => bubble.classList.remove('is-visible'), 4500);
        }
    }
}

function openSantaCertModal(event) {
    if (event) event.stopPropagation();
    const modal = document.getElementById('santaCertOverlay');
    if (modal) {
        modal.classList.add('is-open');
        playMagicChime();
        spawnCelebrationBurst(window.innerWidth / 2, window.innerHeight / 2, 32);
    }
}

function closeSantaCertModal(event) {
    if (event) event.stopPropagation();
    const modal = document.getElementById('santaCertOverlay');
    if (modal) {
        modal.classList.remove('is-open');
    }
}

// 12. Khởi tạo Dây Đèn Vàng Kẹp 10 Ảnh Polaroid Đung Đưa
function initPolaroidWall() {
    const row1 = document.getElementById('polaroidRow1');
    const row2 = document.getElementById('polaroidRow2');
    if (!row1 || !row2) return;

    couplePhotos.forEach((photo, idx) => {
        const card = document.createElement('div');
        card.className = 'hanging-polaroid';
        card.style.setProperty('--sway-idx', idx);
        card.dataset.index = idx;
        card.title = 'Bấm vào để xem ảnh phóng to!';

        const img = document.createElement('img');
        img.src = photo.src;
        img.alt = `Kỷ niệm #${idx + 1}`;

        const label = document.createElement('div');
        label.className = 'hanging-polaroid-label';
        label.textContent = `Kỷ niệm #${idx + 1} ❤️`;

        card.appendChild(img);
        card.appendChild(label);

        card.addEventListener('click', (e) => {
            e.stopPropagation();
            openPhotoLightbox(idx);
        });

        if (idx < 5) {
            row1.appendChild(card);
        } else {
            row2.appendChild(card);
        }
    });
}
window.addEventListener('DOMContentLoaded', initPolaroidWall);

// 13. Slideshow ảnh tự động
let slideshowInterval = null;
let currentSlideshowIdx = 0;

function highlightSlideshowPolaroid(idx) {
    const allCards = document.querySelectorAll('.hanging-polaroid');
    allCards.forEach((c, i) => {
        c.classList.toggle('is-spotlight', i === idx);
    });

    const activeCard = allCards[idx];
    if (activeCard) {
        const rect = activeCard.getBoundingClientRect();
        spawnCelebrationBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 12);
    }

    const textContainer2 = document.querySelector('.text-container.text-inside-card');
    if (textContainer2 && couplePhotos[idx]) {
        renderGreetingText(textContainer2, couplePhotos[idx].caption);
    }
}

function stopPhotoSlideshow() {
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }
    const btn = document.getElementById('slideshowToggleBtn');
    if (btn) {
        btn.classList.remove('is-active');
        btn.textContent = '▶️ Chạy Slideshow Kỷ Niệm';
    }
    document.querySelectorAll('.hanging-polaroid').forEach(c => c.classList.remove('is-spotlight'));
}

function togglePhotoSlideshow(event) {
    if (event) event.stopPropagation();
    const btn = document.getElementById('slideshowToggleBtn');

    if (slideshowInterval) {
        stopPhotoSlideshow();
        if (window.renderText) window.renderText();
        return;
    }

    playMagicChime();
    if (btn) {
        btn.classList.add('is-active');
        btn.textContent = '⏸️ Dừng Slideshow';
    }

    highlightSlideshowPolaroid(currentSlideshowIdx);
    slideshowInterval = setInterval(() => {
        currentSlideshowIdx = (currentSlideshowIdx + 1) % couplePhotos.length;
        highlightSlideshowPolaroid(currentSlideshowIdx);
    }, 3400);
}

// 14. Hiệu ứng Bung Tim & Sao
function spawnCelebrationBurst(originX, originY, count = 24) {
    const symbols = ['❤️', '💖', '✨', '⭐', '🎄', '❄️', '🎁'];
    const cx = originX ?? window.innerWidth / 2;
    const cy = originY ?? window.innerHeight * 0.42;

    for (let i = 0; i < count; i++) {
        const el = document.createElement('span');
        el.className = 'burst-particle';
        el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        el.style.left = `${cx}px`;
        el.style.top = `${cy}px`;
        el.style.fontSize = `${Math.random() * 14 + 14}px`;
        document.body.appendChild(el);

        const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
        const distance = Math.random() * 150 + 60;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance - 30;
        const rot = Math.random() * 360 - 180;

        const anim = el.animate([
            { transform: 'translate(-50%, -50%) scale(0.3) rotate(0deg)', opacity: 1 },
            { transform: `translate(calc(-50% + ${tx * 0.7}px), calc(-50% + ${ty * 0.7}px)) scale(1.2) rotate(${rot * 0.6}deg)`, opacity: 1, offset: 0.55 },
            { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty + 45}px)) scale(0.4) rotate(${rot}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 600 + 850,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'forwards'
        });

        anim.onfinish = () => el.remove();
    }
}

// 15. Điều khiển Mở Kỷ Niệm / Quay lại Cây thông (FIX BUG .is-revealed)
let polaroidRevealTimers = [];

function viewCard() {
    const memoriesStage = document.getElementById('memoriesStage');
    const noelTree = document.querySelector('.noel-tree');
    const viewCardBtn = document.querySelector('.view-card-btn');
    const textOutsideCard = document.querySelector('.text-outside-card');
    const backTreeBtn = document.getElementById('backTreeBtn');

    if (memoriesStage) {
        memoriesStage.classList.add('is-visible');
    }

    if (backTreeBtn) {
        backTreeBtn.classList.add('is-visible');
    }

    if (noelTree) {
        noelTree.style.opacity = '0.18';
        noelTree.style.filter = 'blur(3px)';
        noelTree.style.pointerEvents = 'none';
        if (window.gsap) {
            gsap.globalTimeline.pause();
        }
    }

    if (viewCardBtn) {
        viewCardBtn.style.visibility = 'hidden';
        viewCardBtn.style.opacity = '0';
        viewCardBtn.style.pointerEvents = 'none';
    }

    if (textOutsideCard) {
        textOutsideCard.style.visibility = 'hidden';
        textOutsideCard.style.opacity = '0';
        textOutsideCard.style.pointerEvents = 'none';
    }

    if (typeof isFogActive !== 'undefined' && isFogActive && typeof closeFoggyGlass === 'function') {
        closeFoggyGlass();
    }

    playMagicChime();
    spawnCelebrationBurst(window.innerWidth / 2, window.innerHeight * 0.38, 26);

    // Kích hoạt stagger xuất hiện cho 10 ảnh Polaroid & Bức thư
    polaroidRevealTimers.forEach(clearTimeout);
    polaroidRevealTimers = [];

    const cards = document.querySelectorAll('.hanging-polaroid');
    cards.forEach((card, idx) => {
        const timer = setTimeout(() => {
            card.classList.add('is-revealed');
        }, 120 + idx * 100);
        polaroidRevealTimers.push(timer);
    });

    const letterCard = document.querySelector('.love-letter-card');
    if (letterCard) {
        const letterTimer = setTimeout(() => {
            letterCard.classList.add('is-revealed');
        }, 120 + cards.length * 100 + 150);
        polaroidRevealTimers.push(letterTimer);
    }

    setTimeout(() => {
        if (window.renderText) {
            window.renderText();
        }
    }, 350);
}

function backToTree() {
    const memoriesStage = document.getElementById('memoriesStage');
    const noelTree = document.querySelector('.noel-tree');
    const viewCardBtn = document.querySelector('.view-card-btn');
    const textOutsideCard = document.querySelector('.text-outside-card');
    const backTreeBtn = document.getElementById('backTreeBtn');

    stopPhotoSlideshow();

    polaroidRevealTimers.forEach(clearTimeout);
    polaroidRevealTimers = [];

    // Ẩn lại các ảnh và bức thư để lần bấm sau tiếp tục có hiệu ứng bung mở
    document.querySelectorAll('.hanging-polaroid').forEach(c => c.classList.remove('is-revealed', 'is-spotlight'));
    const letterCard = document.querySelector('.love-letter-card');
    if (letterCard) letterCard.classList.remove('is-revealed');

    if (memoriesStage) {
        memoriesStage.classList.remove('is-visible');
    }

    if (backTreeBtn) {
        backTreeBtn.classList.remove('is-visible');
    }

    if (noelTree) {
        noelTree.style.visibility = 'visible';
        noelTree.style.opacity = '1';
        noelTree.style.filter = 'none';
        noelTree.style.pointerEvents = 'auto';
        if (window.gsap) {
            gsap.globalTimeline.play();
        }
    }

    if (viewCardBtn) {
        viewCardBtn.style.visibility = 'visible';
        viewCardBtn.style.opacity = '1';
        viewCardBtn.style.pointerEvents = 'auto';
        viewCardBtn.style.transform = 'scale(1)';
    }

    if (textOutsideCard) {
        textOutsideCard.style.visibility = 'visible';
        textOutsideCard.style.opacity = '1';
        textOutsideCard.style.pointerEvents = 'auto';
    }
}

// 16. Modal Hộp quà bí mật & Vé quà tặng
function openGiftModal(event) {
    if (event) event.stopPropagation();
    const modal = document.getElementById('giftModalOverlay');
    if (modal) {
        modal.classList.add('is-open');
        playMagicChime();
        spawnCelebrationBurst(window.innerWidth / 2, window.innerHeight / 2, 30);
    }
}

function closeGiftModal(event) {
    if (event) event.stopPropagation();
    const modal = document.getElementById('giftModalOverlay');
    if (modal) {
        modal.classList.remove('is-open');
    }
}

const giftVouchers = [
    '🎟️ 1 Vé đi ăn đồ nướng / lẩu nóng hổi bất kỳ lúc nào em muốn!',
    '🧋 1 Vé uống trà sữa / cacao nóng full topping miễn phí 100%!',
    '🎬 1 Vé đi xem phim + bắp nước ngọt ngào đêm Giáng sinh!',
    '🤗 1 Vé nhận ngay một cái ôm thật chặt và ấm áp mùa đông này!',
    '🎁 1 Điều ước bất kỳ: Em nói gì anh cũng chiều hết nha!'
];
let currentVoucherIdx = 0;

function shuffleGiftVoucher() {
    currentVoucherIdx = (currentVoucherIdx + 1) % giftVouchers.length;
    const voucherEl = document.getElementById('giftVoucherText');
    if (voucherEl) {
        voucherEl.textContent = giftVouchers[currentVoucherIdx];
    }
    playMagicChime();
    spawnCelebrationBurst(window.innerWidth / 2, window.innerHeight / 2, 16);
}

let currentPolaroidIdx = 0;
function cyclePolaroid() {
    currentPolaroidIdx = (currentPolaroidIdx + 1) % couplePhotos.length;
    const imgEl = document.getElementById('polaroidImg');
    const captionEl = document.getElementById('polaroidCaption');
    if (imgEl) {
        imgEl.src = couplePhotos[currentPolaroidIdx].src;
    }
    if (captionEl) {
        captionEl.textContent = `Kỷ niệm #${currentPolaroidIdx + 1} ❤️ (Bấm để đổi ảnh)`;
    }
    playMagicChime();
}

// 17. Người Tuyết Tương Tác
const snowmanQuotes = [
    `Trời lạnh rồi, ${recipientName} nhớ mặc áo ấm và giữ gìn sức khỏe nha! 🧣❤️`,
    `Ông già Noel bảo năm nay ${recipientName} chính là món quà tuyệt vời nhất! 🎁✨`,
    `Đông này vẫn giống đông xưa, vẫn đi xe máy, vẫn thừa yên sau! ⛄💖`,
    `Bấm vào tớ là cả năm tới gặp toàn may mắn và niềm vui đó nha! 🍀❄️`,
    `Chúc ${recipientName} một mùa Giáng sinh ngọt ngào hơn cả kẹo gậy! 🍬🎄`,
    `Nhớ mở thiệp và bấm vào hộp quà bí mật để nhận vé hẹn hò nhé! 🎟️❤️`
];
let snowmanQuoteIdx = 0;
let snowmanBubbleTimer = null;

function pokeSnowman(event) {
    if (event) event.stopPropagation();
    const btn = document.getElementById('snowmanBtn');
    const bubble = document.getElementById('snowmanBubble');

    if (btn) {
        btn.classList.remove('is-jumping');
        void btn.offsetWidth;
        btn.classList.add('is-jumping');
    }

    if (bubble) {
        bubble.textContent = snowmanQuotes[snowmanQuoteIdx];
        snowmanQuoteIdx = (snowmanQuoteIdx + 1) % snowmanQuotes.length;
        bubble.classList.add('is-visible');
        clearTimeout(snowmanBubbleTimer);
        snowmanBubbleTimer = setTimeout(() => {
            bubble.classList.remove('is-visible');
        }, 5500);
    }

    playMagicChime();
    const rect = btn ? btn.getBoundingClientRect() : { left: 50, top: window.innerHeight - 60 };
    spawnCelebrationBurst(rect.left + 35, rect.top + 20, 14);
}

setTimeout(() => {
    const bubble = document.getElementById('snowmanBubble');
    if (bubble) {
        bubble.classList.add('is-visible');
        snowmanBubbleTimer = setTimeout(() => bubble.classList.remove('is-visible'), 5000);
    }
}, 4500);

// 18. Gửi Điều Ước Giáng Sinh
function openWishModal(event) {
    if (event) event.stopPropagation();
    const modal = document.getElementById('wishModalOverlay');
    if (modal) {
        modal.classList.add('is-open');
        const input = document.getElementById('wishInput');
        if (input) setTimeout(() => input.focus(), 100);
    }
}

function closeWishModal(event) {
    if (event) event.stopPropagation();
    const modal = document.getElementById('wishModalOverlay');
    if (modal) {
        modal.classList.remove('is-open');
    }
}

function fillWishPreset(text) {
    const input = document.getElementById('wishInput');
    if (input) {
        input.value = text;
        input.focus();
    }
}

function sendSkyWish() {
    const input = document.getElementById('wishInput');
    const wishText = (input && input.value.trim()) ? input.value.trim() : 'Giáng sinh an lành & tràn ngập yêu thương ❤️';
    if (input) input.value = '';
    closeWishModal();

    playMagicChime();

    const lantern = document.createElement('div');
    lantern.className = 'sky-wish-lantern';
    const startLeft = Math.random() * 44 + 28;
    lantern.style.left = `${startLeft}%`;

    const iconSpan = document.createElement('div');
    iconSpan.className = 'lantern-icon';
    iconSpan.textContent = '🏮✨';

    const textSpan = document.createElement('div');
    textSpan.className = 'lantern-text';
    textSpan.textContent = wishText;

    lantern.appendChild(iconSpan);
    lantern.appendChild(textSpan);
    document.body.appendChild(lantern);

    spawnCelebrationBurst(window.innerWidth * (startLeft / 100), window.innerHeight - 80, 20);

    const swayX = Math.random() * 70 - 35;
    const anim = lantern.animate([
        { transform: 'translate(-50%, 0) scale(0.75)', opacity: 0 },
        { transform: `translate(calc(-50% + ${swayX * 0.4}px), -25vh) scale(1)`, opacity: 1, offset: 0.18 },
        { transform: `translate(calc(-50% - ${swayX * 0.4}px), -65vh) scale(1)`, opacity: 0.98, offset: 0.72 },
        { transform: `translate(calc(-50% + ${swayX}px), -110vh) scale(0.7)`, opacity: 0 }
    ], {
        duration: 14500,
        easing: 'ease-in-out',
        fill: 'forwards'
    });

    anim.onfinish = () => lantern.remove();
}

// 19. Sao Băng Vụt Ngang Bầu Trời
function spawnShootingStar() {
    if (document.hidden) return;
    const star = document.createElement('div');
    star.className = 'shooting-star';
    const startX = Math.random() * (window.innerWidth * 0.65) + window.innerWidth * 0.2;
    const startY = Math.random() * (window.innerHeight * 0.28) + 20;
    star.style.left = `${startX}px`;
    star.style.top = `${startY}px`;
    document.body.appendChild(star);

    const anim = star.animate([
        { transform: 'rotate(-145deg) translateX(0) scaleX(0.2)', opacity: 0 },
        { transform: 'rotate(-145deg) translateX(80px) scaleX(1)', opacity: 1, offset: 0.25 },
        { transform: 'rotate(-145deg) translateX(360px) scaleX(0.3)', opacity: 0 }
    ], {
        duration: 1300,
        easing: 'ease-out',
        fill: 'forwards'
    });

    anim.onfinish = () => star.remove();
}
setInterval(spawnShootingStar, 6500);

// 20. Đếm Ngược Giáng Sinh
function updateChristmasCountdown() {
    const timerEl = document.getElementById('countdownTimer');
    if (!timerEl) return;

    const now = new Date();
    const year = now.getFullYear();
    let christmas = new Date(year, 11, 25, 0, 0, 0);

    if (now.getMonth() === 11 && now.getDate() === 25) {
        timerEl.textContent = 'Merry Christmas! 🎅';
        return;
    }

    if (now > christmas) {
        christmas = new Date(year + 1, 11, 25, 0, 0, 0);
    }

    const diff = christmas - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
    const mins = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
    const secs = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');

    timerEl.textContent = `${days} ngày ${hours}:${mins}:${secs}`;
}
updateChristmasCountdown();
setInterval(updateChristmasCountdown, 1000);

// 21. Vệt Sao Lấp Lánh Theo Chuột / Cảm Ứng
let lastSparkleTime = 0;
window.addEventListener('pointermove', (e) => {
    const now = Date.now();
    if (now - lastSparkleTime < 50) return;
    lastSparkleTime = now;

    const sparkle = document.createElement('span');
    sparkle.className = 'cursor-sparkle';
    const icons = ['✨', '⭐', '❄️', '💫'];
    sparkle.textContent = icons[Math.floor(Math.random() * icons.length)];
    sparkle.style.left = `${e.clientX}px`;
    sparkle.style.top = `${e.clientY}px`;
    sparkle.style.fontSize = `${Math.random() * 8 + 10}px`;
    document.body.appendChild(sparkle);

    const driftX = Math.random() * 26 - 13;
    const driftY = Math.random() * 24 + 10;

    const anim = sparkle.animate([
        { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 0.95 },
        { transform: `translate(calc(-50% + ${driftX}px), calc(-50% + ${driftY}px)) scale(0.2) rotate(90deg)`, opacity: 0 }
    ], {
        duration: 650,
        easing: 'ease-out',
        fill: 'forwards'
    });

    anim.onfinish = () => sparkle.remove();
});

// 22. Quản Lý Nhạc Nền (Background Music) & Đĩa Than Cổ Điển
const audioElement = document.getElementById('audioElement');
const musicPlayerWidget = document.getElementById('musicPlayerWidget');
const musicToggleBtn = document.getElementById('musicToggleBtn');
const musicLabel = document.getElementById('musicLabel');
const volumeSlider = document.getElementById('volumeSlider');
const volIcon = document.getElementById('volIcon');

let noteInterval = null;
let lastVolume = 0.25;

function syncMusicUI() {
    if (!audioElement) return;
    const isPlaying = !audioElement.paused && !audioElement.muted && audioElement.volume > 0;
    if (musicPlayerWidget) musicPlayerWidget.classList.toggle('is-playing', isPlaying);
    if (musicToggleBtn) musicToggleBtn.classList.toggle('is-playing', isPlaying);
    if (musicLabel) musicLabel.textContent = isPlaying ? 'Đang phát...' : 'Bật nhạc';

    if (isPlaying) {
        startFloatingMusicNotes();
    } else {
        stopFloatingMusicNotes();
    }
    updateVolumeIcon();
}

function updateVolumeIcon() {
    if (!audioElement || !volIcon) return;
    if (audioElement.muted || audioElement.volume === 0) {
        volIcon.textContent = '🔇';
    } else if (audioElement.volume < 0.5) {
        volIcon.textContent = '🔉';
    } else {
        volIcon.textContent = '🔊';
    }
}

function changeVolume(val, event) {
    if (event) event.stopPropagation();
    if (!audioElement) return;
    const volume = parseFloat(val);
    try {
        audioElement.volume = volume;
        audioElement.muted = (volume === 0);
    } catch (_) {}
    if (volume > 0) lastVolume = volume;
    syncMusicUI();
}

function toggleMute(event) {
    if (event) event.stopPropagation();
    if (!audioElement) return;
    if (audioElement.muted || audioElement.volume === 0) {
        audioElement.muted = false;
        try { audioElement.volume = lastVolume || 0.25; } catch (_) {}
        if (volumeSlider) volumeSlider.value = lastVolume || 0.25;
    } else {
        audioElement.muted = true;
        if (volumeSlider) volumeSlider.value = 0;
    }
    syncMusicUI();
    playMagicChime();
}

function toggleMusic(event) {
    if (event) event.stopPropagation();
    if (!audioElement) return;
    if (audioElement.paused) {
        audioElement.muted = false;
        try { audioElement.volume = lastVolume || 0.25; } catch (_) {}
        if (volumeSlider) volumeSlider.value = lastVolume || 0.25;
        audioElement.play().then(syncMusicUI).catch(() => {});
        spawnCelebrationBurst(window.innerWidth - 65, 50, 16);
    } else {
        audioElement.pause();
        syncMusicUI();
    }
}

function startFloatingMusicNotes() {
    if (noteInterval) return;
    noteInterval = setInterval(spawnFloatingMusicNote, 1500);
}

function stopFloatingMusicNotes() {
    if (noteInterval) {
        clearInterval(noteInterval);
        noteInterval = null;
    }
}

function spawnFloatingMusicNote() {
    if (document.hidden) return;
    const widget = document.getElementById('musicPlayerWidget');
    if (!widget) return;
    const rect = widget.getBoundingClientRect();

    const note = document.createElement('span');
    note.className = 'floating-music-note';
    const icons = ['🎵', '🎶', '🎼', '✨', '⭐'];
    note.textContent = icons[Math.floor(Math.random() * icons.length)];

    const startX = rect.left + 20 + (Math.random() * 14 - 7);
    const startY = rect.top + 16;
    note.style.left = startX + 'px';
    note.style.top = startY + 'px';
    document.body.appendChild(note);

    const driftX = Math.random() * 45 - 22;
    const driftY = -(Math.random() * 55 + 40);
    const rot = Math.random() * 60 - 30;

    const anim = note.animate([
        { transform: 'translate(0, 0) scale(0.6) rotate(0deg)', opacity: 0 },
        { transform: `translate(${driftX * 0.5}px, ${driftY * 0.5}px) scale(1.15) rotate(${rot * 0.5}deg)`, opacity: 0.95, offset: 0.4 },
        { transform: `translate(${driftX}px, ${driftY}px) scale(0.6) rotate(${rot}deg)`, opacity: 0 }
    ], {
        duration: 1700,
        easing: 'ease-out',
        fill: 'forwards'
    });

    anim.onfinish = () => note.remove();
}

if (audioElement) {
    audioElement.addEventListener('play', syncMusicUI);
    audioElement.addEventListener('pause', syncMusicUI);
}

// Tự động phát khi có tương tác đầu tiên của người dùng (chạm lau kính hoặc click)
let audioUnlocked = false;
function unlockAudioOnFirstInteraction() {
    if (audioUnlocked) return;
    audioUnlocked = true;
    getSharedAudioContext();
    if (audioElement && audioElement.paused) {
        try { audioElement.volume = 0.25; } catch (_) {}
        audioElement.muted = false;
        audioElement.play().then(syncMusicUI).catch(() => {});
    }
}
document.addEventListener('pointerdown', function(e) {
    if (e.target.closest('#musicPlayerWidget')) return;
    unlockAudioOnFirstInteraction();
}, { once: true });
document.addEventListener('click', function(e) {
    if (e.target.closest('#musicPlayerWidget')) return;
    unlockAudioOnFirstInteraction();
}, { once: true });

// 23. Hiệu ứng Cửa sổ đọng sương & Lau kính mùa đông (Foggy Frosted Glass)
let isFogActive = false;
let isFogDrawing = false;
let fogLastX = 0;
let fogLastY = 0;
let hasWipedEnough = false;
let lastSqueakTime = 0;
let fogCanvas = null;
let fogCtx = null;

function initFoggyGlass() {
    fogCanvas = document.getElementById('foggyGlassCanvas');
    if (!fogCanvas) return;
    fogCtx = fogCanvas.getContext('2d');

    window.addEventListener('resize', () => {
        if (isFogActive) {
            renderFrostTexture();
        }
    });

    fogCanvas.addEventListener('pointerdown', handleFogPointerDown);
    window.addEventListener('pointermove', handleFogPointerMove);
    window.addEventListener('pointerup', handleFogPointerUp);
    window.addEventListener('pointercancel', handleFogPointerUp);

    // Mở lớp sương mù phủ kín màn hình ngay khi tải trang
    openFoggyGlass(false);
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initFoggyGlass);
} else {
    initFoggyGlass();
}

function renderFrostTexture() {
    if (!fogCanvas || !fogCtx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    fogCanvas.width = w * dpr;
    fogCanvas.height = h * dpr;
    fogCanvas.style.width = w + 'px';
    fogCanvas.style.height = h + 'px';

    fogCtx.setTransform(1, 0, 0, 1, 0, 0);
    fogCtx.scale(dpr, dpr);

    fogCtx.globalCompositeOperation = 'source-over';

    // 1. Lớp phủ sương mờ băng giá
    const grad = fogCtx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(215, 235, 255, 0.88)');
    grad.addColorStop(0.5, 'rgba(230, 245, 255, 0.84)');
    grad.addColorStop(1, 'rgba(205, 230, 255, 0.90)');
    fogCtx.fillStyle = grad;
    fogCtx.fillRect(0, 0, w, h);

    // 2. Viền đóng băng ở 4 góc và cạnh cửa sổ (Vignette)
    const vignette = fogCtx.createRadialGradient(
        w / 2, h / 2, Math.min(w, h) * 0.3,
        w / 2, h / 2, Math.max(w, h) * 0.72
    );
    vignette.addColorStop(0, 'rgba(255, 255, 255, 0)');
    vignette.addColorStop(0.65, 'rgba(240, 248, 255, 0.28)');
    vignette.addColorStop(1, 'rgba(205, 232, 255, 0.85)');
    fogCtx.fillStyle = vignette;
    fogCtx.fillRect(0, 0, w, h);

    // 3. Hạt tinh thể tuyết / đọng sương li ti
    fogCtx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    for (let i = 0; i < 400; i++) {
        const rx = Math.random() * w;
        const ry = Math.random() * h;
        const r = Math.random() * 2.2 + 0.6;
        fogCtx.beginPath();
        fogCtx.arc(rx, ry, r, 0, Math.PI * 2);
        fogCtx.fill();
    }

    // 4. Khắc nhẹ hình trái tim mờ ảo ở giữa kính
    drawGhostHeart(w / 2, h * 0.38);

    hasWipedEnough = false;
}

function drawGhostHeart(cx, cy) {
    if (!fogCtx) return;
    fogCtx.save();
    fogCtx.globalCompositeOperation = 'destination-out';
    fogCtx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    fogCtx.lineWidth = 14;
    fogCtx.lineCap = 'round';
    fogCtx.lineJoin = 'round';

    fogCtx.beginPath();
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.12;
    fogCtx.moveTo(cx, cy + size * 0.7);
    fogCtx.bezierCurveTo(cx - size * 1.2, cy - size * 0.4, cx - size * 0.6, cy - size * 1.1, cx, cy - size * 0.4);
    fogCtx.bezierCurveTo(cx + size * 0.6, cy - size * 1.1, cx + size * 1.2, cy - size * 0.4, cx, cy + size * 0.7);
    fogCtx.stroke();
    fogCtx.restore();
}

function wipeFogAt(x, y) {
    if (!fogCtx) return;
    fogCtx.globalCompositeOperation = 'destination-out';
    const isMobile = window.innerWidth < 600;
    const radius = isMobile ? 38 : 46;

    const eraserGrad = fogCtx.createRadialGradient(x, y, radius * 0.25, x, y, radius);
    eraserGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
    eraserGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.9)');
    eraserGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    fogCtx.fillStyle = eraserGrad;
    fogCtx.beginPath();
    fogCtx.arc(x, y, radius, 0, Math.PI * 2);
    fogCtx.fill();

    if (Math.random() < 0.2) {
        spawnWaterDroplet(x, y);
    }

    if (Date.now() - lastSqueakTime > 200) {
        lastSqueakTime = Date.now();
        playWipeSqueak();
    }
}

function wipeFogLine(x1, y1, x2, y2) {
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const step = 8;
    const steps = Math.max(1, Math.floor(dist / step));
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        wipeFogAt(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t);
    }
}

function handleFogPointerDown(e) {
    if (!isFogActive) return;
    isFogDrawing = true;
    fogLastX = e.clientX;
    fogLastY = e.clientY;
    wipeFogAt(fogLastX, fogLastY);

    const hint = document.getElementById('fogHintBadge');
    if (hint && hint.classList.contains('is-visible')) {
        hint.classList.remove('is-visible');
    }
}

function handleFogPointerMove(e) {
    if (!isFogActive || !isFogDrawing) return;
    wipeFogLine(fogLastX, fogLastY, e.clientX, e.clientY);
    fogLastX = e.clientX;
    fogLastY = e.clientY;

    if (!hasWipedEnough && Math.random() < 0.08) {
        checkWipedPercentage();
    }
}

function handleFogPointerUp() {
    isFogDrawing = false;
    if (isFogActive && !hasWipedEnough) {
        checkWipedPercentage();
    }
}

// Kiểm tra xem đã lau sạch bao nhiêu % diện tích
function checkWipedPercentage() {
    if (!fogCanvas || !fogCtx || hasWipedEnough) return;
    const w = fogCanvas.width;
    const h = fogCanvas.height;

    const sampleStep = 32;
    const cols = Math.floor(w / sampleStep);
    const rows = Math.floor(h / sampleStep);
    let clearPoints = 0;
    let totalPoints = cols * rows;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const pixel = fogCtx.getImageData(c * sampleStep, r * sampleStep, 1, 1).data;
            if (pixel[3] < 50) {
                clearPoints++;
            }
        }
    }

    const ratio = clearPoints / totalPoints;
    if (ratio > 0.52) {
        hasWipedEnough = true;
        playMagicChime();
        spawnCelebrationBurst(window.innerWidth / 2, window.innerHeight * 0.45, 30);

        const bubble = document.getElementById('snowmanBubble');
        if (bubble) {
            bubble.textContent = `Cửa sổ đã sáng trong rồi! Chúc ${recipientName} một mùa đông thật ấm áp và hạnh phúc nhé! ❄️❤️`;
            bubble.classList.add('is-visible');
            setTimeout(() => bubble.classList.remove('is-visible'), 6000);
        }
    }
}

// Âm thanh lau kính sột soạt êm dịu
function playWipeSqueak() {
    try {
        const ctx = getSharedAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(700 + Math.random() * 400, now);
        osc.frequency.exponentialRampToValueAtTime(1300 + Math.random() * 300, now + 0.07);
        gain.gain.setValueAtTime(0.012, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
    } catch (_) {}
}

// Giọt nước đọng trượt xuống
function spawnWaterDroplet(x, y) {
    const droplet = document.createElement('div');
    droplet.className = 'water-droplet-sparkle';
    const size = Math.random() * 5 + 3;
    droplet.style.width = size + 'px';
    droplet.style.height = (size * 1.4) + 'px';
    droplet.style.left = x + 'px';
    droplet.style.top = y + 'px';
    document.body.appendChild(droplet);

    const dripDist = Math.random() * 40 + 20;
    const anim = droplet.animate([
        { transform: 'translate(-50%, 0) scale(1)', opacity: 0.9 },
        { transform: `translate(-50%, ${dripDist}px) scale(0.6, 1.2)`, opacity: 0 }
    ], {
        duration: Math.random() * 800 + 700,
        easing: 'ease-in',
        fill: 'forwards'
    });

    anim.onfinish = () => droplet.remove();
}

function toggleFoggyGlass(event) {
    if (event) event.stopPropagation();
    if (isFogActive) {
        closeFoggyGlass();
    } else {
        openFoggyGlass();
    }
}

function openFoggyGlass(playChime = true) {
    isFogActive = true;
    const canvas = document.getElementById('foggyGlassCanvas');
    const badge = document.getElementById('fogHintBadge');
    const actionsBar = document.getElementById('fogActionsBar');
    const pill = document.getElementById('fogPillText');

    renderFrostTexture();

    if (canvas) canvas.classList.add('is-active');
    if (badge) badge.classList.add('is-visible');
    if (actionsBar) actionsBar.classList.add('is-visible');
    if (pill) pill.textContent = 'Đang bật lau kính ❄️';

    if (playChime) {
        playMagicChime();
    }
    setTimeout(() => {
        if (badge && isFogActive) badge.classList.remove('is-visible');
    }, 5500);
}

function refrostGlass(event) {
    if (event) event.stopPropagation();
    playMagicChime();
    renderFrostTexture();
    const badge = document.getElementById('fogHintBadge');
    if (badge) {
        badge.textContent = 'Đã phủ sương mới! Bạn hãy lau lại kính nhé ❄️';
        badge.classList.add('is-visible');
        setTimeout(() => badge.classList.remove('is-visible'), 3500);
    }
}

function clearFogGlass(event) {
    if (event) event.stopPropagation();
    if (!fogCanvas || !fogCtx) return;
    playMagicChime();
    spawnCelebrationBurst(window.innerWidth / 2, window.innerHeight * 0.45, 26);
    fogCtx.clearRect(0, 0, fogCanvas.width, fogCanvas.height);
    hasWipedEnough = true;
}

function closeFoggyGlass(event) {
    if (event) event.stopPropagation();
    isFogActive = false;
    isFogDrawing = false;
    const canvas = document.getElementById('foggyGlassCanvas');
    const badge = document.getElementById('fogHintBadge');
    const actionsBar = document.getElementById('fogActionsBar');
    const pill = document.getElementById('fogPillText');

    if (canvas) canvas.classList.remove('is-active');
    if (badge) badge.classList.remove('is-visible');
    if (actionsBar) actionsBar.classList.remove('is-visible');
    if (pill) pill.textContent = 'Lau kính đọng sương';
}
