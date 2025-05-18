
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

export let simSpeed = {translation: 1 , rotation: 1, points: 10} = 1; // Default simulation speed multiplier

export function setSimulationSpeeds(trans, rot, points = 10)
{
  simSpeed.translation = trans
  simSpeed.rotation = rot
  simSpeed.points = points
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