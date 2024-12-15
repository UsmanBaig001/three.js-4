import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import gsap from "gsap";

// Debug GUI
const gui = new dat.GUI();

// Loading Manager
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => console.log("Loading started");
loadingManager.onLoad = () => console.log("Loading completed");
loadingManager.onProgress = (url, loaded, total) =>
  console.log(`Loading: ${(loaded / total) * 100}% ${url}`);
loadingManager.onError = () => console.error("Error loading resource");

const textureLoader = new THREE.TextureLoader(loadingManager);
const cuberTextureLoader = new THREE.CubeTextureLoader();

const crateTexture = textureLoader.load("./textures/Crate.webp");
const matcapTexture = textureLoader.load("./textures/matcaps/3.png");
const doorColorTexture = textureLoader.load("./textures/door/color.jpg");
const doorHeightTexture = textureLoader.load("./textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("./textures/door/normal.jpg");
const doorAlphaTexture = textureLoader.load("./textures/door/alpha.jpg");
const doorMetalnessTexture = textureLoader.load(
  "./textures/door/metalness.jpg"
);
const doorRoughnessTexture = textureLoader.load(
  "./textures/door/roughness.jpg"
);
const doorAmbientOcclusionTexture = textureLoader.load(
  "./textures/door/ambientOcclusion.jpg"
);

// crateTexture.minFilter = THREE.NearestFilter;
// crateTexture.magFilter = THREE.NearestFilter;
// crateTexture.generateMipmaps = false;
// matcapTexture.minFilter = THREE.NearestFilter;
// matcapTexture.magFilter = THREE.NearestFilter;
// matcapTexture.generateMipmaps = false;
// doorColorTexture.minFilter = THREE.NearestFilter;
// doorColorTexture.magFilter = THREE.NearestFilter;
// doorColorTexture.generateMipmaps = false;

const envirnomentMapTextures = cuberTextureLoader.load([
  "./textures/environmentMaps/0/px.jpg",
  "./textures/environmentMaps/0/nx.jpg",
  "./textures/environmentMaps/0/py.jpg",
  "./textures/environmentMaps/0/ny.jpg",
  "./textures/environmentMaps/0/pz.jpg",
  "./textures/environmentMaps/0/nz.jpg",
]);

// Canvas
const canvas = document.getElementById("webgl");

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Scene
const scene = new THREE.Scene();

// Geometry and Material
// const geometry = new THREE.BoxGeometry(1, 1, 1, 4, 4, 4);

// Meshes

// const material = new THREE.MeshBasicMaterial({ map: crateTexture });
// const material = new THREE.MeshBasicMaterial({});
// material.map = crateTexture;
// material.side = THREE.DoubleSide;
// material.transparency = true;
// material.opacity = 0.5;
// material.alphaMap = crateTexture;

// const material = new THREE.MeshNormalMaterial();
// material.side = THREE.DoubleSide;
// material.flatShading = true;

// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;
// material.side = THREE.DoubleSide;

// const material = new THREE.MeshDepthMaterial();

// const material = new THREE.MeshLambertMaterial();
//
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 1000;
// material.specular = new THREE.Color("white");

// const material = new THREE.MeshToonMaterial();

// const material = new THREE.MeshStandardMaterial();
// material.metalness = 0;
// material.roughness = 1;
// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.1;
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.side = THREE.DoubleSide;
// material.normalMap = doorNormalTexture;
// material.normalScale.set(0.5, 0.5);
// material.alphaMap = doorAlphaTexture;
// material.transparent = true;

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.side = THREE.DoubleSide;
material.envMap = envirnomentMapTextures;

gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);
gui.add(material, "aoMapIntensity").min(0).max(10).step(0.001);
gui.add(material, "displacementScale").min(0).max(1).step(0.0001);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere.position.x = -1.5;
sphere.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);
plane.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
);
torus.position.x = 1.5;
torus.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);

scene.add(plane, sphere, torus);

/**
 * Lights
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // More ambient light
// const pointLight = new THREE.PointLight(0xffffff, 1.5); // Stronger point light
// pointLight.position.set(2, 3, 4);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(2, 3, 4);
scene.add(directionalLight);

// Axes Helper
// const axesHelper = new THREE.AxesHelper(1, 1, 1);
// scene.add(axesHelper);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.z = 5;
// camera.lookAt(mesh.position);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Handle Window Resize
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Fullscreen Toggle
window.addEventListener("dblclick", () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen?.() || canvas.webkitRequestFullscreen?.();
  } else {
    document.exitFullscreen?.() || document.webkitExitFullscreen?.();
  }
});

const clock = new THREE.Clock();
// Animation Loop
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
