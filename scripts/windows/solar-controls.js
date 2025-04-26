import {setOrbitLinesVisible, setSimulationSpeeds} from "../../Planets/solar-controls.js"

const id = "solar-controls" 

document.addEventListener("windowOpened", (event) => {
    
    if (event.detail.id != id)
        return;

    onWindowOpen();
});

function onWindowOpen()
{
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
}


document.addEventListener("windowClosed", (event) => {

    if (event.id != id)
        return;

    // Add event listener for simulation speed slider
    const speedSlider = document.getElementById('simulation-speed');
    speedSlider.removeEventListener('input');

    const orbitLinesCheckbox = document.getElementById('orbit-lines');
    orbitLinesCheckbox.removeEventListener('change');

});