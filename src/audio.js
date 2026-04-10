// Audio Manager Module
const AudioManager = (() => {
  // Playlist used for random background rotation.
  // Add/remove tracks here only.
  const musicFiles = [
    "Cult of the Lamb [Official] - Anchordeep.mp3",
    "Cult of the Lamb [Official] - First Son, Baal.mp3",
    "Cult of the Lamb [Official] - Midas.mp3",
    "Cult of the Lamb [Official] - Praise the Lamb.mp3",
    "Cult of the Lamb [Official] - Sacrifice.mp3",
    "Cult of the Lamb [Official] - Saviour.mp3",
    "Cult of the Lamb [Official] - Sozo.mp3",
    "Cult of the Lamb [Official] - Start a Cult.mp3"
  ];

  const SFX_PATH = "./sounds/Press Button.mp3";
  const MUSIC_PATH = "./sounds/musics/";
  const STORAGE_KEY = "cultPortfolioAudioMuted";
  const PANEL_STORAGE_KEY = "cultPortfolioAudioPanelHidden";

  // Audio elements
  const bgmAudio = new Audio();
  const sfxAudio = new Audio();
  bgmAudio.loop = false;
  bgmAudio.preload = "auto";
  sfxAudio.preload = "auto";
  sfxAudio.src = SFX_PATH;

  let isMuted = localStorage.getItem(STORAGE_KEY) === "true";
  let isPanelHidden = localStorage.getItem(PANEL_STORAGE_KEY) === "true";
  let currentMusicTitle = "";
  let currentMusicFile = "";
  let autoplayBlocked = false;

  function setAutoplayHintVisible(visible) {
    const hint = document.getElementById("audioAutoplayHint");
    if (!hint) {
      return;
    }

    hint.hidden = !visible;
    hint.classList.toggle("is-visible", visible);
  }

  // Extract display title from filename (part after " - ")
  function extractTitle(filename) {
    const parts = filename.split(" - ");
    if (parts.length > 1) {
      return parts[parts.length - 1].replace(".mp3", "");
    }
    return filename.replace(".mp3", "");
  }

  // Get random music from list
  function getRandomMusic(excludeFile = "") {
    if (musicFiles.length <= 1) {
      return musicFiles[0] || "";
    }

    const choices = musicFiles.filter((file) => file !== excludeFile);
    const random = Math.floor(Math.random() * musicFiles.length);
    return choices[random % choices.length];
  }

  function setCurrentMusic(filename) {
    if (!filename) {
      return;
    }

    currentMusicFile = filename;
    bgmAudio.src = MUSIC_PATH + filename;
    currentMusicTitle = extractTitle(filename);
    updateControlPanel();
  }

  // Play background music.
  // If no file is provided, keeps current one or picks a random track.
  function playMusic(filename = "") {
    if (isMuted) {
      return;
    }

    if (filename) {
      setCurrentMusic(filename);
    }

    if (!bgmAudio.src) {
      setCurrentMusic(getRandomMusic());
    }

    bgmAudio
      .play()
      .then(() => {
        autoplayBlocked = false;
        setAutoplayHintVisible(false);
      })
      .catch(() => {
        // Expected on some browsers until a user gesture occurs.
      });
  }

  function tryAutoplayOnLoad() {
    if (isMuted) {
      return;
    }

    if (!bgmAudio.src) {
      setCurrentMusic(getRandomMusic());
    }

    bgmAudio.muted = true;
    bgmAudio
      .play()
      .then(() => {
        // Start muted for autoplay compliance, then restore audible playback.
        bgmAudio.muted = false;
        autoplayBlocked = false;
        setAutoplayHintVisible(false);
      })
      .catch(() => {
        // Browser blocked autoplay: UI hint will ask for first user interaction.
        bgmAudio.muted = false;
        autoplayBlocked = true;
        setAutoplayHintVisible(true);
      });
  }

  // Play SFX (button click)
  function playSFX() {
    if (isMuted) return;

    sfxAudio.currentTime = 0;
    sfxAudio.play().catch((err) => {
      console.warn("Could not play SFX:", err);
    });
  }

  // Toggle mute state
  function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem(STORAGE_KEY, String(isMuted));

    if (isMuted) {
      bgmAudio.muted = true;
      bgmAudio.pause();
    } else {
      bgmAudio.muted = false;
      playMusic();
    }

    updateControlPanel();
  }

  function setPanelHidden(hidden) {
    isPanelHidden = hidden;
    localStorage.setItem(PANEL_STORAGE_KEY, String(hidden));

    const panel = document.getElementById("audioControlPanel");
    const launcher = document.getElementById("audioPanelLauncher");
    panel?.classList.toggle("is-hidden", hidden);

    if (launcher) {
      launcher.hidden = !hidden;
      launcher.setAttribute("aria-expanded", String(!hidden));
    }
  }

  // Update control panel UI from current in-memory audio state.
  function updateControlPanel() {
    const titleEl = document.getElementById("audioTitle");
    const muteBtn = document.getElementById("audioMuteBtn");

    if (titleEl) {
      titleEl.textContent = currentMusicTitle || "No music";
    }

    if (muteBtn) {
      muteBtn.setAttribute("aria-pressed", isMuted);
      muteBtn.classList.toggle("is-muted", isMuted);
      muteBtn.title = isMuted ? "Unmute audio" : "Mute audio";
    }
  }

  // Initialize audio manager and connect DOM handlers.
  // Keep this function as the single startup entry point.
  function init() {
    setCurrentMusic(getRandomMusic());

    // Set initial mute state
    updateControlPanel();

    setPanelHidden(isPanelHidden);

    // Try immediate audible playback after load.
    tryAutoplayOnLoad();

    const unlockAudio = () => {
      if (autoplayBlocked) {
        setAutoplayHintVisible(false);
      }
      bgmAudio.muted = false;
      playMusic();
      document.removeEventListener("pointerdown", unlockAudio);
      document.removeEventListener("keydown", unlockAudio);
    };

    document.addEventListener("pointerdown", unlockAudio, { once: true });
    document.addEventListener("keydown", unlockAudio, { once: true });

    // Play next music when current ends
    bgmAudio.addEventListener("ended", () => {
      const nextMusic = getRandomMusic(currentMusicFile);
      playMusic(nextMusic);
    });

    // Attach SFX globally so newly created buttons/links are also covered.
    document.addEventListener("click", (event) => {
      const target = event.target;
      const clickable = target instanceof Element ? target.closest("button, a") : null;

      if (clickable) {
        playSFX();
      }
    });

    // Mute button handler
    const muteBtn = document.getElementById("audioMuteBtn");
    if (muteBtn) {
      muteBtn.addEventListener("click", () => {
        toggleMute();
      });
    }

    // Toggle panel visibility
    const toggleBtn = document.getElementById("audioToggleBtn");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        setPanelHidden(true);
      });
    }

    const launcher = document.getElementById("audioPanelLauncher");
    if (launcher) {
      launcher.addEventListener("click", () => {
        setPanelHidden(false);
      });
    }
  }

  // Public API used by src/main.js
  return {
    init,
    playSFX,
    playMusic,
    toggleMute,
    getCurrentTitle: () => currentMusicTitle,
    isMuted: () => isMuted
  };
})();

export default AudioManager;
