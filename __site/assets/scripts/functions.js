// functions.js for functions that the buttons can run without needing a floating window
import { generateRandomColors, applyColors } from "/assets/scripts/colors.js";
import { cyclePlanetFocus, state } from "/Space/solar-controls.js"
import { composeTextElements, ToggleDecorate } from "/assets/scripts/decoration.js";

const WEBSITE_VERSION = '0.5.3';

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

window.MessageSilly = function _message_silly(text) {

    const decorationsDiv = document.getElementById('decorations');
    if (decorationsDiv) {
        const p = document.createElement('p');
        p.textContent = text;
        p.classList.add('decoration');
        p.classList.add('decorated-text');
        p.classList.add('wiggly');
        p.classList.add('rainbow');
        p.classList.add('random-position');
        p.classList.add('interactable');
        p.classList.add('erasable');
        p.style.position = 'absolute';
        p.style.left = `${Math.random() * (window.innerWidth - 200)}px`;
        p.style.top = `${Math.random() * (window.innerHeight - 50)}px`;
        p.style.fontSize = '4em';

        decorationsDiv.appendChild(p);

        p.addEventListener('click', () => {
            p.remove();
        });

        composeTextElements();
    }
}

window.seeWebsiteVersion = function _seeWebsiteVersion() {

    const versionElements = document.querySelectorAll(".WEBSITE_VERSION");
    versionElements.forEach(element => {
    element.textContent = WEBSITE_VERSION;
    });
    console.log(`Website version: ${WEBSITE_VERSION}`);
}

window.gotoPage = function _gotoPage(url) {
    window.location.href = url;
}

window.decorate = function _decorate() {
    ToggleDecorate();
}

window.ShowTutorial();
window.seeWebsiteVersion();