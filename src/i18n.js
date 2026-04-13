const LANGUAGE_KEY = "cultPortfolioLanguage.v2";

// Translation dictionary indexed by locale -> key.
// Keep translation keys stable to avoid breaking existing data-i18n bindings.
const dictionary = {
  en: {
    "label.home": "Invocation Gate",
    "label.about": "Story",
    "label.projects": "Relics",
    "label.skills": "Arsenal",
    "label.experience": "Path",
    "label.contact": "Whisper",
    "label.cv": "Scrolls",
    "label.woolhaven": "Village",
    "home.title": "I build interactive digital rituals.",
    "home.copy": "Welcome to my world: software, game dev experimentation, and crafted interfaces where performance meets style.",
    "home.ctaProjects": "Explore projects",
    "about.title": "About me",
    "about.copy1": "I am Sevan, a young full-stack minded developer from France. I like expressive front-end systems and strong technical foundations.",
    "about.copy2": "This V2 is built as a preconfigured system: you can plug content in quickly while keeping a premium look and motion language.",
    "projects.title": "Projects",
    "skills.title": "Skills",
    "skills.copy": "Replace this list with your real stack or split by frontend, backend, and game-dev specializations.",
    "experience.title": "Experience and studies",
    "experience.step1Title": "CESI - IT Developer path",
    "experience.step1Copy": "Add your school timeline, major courses, and key achievements.",
    "experience.step2Title": "Personal game experiments",
    "experience.step2Copy": "Document your Unity projects, prototypes, and technical decisions.",
    "experience.step3Title": "Freelance or team projects",
    "experience.step3Copy": "Add mission goals, your role, and measurable outcomes.",
    "contact.title": "Contact me",
    "contact.name": "Name",
    "contact.message": "Message",
    "contact.placeholderName": "Your name",
    "contact.placeholderMessage": "Tell me about your project",
    "contact.send": "Send by email",
    "cv.title": "CV and resume",
    "cv.copy": "Link your latest files here. Keep both FR and EN versions up to date.",
    "cv.downloadCv": "Open CV",
    "cv.downloadResume": "Open resume",
    "woolhaven.title": "Woolhaven corner",
    "woolhaven.copy": "A warmer area for playful projects, art, side quests, and content with a brighter tone.",
    "woolhaven.item1": "Art direction experiments",
    "woolhaven.item2": "Creative coding mini-scenes",
    "woolhaven.item3": "Community and personal updates"
  },
  fr: {
    "label.home": "Portail",
    "label.about": "Histoire",
    "label.projects": "Reliques",
    "label.skills": "Arsenal",
    "label.experience": "Parcours",
    "label.contact": "Message",
    "label.cv": "Parchemins",
    "label.woolhaven": "Village",
    "home.title": "Bien le bonjour sur mon portfolio !",
    "home.copy": "Bienvenue dans mon univers: developpement logiciel, experimentation game dev, test informatique, bidouille de la techonolige et interfaces soignees qui restent (au mieux) performantes.",
    "home.copy2": "Le seul moyen d'apprendre c'est d'appliquer et de confronté de vrai projets, personnel ou sur commande. Je suis ouvert a toute proposition de collaboration, freelance ou emploi. (en recherche de stage) ☺️",
    "home.ctaProjects": "Voir les projets",
    "about.title": "A propos",
    "about.copy1": "Je suis Sevan, developpeur full-stack de France. J'aime les interfaces expressives et les bases techniques solides. Même si je suis toujours en étude, j'essaie de varier mes projets et de consolider mes aquis. Je suis passionné par les jeux vidéo, la musique et les experiences interactives en general.",
    "about.copy2": "J'apprécie quand on me donne des conseils pour améliorer mon travail, n'hesitez pas a me contacter si vous avez des suggestions ou des opportunités de projet. N'hésitez pas à regarder mes projets et me donner votre avis !",
    "projects.title": "Projets",
    "skills.title": "Competences",
    "skills.copy": "Remplace cette liste avec ta stack reelle ou separe frontend, backend et game dev.",
    "experience.title": "Experience et etudes",
    "experience.step1Title": "CESI - Parcours Developpeur IT",
    "experience.step1Copy": "Ajoute ta timeline, les cours marquants et tes resultats.",
    "experience.step2Title": "Experiences de jeu personnelles",
    "experience.step2Copy": "Documente tes prototypes Unity et decisions techniques.",
    "experience.step3Title": "Missions freelances ou equipe",
    "experience.step3Copy": "Ajoute objectifs, role et resultats mesurables.",
    "contact.title": "Me contacter",
    "contact.name": "Nom",
    "contact.message": "Message",
    "contact.placeholderName": "Ton nom",
    "contact.placeholderMessage": "Parle-moi de ton projet",
    "contact.send": "Envoyer par email",
    "cv.title": "CV et resume",
    "cv.copy": "Vous pouvez lire ou télécharger mon CV ou mon resume ici.",
    "cv.downloadCv": "Ouvrir le CV",
    "cv.downloadResume": "Ouvrir le resume",
    "woolhaven.title": "Coin Woolhaven",
    "woolhaven.copy": "Une zone plus chaleureuse pour les projets creatifs, art et contenus plus lumineux.",
    "woolhaven.item1": "Experimentations de direction artistique",
    "woolhaven.item2": "Mini-scenes de creative coding",
    "woolhaven.item3": "Actualites perso et communaute"
  }
};

export function getLanguage() {
  const saved = localStorage.getItem(LANGUAGE_KEY);
  if (saved === "fr" || saved === "en") {
    return saved;
  }

  return "en";
}

export function setLanguage(lang) {
  const safe = lang === "fr" ? "fr" : "en";
  localStorage.setItem(LANGUAGE_KEY, safe);
  return safe;
}

export function toggleLanguage() {
  return setLanguage(getLanguage() === "en" ? "fr" : "en");
}

export function translate(key, lang = getLanguage()) {
  // Falls back to EN then key itself to avoid blank UI labels.
  const languagePack = dictionary[lang] || dictionary.en;
  return languagePack[key] || dictionary.en[key] || key;
}

export function applyTranslations(root = document, lang = getLanguage()) {
  // Text content update
  root.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    node.textContent = translate(key, lang);
  });

  // Placeholder attribute update
  root.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const key = node.getAttribute("data-i18n-placeholder");
    node.setAttribute("placeholder", translate(key, lang));
  });
}
