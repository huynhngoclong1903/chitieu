const milestones = [
  {
    date: "03/08/2022",
    iso: "2022-08-03",
    title: "Chào đời",
    note: "Ngày đầu tiên khu vườn nhỏ có thêm một bông hoa thật đặc biệt.",
    accent: "#ff75a0",
    image: "./assets/photos/photo-03082022.jpg",
    position: "50% 42%",
    type: "start",
    video: ""
  },
  {
    date: "03/02/2023",
    iso: "2023-02-03",
    title: "6 tháng",
    note: "Nụ cười đầu đời làm cả nhà thấy ngày nào cũng có nắng.",
    accent: "#ffb452",
    image: "./assets/photos/photo-03022023.jpg",
    position: "50% 50%",
    fit: "contain",
    type: "small",
    video: ""
  },
  {
    date: "03/08/2023",
    iso: "2023-08-03",
    title: "1 tuổi",
    note: "Mốc sinh nhật đầu tiên, bé bắt đầu khám phá thế giới theo cách rất riêng.",
    accent: "#63c9f4",
    image: "./assets/photos/photo-03082023.jpg",
    position: "50% 44%",
    type: "birthday",
    video: ""
  },
  {
    date: "03/02/2024",
    iso: "2024-02-03",
    title: "1 tuổi 6 tháng",
    note: "Một chồi non giữa mùa, thêm một khoảnh khắc ấm áp bên gia đình.",
    accent: "#a98af0",
    image: "./assets/photos/photo-03022024.jpg",
    position: "50% 44%",
    type: "small",
    video: ""
  },
  {
    date: "03/08/2024",
    iso: "2024-08-03",
    title: "2 tuổi",
    note: "Sinh nhật 2 tuổi rực rỡ với thật nhiều nụ cười và màu vàng ấm áp.",
    accent: "#55cf89",
    image: "./assets/photos/photo-03082024.jpg",
    extraImages: ["./assets/photos/photo-03082024-alt.jpg"],
    position: "50% 46%",
    type: "birthday",
    video: ""
  },
  {
    date: "03/02/2025",
    iso: "2025-02-03",
    title: "2 tuổi 6 tháng",
    note: "Một nửa năm đầy lí lắc, bé cười tươi trong vòng tay cả nhà.",
    accent: "#ff7b64",
    image: "./assets/photos/photo-03022025.jpg",
    position: "50% 28%",
    fit: "contain",
    type: "small",
    video: ""
  },
  {
    date: "03/08/2025",
    iso: "2025-08-03",
    title: "3 tuổi",
    note: "Bé thêm một tuổi, thêm một chút tự tin và thật nhiều khoảnh khắc đáng yêu.",
    accent: "#ffdc4f",
    image: "./assets/photos/photo-03082025.jpg",
    position: "50% 44%",
    type: "birthday",
    video: ""
  },
  {
    date: "03/02/2026",
    iso: "2026-02-03",
    title: "3 tuổi 6 tháng",
    note: "Một mốc nhỏ thật ấm, khi bé đã lớn hơn trong từng câu nói và ánh mắt.",
    accent: "#a98af0",
    image: "./assets/photos/photo-03022026.jpg",
    position: "50% 50%",
    fit: "contain",
    type: "small",
    video: ""
  },
  {
    date: "03/08/2026",
    iso: "2026-08-03",
    title: "4 tuổi",
    note: "Một hộp quà nhỏ đang giữ lại điều bất ngờ cho ngày Kem tròn 4 tuổi.",
    accent: "#ff75a0",
    image: "",
    position: "50% 50%",
    type: "final",
    video: ""
  }
];

const timelineGarden = document.querySelector("#timelineGarden");
const modal = document.querySelector("#memoryModal");
const modalImage = document.querySelector("#modalImage");
const modalMedia = document.querySelector(".modal-media");
const modalPlaceholder = document.querySelector("#modalPlaceholder");
const modalDate = document.querySelector("#modalDate");
const modalTitle = document.querySelector("#modalTitle");
const modalNote = document.querySelector("#modalNote");
const videoSlot = document.querySelector("#videoSlot");
let activeIndex = 0;

function renderTimeline() {
  timelineGarden.innerHTML = milestones
    .map((item, index) => {
      const isSmall = item.type === "small";
      const isStart = item.type === "start";
      const isFinal = item.type === "final";
      const classes = [
        "milestone",
        isSmall ? "milestone-small" : "",
        isStart ? "milestone-start" : "",
        isFinal ? "milestone-final" : ""
      ]
        .filter(Boolean)
        .join(" ");

      const photo = item.image
        ? `<img src="${item.image}" alt="${item.title} - ${item.date}" />`
        : isFinal
          ? `
            <div class="surprise-stage" aria-hidden="true">
              <span class="surprise-confetti surprise-confetti-a"></span>
              <span class="surprise-confetti surprise-confetti-b"></span>
              <span class="surprise-confetti surprise-confetti-c"></span>
              <span class="surprise-gift">
                <span class="gift-lid"></span>
                <span class="gift-box"></span>
                <span class="gift-ribbon"></span>
              </span>
              <strong>Điều bất ngờ của Kem</strong>
            </div>
          `
          : `<span>Chờ ảnh bé</span>`;
      const placeholderClass = item.image ? "" : isFinal ? " is-placeholder is-surprise" : " is-placeholder";
      const countdownBadge = isFinal ? `<span class="countdown-mini" data-card-days></span>` : "";

      const fit = item.fit || "cover";

      return `
        <article class="${classes}" style="--accent: ${item.accent}; --position: ${item.position}; --fit: ${fit};">
          <span class="marker">${index + 1}</span>
          <div class="milestone-card">
            <div class="card-bloom" aria-hidden="true">
              <span></span><span></span><span></span><span></span>
            </div>
            <i class="paper-tape paper-tape-a" aria-hidden="true"></i>
            <i class="paper-tape paper-tape-b" aria-hidden="true"></i>
            <button class="memory-button" type="button" data-open="${index}" aria-label="Mở kỷ niệm ${item.title} ${item.date}">
              <div class="photo-frame${placeholderClass}">${photo}</div>
              <div class="card-copy">
                <span>${item.date}</span>
                <strong>${item.title}</strong>
                <p>${item.note}</p>
              </div>
              ${countdownBadge}
            </button>
            <button class="play-chip" type="button" data-video="${index}" aria-label="Mở video kỷ niệm ${item.title}"></button>
          </div>
        </article>
      `;
    })
    .join("");

  timelineGarden.querySelectorAll("[data-open]").forEach((button) => {
    button.addEventListener("click", () => openModal(Number(button.dataset.open)));
  });

  timelineGarden.querySelectorAll("[data-video]").forEach((button) => {
    button.addEventListener("click", () => openVideoModal(Number(button.dataset.video)));
  });

  observeCards();
}

function observeCards() {
  const cards = document.querySelectorAll(".milestone");
  if (!("IntersectionObserver" in window)) {
    cards.forEach((card) => card.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  cards.forEach((card) => observer.observe(card));
}

function openModal(index) {
  activeIndex = index;
  const item = milestones[index];
  modal.classList.remove("is-video-only");
  modalDate.textContent = item.date;
  modalTitle.textContent = item.title;
  modalNote.textContent = item.note;

  if (item.image) {
    modalImage.src = item.image;
    modalImage.alt = `${item.title} - ${item.date}`;
    modalMedia.classList.remove("is-empty");
  } else {
    modalImage.removeAttribute("src");
    modalImage.alt = "";
    modalPlaceholder.textContent = item.type === "final" ? "Điều bất ngờ sinh nhật của Kem" : "Chờ ảnh bé";
    modalMedia.classList.add("is-empty");
  }

  renderVideo(item);
  burstConfetti(item.accent);
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function openVideoModal(index) {
  activeIndex = index;
  const item = milestones[index];
  modal.classList.add("is-video-only");
  modalDate.textContent = "";
  modalTitle.textContent = `Video ${item.title}`;
  modalNote.textContent = "";
  modalImage.removeAttribute("src");
  modalImage.alt = "";
  modalMedia.classList.add("is-empty");
  modalPlaceholder.textContent = "Video kỷ niệm";
  renderVideo(item);
  burstConfetti(item.accent);
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.classList.remove("is-video-only");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  videoSlot.innerHTML = "";
}

function renderVideo(item) {
  if (item.video) {
    videoSlot.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${item.video}"
        title="Video kỷ niệm ${item.title}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    `;
  } else {
    videoSlot.innerHTML = `<div class="video-empty">Video kỷ niệm sẽ được thêm sau</div>`;
  }
}

function moveModal(step) {
  const nextIndex = (activeIndex + step + milestones.length) % milestones.length;
  openModal(nextIndex);
}

function burstConfetti(color) {
  const burst = document.createElement("div");
  burst.className = "confetti-burst";
  const colors = [color, "#ffdc4f", "#63c9f4", "#ff75a0", "#55cf89", "#a98af0"];

  for (let index = 0; index < 26; index += 1) {
    const piece = document.createElement("span");
    piece.style.setProperty("--x", `${Math.cos(index * 0.62) * (90 + (index % 5) * 14)}px`);
    piece.style.setProperty("--y", `${Math.sin(index * 0.62) * (72 + (index % 4) * 18)}px`);
    piece.style.setProperty("--delay", `${(index % 6) * 18}ms`);
    piece.style.background = colors[index % colors.length];
    burst.appendChild(piece);
  }

  document.body.appendChild(burst);
  window.setTimeout(() => burst.remove(), 950);
}

function updateCountdown() {
  const target = new Date("2026-08-03T00:00:00+07:00");
  const now = new Date();
  const diff = Math.max(0, target - now);
  const totalMinutes = Math.floor(diff / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  document.querySelectorAll("[data-days]").forEach((el) => (el.textContent = days));
  document.querySelectorAll("[data-hours]").forEach((el) => (el.textContent = hours));
  document.querySelectorAll("[data-minutes]").forEach((el) => (el.textContent = minutes));
  document.querySelectorAll("[data-final-days]").forEach((el) => (el.textContent = `${days} ngày`));
  document.querySelectorAll("[data-card-days]").forEach((el) => (el.textContent = `Còn ${days} ngày`));
}

document.querySelectorAll("[data-close-modal]").forEach((el) => {
  el.addEventListener("click", closeModal);
});

document.querySelector("[data-prev]").addEventListener("click", () => moveModal(-1));
document.querySelector("[data-next]").addEventListener("click", () => moveModal(1));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeModal();
  }
});

renderTimeline();
updateCountdown();
setInterval(updateCountdown, 60000);
