import * as THREE from 'three'
import dropVertexShader from './shaders/drop/vertex.glsl';
import dropFragmentShader from './shaders/drop/fragment.glsl';
import particlesVertexShader from './shaders/particles/vertex.glsl';
import particlesFragmentShader from './shaders/particles/fragment.glsl';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 7);
scene.add(camera);
const controls = new OrbitControls(camera, canvas);

const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1;

/**
* Points
*/
const curve1 = new THREE.SplineCurve([
  new THREE.Vector2(0.000000, 0.000000),
  new THREE.Vector2(0.047439, 0.008781),
  new THREE.Vector2(0.083663, 0.036272),
  new THREE.Vector2(0.105215, 0.080331),
  new THREE.Vector2(0.113577, 0.124871),
  new THREE.Vector2(0.115893, 0.169723),
  new THREE.Vector2(0.114094, 0.226568),
  new THREE.Vector2(0.109559, 0.280991),
  new THREE.Vector2(0.102370, 0.344970),
  new THREE.Vector2(0.092311, 0.424740),
  new THREE.Vector2(0.080957, 0.514696),
  new THREE.Vector2(0.070820, 0.594478),
  new THREE.Vector2(0.064582, 0.662809),
  new THREE.Vector2(0.054219, 0.788387),
  new THREE.Vector2(0.045788, 0.890215),
  new THREE.Vector2(0.035777, 1.016548),
  new THREE.Vector2(0.017421, 1.161712),
  new THREE.Vector2(0.000000, 1.188697)
]);

const curve2 = new THREE.SplineCurve([
  new THREE.Vector2(0.00000000, 0.05249219),
  new THREE.Vector2(0.02353037, 0.05557644),
  new THREE.Vector2(0.04733661, 0.07088265),
  new THREE.Vector2(0.06289341, 0.09870860),
  new THREE.Vector2(0.07006410, 0.13031600),
  new THREE.Vector2(0.07257684, 0.16152610),
  new THREE.Vector2(0.07244543, 0.19605456),
  new THREE.Vector2(0.07011111, 0.23376948),
  new THREE.Vector2(0.06502574, 0.28320913),
  new THREE.Vector2(0.05755539, 0.34173070),
  new THREE.Vector2(0.04716476, 0.41779440),
  new THREE.Vector2(0.03611469, 0.50519714),
  new THREE.Vector2(0.02592416, 0.59628838),
  new THREE.Vector2(0.01742113, 0.67885639),
  new THREE.Vector2(0.0079270, 0.763),
  new THREE.Vector2(0.00000000, 0.77643018)
]);

const slicePointCount = 100;

const points1 = curve1.getPoints(slicePointCount);
const points2 = curve2.getPoints(slicePointCount);

const glowColors = [
  new THREE.Color(0xD13EE6),
  new THREE.Color(0x0000ff)
];

//Drop
function createDrop(glowColor) {
  const dropLength = Math.max(...points1.map(p => p.y)) - Math.min(...points1.map(p => p.y));
  const drop = new THREE.Object3D();

  //Outer drop
  {
    const geometry = new THREE.LatheGeometry(points1, 100);
    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: dropVertexShader,
      fragmentShader: dropFragmentShader,
      uniforms: {
        uGlowColor: {
          value: glowColor
        },
        uGlowStrength: {
          value: 6
        },
        uStartTailOpacity: {
          value: 0.9
        },
        uOpacity: {
          value: 0.3
        },
        uDropLength: {
          value: dropLength
        }
      }
    });
    const outerDrop = new THREE.Mesh(geometry, material);
    drop.add(outerDrop);
  }

  //Inner drop
  {
    const geometry = new THREE.LatheGeometry(points2, 100);
    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: dropVertexShader,
      fragmentShader: dropFragmentShader,
      uniforms: {
        uGlowColor: {
          value: glowColor
        },
        uGlowStrength: {
          value: 4
        },
        uStartTailOpacity: {
          value: 0.5
        },
        uOpacity: {
          value: 1
        },
        uDropLength: {
          value: dropLength
        }
      },
    });
    const innerDrop = new THREE.Mesh(geometry, material);
    drop.add(innerDrop);
  }

  //Particles
  {
    const pointSize = 70;
    const particleSystemLength = 1.5;
    const minTailThickness = 0.05;
    const tailThickness = 0.15;
    const particles = 1400;

    const positions = new Float32Array(particles * 3);

    for (let i = 0; i < particles; i++) {
      const normalizedIndex = THREE.MathUtils.inverseLerp(0, particles, i);
      const maxThickness = (1 - normalizedIndex) * (tailThickness - minTailThickness) + minTailThickness;

      const randomAngle = Math.random() * Math.PI * 2;
      const x = (Math.random() - 0.5) * maxThickness * Math.cos(randomAngle);
      const z = (Math.random() - 0.5) * maxThickness * Math.sin(randomAngle);
      const y = Math.pow(normalizedIndex, 10) * particleSystemLength;

      const particleIndex = i * 3;
      positions[particleIndex] = x;
      positions[particleIndex + 1] = y + 0.1;
      positions[particleIndex + 2] = z;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.ShaderMaterial({
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      vertexShader: particlesVertexShader,
      fragmentShader: particlesFragmentShader,
      uniforms:
      {
        uTime: { value: 0 },
        uSize: { value: pointSize },
        uGlowColor: {
          value: glowColor
        },
        uOpacity: {
          value: 1
        },
        uParticleSystemLength: {
          value: particleSystemLength
        }
      }
    })

    const mesh = new THREE.Points(geometry, material)
    mesh.position.set(0, 0, 0);
    drop.add(mesh)
  }

  return drop;
}

//Fireworks
{
  const slice = new THREE.Object3D();

  const dropCount = 14;
  for (let i = 1; i < dropCount; i++) {
    const dropInner = createDrop(glowColors[Math.floor(Math.random() * 2)]);
    dropInner.rotateZ(Math.PI / 2);
    dropInner.position.setX(Math.random() / 5 + 3);
    dropInner.position.setY((Math.random() - 0.5) / 5);
    dropInner.position.setZ((Math.random() - 0.5) / 5);

    const dropWrapper = new THREE.Object3D();
    dropWrapper.add(dropInner.clone());
    dropWrapper.rotateZ((i - Math.random() / 3) * Math.PI / dropCount);
    slice.add(dropWrapper);
  }

  const sliceCount = 15;
  for (let i = 0; i <= sliceCount; i++) {
    const sliceWrapper = new THREE.Object3D();
    sliceWrapper.add(slice.clone());
    sliceWrapper.rotateX((i - Math.random() / 3) * Math.PI * 2.0 / sliceCount);
    scene.add(sliceWrapper);
  }
}

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  renderer.setSize(sizes.width, sizes.height);

  // Update sizes

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update material
  //material.uniforms.uTime.value = elapsedTime

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()