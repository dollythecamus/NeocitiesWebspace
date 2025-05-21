import * as THREE from 'https://cdn.skypack.dev/three@0.134.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.134.0/examples/jsm/controls/OrbitControls.js';

const LOW_RES_WIDTH = 1920 / 2
const LOW_RES_HEIGHT = 1080 / 2

export function createRenderer() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
  camera.position.z = 200;
  camera.position.y = 150;

  const renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Add a starry skybox
  const loader = new THREE.CubeTextureLoader();
  const starrySkybox = loader.load([
    './stars/stars3.jpg', // Left
    './stars/stars3.jpg', // Right
    './stars/stars3.jpg', // Top
    './stars/stars3.jpg', // Bottom
    './stars/stars3.jpg', // Front
    './stars/stars3.jpg', // Back
  ]);
  scene.background = starrySkybox;

  // Low-res render target (the pixelated one)
  const renderTarget = new THREE.WebGLRenderTarget(LOW_RES_WIDTH, LOW_RES_HEIGHT);
  renderTarget.texture.minFilter = THREE.NearestFilter;
  renderTarget.texture.magFilter = THREE.NearestFilter;
  renderTarget.texture.generateMipmaps = false;

  // Fullscreen quad to show low-res image
  const finalScene = new THREE.Scene();
  const finalCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const finalMaterial = new THREE.MeshBasicMaterial({ map: renderTarget.texture });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), finalMaterial);
  finalScene.add(quad);

  // Orbit controls for the camera
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.enablePan = true;
  controls.enableZoom = true;
  controls.target.set(0, 0, 0);
  controls.update();


  return {
      scene,
      camera,
      renderer,
      controls,
      renderTarget,
      finalScene,
      finalCamera,
    };
}

export function renderLoop(state) {
    let lastTime = performance.now();

    function animate() {
      requestAnimationFrame(animate);
  
      const currentTime = performance.now();
      const deltaTime = (currentTime - lastTime) / 1000; // seconds
      lastTime = currentTime;

      state.controls.update();
  
      // Update planet orbits
      if (typeof state.update === 'function') {
        state.update(deltaTime);
      }
  
      state.renderer.setRenderTarget(state.renderTarget);
      state.renderer.render(state.scene, state.camera);
  
      state.renderer.setRenderTarget(null);
      state.renderer.render(state.finalScene, state.finalCamera);
    }
  
    animate();
}

