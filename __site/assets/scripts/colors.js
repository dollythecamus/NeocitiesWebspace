import { composeTextElements } from "/assets/scripts/decoration.js";
import { UpdateButtonColors } from "/assets/scripts/buttons.js"; 
import { UpdateWindowColors } from "/assets/scripts/windows.js";

export let lightColorhslRange = {
    hue: [0, 360], // full color wheel
    saturation: [70, 100], // 70-100%
    lightness: [75, 85] // 75-95%
};

export let darkColorhslRange = {
    hue: [0, 360], // full color wheel
    saturation: [30, 60], // 30-60%
    lightness: [10, 30] // 10-30%
};

export let similarColorhslRange = {
    hue: 15, // +/- 15 degrees
    saturation: 10, // +/- 10%
    lightness: 10 // +/- 10%
};

function saveColorRangesToLocalStorage() {
    localStorage.setItem('siteColorRanges', JSON.stringify({
        light: lightColorhslRange,
        dark: darkColorhslRange,
        similar: similarColorhslRange
    }));
}

function loadColorRangesFromLocalStorage() {
    const stored = localStorage.getItem('siteColorRanges');
    if (stored) {
        const ranges = JSON.parse(stored);
        if (ranges.light) Object.assign(lightColorhslRange, ranges.light);
        if (ranges.dark) Object.assign(darkColorhslRange, ranges.dark);
        if (ranges.similar) Object.assign(similarColorhslRange, ranges.similar);
    }
}

export function updateColorRangesAndStore() {
    saveColorRangesToLocalStorage();
}

function generateRandomLightColor() {
    const hue = Math.floor(Math.random() * (lightColorhslRange.hue[1] - lightColorhslRange.hue[0] + 1)) + lightColorhslRange.hue[0];
    const saturation = Math.floor(Math.random() * (lightColorhslRange.saturation[1] - lightColorhslRange.saturation[0] + 1)) + lightColorhslRange.saturation[0];
    const lightness = Math.floor(Math.random() * (lightColorhslRange.lightness[1] - lightColorhslRange.lightness[0] + 1)) + lightColorhslRange.lightness[0];
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function generateRandomDarkColor() {
    const hue = Math.floor(Math.random() * (darkColorhslRange.hue[1] - darkColorhslRange.hue[0] + 1)) + darkColorhslRange.hue[0];
    const saturation = Math.floor(Math.random() * (darkColorhslRange.saturation[1] - darkColorhslRange.saturation[0] + 1)) + darkColorhslRange.saturation[0];
    const lightness = Math.floor(Math.random() * (darkColorhslRange.lightness[1] - darkColorhslRange.lightness[0] + 1)) + darkColorhslRange.lightness[0];
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function getSimilarColor(hslString, hueRange = similarColorhslRange.hue, satRange = similarColorhslRange.saturation, lightRange = similarColorhslRange.lightness) {
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
  
  // Helper to get a random offset within range
  function getRandomOffset(range) {
    return Math.floor(Math.random() * (2 * range + 1)) - range;
  }
  
  // Clamp value between min and max
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
  

export function generateRandomColors(count) {
    let generatedSiteColors = {'lights': [], 'darks': []};
    const lights = [];
    const darks = [];
    for (let i = 0; i < count; i++) {
        lights.push(generateRandomLightColor())
        darks.push(generateRandomDarkColor());
    }
    // Store the generated colors in the global array, to make use later
    generatedSiteColors.lights = lights;
    generatedSiteColors.darks = darks;

    // Save the colors to local storage
    localStorage.setItem('siteColors', JSON.stringify(generatedSiteColors));

    return generatedSiteColors;
}
  

export function getSiteGeneratedColors(count = 16) {
    // Load color ranges from localStorage if present
    loadColorRangesFromLocalStorage();

    const storedColors = localStorage.getItem('siteColors');
    let generatedSiteColors = {'lights': [], 'darks': []};
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

export function applyColors()
{
    const colors = getSiteGeneratedColors();
    composeTextElements();
    UpdateWindowColors(colors);
    UpdateButtonColors(colors);

    document.documentElement.style.setProperty('--color0', colors.lights[0]);
    document.documentElement.style.setProperty('--color1', colors.lights[1]);
    document.documentElement.style.setProperty('--color2', colors.lights[2]);
    document.documentElement.style.setProperty('--color3', colors.lights[3]);
    document.documentElement.style.setProperty('--color4', colors.lights[4]);
    document.documentElement.style.setProperty('--color5', colors.lights[5]);
    document.documentElement.style.setProperty('--color6', colors.lights[6]);

    document.documentElement.style.setProperty('--colorDark0', colors.darks[0]);
    document.documentElement.style.setProperty('--colorDark1', colors.darks[1]);
    document.documentElement.style.setProperty('--colorDark2', colors.darks[2]);
}

applyColors();