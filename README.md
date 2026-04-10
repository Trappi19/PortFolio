# Portfolio V2

Portfolio interactif (HTML/CSS/JS modules) avec navigation par sections, fond video, modal projets, audio d'ambiance et systeme FR/EN.

## Stack

- Vite
- Three.js
- GSAP
- Vanilla JS modules

## Lancer en local

```bash
npm install
npm run dev
```

## Build production

```bash
npm run build
npm run preview
```

## Structure du projet

```text
.
|- index.html
|- src/
|  |- main.js                  # Orchestrateur principal (navigation, UI, modal, transitions)
|  |- scene.js                 # Scene 3D Three.js (camera, lumieres, animation)
|  |- audio.js                 # Gestion audio (musique, SFX, panel, mute)
|  |- i18n.js                  # Traductions FR/EN et application data-i18n
|  |- projects-store.js        # API locale pour recuperer la liste des projets
|  |- data/
|  |  |- default-projects.js   # Source de verite des cartes projets
|  |- styles/
|     |- main.css              # Styles globaux, layout, composants, animations
|- sounds/
|- sprites/
|- vid/
```

## Guide de modification rapide

1. Modifier les textes FR/EN: `src/i18n.js`
2. Ajouter ou editer un projet: `src/data/default-projects.js`
3. Changer la navigation/sections/modal: `src/main.js`
4. Changer l'ambiance visuelle 3D: `src/scene.js`
5. Changer le style UI: `src/styles/main.css`
6. Changer l'audio (playlist/SFX/comportement): `src/audio.js`

## Points d'attention maintenance

- Les IDs des sections dans `index.html` doivent correspondre aux cibles `data-target` utilisees par `src/main.js`.
- Les cles de traduction `data-i18n` dans le HTML doivent exister dans `src/i18n.js`.
- La grille projets est rendue dynamiquement depuis `src/data/default-projects.js`.
- L'adresse de contact par email est definie dans `src/main.js` (mailto du formulaire).

## Notes

- Les liens CV/Resume dans `index.html` pointent vers `../assets/documents/CV.pdf` et `../assets/documents/Resume.pdf`.
- Sur mobile, la roue laterale peut etre masquee tandis que la top-nav reste active.
