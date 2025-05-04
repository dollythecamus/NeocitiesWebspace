import { createRenderer, renderLoop } from './Renderer.js';
import { planetsData, createPlanet, updatePlanet, enablePlanetRaycast, createOrbitLine , addProjectToPlanet, setPlanetOrbits} from './Planet.js';
import {state, translationSimulationSpeed, rotationSimulationSpeed} from './solar-controls.js'

// Init renderer
Object.assign(state, createRenderer());

let projectsData = [];
//let planetsData = []

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
// planetsData = await loadData('./data/planets.json');

// Create planets and add them to the scene
state.planets = planetsData.planets.map((config) => {
    const planet = createPlanet(config, state.scene);
    enablePlanetRaycast(planet, state.camera, state.renderer.domElement);
    return planet
  });
  
state.planets.forEach((planet) => {
  setPlanetOrbits(state.planets, planet);
  const line = createOrbitLine(state.planets, planet, state.scene);
  if (line)
    state.lines.push(line)
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
      cyclePlanetFocus()
    }
});


// Patch in update logic
state.update = function(deltaTime) {
  for (const planet of state.planets) {
    updatePlanet(planet, deltaTime, {translation: translationSimulationSpeed, rotation: rotationSimulationSpeed});
  }

  const targetPlanet = state.planets[state.focusedPlanetIndex];
  if (targetPlanet && targetPlanet.camera_focus) {
    
    let maxDistance = targetPlanet.radius * 40;
    
    if (targetPlanet.name == "Star") {
      maxDistance = targetPlanet.radius * 100;  
    }

    state.controls.maxDistance = maxDistance;
    state.controls.minDistance = targetPlanet.radius*0.8;
    state.controls.target.copy(targetPlanet.center.position);
    state.controls.update();
  }
};

//setSimulationSpeeds(10.0, 1.0)
// Render loop
renderLoop(state);

