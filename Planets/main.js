import * as THREE from 'https://cdn.skypack.dev/three@0.134.0';
import { createRenderer, renderLoop } from './Renderer.js';
import { createPlanet, updatePlanet, enablePlanetRaycast, createOrbitLine , addProjectToPlanet, setPlanetOrbits, setSimulationSpeeds} from './Planet.js';

const state = {
  scene: null,
  camera: null,
  renderer: null,
  planets: [],
  projects: [],
  focusedPlanetIndex: 3,
  controls: null, 
};

// Init renderer
Object.assign(state, createRenderer());

let projectsData = [];
let planetsData = []

async function loadData(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load data: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

projectsData = await loadData('./data/projects.json');
planetsData = await loadData('./data/planets.json');

// Create planets and add them to the scene
state.planets = planetsData.planets.map((config) => {
    const planet = createPlanet(config, state.scene);
    enablePlanetRaycast(planet, state.camera, state.renderer.domElement);
    return planet
  });
  
state.planets.forEach((planet) => {
  setPlanetOrbits(state.planets, planet);
  createOrbitLine(state.planets, planet, state.scene);
});

state.projects = projectsData.projects.map((project) => {
  const planet = state.planets.find(p => p.name === project.planet);
  if (planet) {
      addProjectToPlanet(planet, project);
    }
  return project;
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault(); // stop browser from switching elements
      state.focusedPlanetIndex = (state.focusedPlanetIndex + 1) % state.planets.length;
    }
  });

// Patch in update logic
state.update = function(deltaTime) {
  for (const planet of state.planets) {
    updatePlanet(planet, deltaTime);
  }

  // Add offset to OrbitControls camera position based on the focused planet's orbit
  const targetPlanet = state.planets[state.focusedPlanetIndex];
  if (targetPlanet) {
    
    let maxDistance = targetPlanet.radius * 4;
    
    if (targetPlanet.name == "Star") {
      maxDistance = targetPlanet.radius * 100;  
    }

    state.controls.maxDistance = maxDistance;
    state.controls.minDistance = targetPlanet.radius*0.8;
    state.controls.target.copy(targetPlanet.center.position);
    state.controls.update();
  }
};

setSimulationSpeeds(0.01, 1.0)
// Render loop
renderLoop(state);

