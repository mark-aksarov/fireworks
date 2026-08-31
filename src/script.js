import * as THREE from "three";

import dropVertexShader from "./shaders/drop/vertex.glsl";
import dropFragmentShader from "./shaders/drop/fragment.glsl";

import particlesVertexShader from "./shaders/particles/vertex.glsl";
import particlesFragmentShader from "./shaders/particles/fragment.glsl";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * =========================================================
 * CANVAS
 * =========================================================
 */

const canvas = document.querySelector("canvas.webgl");

const isMobile =
  window.matchMedia("(max-width: 768px)").matches ||
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

const isSmallMobile = window.matchMedia("(max-width: 480px)").matches;

/**
 * =========================================================
 * SCENE
 * =========================================================
 */

const scene = new THREE.Scene();

/**
 * =========================================================
 * CAMERA
 * =========================================================
 */

const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);

camera.position.set(0, 0, isMobile ? 16 : 15);

scene.add(camera);

/**
 * =========================================================
 * CONTROLS
 * =========================================================
 */

const controls = new OrbitControls(camera, canvas);

controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = !isSmallMobile;

canvas.style.touchAction = "none";

/**
 * =========================================================
 * RENDERER
 * =========================================================
 */

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
});

const maxPixelRatio = isMobile ? (isSmallMobile ? 1 : 1.5) : 2;

renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.toneMapping = THREE.ReinhardToneMapping;

renderer.toneMappingExposure = 1;

/**
 * =========================================================
 * CURVE 1
 * =========================================================
 */

const curve1 = new THREE.SplineCurve([
  new THREE.Vector2(0.0, 0.0),
  new THREE.Vector2(0.047439, 0.008781),
  new THREE.Vector2(0.083663, 0.036272),
  new THREE.Vector2(0.105215, 0.080331),
  new THREE.Vector2(0.113577, 0.124871),
  new THREE.Vector2(0.115893, 0.169723),
  new THREE.Vector2(0.114094, 0.226568),
  new THREE.Vector2(0.109559, 0.280991),
  new THREE.Vector2(0.10237, 0.34497),
  new THREE.Vector2(0.092311, 0.42474),
  new THREE.Vector2(0.080957, 0.514696),
  new THREE.Vector2(0.07082, 0.594478),
  new THREE.Vector2(0.064582, 0.662809),
  new THREE.Vector2(0.054219, 0.788387),
  new THREE.Vector2(0.045788, 0.890215),
  new THREE.Vector2(0.035777, 1.016548),
  new THREE.Vector2(0.017421, 1.161712),
  new THREE.Vector2(0.0, 1.188697),
]);

/**
 * =========================================================
 * CURVE 2
 * =========================================================
 */

const curve2 = new THREE.SplineCurve([
  new THREE.Vector2(0.0, 0.05249219),
  new THREE.Vector2(0.02353037, 0.05557644),
  new THREE.Vector2(0.04733661, 0.07088265),
  new THREE.Vector2(0.06289341, 0.0987086),
  new THREE.Vector2(0.0700641, 0.130316),
  new THREE.Vector2(0.07257684, 0.1615261),
  new THREE.Vector2(0.07244543, 0.19605456),
  new THREE.Vector2(0.07011111, 0.23376948),
  new THREE.Vector2(0.06502574, 0.28320913),
  new THREE.Vector2(0.05755539, 0.3417307),
  new THREE.Vector2(0.04716476, 0.4177944),
  new THREE.Vector2(0.03611469, 0.50519714),
  new THREE.Vector2(0.02592416, 0.59628838),
  new THREE.Vector2(0.01742113, 0.67885639),
  new THREE.Vector2(0.007927, 0.763),
  new THREE.Vector2(0.0, 0.77643018),
]);

const slicePointCount = 100;

const points1 = curve1.getPoints(slicePointCount);

const points2 = curve2.getPoints(slicePointCount);

/**
 * =========================================================
 * COLORS
 * =========================================================
 */

const glowColors = [
  new THREE.Color(0xd13ee6),
  new THREE.Color(0x0000ff),
  new THREE.Color(0xff3366),
  new THREE.Color(0x33ccff),
  new THREE.Color(0xffffff),
];

/**
 * =========================================================
 * SETTINGS
 * =========================================================
 */

const settings = {
  /**
   * -------------------------------------------------------
   * Animation
   * -------------------------------------------------------
   */

  fireworksDuration: 1.4,

  fadeInDuration: 0.2,

  tailGrowthDuration: 0.2,

  tailGrowthPower: 2.5,

  fadeOutBeforeEnd: 0.8,

  fadeOutDuration: 0.6,

  maxDropDelay: 0,

  /**
   * -------------------------------------------------------
   * Firework shape
   * -------------------------------------------------------
   */

  dropCount: isMobile ? (isSmallMobile ? 10 : 12) : 14,

  sliceCount: isMobile ? (isSmallMobile ? 10 : 12) : 15,

  /**
   * -------------------------------------------------------
   * Ray length
   * -------------------------------------------------------
   */

  minRadius: 2.7,

  maxRadius: 3.3,

  /**
   * -------------------------------------------------------
   * Random vertical/depth offset
   * -------------------------------------------------------
   */

  targetOffset: 0.35,

  /**
   * -------------------------------------------------------
   * Particles
   * -------------------------------------------------------
   */

  particleCount: isMobile ? (isSmallMobile ? 600 : 800) : 1400,

  particleSystemLength: 1.5,

  tailThickness: 0.15,

  minTailThickness: 0.05,

  particleSize: isMobile ? 60 : 70,

  /**
   * -------------------------------------------------------
   * Mobile geometry quality
   * -------------------------------------------------------
   */

  latheSegments: isMobile ? (isSmallMobile ? 32 : 40) : 100,

  /**
   * -------------------------------------------------------
   * Outer / inner glow
   * -------------------------------------------------------
   */

  outerGlowStrength: 6,

  innerGlowStrength: 4,

  outerOpacity: 0.3,

  innerOpacity: 1,

  outerStartTailOpacity: 0.9,

  innerStartTailOpacity: 0.5,

  /**
   * -------------------------------------------------------
   * Camera
   * -------------------------------------------------------
   */

  cameraFov: 40,
};

/**
 * =========================================================
 * DEFAULT SETTINGS
 * =========================================================
 */

const defaultSettings = { ...settings };

/**
 * =========================================================
 * CLOCK
 * =========================================================
 */

const clock = new THREE.Clock();

let fireworksStartTime = 0;

/**
 * =========================================================
 * ANIMATED DROPS
 * =========================================================
 */

const animatedDrops = [];

/**
 * =========================================================
 * FIREWORK GROUP
 * =========================================================
 */

let fireworksGroup = new THREE.Group();

scene.add(fireworksGroup);

/**
 * =========================================================
 * HELPERS
 * =========================================================
 */

function getRandomGlowColor() {
  return glowColors[Math.floor(Math.random() * glowColors.length)];
}

function getRandomTarget() {
  const radius = THREE.MathUtils.lerp(
    settings.minRadius,
    settings.maxRadius,
    Math.random(),
  );

  return new THREE.Vector3(
    radius,
    (Math.random() - 0.5) * settings.targetOffset,
    (Math.random() - 0.5) * settings.targetOffset,
  );
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

/**
 * =========================================================
 * CREATE DROP
 * =========================================================
 */

function createDrop(glowColor) {
  const dropLength =
    Math.max(...points1.map((p) => p.y)) - Math.min(...points1.map((p) => p.y));

  const drop = new THREE.Object3D();

  /**
   * -------------------------------------------------------
   * OUTER DROP
   * -------------------------------------------------------
   */

  {
    const geometry = new THREE.LatheGeometry(points1, settings.latheSegments);

    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,

      depthWrite: false,

      blending: THREE.AdditiveBlending,

      vertexShader: dropVertexShader,

      fragmentShader: dropFragmentShader,

      uniforms: {
        uGlowColor: {
          value: glowColor,
        },

        uGlowStrength: {
          value: settings.outerGlowStrength,
        },

        uStartTailOpacity: {
          value: settings.outerStartTailOpacity,
        },

        uOpacity: {
          value: 0,
        },

        uDropLength: {
          value: dropLength,
        },

        uTailGrowth: {
          value: 0,
        },
      },
    });

    material.userData.originalOpacity = settings.outerOpacity;

    const outerDrop = new THREE.Mesh(geometry, material);

    drop.add(outerDrop);
  }

  /**
   * -------------------------------------------------------
   * INNER DROP
   * -------------------------------------------------------
   */

  {
    const geometry = new THREE.LatheGeometry(points2, settings.latheSegments);

    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,

      depthWrite: false,

      blending: THREE.AdditiveBlending,

      vertexShader: dropVertexShader,

      fragmentShader: dropFragmentShader,

      uniforms: {
        uGlowColor: {
          value: glowColor,
        },

        uGlowStrength: {
          value: settings.innerGlowStrength,
        },

        uStartTailOpacity: {
          value: settings.innerStartTailOpacity,
        },

        uOpacity: {
          value: 0,
        },

        uDropLength: {
          value: dropLength,
        },

        uTailGrowth: {
          value: 0,
        },
      },
    });

    material.userData.originalOpacity = settings.innerOpacity;

    const innerDrop = new THREE.Mesh(geometry, material);

    drop.add(innerDrop);
  }

  /**
   * -------------------------------------------------------
   * PARTICLES
   * -------------------------------------------------------
   */

  {
    const particles = settings.particleCount;

    const positions = new Float32Array(particles * 3);

    for (let i = 0; i < particles; i++) {
      const normalizedIndex = THREE.MathUtils.inverseLerp(0, particles, i);

      const maxThickness =
        (1 - normalizedIndex) *
          (settings.tailThickness - settings.minTailThickness) +
        settings.minTailThickness;

      const randomAngle = Math.random() * Math.PI * 2;

      const x = (Math.random() - 0.5) * maxThickness * Math.cos(randomAngle);

      const z = (Math.random() - 0.5) * maxThickness * Math.sin(randomAngle);

      const y = Math.pow(normalizedIndex, 10) * settings.particleSystemLength;

      const particleIndex = i * 3;

      positions[particleIndex] = x;

      positions[particleIndex + 1] = y + 0.1;

      positions[particleIndex + 2] = z;
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.ShaderMaterial({
      depthWrite: false,

      blending: THREE.AdditiveBlending,

      vertexShader: particlesVertexShader,

      fragmentShader: particlesFragmentShader,

      uniforms: {
        uTime: {
          value: 0,
        },

        uSize: {
          value: settings.particleSize,
        },

        uGlowColor: {
          value: glowColor,
        },

        uOpacity: {
          value: 0,
        },

        uParticleSystemLength: {
          value: settings.particleSystemLength,
        },

        uTailGrowth: {
          value: 0,
        },
      },
    });

    material.userData.originalOpacity = 1;

    const mesh = new THREE.Points(geometry, material);

    drop.add(mesh);
  }

  return drop;
}

/**
 * =========================================================
 * CREATE FIREWORK
 * =========================================================
 */

function createFirework() {
  const slice = new THREE.Object3D();

  /**
   * -------------------------------------------------------
   * DROPS
   * -------------------------------------------------------
   */

  for (let i = 1; i < settings.dropCount; i++) {
    const glowColor = getRandomGlowColor();

    const drop = createDrop(glowColor);

    drop.rotateZ(Math.PI / 2);

    drop.position.set(0, 0, 0);

    const target = getRandomTarget();

    const delay = Math.random() * settings.maxDropDelay;

    drop.userData.firework = {
      start: new THREE.Vector3(0, 0, 0),

      target,

      delay,
    };

    const dropWrapper = new THREE.Object3D();

    dropWrapper.add(drop);

    dropWrapper.rotateZ(
      ((i - Math.random() / 3) * Math.PI) / settings.dropCount,
    );

    slice.add(dropWrapper);
  }

  /**
   * -------------------------------------------------------
   * SLICES
   * -------------------------------------------------------
   */

  for (let i = 0; i <= settings.sliceCount; i++) {
    const sliceWrapper = new THREE.Object3D();

    const sliceClone = slice.clone(true);

    sliceWrapper.add(sliceClone);

    sliceWrapper.rotateX(
      ((i - Math.random() / 3) * Math.PI * 2.0) / settings.sliceCount,
    );

    fireworksGroup.add(sliceWrapper);
  }

  /**
   * -------------------------------------------------------
   * FIND DROPS
   * -------------------------------------------------------
   */

  fireworksGroup.traverse((object) => {
    if (object.userData?.firework) {
      animatedDrops.push(object);
    }
  });
}

/**
 * =========================================================
 * CLEAR FIREWORK
 * =========================================================
 */

function clearFirework() {
  animatedDrops.length = 0;

  fireworksGroup.traverse((object) => {
    if (object.isMesh || object.isPoints) {
      object.geometry?.dispose();

      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => {
            material.dispose();
          });
        } else {
          object.material.dispose();
        }
      }
    }
  });

  scene.remove(fireworksGroup);

  fireworksGroup = new THREE.Group();

  scene.add(fireworksGroup);
}

/**
 * =========================================================
 * RESET DROP
 * =========================================================
 */

function resetDrop(drop) {
  const firework = drop.userData.firework;

  firework.target = getRandomTarget();

  firework.start = new THREE.Vector3(0, 0, 0);

  firework.delay = Math.random() * settings.maxDropDelay;

  drop.position.set(0, 0, 0);

  const newColor = getRandomGlowColor();

  drop.traverse((object) => {
    if (object.material instanceof THREE.ShaderMaterial) {
      const uniforms = object.material.uniforms;

      /**
       * -----------------------------------------------------
       * COLOR
       * -----------------------------------------------------
       */

      if (uniforms?.uGlowColor) {
        uniforms.uGlowColor.value = newColor;
      }

      /**
       * -----------------------------------------------------
       * TAIL
       * -----------------------------------------------------
       */

      if (uniforms?.uTailGrowth) {
        uniforms.uTailGrowth.value = 0;
      }

      /**
       * -----------------------------------------------------
       * TIME
       * -----------------------------------------------------
       */

      if (uniforms?.uTime) {
        uniforms.uTime.value = 0;
      }

      /**
       * -----------------------------------------------------
       * OPACITY
       * -----------------------------------------------------
       */

      if (uniforms?.uOpacity) {
        uniforms.uOpacity.value = 0;
      }
    }
  });
}

/**
 * =========================================================
 * RESET FIREWORK CYCLE
 * =========================================================
 */

function resetFireworkCycle() {
  fireworksStartTime = clock.getElapsedTime();

  for (const drop of animatedDrops) {
    resetDrop(drop);
  }
}

/**
 * =========================================================
 * RESET SETTINGS
 * =========================================================
 */

function resetSettings() {
  Object.assign(settings, defaultSettings);

  camera.fov = settings.cameraFov;

  camera.updateProjectionMatrix();

  document.querySelectorAll("[data-setting]").forEach((input) => {
    const name = input.dataset.setting;

    if (name in settings) {
      input.value = settings[name];
    }

    const value = document.querySelector(`[data-value="${name}"]`);

    if (!value) {
      return;
    }

    switch (name) {
      case "fireworksDuration":
      case "fadeInDuration":
      case "tailGrowthDuration":
      case "fadeOutBeforeEnd":
      case "fadeOutDuration":
      case "maxDropDelay":
        value.textContent = `${Number(settings[name]).toFixed(2)}s`;
        break;

      case "tailGrowthPower":
      case "minRadius":
      case "maxRadius":
      case "targetOffset":
        value.textContent = Number(settings[name]).toFixed(2);
        break;

      case "particleSize":
        value.textContent = Number(settings[name]).toFixed(0);
        break;

      case "cameraFov":
        value.textContent = `${settings[name]}°`;
        break;

      default:
        value.textContent = settings[name];
    }
  });

  rebuildFirework();
}

/**
 * =========================================================
 * REBUILD GEOMETRY
 * =========================================================
 */

function rebuildFirework() {
  clearFirework();

  createFirework();

  resetFireworkCycle();
}

/**
 * =========================================================
 * GUI
 * =========================================================
 */

const panel = document.querySelector(".controls-panel");

const panelToggle = document.querySelector(".controls-toggle");

panelToggle?.addEventListener("click", () => {
  panel?.classList.toggle("is-collapsed");
});

/**
 * =========================================================
 * INPUT HELPERS
 * =========================================================
 */

function bindRange(
  name,
  valueElement,
  formatter = (value) => Number(value).toFixed(2),
) {
  const input = document.querySelector(`[data-setting="${name}"]`);

  const value = document.querySelector(`[data-value="${name}"]`);

  if (!input) return;

  input.value = settings[name];

  if (value) {
    value.textContent = formatter(input.value);
  }

  input.addEventListener("input", () => {
    settings[name] = Number(input.value);

    if (value) {
      value.textContent = formatter(input.value);
    }
  });
}

/**
 * =========================================================
 * ANIMATION SETTINGS
 * =========================================================
 */

bindRange("fireworksDuration", null, (value) => `${Number(value).toFixed(2)}s`);

bindRange("fadeInDuration", null, (value) => `${Number(value).toFixed(2)}s`);

bindRange(
  "tailGrowthDuration",
  null,
  (value) => `${Number(value).toFixed(2)}s`,
);

bindRange("tailGrowthPower", null, (value) => Number(value).toFixed(2));

bindRange("fadeOutBeforeEnd", null, (value) => `${Number(value).toFixed(2)}s`);

bindRange("fadeOutDuration", null, (value) => `${Number(value).toFixed(2)}s`);

bindRange("maxDropDelay", null, (value) => `${Number(value).toFixed(2)}s`);

/**
 * =========================================================
 * SHAPE SETTINGS
 * =========================================================
 */

bindRange("minRadius", null, (value) => Number(value).toFixed(2));

bindRange("maxRadius", null, (value) => Number(value).toFixed(2));

bindRange("targetOffset", null, (value) => Number(value).toFixed(2));

bindRange("particleSize", null, (value) => Number(value).toFixed(0));

/**
 * =========================================================
 * BUTTONS
 * =========================================================
 */

const resetButton = document.querySelector(".reset-firework");

resetButton?.addEventListener("click", resetSettings);

const rebuildButton = document.querySelector(".apply-geometry");

rebuildButton?.addEventListener("click", rebuildFirework);

/**
 * =========================================================
 * CAMERA SETTINGS
 * =========================================================
 */

const cameraFovInput = document.querySelector('[data-setting="cameraFov"]');

const cameraFovValue = document.querySelector('[data-value="cameraFov"]');

if (cameraFovInput) {
  cameraFovInput.value = settings.cameraFov;

  if (cameraFovValue) {
    cameraFovValue.textContent = `${settings.cameraFov}°`;
  }

  cameraFovInput.addEventListener("input", () => {
    settings.cameraFov = Number(cameraFovInput.value);

    camera.fov = settings.cameraFov;

    camera.updateProjectionMatrix();

    if (cameraFovValue) {
      cameraFovValue.textContent = `${settings.cameraFov}°`;
    }
  });
}

/**
 * =========================================================
 * RESIZE
 * =========================================================
 */

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
});

/**
 * =========================================================
 * INITIAL FIREWORK
 * =========================================================
 */

createFirework();

fireworksStartTime = clock.getElapsedTime();

/**
 * =========================================================
 * ANIMATION
 * =========================================================
 */

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  const fireworksTime = elapsedTime - fireworksStartTime;

  /**
   * -------------------------------------------------------
   * FADE SETTINGS
   * -------------------------------------------------------
   */

  const fadeStart = Math.max(
    0,
    settings.fireworksDuration - settings.fadeOutBeforeEnd,
  );

  const actualFadeDuration = Math.min(
    settings.fadeOutDuration,
    settings.fireworksDuration - fadeStart,
  );

  /**
   * -------------------------------------------------------
   * DROPS
   * -------------------------------------------------------
   */

  for (const drop of animatedDrops) {
    const firework = drop.userData.firework;

    /**
     * -----------------------------------------------------
     * LOCAL TIME
     * -----------------------------------------------------
     */

    let cycleTime = fireworksTime - firework.delay;

    if (cycleTime < 0) {
      cycleTime = 0;
    }

    /**
     * -----------------------------------------------------
     * MOVEMENT
     * -----------------------------------------------------
     */

    const movementProgress = THREE.MathUtils.clamp(
      cycleTime / settings.fireworksDuration,
      0,
      1,
    );

    const movementEase = easeOutCubic(movementProgress);

    drop.position.lerpVectors(firework.start, firework.target, movementEase);

    /**
     * -----------------------------------------------------
     * TAIL GROWTH
     * -----------------------------------------------------
     */

    const linearTailProgress = THREE.MathUtils.clamp(
      cycleTime / settings.tailGrowthDuration,
      0,
      1,
    );

    const tailGrowth = Math.pow(linearTailProgress, settings.tailGrowthPower);

    /**
     * -----------------------------------------------------
     * FADE IN
     * -----------------------------------------------------
     */

    let opacity = 1;

    if (settings.fadeInDuration > 0 && cycleTime < settings.fadeInDuration) {
      const fadeInProgress = THREE.MathUtils.clamp(
        cycleTime / settings.fadeInDuration,
        0,
        1,
      );

      opacity = easeOutCubic(fadeInProgress);
    }

    /**
     * -----------------------------------------------------
     * FADE OUT
     * -----------------------------------------------------
     */

    if (cycleTime > fadeStart && actualFadeDuration > 0) {
      const fadeProgress = THREE.MathUtils.clamp(
        (cycleTime - fadeStart) / actualFadeDuration,
        0,
        1,
      );

      opacity *= 1 - fadeProgress;
    }

    /**
     * -----------------------------------------------------
     * COMPLETE TRANSPARENCY
     * -----------------------------------------------------
     */

    if (cycleTime >= settings.fireworksDuration) {
      opacity = 0;
    }

    /**
     * -----------------------------------------------------
     * UPDATE MATERIALS
     * -----------------------------------------------------
     */

    drop.traverse((object) => {
      if (object.material instanceof THREE.ShaderMaterial) {
        const uniforms = object.material.uniforms;

        /**
         * Tail
         */

        if (uniforms?.uTailGrowth) {
          uniforms.uTailGrowth.value = tailGrowth;
        }

        /**
         * Time
         */

        if (uniforms?.uTime) {
          uniforms.uTime.value = elapsedTime;
        }

        /**
         * Opacity
         */

        if (uniforms?.uOpacity) {
          const originalOpacity = object.material.userData.originalOpacity ?? 1;

          uniforms.uOpacity.value = originalOpacity * opacity;
        }

        /**
         * Dynamic particle size
         */

        if (uniforms?.uSize) {
          uniforms.uSize.value = settings.particleSize;
        }

        /**
         * Dynamic particle length
         */

        if (uniforms?.uParticleSystemLength) {
          uniforms.uParticleSystemLength.value = settings.particleSystemLength;
        }
      }
    });
  }

  /**
   * -------------------------------------------------------
   * AUTOMATIC RESET
   * -------------------------------------------------------
   */

  if (fireworksTime >= settings.fireworksDuration) {
    resetFireworkCycle();
  }

  /**
   * -------------------------------------------------------
   * CONTROLS
   * -------------------------------------------------------
   */

  controls.update();

  /**
   * -------------------------------------------------------
   * RENDER
   * -------------------------------------------------------
   */

  renderer.render(scene, camera);

  requestAnimationFrame(tick);
};

tick();
