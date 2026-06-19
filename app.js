const BIRTHDAY_TIME = new Date("2026-08-03T00:00:00+07:00");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const app = document.querySelector(".app");
const twinkleField = document.querySelector(".twinkle-field");
const ambientPlanets = document.querySelector("#ambientPlanets");
const countdown = document.querySelector("#countdown");
const journeyCountdown = document.querySelector("#journeyCountdown");
const toast = document.querySelector("#toast");
const drawer = document.querySelector("#memoryDrawer");
const drawerPhoto = document.querySelector("#drawerPhoto");
const drawerEyebrow = document.querySelector("#drawerEyebrow");
const drawerTitle = document.querySelector("#drawerTitle");
const drawerText = document.querySelector("#drawerText");
const drawerAction = document.querySelector("#drawerAction");
const drawerActionLabel = drawerAction.querySelector(".action-label");
const albumPage = document.querySelector("#albumPage");
const albumPhoto = document.querySelector("#albumPhoto");
const albumKicker = document.querySelector("#albumKicker");
const albumTitle = document.querySelector("#albumTitle");
const albumCaption = document.querySelector("#albumCaption");
const albumPrev = document.querySelector("#albumPrev");
const albumNext = document.querySelector("#albumNext");
const albumDots = document.querySelector("#albumDots");
const albumThumbs = document.querySelector("#albumThumbs");
const canvas = document.querySelector("#confettiCanvas");
const ctx = canvas.getContext("2d");
const pieces = [];
const navLinks = [...document.querySelectorAll(".bottom-nav a")];
let animationFrame = null;
let toastTimer = null;
let activeMemory = null;
let previousCountdown = {};
let lastPopAt = 0;
let activeAlbumIndex = 0;

const assetIcons = {
  planetOne: "assets/icons/1.png",
  planetTwo: "assets/icons/2.png",
  planetThree: "assets/icons/3.png",
  planetFour: "assets/icons/4.png",
  star: "assets/icons/5.png"
};
const memoryEffects = {
  birth: [assetIcons.star, assetIcons.star, assetIcons.planetOne],
  one: [assetIcons.planetOne, assetIcons.star, assetIcons.planetThree],
  two: [assetIcons.planetTwo, assetIcons.planetFour, assetIcons.star],
  three: [assetIcons.planetThree, assetIcons.planetOne, assetIcons.star],
  four: [assetIcons.planetFour, assetIcons.star, assetIcons.star]
};
const familyPhotos = ["assets/memories/family.jpg", "assets/memories/family.png", "assets/memories/family.webp"];

const albumPages = [
  {
    kicker: "Trang gia đình",
    title: "Cả nhà bên Kem",
    caption: "Một khung hình ấm áp để giữ lại tình yêu của cả nhà.",
    photos: familyPhotos
  },
  {
    kicker: "Trang chào đời",
    title: "Chào đời",
    caption: "Ngày Kem đáp xuống Trái Đất, cả nhà có thêm một vì sao nhỏ.",
    photos: ["assets/memories/chao-doi.jpg", "assets/memories/chao-doi.png", "assets/memories/chao-doi.webp"]
  },
  {
    kicker: "Trang đầu đời",
    title: "Mắt tròn khám phá",
    caption: "Những bước đầu tiên và nụ cười làm cả nhà tan chảy.",
    photos: ["assets/memories/1-tuoi.jpg", "assets/memories/1-tuoi.png", "assets/memories/1-tuoi.webp"]
  },
  {
    kicker: "Trang yêu thương",
    title: "Cười vang cả nhà",
    caption: "Những trò vui nhỏ xíu làm ngày nào cũng rộn ràng.",
    photos: ["assets/memories/2-tuoi.jpg", "assets/memories/2-tuoi.png", "assets/memories/2-tuoi.webp"]
  },
  {
    kicker: "Trang khám phá",
    title: "Hỏi cả bầu trời",
    caption: "Tuổi tò mò, chạy nhảy và gom thêm thật nhiều ký ức xinh.",
    photos: ["assets/memories/3-tuoi.jpg", "assets/memories/3-tuoi.png", "assets/memories/3-tuoi.webp"]
  },
  {
    kicker: "Trang sinh nhật",
    title: "Một trang sinh nhật",
    caption: "Trang nhỏ chờ thêm những tấm hình mới của Kem.",
    photos: ["assets/memories/photo-03082024-alt.jpg", "assets/memories/photo-03022026.jpg", "assets/memories/4-tuoi.jpg"]
  }
];

const memories = {
  birth: {
    eyebrow: "Trạm đầu tiên",
    title: "Chào đời",
    icon: assetIcons.star,
    photos: ["assets/memories/chao-doi.jpg", "assets/memories/chao-doi.png", "assets/memories/chao-doi.webp"],
    text: "Ngày Kem đáp xuống Trái Đất, cả nhà có thêm một vì sao nhỏ để yêu thương.",
    colors: ["#ffe867", "#ff7a59"]
  },
  one: {
    eyebrow: "Mặt trăng nhỏ",
    title: "1 tuổi",
    icon: assetIcons.planetOne,
    photos: ["assets/memories/1-tuoi.jpg", "assets/memories/1-tuoi.png", "assets/memories/1-tuoi.webp"],
    text: "Những bước khám phá đầu tiên, đôi mắt tròn xoe và nụ cười làm cả nhà tan chảy.",
    colors: ["#f7f7ff", "#7fc7ff"]
  },
  two: {
    eyebrow: "Hành tinh cam",
    title: "2 tuổi",
    icon: assetIcons.planetTwo,
    photos: ["assets/memories/2-tuoi.jpg", "assets/memories/2-tuoi.png", "assets/memories/2-tuoi.webp"],
    text: "Kem bắt đầu có thật nhiều trò vui, cười vang và làm mọi ngày trong nhà rộn ràng hơn.",
    colors: ["#ffb453", "#ff6f59"]
  },
  three: {
    eyebrow: "Trái Đất xanh",
    title: "3 tuổi",
    icon: assetIcons.planetThree,
    photos: ["assets/memories/3-tuoi.jpg", "assets/memories/3-tuoi.png", "assets/memories/3-tuoi.webp"],
    text: "Một tuổi đầy câu hỏi dễ thương, chạy nhảy nhiều hơn và tò mò về cả bầu trời.",
    colors: ["#64e7ff", "#75d66f"]
  },
  four: {
    eyebrow: "Cổng sinh nhật",
    title: "4 tuổi",
    icon: assetIcons.planetFour,
    photos: ["assets/memories/4-tuoi.jpg", "assets/memories/4-tuoi.png", "assets/memories/4-tuoi.webp"],
    text: "Hộp quà tuổi 4 vẫn đang chờ mở. Khi tới sinh nhật, nơi này sẽ bừng sáng thành lời chúc mừng thật lớn cho Kem.",
    openText: "Cổng sinh nhật đã mở rồi! Chúc Kem tuổi 4 thật vui, khỏe, hồn nhiên và có thêm thật nhiều chuyến bay đáng nhớ.",
    colors: ["#ffdc3f", "#64e7ff"],
    future: true
  }
};

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const distance = BIRTHDAY_TIME.getTime() - Date.now();
  const safeDistance = Math.max(0, distance);
  const values = {
    days: Math.floor(safeDistance / 86400000),
    hours: Math.floor((safeDistance % 86400000) / 3600000),
    minutes: Math.floor((safeDistance % 3600000) / 60000),
    seconds: Math.floor((safeDistance % 60000) / 1000)
  };

  Object.entries(values).forEach(([unit, value]) => {
    const number = countdown.querySelector(`[data-unit="${unit}"]`);
    number.textContent = pad(value);
    if (previousCountdown[unit] !== undefined && previousCountdown[unit] !== value) {
      const box = number.closest(".time-box");
      box.classList.remove("is-ticking");
      void box.offsetWidth;
      box.classList.add("is-ticking");
    }
  });
  previousCountdown = values;

  if (distance <= 0) {
    document.querySelector("#countdownTitle").innerHTML = '<span class="soft-icon icon-cake" aria-hidden="true"></span> Chúc mừng sinh nhật Kem!';
    if (journeyCountdown) {
      journeyCountdown.textContent = "Cổng sinh nhật đã mở!";
    }
  } else if (journeyCountdown) {
    journeyCountdown.textContent = "Một chương mới sắp mở ra";
  }
}

function seedTwinkles() {
  const count = prefersReducedMotion ? 10 : 24;
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < count; index += 1) {
    const star = document.createElement("span");
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty("--delay", `${Math.random() * 5}s`);
    star.style.setProperty("--speed", `${2.3 + Math.random() * 3.8}s`);
    fragment.append(star);
  }

  twinkleField.append(fragment);
}

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function burst(x = window.innerWidth / 2, y = window.innerHeight / 2, amount = 80) {
  if (prefersReducedMotion) {
    return;
  }

  const colors = ["#ffdc3f", "#64e7ff", "#ff7a59", "#a9ffcf", "#ffffff", "#8ea2ff"];

  for (let index = 0; index < amount; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2.2 + Math.random() * 6.2;
    pieces.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2.8,
      size: 5 + Math.random() * 7,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 72 + Math.random() * 42,
      rotation: Math.random() * Math.PI,
      spin: -0.12 + Math.random() * 0.24
    });
  }

  if (!animationFrame) {
    animationFrame = requestAnimationFrame(drawConfetti);
  }
}

function drawConfetti() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (let index = pieces.length - 1; index >= 0; index -= 1) {
    const piece = pieces[index];
    piece.x += piece.vx;
    piece.y += piece.vy;
    piece.vy += 0.13;
    piece.rotation += piece.spin;
    piece.life -= 1;

    if (piece.life <= 0 || piece.y > window.innerHeight + 40) {
      pieces.splice(index, 1);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = Math.max(piece.life / 90, 0);
    ctx.translate(piece.x, piece.y);
    ctx.rotate(piece.rotation);
    ctx.fillStyle = piece.color;
    ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.58);
    ctx.restore();
  }

  if (pieces.length) {
    animationFrame = requestAnimationFrame(drawConfetti);
  } else {
    animationFrame = null;
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 1900);
}

function loadFirstPhoto(paths) {
  return new Promise((resolve) => {
    if (!paths || paths.length === 0) {
      resolve(null);
      return;
    }

    let index = 0;
    const image = new Image();

    image.onload = () => resolve(paths[index]);
    image.onerror = () => {
      index += 1;
      if (index >= paths.length) {
        resolve(null);
        return;
      }

      image.src = paths[index];
    };
    image.src = paths[index];
  });
}

function setPhotoSurface(element, src, icon) {
  const fallbackImage = typeof icon === "string" && icon.startsWith("assets/");
  const imageSource = src || (fallbackImage ? icon : "");

  element.classList.toggle("has-photo", Boolean(imageSource));
  element.classList.toggle("has-asset-icon", Boolean(!src && fallbackImage));
  element.style.backgroundImage = imageSource ? `url("${imageSource}")` : "";
  element.textContent = imageSource ? "" : icon || "";
}

function seedAmbientPlanets() {
  if (!ambientPlanets || prefersReducedMotion) {
    return;
  }

  const assets = [assetIcons.planetOne, assetIcons.planetTwo, assetIcons.planetThree, assetIcons.planetFour, assetIcons.star];
  const positions = [
    { left: 8, top: 20, size: 44, delay: -0.4, duration: 8.4 },
    { left: 82, top: 24, size: 40, delay: -2.1, duration: 9.1 },
    { left: 14, top: 58, size: 34, delay: -3.2, duration: 7.6 },
    { left: 78, top: 69, size: 38, delay: -1.3, duration: 8.8 },
    { left: 50, top: 43, size: 28, delay: -2.8, duration: 6.9 }
  ];

  const fragment = document.createDocumentFragment();
  positions.forEach((item, index) => {
    const planet = document.createElement("span");
    planet.className = "ambient-planet";
    planet.style.backgroundImage = `url("${assets[index % assets.length]}")`;
    planet.style.left = `${item.left}%`;
    planet.style.top = `${item.top}%`;
    planet.style.width = `${item.size}px`;
    planet.style.height = `${item.size}px`;
    planet.style.setProperty("--float-delay", `${item.delay}s`);
    planet.style.setProperty("--float-duration", `${item.duration}s`);
    fragment.append(planet);
  });

  ambientPlanets.append(fragment);
}

function hydrateMemoryPhotos() {
  document.querySelectorAll(".memory-orb").forEach(async (button) => {
    const memory = memories[button.dataset.memory];
    const photo = button.querySelector(".orb-photo");
    const src = await loadFirstPhoto(memory.photos);
    memory.activePhoto = src;
    setPhotoSurface(photo, src, memory.icon);
  });
}

function renderAlbumPage(direction = "next") {
  const page = albumPages[activeAlbumIndex];
  const photo = page.activePhoto;

  albumKicker.textContent = page.kicker;
  albumTitle.textContent = page.title;
  albumCaption.textContent = page.caption;
  albumPhoto.classList.toggle("has-photo", Boolean(photo));
  albumPhoto.style.setProperty("--album-photo", photo ? `url("${photo}")` : "");

  albumPage.classList.remove("is-turning-next", "is-turning-prev");
  void albumPage.offsetWidth;
  albumPage.classList.add(direction === "prev" ? "is-turning-prev" : "is-turning-next");

  albumDots.querySelectorAll("button").forEach((button, index) => {
    button.classList.toggle("is-active", index === activeAlbumIndex);
    button.setAttribute("aria-current", index === activeAlbumIndex ? "true" : "false");
  });
  albumThumbs.querySelectorAll("button").forEach((button, index) => {
    button.classList.toggle("is-active", index === activeAlbumIndex);
    button.setAttribute("aria-current", index === activeAlbumIndex ? "true" : "false");
  });
}

function goAlbumPage(step) {
  activeAlbumIndex = (activeAlbumIndex + step + albumPages.length) % albumPages.length;
  renderAlbumPage(step < 0 ? "prev" : "next");
  if (!prefersReducedMotion) {
    burst(window.innerWidth / 2, window.innerHeight * 0.56, 16);
  }
}

async function hydrateMiniAlbum() {
  albumDots.innerHTML = "";
  albumThumbs.innerHTML = "";
  albumPages.forEach((page, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Mở trang album ${index + 1}`);
    dot.addEventListener("click", () => {
      const direction = index < activeAlbumIndex ? "prev" : "next";
      activeAlbumIndex = index;
      renderAlbumPage(direction);
    });
    albumDots.append(dot);

    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.setAttribute("aria-label", `Xem ảnh album ${index + 1}`);
    thumb.addEventListener("click", () => {
      const direction = index < activeAlbumIndex ? "prev" : "next";
      activeAlbumIndex = index;
      renderAlbumPage(direction);
    });
    albumThumbs.append(thumb);
  });

  await Promise.all(albumPages.map(async (page) => {
    page.activePhoto = await loadFirstPhoto(page.photos);
    if (page.activePhoto) {
      const image = new Image();
      image.src = page.activePhoto;
    }
  }));

  albumThumbs.querySelectorAll("button").forEach((button, index) => {
    const photo = albumPages[index].activePhoto;
    if (photo) {
      button.style.backgroundImage = `linear-gradient(180deg, rgba(4, 10, 40, 0), rgba(4, 10, 40, 0.18)), url("${photo}")`;
    }
  });

  renderAlbumPage("next");
}

function isBirthdayOpen() {
  return BIRTHDAY_TIME.getTime() <= Date.now();
}

function celebrateJourneyStop(button, memoryKey) {
  if (prefersReducedMotion) {
    return;
  }

  const stop = button.closest(".flight-stop");
  if (!stop) {
    return;
  }

  const icons = memoryEffects[memoryKey] || [assetIcons.star];
  stop.classList.add("is-active");
  window.setTimeout(() => stop.classList.remove("is-active"), 820);

  for (let index = 0; index < 8; index += 1) {
    const spark = document.createElement("span");
    const angle = (Math.PI * 2 * index) / 8;
    const distance = 42 + Math.random() * 24;
    const icon = icons[index % icons.length];

    spark.className = "stop-spark";
    spark.style.setProperty("--spark-image", `url("${icon}")`);
    spark.style.setProperty("--spark-x", `${Math.cos(angle) * distance}px`);
    spark.style.setProperty("--spark-y", `${Math.sin(angle) * distance}px`);
    spark.style.setProperty("--spark-r", `${-28 + Math.random() * 56}deg`);
    spark.style.left = `${button.offsetLeft + button.offsetWidth / 2}px`;
    spark.style.top = `${button.offsetTop + button.offsetHeight / 2}px`;
    stop.append(spark);
    window.setTimeout(() => spark.remove(), 920);
  }
}

function openMemory(memoryKey) {
  const memory = memories[memoryKey];

  if (!memory) {
    return;
  }

  activeMemory = memoryKey;
  const locked = memory.future && !isBirthdayOpen();
  const actionText = locked ? "Rắc pháo giấy chờ ngày mở quà" : "Rắc sao ký ức";

  drawer.classList.toggle("is-locked", locked);
  setPhotoSurface(drawerPhoto, memory.activePhoto, memory.icon);
  drawerPhoto.style.setProperty("--photo-a", memory.colors[0]);
  drawerPhoto.style.setProperty("--photo-b", memory.colors[1]);
  drawerEyebrow.textContent = memory.eyebrow;
  drawerTitle.textContent = memory.title;
  drawerText.textContent = locked ? `${memory.text} ${journeyCountdown.textContent}.` : memory.openText || memory.text;
  drawerActionLabel.textContent = actionText;

  drawer.hidden = false;
  requestAnimationFrame(() => drawer.classList.add("is-open"));

  if (locked) {
    burst(window.innerWidth / 2, window.innerHeight * 0.65, 38);
  } else {
    burst(window.innerWidth / 2, window.innerHeight * 0.68, 26);
  }
}

function closeMemory() {
  drawer.classList.remove("is-open");
  window.setTimeout(() => {
    if (!drawer.classList.contains("is-open")) {
      drawer.hidden = true;
    }
  }, 260);
}

function openFamilyAlbum() {
  activeMemory = "family";
  drawer.classList.remove("is-locked");
  setPhotoSurface(drawerPhoto, activeFamilyPhoto, "♡");
  drawerPhoto.style.setProperty("--photo-a", "#ffe867");
  drawerPhoto.style.setProperty("--photo-b", "#ff9ecb");
  drawerEyebrow.textContent = "Ảnh gia đình";
  drawerTitle.textContent = "Cả nhà bên Kem";
  drawerText.textContent = activeFamilyPhoto
    ? "Một khung hình thật ấm để giữ lại tình yêu của cả nhà trong chuyến bay tuổi thơ của Kem."
    : "Bạn có thể đặt ảnh gia đình tên family.jpg, family.png hoặc family.webp vào thư mục assets/memories.";
  drawerActionLabel.textContent = "Rắc tim yêu thương";

  drawer.hidden = false;
  requestAnimationFrame(() => drawer.classList.add("is-open"));
  burst(window.innerWidth / 2, window.innerHeight * 0.68, 48);
}

function popWish(x, y) {
  if (prefersReducedMotion) {
    return;
  }
  const now = Date.now();
  if (now - lastPopAt < 160) {
    return;
  }
  lastPopAt = now;

  const icons = [assetIcons.planetOne, assetIcons.planetTwo, assetIcons.planetThree, assetIcons.planetFour, assetIcons.star, assetIcons.star];
  const pop = document.createElement("span");
  const icon = icons[Math.floor(Math.random() * icons.length)];
  pop.className = `tap-pop asset-pop${icon === assetIcons.star ? " is-star" : ""}`;
  pop.style.backgroundImage = `url("${icon}")`;
  pop.style.left = `${x}px`;
  pop.style.top = `${y}px`;
  document.body.append(pop);
  window.setTimeout(() => pop.remove(), 900);
}

function setActiveNav(id) {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
  });
}

function initNavigationObserver() {
  const sections = [...document.querySelectorAll(".screen")];
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        setActiveNav(visible.target.id);
      }
    },
    {
      threshold: [0.35, 0.55, 0.75]
    }
  );

  sections.forEach((section) => observer.observe(section));
}

document.querySelector("#partyBtn").addEventListener("click", (event) => {
  burst(event.clientX, event.clientY, 72);
  window.setTimeout(() => burst(window.innerWidth * 0.24, window.innerHeight * 0.28, 34), 170);
  window.setTimeout(() => burst(window.innerWidth * 0.76, window.innerHeight * 0.25, 34), 320);
  showToast("Chúc Kem tuổi 4 thật vui, khỏe và rực rỡ!");
});

document.querySelector("#magicToggle").addEventListener("click", (event) => {
  const active = app.classList.toggle("extra-magic");
  event.currentTarget.setAttribute("aria-pressed", String(active));
  burst(event.clientX, event.clientY, active ? 48 : 22);
  showToast(active ? "Vũ trụ của Kem sáng bừng rồi!" : "Vũ trụ dịu lại một chút.");
});

document.querySelectorAll(".memory-orb").forEach((button) => {
  button.addEventListener("click", (event) => {
    celebrateJourneyStop(event.currentTarget, event.currentTarget.dataset.memory);
    openMemory(event.currentTarget.dataset.memory);
  });
});

document.querySelector("#drawerClose").addEventListener("click", closeMemory);
document.querySelector(".drawer-backdrop").addEventListener("click", closeMemory);
albumPrev.addEventListener("click", () => goAlbumPage(-1));
albumNext.addEventListener("click", () => goAlbumPage(1));

drawerAction.addEventListener("click", (event) => {
  const locked = activeMemory === "four" && !isBirthdayOpen();
  burst(event.clientX, event.clientY, locked ? 58 : 42);
  showToast(activeMemory === "family" ? "Một tim yêu thương vừa bay lên!" : locked ? "Kem đang bay tới cổng sinh nhật tuổi 4!" : "Một ký ức xinh vừa sáng lên!");
});

app.addEventListener("pointerdown", (event) => {
  if (event.target.closest("button, a, .drawer-panel")) {
    return;
  }

  popWish(event.clientX, event.clientY);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !drawer.hidden) {
    closeMemory();
  }
});

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
seedTwinkles();
seedAmbientPlanets();
hydrateMemoryPhotos();
hydrateMiniAlbum();
updateCountdown();
window.setInterval(updateCountdown, 1000);
initNavigationObserver();
