// functions.js for functions that the buttons can run without needing a floating window
import { generateRandomColors, applyColors } from "/scripts/colors.js";
import { cyclePlanetFocus, state } from "/Space/solar-controls.js"

window.randomColors = function _randomColors()
{
    generateRandomColors();
    applyColors();
}

window.cyclePlanetFocus = function _cyclePlanetFocus()
{
    cyclePlanetFocus()
}

window.LogStateToConsole = function _logStateToConsole()
{
    console.log(state)
}

window.ShowTutorial = function _showTutorial()
{
    if (!localStorage.getItem('hasVisited')) {
        
        const tutorials = document.querySelectorAll('.tutorial');
        tutorials.forEach(e =>{
            e.style.display = 'inline'
        });
        
        localStorage.setItem('hasVisited', 'true');
    }
}

window.message = function _message(text) {

}

window.ShowTutorial();