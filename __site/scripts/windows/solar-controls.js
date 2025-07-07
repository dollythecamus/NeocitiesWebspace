import {setOrbitLinesVisible, setSimulationSpeeds, updateOrbitLines} from "../../Space/solar-controls.js"

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
        speedSlider.addEventListener('change', (e) => {
        const speed = parseFloat(e.target.value);
        if (speed == 0 || speed < 0.1 || speed == null || speed == undefined || speed == NaN) {return;}
        setSimulationSpeeds(speed);
    });

    const orbitLinesCheckbox = document.getElementById('orbit-lines');
        orbitLinesCheckbox.addEventListener('change', (e) => {
        const visible = e.target.checked;
        setOrbitLinesVisible(visible)
    });
    
    const orbitLinesUpdate = document.getElementById('update-orbit-lines');
        orbitLinesUpdate.addEventListener('click', (e) => {
        updateOrbitLines();
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

    const orbitLinesUpdate = document.getElementById('update-orbit-lines');
    orbitLinesUpdate.removeEventListener('click');

});