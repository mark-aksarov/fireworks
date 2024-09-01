import * as THREE from 'three'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const radius = 2;
const pointSize = 10;
const branches = 20;
const segments = 20;
const segmentLength = 0.05;
const segmentThickness = 0.05;
const particlesPerSegment = 500;
const totalCount = branches * segments * particlesPerSegment;

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
* Geometry
*/
const geometry = new THREE.BufferGeometry()

const angles = new Float32Array(totalCount)
const positions = new Float32Array(totalCount * 3)
const centerPositions = new Float32Array(totalCount * 3)

const angleIncrement = Math.PI * 2.0 / branches;

for (let i = 0; i < segments; i++) {
  for (let j = 0; j < branches; j++) {
    const angle = angleIncrement * j;

    for (let k = 0; k < particlesPerSegment; k++) {
      const particleIndex = (i * branches + j) * particlesPerSegment + k;
      const positionIndex = particleIndex * 3;

      const center = new THREE.Vector3(
        Math.cos(Math.PI + angle) * segmentLength * i,
        Math.sin(Math.PI + angle) * segmentLength * i,
        0.0
      )

      const randomX = Math.pow(Math.random(), 1) * (Math.random() < 0.5 ? 1 : - 1) * 0.8 * segmentLength;
      const randomY = Math.pow(Math.random(), 8) * (Math.random() < 0.5 ? 1 : - 1) * 0.8 * segmentThickness;
      const randomZ = Math.pow(Math.random(), 8) * (Math.random() < 0.5 ? 1 : - 1) * 0.8 * segmentThickness;

      const randomize = new THREE.Vector3(randomX, randomY, randomZ);
      randomize.applyAxisAngle(new THREE.Vector3(0, 0, 1), angle);

      positions[positionIndex] = center.x + randomize.x;
      positions[positionIndex + 1] = center.y + randomize.y;
      positions[positionIndex + 2] = center.z + randomize.z;

      centerPositions[positionIndex] = center.x;
      centerPositions[positionIndex + 1] = center.y;
      centerPositions[positionIndex + 2] = center.z;

      angles[particleIndex] = angle;
    }
  }
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
geometry.setAttribute('aCenterPosition', new THREE.BufferAttribute(centerPositions, 3))
geometry.setAttribute('aAngle', new THREE.BufferAttribute(angles, 1))

/**
* Material
*/
const material = new THREE.ShaderMaterial({
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
  vertexShader,
  fragmentShader,
  uniforms:
  {
    uTime: { value: 0 },
    uRadius: { value: radius },
    uSize: { value: pointSize },
    uColor: { value: new THREE.Color("#ff0000") }
  }
})

/**
 * Object
 */
const mesh = new THREE.Points(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
* Camera
*/
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update material
  material.uniforms.uTime.value = elapsedTime

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()