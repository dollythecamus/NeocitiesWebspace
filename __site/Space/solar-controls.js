import { createOrbitLine } from "./Planet.js";

export const state = {
  scene: null,
  camera: null,
  renderer: null,
  planets: [],
  projects: [],
  lines: [],
  focusedPlanetIndex: 0,
  controls: null, 
};

export const simSpeed = {translation: 1 , rotation: 1, points: 10}; // Default simulation speed multiplier

export function setSimulationSpeeds(speed)
{
  simSpeed.translation = speed
  simSpeed.rotation = speed
  simSpeed.points = speed * 50
}

export function setOrbitLinesVisible(vis)
{
      state.lines.forEach((line) => {
        line.visible = vis;
  });
}

export function cyclePlanetFocus() {
  state.focusedPlanetIndex = (state.focusedPlanetIndex + 1) % state.planets.length;
  if (! state.planets[state.focusedPlanetIndex].camera_focus) // if it is specified to not focus on the planet, sum again
    cyclePlanetFocus()
}

export function updateOrbitLines()
{
  state.lines.forEach((line) => {
    state.scene.remove(line);
  });

  state.planets.forEach((planet) => {
    const line = createOrbitLine(state.planets, planet, state.scene, simSpeed);
    if (line)
      state.lines.push(line)
  });
}