import * as THREE from "three";
import { gsap } from "gsap";

const focusPresets = {
  home: { cam: [0, 2.4, 9], look: [0, 1.2, 0], color: "#ba2f00" },
  about: { cam: [-2.5, 2.2, 7.5], look: [0, 1.3, 0], color: "#9f1f13" },
  projects: { cam: [2.8, 2.1, 7.8], look: [0, 1.1, 0], color: "#c85606" },
  skills: { cam: [-4, 2.6, 6.5], look: [-1, 1.2, 0], color: "#7b1010" },
  experience: { cam: [4.2, 2.3, 6.5], look: [1.2, 1.1, 0], color: "#8f200f" },
  contact: { cam: [0, 2.8, 6.2], look: [0, 1.1, 0], color: "#da4a00" },
  cv: { cam: [-1.4, 3.2, 8], look: [0, 1.5, 0], color: "#b34709" },
  woolhaven: { cam: [8.2, 2.1, 6], look: [5.2, 1.1, 0], color: "#f78f30" }
};

const sectionOrder = ["home", "about", "projects", "skills", "experience", "contact", "cv", "woolhaven"];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function interpolatePreset(progress) {
  const clamped = Math.max(0, Math.min(1, progress));
  const lastIndex = sectionOrder.length - 1;
  const scaled = clamped * lastIndex;
  const leftIndex = Math.min(lastIndex, Math.floor(scaled));
  const rightIndex = Math.min(lastIndex, leftIndex + 1);
  const localT = scaled - leftIndex;

  const left = focusPresets[sectionOrder[leftIndex]];
  const right = focusPresets[sectionOrder[rightIndex]];

  return {
    cam: [
      lerp(left.cam[0], right.cam[0], localT),
      lerp(left.cam[1], right.cam[1], localT),
      lerp(left.cam[2], right.cam[2], localT)
    ],
    look: [
      lerp(left.look[0], right.look[0], localT),
      lerp(left.look[1], right.look[1], localT),
      lerp(left.look[2], right.look[2], localT)
    ],
    color: new THREE.Color(left.color).lerp(new THREE.Color(right.color), localT)
  };
}

export function createCultScene(canvas) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#090708");
  scene.fog = new THREE.Fog("#090708", 8, 22);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(...focusPresets.home.cam);

  const cameraTarget = new THREE.Vector3(...focusPresets.home.look);
  const desiredCam = { ...vectorToObject(camera.position) };
  const desiredLook = { ...vectorToObject(cameraTarget) };

  const ambient = new THREE.AmbientLight("#9d4426", 0.8);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight("#ff8f4b", 1.2);
  keyLight.position.set(4, 8, 3);
  scene.add(keyLight);

  const rim = new THREE.PointLight("#ff4c00", 20, 16, 2);
  rim.position.set(0, 2.4, 0);
  scene.add(rim);

  const ritualGroup = new THREE.Group();
  scene.add(ritualGroup);

  const ground = new THREE.Mesh(
    new THREE.CylinderGeometry(9, 12, 0.4, 48),
    new THREE.MeshStandardMaterial({ color: "#1c1210", roughness: 0.92, metalness: 0.05 })
  );
  ground.position.y = -0.3;
  ritualGroup.add(ground);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.9, 0.15, 16, 100),
    new THREE.MeshStandardMaterial({ color: "#3a1912", emissive: "#711f0f", emissiveIntensity: 0.8 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.05;
  ritualGroup.add(ring);

  const altar = new THREE.Mesh(
    new THREE.CylinderGeometry(1.2, 1.7, 1.6, 12),
    new THREE.MeshStandardMaterial({ color: "#2f2322", roughness: 0.7, metalness: 0.2 })
  );
  altar.position.y = 0.7;
  ritualGroup.add(altar);

  const lambHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 20, 20),
    new THREE.MeshStandardMaterial({ color: "#e5dfd4", roughness: 0.6, metalness: 0.0 })
  );
  lambHead.position.set(0, 1.55, 0.2);
  ritualGroup.add(lambHead);

  const hornMaterial = new THREE.MeshStandardMaterial({ color: "#1e1614", roughness: 0.45, metalness: 0.5 });
  const hornLeft = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.8, 10), hornMaterial);
  hornLeft.position.set(-0.35, 2.02, 0.18);
  hornLeft.rotation.z = Math.PI * 0.18;
  ritualGroup.add(hornLeft);

  const hornRight = hornLeft.clone();
  hornRight.position.x = 0.35;
  hornRight.rotation.z = -Math.PI * 0.18;
  ritualGroup.add(hornRight);

  const eyeMaterial = new THREE.MeshBasicMaterial({ color: "#ff3300" });
  const eyeLeft = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), eyeMaterial);
  eyeLeft.position.set(-0.15, 1.58, 0.7);
  ritualGroup.add(eyeLeft);
  const eyeRight = eyeLeft.clone();
  eyeRight.position.x = 0.15;
  ritualGroup.add(eyeRight);

  const monolithGeometry = new THREE.BoxGeometry(0.5, 3.2, 0.5);
  const monolithMaterial = new THREE.MeshStandardMaterial({ color: "#181213", emissive: "#260f0a", emissiveIntensity: 0.4 });

  for (let index = 0; index < 8; index += 1) {
    const angle = (index / 8) * Math.PI * 2;
    const monolith = new THREE.Mesh(monolithGeometry, monolithMaterial);
    monolith.position.set(Math.cos(angle) * 5.2, 1.2, Math.sin(angle) * 5.2);
    monolith.rotation.y = angle;
    ritualGroup.add(monolith);
  }

  const runeGeometry = new THREE.TorusKnotGeometry(0.9, 0.06, 96, 12, 2, 3);
  const runeMaterial = new THREE.MeshStandardMaterial({ color: "#5e2112", emissive: "#ff4a0b", emissiveIntensity: 1.25 });
  const rune = new THREE.Mesh(runeGeometry, runeMaterial);
  rune.position.y = 2.7;
  rune.rotation.x = Math.PI / 2;
  ritualGroup.add(rune);

  const flameGroup = new THREE.Group();
  ritualGroup.add(flameGroup);
  const flames = [];

  const flameGeometry = new THREE.ConeGeometry(0.2, 0.65, 10);
  for (let index = 0; index < 14; index += 1) {
    const flame = new THREE.Mesh(
      flameGeometry,
      new THREE.MeshStandardMaterial({
        color: "#ff7e00",
        emissive: "#ff3700",
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.92
      })
    );

    const angle = (index / 14) * Math.PI * 2;
    const radius = 2.95 + Math.random() * 0.35;
    flame.position.set(Math.cos(angle) * radius, 0.5, Math.sin(angle) * radius);
    flame.rotation.x = Math.PI;
    flame.rotation.z = angle;
    flame.userData.seed = Math.random() * Math.PI * 2;
    flames.push(flame);
    flameGroup.add(flame);
  }

  const woolhavenGroup = new THREE.Group();
  woolhavenGroup.position.set(5.5, 0, 0);
  scene.add(woolhavenGroup);

  const meadow = new THREE.Mesh(
    new THREE.CircleGeometry(3.8, 30),
    new THREE.MeshStandardMaterial({ color: "#4a5e33", roughness: 1 })
  );
  meadow.rotation.x = -Math.PI / 2;
  meadow.position.y = -0.09;
  woolhavenGroup.add(meadow);

  const hutBase = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 1, 1.2),
    new THREE.MeshStandardMaterial({ color: "#c98f5e", roughness: 0.95 })
  );
  hutBase.position.set(0, 0.4, 0);
  woolhavenGroup.add(hutBase);

  const hutRoof = new THREE.Mesh(
    new THREE.ConeGeometry(1.02, 0.9, 4),
    new THREE.MeshStandardMaterial({ color: "#843f25", roughness: 0.9 })
  );
  hutRoof.position.set(0, 1.35, 0);
  hutRoof.rotation.y = Math.PI / 4;
  woolhavenGroup.add(hutRoof);

  const treeTrunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.18, 0.7, 10),
    new THREE.MeshStandardMaterial({ color: "#6a3a26", roughness: 1 })
  );
  treeTrunk.position.set(1.7, 0.28, 0.5);
  woolhavenGroup.add(treeTrunk);

  const treeCrown = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 14, 14),
    new THREE.MeshStandardMaterial({ color: "#6e8a42", roughness: 1 })
  );
  treeCrown.position.set(1.7, 0.95, 0.5);
  woolhavenGroup.add(treeCrown);

  const particleCount = 110;
  const particlesGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const seeds = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i += 1) {
    const i3 = i * 3;
    const radius = 2 + Math.random() * 6;
    const theta = Math.random() * Math.PI * 2;
    positions[i3] = Math.cos(theta) * radius;
    positions[i3 + 1] = 0.2 + Math.random() * 4.2;
    positions[i3 + 2] = Math.sin(theta) * radius;
    seeds[i] = Math.random() * Math.PI * 2;
  }

  particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particlesGeometry.setAttribute("seed", new THREE.BufferAttribute(seeds, 1));

  const particles = new THREE.Points(
    particlesGeometry,
    new THREE.PointsMaterial({
      color: "#ff6b2c",
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  scene.add(particles);

  const flashOverlay = document.createElement("div");
  flashOverlay.className = "scene-flash-overlay";
  document.body.appendChild(flashOverlay);

  const pointer = { x: 0, y: 0 };
  window.addEventListener("pointermove", (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
  });

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener("resize", onResize);

  let rafId;
  const clock = new THREE.Clock();

  function tick() {
    const elapsed = clock.getElapsedTime();

    rune.rotation.y += 0.01;
    rune.rotation.z = Math.sin(elapsed * 0.7) * 0.15;

    altar.scale.y = 1 + Math.sin(elapsed * 1.1) * 0.035;
    ring.material.emissiveIntensity = 0.6 + Math.sin(elapsed * 1.4) * 0.25;

    flames.forEach((flame) => {
      const wave = Math.sin(elapsed * 5 + flame.userData.seed);
      flame.scale.y = 0.8 + (wave + 1) * 0.25;
      flame.material.opacity = 0.72 + (wave + 1) * 0.1;
    });

    const positionAttr = particlesGeometry.getAttribute("position");
    const seedAttr = particlesGeometry.getAttribute("seed");

    for (let i = 0; i < positionAttr.count; i += 1) {
      const y = 0.4 + ((i % 10) * 0.26 + Math.sin(elapsed + seedAttr.getX(i))) * 0.25;
      positionAttr.setY(i, y + Math.sin(elapsed * 0.8 + i) * 0.12);
    }
    positionAttr.needsUpdate = true;

    const parallaxX = pointer.x * 0.4;
    const parallaxY = pointer.y * 0.2;

    camera.position.x += (desiredCam.x + parallaxX - camera.position.x) * 0.04;
    camera.position.y += (desiredCam.y - parallaxY - camera.position.y) * 0.04;
    camera.position.z += (desiredCam.z - camera.position.z) * 0.04;

    cameraTarget.x += (desiredLook.x - cameraTarget.x) * 0.08;
    cameraTarget.y += (desiredLook.y - cameraTarget.y) * 0.08;
    cameraTarget.z += (desiredLook.z - cameraTarget.z) * 0.08;

    camera.lookAt(cameraTarget);
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(tick);
  }

  tick();

  function focusSection(sectionName) {
    const preset = focusPresets[sectionName] || focusPresets.home;
    const [cx, cy, cz] = preset.cam;
    const [lx, ly, lz] = preset.look;

    gsap.to(desiredCam, {
      x: cx,
      y: cy,
      z: cz,
      duration: 1.25,
      ease: "power3.out"
    });

    gsap.to(desiredLook, {
      x: lx,
      y: ly,
      z: lz,
      duration: 1.2,
      ease: "power2.out"
    });

    const color = new THREE.Color(preset.color);

    gsap.to(rim.color, {
      r: color.r,
      g: color.g,
      b: color.b,
      duration: 0.9
    });
  }

  function setScrollProgress(progress) {
    const preset = interpolatePreset(progress);

    desiredCam.x = preset.cam[0];
    desiredCam.y = preset.cam[1];
    desiredCam.z = preset.cam[2];

    desiredLook.x = preset.look[0];
    desiredLook.y = preset.look[1];
    desiredLook.z = preset.look[2];

    rim.color.copy(preset.color);
  }

  function setBossTransition(sectionName) {
    const preset = focusPresets[sectionName] || focusPresets.home;
    const flashColor = new THREE.Color(preset.color);

    flashOverlay.style.setProperty(
      "--flash-color",
      `rgba(${Math.round(flashColor.r * 255)}, ${Math.round(flashColor.g * 255)}, ${Math.round(flashColor.b * 255)}, 0.95)`
    );
    flashOverlay.classList.remove("is-active");
    void flashOverlay.offsetWidth;
    flashOverlay.classList.add("is-active");

    gsap.fromTo(rune.scale, { x: 1, y: 1, z: 1 }, { x: 1.18, y: 1.18, z: 1.18, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" });
    gsap.fromTo(ring.scale, { x: 1, y: 1, z: 1 }, { x: 1.08, y: 1.08, z: 1.08, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out" });
    renderer.domElement.style.filter = "brightness(1.15) contrast(1.08)";
    setTimeout(() => {
      renderer.domElement.style.filter = "";
    }, 160);
  }

  return {
    focusSection,
    setScrollProgress,
    setBossTransition,
    destroy() {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      flashOverlay.remove();
      renderer.dispose();
    }
  };
}

function vectorToObject(vector) {
  return {
    x: vector.x,
    y: vector.y,
    z: vector.z
  };
}
