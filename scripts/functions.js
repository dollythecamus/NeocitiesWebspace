// functions.js for functions that the buttons can run without needing a floating window
import { generateRandomColors, applyColors } from "./colors.js";
import { cyclePlanetFocus, state } from "../Space/solar-controls.js"

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