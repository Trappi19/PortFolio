import {
  deleteCustomProject,
  exportCustomProjects,
  getCustomProjects,
  importCustomProjects,
  upsertCustomProject
} from "./projects-store.js";

const projectForm = document.getElementById("projectForm");
const resetBtn = document.getElementById("resetBtn");
const projectTable = document.getElementById("projectTable");
const statsLine = document.getElementById("statsLine");
const exportBtn = document.getElementById("exportBtn");
const importInput = document.getElementById("importInput");
const imagePreviewImg = document.getElementById("imagePreviewImg");
const imagePreviewFallback = document.getElementById("imagePreviewFallback");

function resolveImageUrl(value) {
  const image = String(value || "").trim();
  if (!image) {
    return "";
  }

  if (/^(https?:|data:|blob:|file:)/i.test(image)) {
    return image;
  }

  try {
    return new URL(image, window.location.href).href;
  } catch {
    return image;
  }
}

function updateImagePreview(value) {
  const imageUrl = resolveImageUrl(value);
  if (!imageUrl || !imagePreviewImg || !imagePreviewFallback) {
    if (imagePreviewImg) {
      imagePreviewImg.hidden = true;
      imagePreviewImg.removeAttribute("src");
    }
    if (imagePreviewFallback) {
      imagePreviewFallback.hidden = false;
      imagePreviewFallback.textContent = "No image selected.";
    }
    return;
  }

  imagePreviewImg.hidden = false;
  imagePreviewImg.src = imageUrl;
  imagePreviewFallback.hidden = true;

  imagePreviewImg.onerror = () => {
    imagePreviewImg.hidden = true;
    imagePreviewImg.removeAttribute("src");
    imagePreviewFallback.hidden = false;
    imagePreviewFallback.textContent = "Image cannot be loaded. Check the URL/path.";
  };

  imagePreviewImg.onload = () => {
    imagePreviewFallback.hidden = true;
  };
}

function collectFormData(form) {
  const formData = new FormData(form);

  return {
    id: String(formData.get("id") || "") || `custom-${Date.now()}`,
    slug: String(formData.get("slug") || "").trim(),
    titleFr: String(formData.get("titleFr") || "").trim(),
    titleEn: String(formData.get("titleEn") || "").trim(),
    descriptionFr: String(formData.get("descriptionFr") || "").trim(),
    descriptionEn: String(formData.get("descriptionEn") || "").trim(),
    category: String(formData.get("category") || "general").trim(),
    tags: String(formData.get("tags") || ""),
    accent: String(formData.get("accent") || "#d94f04"),
    url: String(formData.get("url") || "").trim(),
    repo: String(formData.get("repo") || "").trim(),
    image: String(formData.get("image") || "").trim(),
    featured: formData.get("featured") === "on"
  };
}

function createThumbCell(project) {
  const src = project.image || "";
  if (!src) {
    return '<span class="muted">-</span>';
  }

  return `<img class="table-thumb" src="${src}" alt="${project.title.en}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('span'), { className: 'muted', textContent: 'invalid' }))" />`;
}

function renderTable() {
  const projects = getCustomProjects();

  statsLine.textContent = `${projects.length} custom project(s) stored • ${projects.filter((project) => project.featured).length} featured`;

  if (!projects.length) {
    projectTable.innerHTML = '<p class="muted">No custom projects yet. Add your first one above.</p>';
    return;
  }

  projectTable.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Image</th>
          <th>Slug</th>
          <th>Title EN</th>
          <th>Category</th>
          <th>Tags</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${projects
          .map(
            (project) => `
              <tr>
                <td>${createThumbCell(project)}</td>
                <td>${project.slug}</td>
                <td>${project.title.en}</td>
                <td>${project.category}</td>
                <td>${project.tags.join(", ")}</td>
                <td>
                  <button class="table-btn" data-action="edit" data-id="${project.id}">Edit</button>
                  <button class="table-btn table-btn--danger" data-action="delete" data-id="${project.id}">Delete</button>
                </td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function fillForm(project) {
  projectForm.elements.id.value = project.id;
  projectForm.elements.slug.value = project.slug;
  projectForm.elements.titleFr.value = project.title.fr;
  projectForm.elements.titleEn.value = project.title.en;
  projectForm.elements.descriptionFr.value = project.description.fr;
  projectForm.elements.descriptionEn.value = project.description.en;
  projectForm.elements.category.value = project.category;
  projectForm.elements.tags.value = project.tags.join(", ");
  projectForm.elements.accent.value = project.accent;
  projectForm.elements.url.value = project.url;
  projectForm.elements.repo.value = project.repo;
  projectForm.elements.image.value = project.image;
  projectForm.elements.featured.checked = project.featured;
  updateImagePreview(project.image);
}

function clearForm() {
  projectForm.reset();
  projectForm.elements.id.value = "";
  projectForm.elements.accent.value = "#d94f04";
  updateImagePreview("");
}

projectForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = collectFormData(projectForm);
  if (!data.slug) {
    alert("Slug is required.");
    return;
  }

  upsertCustomProject(data);
  renderTable();
  clearForm();
});

resetBtn.addEventListener("click", () => {
  clearForm();
});

projectTable.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const { action, id } = button.dataset;
  const projects = getCustomProjects();
  const project = projects.find((item) => item.id === id);

  if (!project) {
    return;
  }

  if (action === "edit") {
    fillForm(project);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (action === "delete") {
    const confirmed = window.confirm(`Delete project ${project.slug}?`);
    if (!confirmed) {
      return;
    }

    deleteCustomProject(project.id);
    renderTable();
  }
});

exportBtn.addEventListener("click", () => {
  const json = exportCustomProjects();
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "cult-portfolio-projects.json";
  anchor.click();
  URL.revokeObjectURL(url);
});

importInput.addEventListener("change", async () => {
  const [file] = importInput.files || [];
  if (!file) {
    return;
  }

  const text = await file.text();

  try {
    const count = importCustomProjects(text);
    alert(`Imported ${count} project(s).`);
    renderTable();
    clearForm();
  } catch (error) {
    alert(error instanceof Error ? error.message : "Invalid import file.");
  } finally {
    importInput.value = "";
  }
});

projectForm.elements.image.addEventListener("input", (event) => {
  updateImagePreview(event.target.value);
});

renderTable();
updateImagePreview("");
