// Add projects manually in this array.
// Required shape for each card:
// {
//   id: "unique-id",
//   slug: "unique-slug",
//   title: { fr: "Titre FR", en: "English Title" },
//   description: { fr: "Description FR", en: "English description" },
//   category: "game|web|design|...",
//   tags: ["Tech 1", "Tech 2"],
//   accent: "#d94f04",
//   image: "./sprites/your-image.webp",
//   url: "https://your-live-project.url",
//   repo: "https://github.com/you/repository",
//   featured: true
// }
export const defaultProjects = [
  {
    id: "default-horror",
    slug: "project-horror",
    title: {
      fr: "Project Horror",
      en: "Project Horror"
    },
    description: {
      fr: "Prototype de jeu psychologique Unity en cours de production.",
      en: "Psychological horror game prototype in active development."
    },
    category: "game",
    tags: ["Unity", "C#", "Gameplay"],
    accent: "#b90f0a",
    image: "./sprites/Lamb_Cards_Loop.webp",
    url: "",
    repo: "",
    featured: true
  },
  {
    id: "default-exhibition",
    slug: "family-exhibition",
    title: {
      fr: "Exposition artistique",
      en: "Art Exhibition"
    },
    description: {
      fr: "Exposition avec ma famille autour de mes productions numeriques.",
      en: "Family exhibition featuring my digital art pieces."
    },
    category: "design",
    tags: ["Digital Art", "Print", "Curation"],
    accent: "#cf7300",
    image: "./sprites/Main_menu-animation.gif",
    url: "",
    repo: "",
    featured: false
  },
  {
    id: "default-artwork",
    slug: "digital-artwork",
    title: {
      fr: "Collection digitale",
      en: "Digital Artwork"
    },
    description: {
      fr: "Selection de travaux graphiques publies sur mes reseaux.",
      en: "Selection of graphic works published on social media."
    },
    category: "design",
    tags: ["Illustration", "Visual", "Branding"],
    accent: "#d94f04",
    image: "./sprites/Lamb_posted_in_Twitter.webp",
    url: "",
    repo: "",
    featured: true
  },
  {
  id: "default-mobile",
  slug: "mobile-app",
  title: { fr: "Last Meal Memory", en: "Last Meal Memory" },
  description: { fr: "Une application mobile pour ma famille. Cell-ci permet de prévoir des plats pour de futur invité et organiser leurs goûts. Tout relié à une base de donnée en ligne ou local.", en: "A mobile app for my family. It allows us to plan meals for future guests and organize their preferences. Everything is connected to an online or local database." },
  category: "Sql|Kotlin|Mobile",
  tags: ["Android Studio", "SQLite"],
  accent: "#0882a7",
  image: "./sprites/Crown_29-adventurm-eap-animation.gif",
  url: "https://your-live-project.url",
  repo: "https://github.com/Trappi19/Gestion_MobileK",
  featured: true
  }
];