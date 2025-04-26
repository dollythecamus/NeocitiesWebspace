// /scripts/windows/colors.js
// don't get it confused with /scripts/colors.js
// this is for the color floating window
import { generateRandomColors, applyColors } from "../colors.js";

document.getElementById("generate-color").addEventListener("click", () => {
    generateRandomColors();
    applyColors();
});