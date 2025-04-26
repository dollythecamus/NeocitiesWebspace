import {setOrbitLinesVisible, setSimulationSpeeds} from "../../Planets/solar-controls.js"

// Add event listener for simulation speed slider
const speedSlider = document.getElementById('simulation-speed');
speedSlider.addEventListener('input', (e) => {
    const speed = parseFloat(e.target.value);
    setSimulationSpeeds(speed, 1.0);
});

const orbitLinesCheckbox = document.getElementById('orbit-lines');
orbitLinesCheckbox.addEventListener('change', (e) => {
    const visible = e.target.checked;
    setOrbitLinesVisible(visible)
});