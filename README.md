# Cult Lamb Portfolio V2

This folder is a full standalone portfolio V2.
Your existing portfolio files were not modified.

## Stack

- Vite
- Three.js
- GSAP
- Vanilla JS modules

## Run locally

```bash
cd cult-lamb-portfolio-v2
npm install
npm run dev
```

If you open the HTML files directly, base styles still load.
For full 3D and module behavior, use a local server (Vite dev or preview).

## Build

```bash
npm run build
npm run preview
```

## Pages

- Portfolio: /index.html

## How project data works

1. Open src/data/default-projects.js.
2. Add or edit project objects manually.
3. Portfolio page renders that list directly.

## Quick customization checklist

1. Update section texts in src/i18n.js.
2. Replace default projects in src/data/default-projects.js.
3. Tune 3D camera targets and colors in src/scene.js.
4. Update visuals in src/styles/main.css.
5. Replace contact email in src/main.js mailto link.

## Notes

- CV links point to ../assets/documents/CV.pdf and ../assets/documents/Resume.pdf.
- On mobile, the side wheel menu is hidden and top navigation remains active.
