import { defaultProjects } from "./data/default-projects.js";

const STORAGE_KEY = "cultPortfolioProjects.v2";

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

function readRawCustomProjects() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeProject(input) {
  const nowId = `custom-${Date.now()}`;
  const fallbackTitle = input?.title?.en || input?.titleEn || "Untitled project";
  const fallbackDescription =
    input?.description?.en || input?.descriptionEn || "Add a project description in the dashboard.";

  const tags = Array.isArray(input?.tags)
    ? input.tags
    : String(input?.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean);

  return {
    id: String(input?.id || nowId),
    slug: String(input?.slug || fallbackTitle.toLowerCase().replace(/\s+/g, "-")).replace(/[^a-z0-9-]/gi, ""),
    title: {
      fr: String(input?.title?.fr || input?.titleFr || fallbackTitle),
      en: String(input?.title?.en || input?.titleEn || fallbackTitle)
    },
    description: {
      fr: String(input?.description?.fr || input?.descriptionFr || fallbackDescription),
      en: String(input?.description?.en || input?.descriptionEn || fallbackDescription)
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

function writeCustomProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function getCustomProjects() {
  return readRawCustomProjects().map((project) => normalizeProject(project));
}

export function getAllProjects() {
  const custom = getCustomProjects();
  const bySlug = new Map();

  defaultProjects.forEach((project) => {
    bySlug.set(project.slug, normalizeProject(project));
  });

  custom.forEach((project) => {
    bySlug.set(project.slug, normalizeProject(project));
  });

  return [...bySlug.values()];
}

export function upsertCustomProject(input) {
  const project = normalizeProject(input);
  const projects = getCustomProjects();
  const index = projects.findIndex((item) => item.id === project.id || item.slug === project.slug);

  if (index === -1) {
    projects.unshift(project);
  } else {
    projects[index] = project;
  }

  writeCustomProjects(projects);
  return project;
}

export function deleteCustomProject(id) {
  const projects = getCustomProjects().filter((project) => project.id !== id);
  writeCustomProjects(projects);
}

export function exportCustomProjects() {
  return JSON.stringify(getCustomProjects(), null, 2);
}

export function importCustomProjects(jsonText) {
  const parsed = JSON.parse(jsonText);
  if (!Array.isArray(parsed)) {
    throw new Error("Import must be a JSON array.");
  }

  const normalized = parsed.map((project) => normalizeProject(project));
  writeCustomProjects(normalized);
  return normalized.length;
}

export function resetCustomProjects() {
  writeCustomProjects([]);
}
