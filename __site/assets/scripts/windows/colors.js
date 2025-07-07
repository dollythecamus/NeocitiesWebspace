// /scripts/windows/colors.js
// don't get it confused with /scripts/colors.js
// this is for the color floating window
import { generateRandomColors, applyColors } from "/assets/scripts/colors.js";

const id = "colors-window"

document.addEventListener("windowOpened", (event) => {

    if (event.detail.id != id)
        return;

    document.getElementById("generate-color").addEventListener("click", () => {
        generateRandomColors();
        applyColors();
    });
});

document.addEventListener("windowClosed", (event) => {

    if (event.id != id)
        return;

    document.getElementById("generate-color").removeEventListener("click");
});