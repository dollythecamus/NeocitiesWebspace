// functions.js for functions that the buttons can run without needing a floating window
import { generateRandomColors, applyColors } from "./colors.js";

window.randomColors = function randomColors()
{
    generateRandomColors();
    applyColors();
}