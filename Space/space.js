import { createRenderer, renderLoop } from './Renderer.js';
import { planetsData, createPlanet, updatePlanet, enablePlanetRaycast, createOrbitLine, setPlanetOrbits } from './Planet.js';
import { state, simSpeed, updateOrbitLines } from './solar-controls.js'
import { inventionsData, updateInventionOrbits, enableInventionRaycast, CreateInvention } from './Invention.js';

// Init renderer
Object.assign(state, createRenderer());

// Create planets and add them to the scene
state.planets = planetsData.planets.map((config) => {
    const planet = createPlanet(config, state.scene);
    enablePlanetRaycast(planet, state.camera, state.renderer.domElement);
    return planet
  });
  
state.planets.forEach((planet) => {
  setPlanetOrbits(state.planets, planet);
  if (planet.orbit.imaginary) {
    state.planets = state.planets.filter((p) => p !== planet);
  }
});

state.planets.forEach((planet) => {
  const line = createOrbitLine(state.planets, planet, state.scene, simSpeed);
  if (line)
    state.lines.push(line)
});

state.inventions = inventionsData.map((invention) => {
  const new_invention = CreateInvention(invention, state);
  enableInventionRaycast(new_invention, state.camera, state.renderer.domElement)
  return new_invention;
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault(); // stop browser from switching elements
      cyclePlanetFocus()
    }
});

state.update = function(deltaTime) {
  for (const planet of state.planets) {
    updatePlanet(planet, state.planets, deltaTime, simSpeed.translation);
  };

  for (const invention of state.inventions)
  {
    updateInventionOrbits(invention, state.planets, deltaTime, simSpeed);
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

