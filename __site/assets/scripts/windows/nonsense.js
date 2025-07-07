// don't consfuse with ../nonsense.js

import {generateNonsense, puppygirl} from "/assets/scripts/nonsense.js";

let id = "nonsense-window";


document.addEventListener("windowOpened", (event) => {
    
    if (event.detail.id != id)
        return;

    onWindowOpen();
});

function onWindowOpen()
{
    const outputContainer = document.getElementById('nonsense-container');
    outputContainer.textContent = puppygirl(10);
}


document.addEventListener("windowClosed", (event) => {

    if (event.id != id)
        return;

});