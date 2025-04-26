
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