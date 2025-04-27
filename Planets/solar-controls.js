
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

export let translationSimulationSpeed = 1; // Default simulation speed multiplier
export let rotationSimulationSpeed = 1; // Default simulation speed multiplier

export function setSimulationSpeeds(trans, rot)
{
  translationSimulationSpeed = trans
  rotationSimulationSpeed = rot
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