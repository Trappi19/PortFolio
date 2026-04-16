# Portfolio personnel

Ce projet est mon portfolio personnel. J'ai voulu en faire un site immersif, un peu different d'un portfolio classique, avec une ambiance visuelle plus marquee, des transitions animees, une navigation par sections, un fond video, une modale pour detailer les projets, de l'audio d'ambiance et un contenu disponible en FR/EN.

L'idee de base a aussi ete accompagnee par l'IA pour m'aider a clarifier ce que je voulais construire, structurer l'ambiance generale et donner une direction au rendu final. Le premier rendu est disponible sur GitHub Pages.

## Technologies utilisees

- HTML5 / CSS3 / JavaScript moderne
- Vite
- Three.js
- GSAP
- Modules JavaScript natifs

## Ce que fait le site

- Navigation entre les differentes sections du portfolio
- Affichage dynamique des projets avec une modale de detail
- Gestion d'une interface bilingue FR/EN
- Integration d'une ambiance sonore et de comportements audio
- Mise en scene visuelle avec videos de fond et animations

## Lancer le projet en local

```bash
npm install
npm run dev
```

## Generer la version de production

```bash
npm run build
npm run preview
```

## Organisation du projet

```text
.
|- index.html
|- src/
|  |- main.js                  # Orchestration generale : navigation, UI, modal, transitions
|  |- scene.js                 # Scene 3D Three.js : camera, lumieres, animation
|  |- audio.js                 # Gestion audio : musique, SFX, panel, mute
|  |- i18n.js                  # Traductions FR/EN et application des attributs data-i18n
|  |- projects-store.js        # Recuperation de la liste des projets
|  |- data/
|  |  |- default-projects.js   # Source de verite des cartes projets
|  |- styles/
|     |- main.css              # Styles globaux, layout, composants, animations
|- sounds/
|- sprites/
|- vid/
```

## Modifier rapidement le projet

1. Modifier les textes FR/EN : [src/i18n.js](src/i18n.js)
2. Ajouter ou editer un projet : [src/data/default-projects.js](src/data/default-projects.js)
3. Changer la navigation, les sections ou la modale : [src/main.js](src/main.js)
4. Ajuster l'ambiance visuelle 3D : [src/scene.js](src/scene.js)
5. Revoir le style de l'interface : [src/styles/main.css](src/styles/main.css)
6. Modifier l'audio et son comportement : [src/audio.js](src/audio.js)

## Points a connaitre

- Les IDs des sections dans `index.html` doivent correspondre aux cibles `data-target` utilisees par `src/main.js`.
- Les cles `data-i18n` du HTML doivent exister dans `src/i18n.js`.
- La liste des projets est generee a partir de `src/data/default-projects.js`.
- L'adresse email utilisee pour le formulaire de contact est definie dans `src/main.js`.

## Version en ligne

- Premier rendu deploye sur GitHub Pages.
