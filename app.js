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
const familyPhotoButton = document.querySelector("#familyPhoto");
const canvas = document.querySelector("#confettiCanvas");
const ctx = canvas.getContext("2d");
const pieces = [];
const navLinks = [...document.querySelectorAll(".bottom-nav a")];
let animationFrame = null;
let toastTimer = null;
let activeMemory = null;
let activeFamilyPhoto = null;
let previousCountdown = {};

const assetIcons = {
  planetOne: "assets/1.png",
  planetTwo: "assets/2.png",
  planetThree: "assets/3.png",
  planetFour: "assets/4.png",
  star: "assets/5.png"
};
const familyPhotos = ["assets/memories/family.jpg", "assets/memories/family.png", "assets/memories/family.webp"];

const memories = {
  birth: {
    eyebrow: "Trạm đầu tiên",
    title: "Chào đời",
    icon: assetIcons.star,
    photos: ["https://cdn.jsdelivr.net/gh/huynhngoclong1903/chitieu@main/assets/memories/chao-doi.jpg"],
    text: "Ngày Kem đáp xuống Trái Đất, cả nhà có thêm một vì sao nhỏ để yêu thương.",
    colors: ["#ffe867", "#ff7a59"]
  },
  one: {
    eyebrow: "Mặt trăng nhỏ",
    title: "1 tuổi",
    icon: assetIcons.planetOne,
    photos: ["https://cdn.jsdelivr.net/gh/huynhngoclong1903/chitieu@main/assets/memories/1-tuoi.jpg"],
    text: "Những bước khám phá đầu tiên, đôi mắt tròn xoe và nụ cười làm cả nhà tan chảy.",
    colors: ["#f7f7ff", "#7fc7ff"]
  },
  two: {
    eyebrow: "Hành tinh cam",
    title: "2 tuổi",
    icon: assetIcons.planetTwo,
    photos: ["https://cdn.jsdelivr.net/gh/huynhngoclong1903/chitieu@main/assets/memories/2-tuoi.jpg"],
    text: "Kem bắt đầu có thật nhiều trò vui, cười vang và làm mọi ngày trong nhà rộn ràng hơn.",
    colors: ["#ffb453", "#ff6f59"]
  },
  three: {
    eyebrow: "Trái Đất xanh",
    title: "3 tuổi",
    icon: assetIcons.planetThree,
    photos: ["https://cdn.jsdelivr.net/gh/huynhngoclong1903/chitieu@main/assets/memories/3-tuoi.jpg"],
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
    const dayLabel = Math.max(1, Math.ceil(distance / 86400000));
    journeyCountdown.textContent = `Còn ${dayLabel} ngày nữa mở quà`;
  }
}

function seedTwinkles() {
  const count = prefersReducedMotion ? 14 : 48;
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
  const ratio = window.devicePixelRatio || 1;
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
    { left: 8, top: 18, size: 52, delay: -0.4, duration: 8.4 },
    { left: 82, top: 22, size: 46, delay: -2.1, duration: 9.1 },
    { left: 14, top: 58, size: 36, delay: -3.2, duration: 7.6 },
    { left: 78, top: 68, size: 42, delay: -1.3, duration: 8.8 },
    { left: 50, top: 42, size: 30, delay: -2.8, duration: 6.9 },
    { left: 92, top: 48, size: 28, delay: -4.1, duration: 7.2 },
    { left: 30, top: 82, size: 34, delay: -1.7, duration: 8.2 }
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

async function hydrateFamilyPhoto() {
  activeFamilyPhoto = await loadFirstPhoto(familyPhotos);
  familyPhotoButton.classList.toggle("has-photo", Boolean(activeFamilyPhoto));
  familyPhotoButton.style.setProperty("--family-photo", activeFamilyPhoto ? `url("${activeFamilyPhoto}")` : "");
}

function isBirthdayOpen() {
  return BIRTHDAY_TIME.getTime() <= Date.now();
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
    burst(window.innerWidth / 2, window.innerHeight * 0.65, 65);
  } else {
    burst(window.innerWidth / 2, window.innerHeight * 0.68, 40);
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
  burst(window.innerWidth / 2, window.innerHeight * 0.68, 90);
}

function popWish(x, y) {
  if (prefersReducedMotion) {
    return;
  }

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

document.querySelector("#launchBtn").addEventListener("click", (event) => {
  burst(event.clientX, event.clientY, 110);
  showToast("Kem chuẩn bị cất cánh tới sinh nhật 4 tuổi!");
  document.querySelector("#birthday").scrollIntoView({ behavior: "smooth" });
});

document.querySelector("#wishBtn").addEventListener("click", (event) => {
  burst(event.clientX, event.clientY, 70);
  showToast("Một điều ước xinh vừa bay lên bầu trời!");
});

document.querySelector("#partyBtn").addEventListener("click", (event) => {
  burst(event.clientX, event.clientY, 150);
  window.setTimeout(() => burst(window.innerWidth * 0.24, window.innerHeight * 0.28, 70), 170);
  window.setTimeout(() => burst(window.innerWidth * 0.76, window.innerHeight * 0.25, 70), 320);
  showToast("Chúc Kem tuổi 4 thật vui, khỏe và rực rỡ!");
});

document.querySelector("#magicToggle").addEventListener("click", (event) => {
  const active = app.classList.toggle("extra-magic");
  event.currentTarget.setAttribute("aria-pressed", String(active));
  burst(event.clientX, event.clientY, active ? 90 : 34);
  showToast(active ? "Bầu trời lấp lánh hơn rồi!" : "Lấp lánh dịu lại một chút.");
});

document.querySelectorAll(".memory-orb").forEach((button) => {
  button.addEventListener("click", (event) => {
    openMemory(event.currentTarget.dataset.memory);
  });
});

document.querySelector("#drawerClose").addEventListener("click", closeMemory);
document.querySelector(".drawer-backdrop").addEventListener("click", closeMemory);
familyPhotoButton.addEventListener("click", openFamilyAlbum);

drawerAction.addEventListener("click", (event) => {
  const locked = activeMemory === "four" && !isBirthdayOpen();
  burst(event.clientX, event.clientY, locked ? 120 : 80);
  showToast(activeMemory === "family" ? "Một tim yêu thương vừa bay lên!" : locked ? "Kem đang bay tới cổng sinh nhật tuổi 4!" : "Một ký ức xinh vừa sáng lên!");
});

document.addEventListener("pointerdown", (event) => {
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
hydrateFamilyPhoto();
updateCountdown();
window.setInterval(updateCountdown, 1000);
initNavigationObserver();
