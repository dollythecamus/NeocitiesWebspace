import {composeTextElements} from "./text-decoration.js";
import {UpdateButtonColors} from "./buttons.js"; 
import { UpdateWindowColors } from "./windows.js";

let generatedSiteColors = {'lights': [], 'darks': []};
let number_of_colors = 16; // Number of colors to generate

function generateRandomLightColor() {
    const hue = Math.floor(Math.random() * 360); // full color wheel
    const saturation = Math.floor(Math.random() * 30) + 70; // 70-100%
    const lightness = Math.floor(Math.random() * 20) + 65; // 75-95%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function getSimilarColor(hslString, hueRange = 15, satRange = 10, lightRange = 10) {
    // Extract H, S, and L using a regular expression
    const match = hslString.match(/hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/);
    if (!match) throw new Error("Invalid HSL format");
  
    let [h, s, l] = match.slice(1).map(Number);
  
    // Generate similar values within the specified ranges
    h = (h + getRandomOffset(hueRange)) % 360;
    if (h < 0) h += 360;
  
    s = clamp(s + getRandomOffset(satRange), 0, 100);
    l = clamp(l + getRandomOffset(lightRange), 0, 100);
  
    return `hsl(${h}, ${s}%, ${l}%)`;
  }
  
  // Helper to get a random offset within ±range
  function getRandomOffset(range) {
    return Math.floor(Math.random() * (2 * range + 1)) - range;
  }
  
  // Clamp value between min and max
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
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
    
    if (generatedSiteColors.lights.length === 0 && generatedSiteColors.darks.length === 0 || count > generatedSiteColors.lights.length) {
        // If no colors have been generated yet, generate them
        generatedSiteColors = generateRandomColors(count);
    }
    return {
        lights: generatedSiteColors.lights.slice(0, count), 
        darks: generatedSiteColors.darks.slice(0, count)
    };
}

export function oppositeColor(type)
{
    if (type == 'lights')
        return 'darks'
    else if (type == 'darks')
        return 'lights'
}

export function BackgroundColors(colors){
    const titleContainers = document.querySelectorAll(".text-container");

    titleContainers.forEach( (titleContainer) => {

        titleContainer.style.borderColor = colors.darks[0]; // Set border color using the first dark color
        titleContainer.style.backgroundColor = getSimilarColor(colors.darks[0]); // Set background color using the first light color
    });
}  

export function applyColors()
{
    // generateRandomColors(number_of_colors);
    const colors = getSiteGeneratedColors();
    composeTextElements();
    BackgroundColors(colors);
    UpdateWindowColors(colors);
    UpdateButtonColors(colors);

    document.documentElement.style.setProperty('--color0', colors.lights[0]);
    document.documentElement.style.setProperty('--color1', colors.lights[1]);
}
