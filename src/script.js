import * as THREE from 'three'
import gsap from 'gsap'
import * as data from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { ThreeJSOverlayView } from "@googlemaps/three"
import { Loader } from "@googlemaps/js-api-loader"
import { GOOGLE_CALENDAR_LINK, GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_MAPID, GOOGLE_PLACE_ID } from './config.js'; // Here import your Google Places API key and mapID from the config.js file (create it if you don't have it in the root folder)

/* DEBUG */
/* const GUI = new data.GUI()
 */
/* ----------------------------------------------------> BUTTONS <-------------------------------------------------------------------------------------- */

const mapButton = document.getElementById('map-button');
const reviewsButton = document.getElementById('reviews-button');

mapButton.addEventListener('click', () => {
    setTimeout(() => {
        window.open("https://www.google.es/maps/place/Official+Barbershop/@43.3557647,-3.008453,633m/data=!3m2!1e3!4b1!4m6!3m5!1s0xd4e5bd8a808d93d:0x47294277826dee78!8m2!3d43.3557647!4d-3.0058781!16s%2Fg%2F11sctrqch0?entry=ttu&g_ep=EgoyMDI0MTAyMy4wIKXMDSoASAFQAw%3D%3D", "_blank");
    }, 1100);
});
reviewsButton.addEventListener('click', () => {
    setTimeout(() => {
        window.open("https://search.google.com/local/writereview?placeid=ChIJPdkIqNhbTg0ReO5tgndCKUc", "_blank");
    }, 1100);
});

/* --------------------------> Setup of the Scene <---------------------------------------*/

THREE.ColorManagement.enabled = false 

// Debug of the scene and the object animation
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
const canvas = document.querySelector('canvas.header--container-canva')

// Sizes
const sizes = {
    width: window.innerWidth * 0.7,
    height: window.innerHeight * 0.7,
    realwidth: window.innerWidth,
}

window.addEventListener('resize', () => 
{
    sizes.width = window.innerWidth * 0.7,// * 0.7
    sizes.height = window.innerHeight * 0.7 //* 0.7

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

/* Models */
// Import the model and add it to the scene with the animations of the buttons
const gltfLoader = new GLTFLoader()

    gltfLoader.load(
        '/models/index/totemOBS.gltf',
        (gltf) => {
            gltf.scene.scale.set(0.1, 0.1, 0.1);
            gltf.scene.position.set(0, -0.026, 0);
            gsap.to(gltf.scene.rotation, { duration: 0.1, delay: 0, y: (Math.PI * 0.5) });
            scene.add(gltf.scene);
            gsap.to(gltf.scene.rotation, { duration: 1.2, delay: 0.2, y: (Math.PI * 3.5) });
            gsap.to(gltf.scene.rotation, { duration: 1, delay: 1, y: (Math.PI * 3.5) });
            
            function rotationButtons() {
                const galleryButton = document.getElementById("gallery-button");
                const reserveButton = document.getElementById("reserve-button");
                
                galleryButton.addEventListener("click", () => {
                    gsap.to(gltf.scene.rotation, {
                        duration: 1,
                        delay: 0.4,
                        y: gltf.scene.rotation.y + (Math.PI * 2),
                        onComplete: () => {
                            setTimeout(() => {
                                window.location.href = "./gallery.html";
                            }, 1100);
                        }
                    });
                });
    
                reserveButton.addEventListener("click", () => {
                    gsap.to(gltf.scene.rotation, {
                        duration: 1,
                        delay: 0.4,
                        y: gltf.scene.rotation.y + ((Math.PI * 2) * 2),
                        onComplete: () => {
                            setTimeout(() => {
                                window.location.href = GOOGLE_CALENDAR_LINK; // Link to the Google Calendar appointment
                            }, 1100);
                        }
                    });
                });
            }
    
            rotationButtons();
        }
    );

/*-----------------------------------------------------------> LANDING PAGE SCENE <--------------------------------------------------------------*/

// Material
const material = new THREE.MeshMatcapMaterial()
material.matcap = matcapTexture

// Object
const ground = new THREE.Mesh(
    new THREE.SphereGeometry(2, 0.1, 2),
    basicMaterial
)

ground.castShadow = true
ground.receiveShadow = true
ground.position.set(0, -1, 0)

//Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0)
scene.add(ambientLight)

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 15)
directionalLight1.position.set(1, 0, -2)
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 15)
directionalLight2.position.set(2, 0, 1)
scene.add(directionalLight1, directionalLight2)
const directionalLight3 = new THREE.DirectionalLight(0xffffff, 15)
directionalLight3.position.set(1, 0, 2)
const directionalLight4 = new THREE.DirectionalLight(0xffffff, 15)
directionalLight4.position.set(-2, 0, 1)
const directionalLight5 = new THREE.DirectionalLight(0xffffff, 15)
directionalLight5.position.set(0, -2, 0)
directionalLight5.rotateY(Math.PI * 0.5)

scene.add(directionalLight1, directionalLight2, directionalLight3, directionalLight4, directionalLight5)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(0, 0, 0.185)
scene.add(camera) //camera.lookAt(mesh.position)

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
    alpha: true // transparent background
})

renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    /* const elapsedTime = clock.getElapsedTime() */
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

/* -------------------------------------------------------------> MAP SCENE 1 <----------------------------------------------------------------------------------- */
let map;
let sceneMap;
let rendererMap;
let overlayView;
let zoomMap = 17 + ((sizes.realwidth - 320) / sizes.realwidth) * 1.2; // Depending on the screen width, the zoom will be adjusted

const loader2 = new Loader({
    apiKey: GOOGLE_MAPS_API_KEY, // Import your Google Places API key from the config.js file
    version: "weekly",
    libraries: ["places"],
    language: "es"
});

loader2.load().then(async () => {
    const { Map } = await google.maps.importLibrary("maps");

    const mapOptions = {
        tilt: 0,
        heading: 0,
        zoom: zoomMap, // For 3d visualization structures purposes must be between 18-17
        center: { lat: 43.35596731257095, lng: -3.0059229625764146 },
        mapId: GOOGLE_MAPS_MAPID, // Import your Google Map ID from the config.js file
        disableDefaultUI: true,
        gestureHandling: "none",
        keyboardShortcuts: false,
    };

    function initMap() {
        const mapDiv = document.getElementById("map");
        map = new Map(mapDiv, mapOptions);

        sceneMap = new THREE.Scene();
        rendererMap = new THREE.WebGLRenderer({ alpha: true });

        const width = window.innerWidth;
        const height = window.innerHeight;
        rendererMap.setSize(width, height);
        rendererMap.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        console.log('✅ Map was initialized:', map);
        console.log('✅ Three.js scene was initialized:', sceneMap);

        const gltfLoaderMaps = new GLTFLoader();
        const url = "/models/index/totemOBS.gltf";
        const material = new THREE.MeshStandardMaterial();
        material.roughness = 0.1;
        material.metalness = 0.5;
        material.map = textureLoader.load('/textures/matcaps/10.png');

        gltfLoaderMaps.load(url, (gltf) => {
            console.log('✅ 3D model was loaded:', gltf);
            gltf.scene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.material = material;
                }
            });
            gltf.scene.scale.set(16, 16, 16);
            gltf.scene.rotation.x = Math.PI / 2;
            gltf.scene.rotation.y = Math.PI / 0.75;
            gltf.scene.position.set(0, 0, -60);
            sceneMap.add(gltf.scene);

            animateScene(gltf.scene);
        });

        overlayView = new ThreeJSOverlayView({
            map,
            scene: sceneMap,
            anchor: { ...mapOptions.center, altitude: 100 },
            THREE,
        });
        console.log('✅ 3D Overlay view was initialized', overlayView);
        window.addEventListener("resize", onWindowResize);
    }

    function animateScene(model) {
        let { tilt, heading, zoom } = mapOptions;

        const animate = () => {
            if (tilt < 67.5) {
                tilt += 0.5;
                model.position.z -= 0.075;
            } else if (heading <= 375) {
                heading += 0.3;
                if (zoom > (zoomMap - 1) && zoom > 17) {
                    zoom -= 0.001;
                    model.position.z += 0.06;
                    model.scale.x += 0.006;
                    model.scale.y += 0.006;
                    model.scale.z += 0.006;
                }
            } else {
                return;
            }
            map.moveCamera({ tilt, heading, zoom });
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }

    function onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        rendererMap.setSize(width, height);
    }

    function cleanup() {
        if (rendererMap) { // Verify and release the WebGL context if it exists
            rendererMap.dispose();
            rendererMap = null;
            console.log('✅ WebGL context was released');
        }
        if (sceneMap) { // Verify and remove all children from the scene
            while (sceneMap.children.length > 0) {
                sceneMap.remove(sceneMap.children[0]);
            }
            sceneMap = null;
            console.log('✅ Scene was cleaned');
        }
        if (overlayView) {
            overlayView.setMap(null);
            overlayView = null;
        }
    }

    let currentSection = 0;
    let scrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
        const newSection = Math.round(scrollY / sizes.height);

        if (currentSection !== newSection) {
            currentSection = newSection;

            if (currentSection == 3 || currentSection == 13) {
                // Kill before initializing the new map
                cleanup();
                initMap();
                initReviews();
            }
        }
        console.log('Section changed to:', currentSection);
    });
});


/* -----------------------------------------------------> REVIEWS <----------------------------------------------------------------- */

function initReviews() {
    var placeId = GOOGLE_PLACE_ID; // Import your Google Place ID from the config.js file
    var service = new google.maps.places.PlacesService(map);

    service.getDetails({ placeId: placeId }, function (place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            if (place.reviews) {
                displayReviews(place.reviews);
            }
        } else {
            console.error('Error fetching reviews:', status);
        }
    });
}

function displayReviews(reviews) {
    const reviewsContainer = document.getElementById('reviews-slider');
    reviewsContainer.innerHTML = ''; // Clean the container before adding the new reviews

    reviews.forEach(review => {
        const rating = parseInt(review.rating);
        const reviewHTML = `
            <article class="reviews-container--card">
                <div class="reviews-container--card--info">
                    <img src="${review.profile_photo_url}" alt="${review.author_name}"/>
                    <h2 class="reviews--card-title">${review.author_name}</h2>
                    <p class="reviews--card-rating"><small class="text-muted">${'⭐'.repeat(rating)}</small></p>
                </div>
                <h3 class="reviews--card-text">${review.text}</h3>
                <p class="reviews--card-time">${review.relative_time_description}</p>
            </article>
        `;

        reviewsContainer.innerHTML += reviewHTML;
    });
}


window.onerror = function(message, source, lineno, colno, error) {
    console.error('Error capturado:', message, 'En:', source, 'Línea:', lineno, 'Columna:', colno, 'Error:', error);
};
