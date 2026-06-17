const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const button = item.querySelector("button");
  button.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");

    faqItems.forEach((entry) => {
      entry.classList.remove("open");
      entry.querySelector("button").setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

const tabCopy = [
  {
    number: "01",
    title: "NFT Toolkit: Maximize Your Digital Assets",
    body:
      "Exploring new opportunities, our tools help you unlock the full potential of the NFT world: explore, engage, and elevate your digital assets like never before.",
    detail:
      "Discover innovative features that streamline trading, enhance security, and provide deep insights into the NFT market."
  },
  {
    number: "02",
    title: "Exchange NFTs With Other Users",
    body:
      "Move from browsing to active exchange with curated prompts, trusted creator histories, and wallet-ready collection views.",
    detail:
      "Every swap is presented with clear metadata, creator context, and a compact visual trail before you commit."
  },
  {
    number: "03",
    title: "Build and Showcase Your NFT",
    body:
      "Create a collector-facing profile that frames your digital work with scarcity notes, story cards, and gallery-ready visuals.",
    detail:
      "The showcase system keeps the experience visual first while still giving serious collectors the data they need."
  },
  {
    number: "04",
    title: "Put Your NFTs Up for Sale",
    body:
      "Prepare listings with polished previews, pricing guidance, and marketplace-ready details from a single dashboard.",
    detail:
      "Sale flows are designed to feel fast and calm, with the key ownership information visible at each step."
  }
];

const tabButtons = document.querySelectorAll(".toolkit-tabs button");
const toolkitContent = document.querySelector(".toolkit-content");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const index = Number(button.dataset.tab);
    const copy = tabCopy[index];

    tabButtons.forEach((tab) => {
      tab.classList.remove("active");
      tab.setAttribute("aria-selected", "false");
    });

    button.classList.add("active");
    button.setAttribute("aria-selected", "true");

    toolkitContent.dataset.panel = String(index);
    toolkitContent.innerHTML = `
      <span>${copy.number}</span>
      <h2>${copy.title}</h2>
      <p>${copy.body}</p>
      <p>${copy.detail}</p>
      <a href="#contact">Learn More</a>
    `;
  });
});
