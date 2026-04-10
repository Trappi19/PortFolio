import { gsap } from "gsap";
import { applyTranslations, getLanguage, toggleLanguage } from "./i18n.js";
import { getAllProjects } from "./projects-store.js";
import AudioManager from "./audio.js";

const scroller = document.getElementById("contentScroller");
const sectionNodes = [...document.querySelectorAll("[data-section]")];
const wheelButtons = [...document.querySelectorAll(".wheel-item")];
const topButtons = [...document.querySelectorAll(".top-nav__item[data-target]")];
const allTargetButtons = [...document.querySelectorAll("[data-target]")];
const langToggle = document.getElementById("langToggle");
const header = document.getElementById("oracleHeader");
const progressBar = document.getElementById("scrollProgress");
const projectGrid = document.getElementById("projectGrid");
const contactForm = document.getElementById("contactForm");
const wheelCoreLabel = document.querySelector(".ritual-wheel__core span");
const backgroundVideo = document.getElementById("backgroundVideo");
const backgroundFade = document.getElementById("backgroundFade");
const sectionOrder = ["home", "about", "projects", "skills", "experience", "contact", "cv", "woolhaven"];
const sectionLabels = {
  home: "Home",
  about: "Story",
  projects: "Relics",
  skills: "Skills",
  experience: "Path",
  contact: "Whisper",
  cv: "Scrolls",
  woolhaven: "Woolhaven"
};

const sectionVideos = {
  home: "Game teaser.mp4",
  about: "Cult of The Lamb † Reveal Trailer [tp-k9mnXutE].webm",
  projects: "Cult of the Lamb ｜ Launch Trailer [xsPtUNB1z-Q].mp4",
  skills: "Cult of the Lamb ｜ Sinful Pack Available Now! [e0J14QGhow0].mp4",
  experience: "Cult of the Lamb ｜ Sins of the Flesh Launch Trailer [dsCUA_VQ5Nw].mp4",
  contact: "Cult of the Lamb ｜ Unholy Alliance Launch Trailer [rjeyYMuGZgU].mp4",
  cv: "Cult of the Lamb - Official Woolhaven Launch Trailer [blFTLCBS9Jc].webm",
  woolhaven: "Woolhaven.mp4",
  credits: "Crédit.webm"
};
const videoBaseUrl = new URL("../vid/", import.meta.url);
const transitionDuration = 420;
const blackoutFadeDuration = 180;
const loopPauseDuration = 120;

let currentSection = "home";
let activeSectionIndex = 0;
let wheelRotation = 0;
let sectionTransitionLock = false;
let backgroundTransitionTimer = null;
let backgroundSwitchTimer = null;

function updateLanguageUI() {
  const lang = getLanguage();
  applyTranslations(document, lang);
  langToggle.textContent = lang === "en" ? "FR" : "EN";
  renderProjects();
}

const projectModal = document.getElementById("projectModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalCover = document.getElementById("modalCover");
const modalTitle = document.getElementById("modalTitle");
const modalTags = document.getElementById("modalTags");
const modalCategory = document.getElementById("modalCategory");
const modalDescription = document.getElementById("modalDescription");
const modalLinks = document.getElementById("modalLinks");

function openProjectModal(project, lang) {
  const title = project.title[lang] || project.title.en;
  const description = project.description[lang] || project.description.en;
  const tags = project.tags.map((tag) => `<span>${tag}</span>`).join("");

  modalTitle.textContent = title;
  modalCategory.textContent = project.category + (project.featured ? " • Featured" : "");
  modalDescription.innerHTML = description.replace(/\n/g, "<br>");
  modalTags.innerHTML = tags;
  modalCover.style.backgroundImage = project.image ? `url(${project.image})` : "none";
  modalCover.style.backgroundColor = project.image ? "transparent" : "rgba(255, 255, 255, 0.04)";

  const links = [
    project.url ? `<a href="${project.url}" target="_blank" rel="noreferrer">Live Demo</a>` : "",
    project.repo ? `<a href="${project.repo}" target="_blank" rel="noreferrer">View Code</a>` : ""
  ].filter(Boolean).join("");
  modalLinks.innerHTML = links;

  projectModal.setAttribute("aria-hidden", "false");
  closeModalBtn.focus();
  document.body.style.overflow = "hidden"; // Prevent background scrolling
}

function closeProjectModal() {
  projectModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

closeModalBtn.addEventListener("click", closeProjectModal);
projectModal.addEventListener("click", (e) => {
  if (e.target === projectModal || e.target.classList.contains("project-modal__backdrop")) {
    closeProjectModal();
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && projectModal.getAttribute("aria-hidden") === "false") {
    closeProjectModal();
  }
});

function renderProjects() {
  const lang = getLanguage();
  const projects = getAllProjects();

  projectGrid.innerHTML = "";

  if (!projects.length) {
    projectGrid.innerHTML = `<p class="panel-copy">${
      lang === "fr" ? "Aucun projet pour le moment. Ajoute-en dans src/data/default-projects.js." : "No project yet. Add one in src/data/default-projects.js."
    }</p>`;
    return;
  }

  projects.forEach((project) => {
    const card = document.createElement("article");
    card.className = "project-card";
    card.style.setProperty("--project-accent", project.accent || "#d94f04");
    card.tabIndex = 0;

    const tags = project.tags.map((tag) => `<span>${tag}</span>`).join("");
    const title = project.title[lang] || project.title.en;
    const description = project.description[lang] || project.description.en;
    const shortTitle = title
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .join(" ");

    const media = project.image
      ? `<img src="${project.image}" alt="${title}" loading="lazy" />`
      : `<div class="project-placeholder"><span>${title.slice(0, 2).toUpperCase()}</span></div>`;

    const links = [
      project.url ? `<a href="${project.url}" target="_blank" rel="noreferrer">Live</a>` : "",
      project.repo ? `<a href="${project.repo}" target="_blank" rel="noreferrer">Code</a>` : ""
    ]
      .filter(Boolean)
      .join("");

    card.innerHTML = `
      <div class="project-card__media">
        ${media}
        <p class="project-card__quick">${shortTitle || title}</p>
      </div>
      <div class="project-card__body">
        <p class="project-meta">${project.category}${project.featured ? " • Featured" : ""}</p>
        <h3>${title}</h3>
        <p>${description.slice(0, 100)}...</p>
        <div class="project-tags">${tags}</div>
        <div class="project-links" style="pointer-events: none;">${links}</div>
      </div>
    `;

    card.addEventListener("click", () => openProjectModal(project, lang));

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openProjectModal(project, lang);
      }
    });

    const imageNode = card.querySelector(".project-card__media img");
    if (imageNode) {
      imageNode.addEventListener("error", () => {
        imageNode.remove();
        const placeholder = document.createElement("div");
        placeholder.className = "project-placeholder";
        placeholder.innerHTML = `<span>${title.slice(0, 2).toUpperCase()}</span>`;
        card.querySelector(".project-card__media")?.append(placeholder);
      });
    }

    projectGrid.append(card);
  });
}

function getBackgroundVideoUrl(sectionId) {
  const filename = sectionVideos[sectionId] || sectionVideos.home;
  return new URL(filename, videoBaseUrl).href;
}

function setBackgroundVideo(sectionId, { force = false } = {}) {
  if (!backgroundVideo) {
    return;
  }

  const nextSource = getBackgroundVideoUrl(sectionId);

  if (!force && backgroundVideo.dataset.section === sectionId && backgroundVideo.currentSrc === nextSource) {
    return;
  }

  backgroundVideo.dataset.section = sectionId;

  if (backgroundVideo.currentSrc !== nextSource) {
    backgroundVideo.src = nextSource;
    backgroundVideo.load();
  }

  backgroundVideo.play().catch(() => {
    // Muted autoplay should work, but some browsers still defer until the first gesture.
  });
}

function setBackgroundFadeVisible(visible) {
  if (!backgroundFade) {
    return;
  }

  backgroundFade.classList.toggle("is-visible", visible);
}

function transitionBackgroundVideo(sectionId, { restartCurrent = false } = {}) {
  if (!backgroundVideo) {
    return;
  }

  setBackgroundFadeVisible(true);

  window.clearTimeout(backgroundTransitionTimer);
  window.clearTimeout(backgroundSwitchTimer);

  backgroundSwitchTimer = window.setTimeout(() => {
    if (restartCurrent) {
      backgroundVideo.currentTime = 0;
      backgroundVideo.play().catch(() => {
        // Playback can still wait for a user gesture in strict autoplay contexts.
      });
      return;
    }

    setBackgroundVideo(sectionId, { force: true });
  }, blackoutFadeDuration + (restartCurrent ? loopPauseDuration : 0));

  backgroundTransitionTimer = window.setTimeout(() => {
    setBackgroundFadeVisible(false);
  }, transitionDuration);
}

const sectionThemes = {
  home: { primary: "#d94f04", bg: "#080604", accent: "#d94f04" },
  about: { primary: "#c03a5e", bg: "#0d0408", accent: "#ff6b8f" },
  projects: { primary: "#4ca87b", bg: "#040d08", accent: "#6df5b5" },
  contact: { primary: "#8c52ff", bg: "#06040d", accent: "#c4a3ff" }
};

const wheelSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--wheel-size"));
const RADIUS = Number.isFinite(wheelSize) ? Math.round(wheelSize * 0.44) : 210;
const totalNodes = wheelButtons.length;
const angleStep = 360 / totalNodes;

// Set to true to re-enable 3D tilt/deformation while the wheel rotates.
const ENABLE_WHEEL_TILT = false;
const WHEEL_TILT = {
  wheelX: 12,
  wheelY: -16,
  coreX: -12,
  coreY: 16
};

document.body.classList.toggle("wheel-tilt-enabled", ENABLE_WHEEL_TILT);

// Initialize orbital wheel
wheelButtons.forEach((btn, idx) => {
  btn.dataset.wheelIndex = idx;
  gsap.set(btn, {
    transformOrigin: `-${RADIUS}px 50%`,
    x: RADIUS,
    rotation: idx * angleStep,
  });
});

gsap.set(".ritual-wheel", {
  rotation: wheelRotation,
  ...(ENABLE_WHEEL_TILT
    ? {
        rotationX: WHEEL_TILT.wheelX,
        rotationY: WHEEL_TILT.wheelY
      }
    : {})
});

gsap.set(".ritual-wheel__core span", {
  rotation: -wheelRotation,
  ...(ENABLE_WHEEL_TILT
    ? {
        rotationX: WHEEL_TILT.coreX,
        rotationY: WHEEL_TILT.coreY
      }
    : {})
});

function getSectionIndex(sectionId) {
  return sectionOrder.indexOf(sectionId);
}

function getWheelDelta(fromIndex, toIndex) {
  let delta = toIndex - fromIndex;
  const half = totalNodes / 2;

  if (delta > half) {
    delta -= totalNodes;
  }

  if (delta < -half) {
    delta += totalNodes;
  }

  return delta;
}

function spinWheel(deltaSteps) {
  if (!deltaSteps) {
    return;
  }

  wheelRotation -= deltaSteps * angleStep;

  gsap.to(".ritual-wheel", {
    rotation: wheelRotation,
    ...(ENABLE_WHEEL_TILT
      ? {
          rotationX: WHEEL_TILT.wheelX,
          rotationY: WHEEL_TILT.wheelY
        }
      : {}),
    duration: 0.85,
    ease: "power3.out"
  });

  gsap.to(".ritual-wheel__core span", {
    rotation: -wheelRotation,
    ...(ENABLE_WHEEL_TILT
      ? {
          rotationX: WHEEL_TILT.coreX,
          rotationY: WHEEL_TILT.coreY
        }
      : {}),
    duration: 0.85,
    ease: "power3.out"
  });
}

function setActiveSection(sectionId, options = {}) {
  const targetIndex = getSectionIndex(sectionId);
  const hasWheelTarget = targetIndex !== -1;

  const previousIndex = activeSectionIndex;
  currentSection = sectionId;
  if (hasWheelTarget) {
    activeSectionIndex = targetIndex;
  }

  const theme = sectionThemes[sectionId] || sectionThemes.home;
  document.documentElement.style.setProperty("--primary-color", theme.primary);
  document.documentElement.style.setProperty("--background-color", theme.bg);
  document.documentElement.style.setProperty("--project-accent", theme.accent);

  if (hasWheelTarget) {
    wheelButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.target === sectionId);
      button.setAttribute("aria-current", button.dataset.target === sectionId ? "true" : "false");
    });

    if (wheelCoreLabel) {
      wheelCoreLabel.textContent = sectionLabels[sectionId] || sectionId;
    }
  }

  sectionNodes.forEach((section) => {
    const isActive = section.id === sectionId;
    section.hidden = !isActive;
    section.classList.toggle("is-active", section.id === sectionId);
  });

  if (hasWheelTarget) {
    const deltaSteps = options.direction ?? getWheelDelta(previousIndex, targetIndex);
    spinWheel(deltaSteps);

    wheelButtons.forEach((btn, idx) => {
      const isActive = idx === targetIndex;
      gsap.to(btn, {
        scale: isActive ? 1.15 : 0.88,
        opacity: isActive ? 1 : 0.5,
        duration: 0.6,
        ease: "power2.out"
      });
    });
  }

  document.body.dataset.section = sectionId;

  topButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.target === sectionId);
  });

  const activeSection = document.getElementById(sectionId);
  if (activeSection) {
    gsap.fromTo(
      activeSection,
      { opacity: 0, y: 18, scale: 0.985, filter: "blur(10px)" },
      { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.45, ease: "power2.out" }
    );
  }
}

function navigateToSection(sectionId, options = {}) {
  if (sectionTransitionLock && !options.skipLock) {
    return;
  }

  if (!document.getElementById(sectionId)) {
    return;
  }

  if (!options.skipLock) {
    sectionTransitionLock = true;
    setTimeout(() => {
      sectionTransitionLock = false;
    }, transitionDuration);
  }

  transitionBackgroundVideo(sectionId);

  setActiveSection(sectionId, options);
}

allTargetButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const target = button.dataset.target;

    if (!target) {
      return;
    }

    if (button.tagName === "A") {
      return;
    }

    event.preventDefault();
    navigateToSection(target);
  });
});

window.addEventListener(
  "wheel",
  (event) => {
    if (projectModal.getAttribute("aria-hidden") === "false") {
      return;
    }

    if (event.target.closest("input, textarea, select, .project-modal")) {
      return;
    }

    event.preventDefault();
    const direction = event.deltaY > 0 ? 1 : -1;
    const nextIndex = (activeSectionIndex + direction + sectionOrder.length) % sectionOrder.length;
    navigateToSection(sectionOrder[nextIndex], { direction, skipLock: true });
  },
  { passive: false }
);

langToggle.addEventListener("click", () => {
  toggleLanguage();
  updateLanguageUI();
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();

  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
  window.location.href = `mailto:contacttrappi@gmail.com?subject=${subject}&body=${body}`;
});

gsap.from(".brand-block, .top-nav, .ritual-wheel, .oracle-shell", {
  opacity: 0,
  y: 24,
  duration: 1.15,
  stagger: 0.08,
  ease: "power3.out"
});

gsap.from(".panel-card", {
  opacity: 0,
  x: 26,
  duration: 0.95,
  stagger: 0.1,
  ease: "power2.out",
  delay: 0.25
});

updateLanguageUI();
setBackgroundVideo(currentSection, { force: true });
setActiveSection(currentSection);

if (backgroundVideo) {
  backgroundVideo.addEventListener("ended", () => {
    transitionBackgroundVideo(currentSection, { restartCurrent: true });
  });
}

// Initialize audio manager
AudioManager.init();
