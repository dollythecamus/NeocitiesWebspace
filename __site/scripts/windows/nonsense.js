// don't consfuse with ../nonsense.js

import 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
import {generateNonsense, puppygirl} from "../nonsense.js";

let id = "nonsense-window";


document.addEventListener("windowOpened", (event) => {
    
    if (event.detail.id != id)
        return;

    onWindowOpen();
});

function onWindowOpen()
{
    const outputContainer = document.getElementById('nonsense-container');
    outputContainer.innerHTML = marked.parse(puppygirl(10));
}


document.addEventListener("windowClosed", (event) => {

    if (event.id != id)
        return;

});