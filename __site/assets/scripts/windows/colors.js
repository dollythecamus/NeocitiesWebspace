// /scripts/windows/colors.js
// don't get it confused with /scripts/colors.js
// this is for the color floating window
import {lightColorhslRange, darkColorhslRange, similarColorhslRange, updateColorRangesAndStore} from "/assets/scripts/colors.js";

const id = "colors-window"

function getStoredColorRanges() {
    const stored = localStorage.getItem('siteColorRanges');
    if (stored) {
        const ranges = JSON.parse(stored);
        return {
            light: ranges.light || lightColorhslRange,
            dark: ranges.dark || darkColorhslRange,
            similar: ranges.similar || similarColorhslRange
        };
    }
    return {
        light: lightColorhslRange,
        dark: darkColorhslRange,
        similar: similarColorhslRange
    };
}

function setupRangeInputs() {
    // Light color ranges
    const lightMin = {
        hue: document.querySelector('#colors-window .light .minimum #hue-range'),
        saturation: document.querySelector('#colors-window .light .minimum #saturation-range'),
        lightness: document.querySelector('#colors-window .light .minimum #lightness-range'),
    };
    const lightMax = {
        hue: document.querySelector('#colors-window .light .maximum #hue-range'),
        saturation: document.querySelector('#colors-window .light .maximum #saturation-range'),
        lightness: document.querySelector('#colors-window .light .maximum #lightness-range'),
    };
    // Dark color ranges
    const darkMin = {
        hue: document.querySelector('#colors-window .dark .minimum #hue-range'),
        saturation: document.querySelector('#colors-window .dark .minimum #saturation-range'),
        lightness: document.querySelector('#colors-window .dark .minimum #lightness-range'),
    };
    const darkMax = {
        hue: document.querySelector('#colors-window .dark .maximum #hue-range'),
        saturation: document.querySelector('#colors-window .dark .maximum #saturation-range'),
        lightness: document.querySelector('#colors-window .dark .maximum #lightness-range'),
    };
    // Similar color ranges
    const similar = {
        hue: document.querySelector('#colors-window .ranges:not(.light):not(.dark) #hue-range'),
        saturation: document.querySelector('#colors-window .ranges:not(.light):not(.dark) #saturation-range'),
        lightness: document.querySelector('#colors-window .ranges:not(.light):not(.dark) #lightness-range'),
    };

    // Load stored values and set sliders
    const stored = getStoredColorRanges();
    // Set slider values and spans
    if (lightMin.hue) lightMin.hue.value = stored.light.hue[0];
    if (lightMax.hue) lightMax.hue.value = stored.light.hue[1];
    if (lightMin.saturation) lightMin.saturation.value = stored.light.saturation[0];
    if (lightMax.saturation) lightMax.saturation.value = stored.light.saturation[1];
    if (lightMin.lightness) lightMin.lightness.value = stored.light.lightness[0];
    if (lightMax.lightness) lightMax.lightness.value = stored.light.lightness[1];

    if (darkMin.hue) darkMin.hue.value = stored.dark.hue[0];
    if (darkMax.hue) darkMax.hue.value = stored.dark.hue[1];
    if (darkMin.saturation) darkMin.saturation.value = stored.dark.saturation[0];
    if (darkMax.saturation) darkMax.saturation.value = stored.dark.saturation[1];
    if (darkMin.lightness) darkMin.lightness.value = stored.dark.lightness[0];
    if (darkMax.lightness) darkMax.lightness.value = stored.dark.lightness[1];

    if (similar.hue) similar.hue.value = stored.similar.hue;
    if (similar.saturation) similar.saturation.value = stored.similar.saturation;
    if (similar.lightness) similar.lightness.value = stored.similar.lightness;

    // Value display spans
    function updateValue(input, span) {
        span.textContent = input.value;
    }
    [lightMin, lightMax, darkMin, darkMax, similar].forEach(group => {
        Object.entries(group).forEach(([key, input]) => {
            if (!input) return;
            const span = input.parentElement.querySelector('span');
            updateValue(input, span);
            input.addEventListener('input', () => updateValue(input, span));
        });
    });

    // Update color ranges in /scripts/colors.js when sliders change
    function updateColorRanges() {
        lightColorhslRange.hue = [parseInt(lightMin.hue.value), parseInt(lightMax.hue.value)];
        lightColorhslRange.saturation = [parseInt(lightMin.saturation.value), parseInt(lightMax.saturation.value)];
        lightColorhslRange.lightness = [parseInt(lightMin.lightness.value), parseInt(lightMax.lightness.value)];
        darkColorhslRange.hue = [parseInt(darkMin.hue.value), parseInt(darkMax.hue.value)];
        darkColorhslRange.saturation = [parseInt(darkMin.saturation.value), parseInt(darkMax.saturation.value)];
        darkColorhslRange.lightness = [parseInt(darkMin.lightness.value), parseInt(darkMax.lightness.value)];
        similarColorhslRange.hue = parseInt(similar.hue.value);
        similarColorhslRange.saturation = parseInt(similar.saturation.value);
        similarColorhslRange.lightness = parseInt(similar.lightness.value);
        updateColorRangesAndStore();
    }
    // Attach listeners to all sliders
    [lightMin, lightMax, darkMin, darkMax, similar].forEach(group => {
        Object.values(group).forEach(input => {
            if (!input) return;
            input.addEventListener('input', updateColorRanges);
        });
    });
    // Initial update
    updateColorRanges();
}

document.addEventListener("windowOpened", (event) => {
    if (event.detail.id != id)
        return;
    setupRangeInputs();
    document.getElementById("generate-color").addEventListener("click", () => {
        window.randomColors();
    });
});

document.addEventListener("windowClosed", (event) => {
    if (event.id != id)
        return;
    document.getElementById("generate-color").removeEventListener("click");
});