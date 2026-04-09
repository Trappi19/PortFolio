import { defaultProjects } from "./data/default-projects.js";

function normalizeImageSource(rawImage) {
  const image = String(rawImage || "").trim();
  if (!image) {
    return "";
  }

  if (/^(https?:|data:|blob:|file:)/i.test(image)) {
    return image;
  }

  if (typeof window === "undefined" || !window.location) {
    return image;
  }

  try {
    return new URL(image, window.location.href).href;
  } catch {
    return image;
  }
}

function normalizeProject(input) {
  const fallbackTitle = input?.title?.en || "Untitled project";
  const fallbackDescription = input?.description?.en || "Add a project description in src/data/default-projects.js.";

  const tags = Array.isArray(input?.tags) ? input.tags : [];

  return {
    id: String(input?.id || fallbackTitle.toLowerCase().replace(/\s+/g, "-")),
    slug: String(input?.slug || fallbackTitle.toLowerCase().replace(/\s+/g, "-")).replace(/[^a-z0-9-]/gi, ""),
    title: {
      fr: String(input?.title?.fr || fallbackTitle),
      en: String(input?.title?.en || fallbackTitle)
    },
    description: {
      fr: String(input?.description?.fr || fallbackDescription),
      en: String(input?.description?.en || fallbackDescription)
    },
    category: String(input?.category || "general"),
    tags,
    accent: String(input?.accent || "#d94f04"),
    image: normalizeImageSource(input?.image),
    url: String(input?.url || ""),
    repo: String(input?.repo || ""),
    featured: Boolean(input?.featured)
  };
}

export function getAllProjects() {
  return defaultProjects.map((project) => normalizeProject(project));
}
