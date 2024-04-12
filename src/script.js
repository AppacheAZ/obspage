import * as THREE from 'three'
import gsap from 'gsap'
import * as data from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Swiper from 'swiper'
import 'swiper/css';

var swiper = new Swiper('.swiper-container', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows : true,
    },
    loop: true,
  });

THREE.ColorManagement.enabled = false

/* Debug */
const gui = new data.GUI()
const parameters = {
    color: 0xff0000,
    spin: () => {
        gsap.to(mesh.rotation, {duration: 1, delay: 0.4, y: mesh.rotation.y + (Math.PI * 2.25)})
    }
}

/* Textures */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/10.png')
const basicMaterial = new THREE.MeshBasicMaterial()

/* Cursor */
const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = - (event.clientY / sizes.height - 0.5)
})

/* Base */
// Canvas
const canvas = document.querySelector('canvas.header--container-canva')

// Sizes
const sizes = {
    width: window.innerWidth, //* 0.7,
    height: window.innerHeight //* 0.7
}

window.addEventListener('resize', () => 
{
    sizes.width = window.innerWidth,// * 0.7
    sizes.height = window.innerHeight //* 0.7

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer, also update the canvas size
    renderer.setSize(sizes.width, sizes.height)

    // Update pixel ratio
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Scene
const scene = new THREE.Scene()

const material = new THREE.MeshMatcapMaterial()
material.matcap = matcapTexture

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 1.5, 0.2, 5, 5, 5),
    material
)

const ground = new THREE.Mesh(
    new THREE.SphereGeometry(2, 0.1, 2),
    basicMaterial
)

ground.castShadow = true
ground.receiveShadow = true
ground.position.set(0, -1, 0)


//scene.add(ground)
scene.add(mesh)
const ambientLight = new THREE.AmbientLight(0xffffff, 0)
scene.add(ambientLight)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name('Ambient Light Intensity')

// Camera

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 1.2
camera.position.y = 1
camera.position.x = 1.6
//camera.lookAt(mesh.position)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true // inertia

controls.enableRotate = true // rotation
controls.enablePan = false // to drag the camera
controls.enableZoom = false // to zoom in and out

controls.maxPolarAngle = Math.PI / 2 // to limit the rotation
controls.minPolarAngle = Math.PI / 2 // to limit the rotation

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
/* renderer.setSize(sizes.width, sizes.height) */
renderer.setSize(sizes.width, sizes.height)
/* console.log(camera.position.length()) */
/* renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap */

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

    window.addEventListener('buttons', rotationButtons)
}

gsap.to(mesh.rotation, {duration: 1, delay: 0.4, y:(Math.PI * 2.22)})

tick()

//Buttons
function rotationButtons() {
    const galleryButton = document.getElementById("gallery-button")
    const reserveButton = document.getElementById("reserve-button")
    galleryButton.addEventListener("click", () => {
        gsap.to(mesh.rotation, {duration: 1, delay: 0.4, y: mesh.rotation.y + (Math.PI * 2.25),
            redirection:() => {
                setTimeout(() => {
                    window.location.href = "./gallery.html";
                }, 1100);
            }})
    })
    reserveButton.addEventListener("click", () => {
        gsap.to(mesh.rotation, {duration: 1, delay: 0.4, y: mesh.rotation.y + (Math.PI * 2.25)*2})
    })  
}
rotationButtons();