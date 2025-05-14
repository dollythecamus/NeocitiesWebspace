// don't consfuse with ../nonsense.js

import 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
import {generateNonsense} from "../nonsense.js";

let id = "nonsense-window";


document.addEventListener("windowOpened", (event) => {
    
    if (event.detail.id != id)
        return;

    onWindowOpen();
});

function onWindowOpen()
{
    const generateButton = document.getElementById('generate-nonsense');
    const outputContainer = document.getElementById('nonsense-container');

    generateButton.addEventListener('click', () => {
        const nonsenseText = generateNonsense();
        outputContainer.innerHTML = marked.parse(nonsenseText);
    });

    // Trigger the button click to generate initial nonsense
    generateButton.click();
}


document.addEventListener("windowClosed", (event) => {

    if (event.id != id)
        return;

});