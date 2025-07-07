// functions.js for functions that the buttons can run without needing a floating window
import { generateRandomColors, applyColors } from "/assets/scripts/colors.js";
import { cyclePlanetFocus, state } from "/Space/solar-controls.js"
import { composeTextElements } from "/assets/scripts/text-decoration.js";

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

window.SillyMessage = function _message(text) {
    const decorationsDiv = document.getElementById('decorations');
    if (decorationsDiv) {
        const p = document.createElement('p');
        p.textContent = text;
        p.classList.add('decorated-text');
        p.classList.add('wiggly');
        p.classList.add('rainbow');
        p.style.position = 'absolute';
        p.style.left = `${Math.random() * (window.innerWidth - 200)}px`;
        p.style.top = `${Math.random() * (window.innerHeight - 50)}px`;
        p.style.fontSize = '4em';

        decorationsDiv.appendChild(p);

        composeTextElements();
    }
}

window.ShowTutorial();