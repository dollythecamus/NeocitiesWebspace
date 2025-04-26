import {UpdateWigglyText} from "./wiggle-letters.js";
import {UpdateWindowColors, UpdateButtonColors} from "./buttons-windows.js"; 

let generatedSiteColors = {'lights': [], 'darks': []};
let number_of_colors = 16; // Number of colors to generate

function generateRandomLightColor() {
    const hue = Math.floor(Math.random() * 360); // full color wheel
    const saturation = Math.floor(Math.random() * 30) + 70; // 70-100%
    const lightness = Math.floor(Math.random() * 20) + 65; // 75-95%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
  
function generateRandomDarkColor() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 30) + 30; // vivid
    const lightness = Math.floor(Math.random() * 20) + 10; // 10-30%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function generateRandomColors(count) {
    const lights = [];
    const darks = [];
    for (let i = 0; i < count; i++) {
        lights.push(generateRandomLightColor())
        darks.push(generateRandomDarkColor());
    }
    // Store the generated colors in the global array, to make use later (TODO)
    generatedSiteColors.lights = lights;
    generatedSiteColors.darks = darks;

    // Save the colors to local storage
    localStorage.setItem('siteColors', JSON.stringify(generatedSiteColors));

    return generatedSiteColors;
}
  

export function getSiteGeneratedColors(count = number_of_colors) {
    const storedColors = localStorage.getItem('siteColors');
    if (storedColors) {
        generatedSiteColors = JSON.parse(storedColors);
    }
    
    if (generatedSiteColors.lights.length === 0 && generatedSiteColors.darks.length === 0) {
        // If no colors have been generated yet, generate them
        generatedSiteColors = generateRandomColors(count);
    }
    return {
        lights: generatedSiteColors.lights.slice(0, count), 
        darks: generatedSiteColors.darks.slice(0, count)
    };
}

export function applyColors()
{
    // generateRandomColors(number_of_colors);
    const colors = getSiteGeneratedColors();
    UpdateWigglyText(colors);
    UpdateWindowColors(colors);
    UpdateButtonColors(colors);
    updateFloatingTextColors(colors);
}

function updateFloatingTextColors()
{

}
