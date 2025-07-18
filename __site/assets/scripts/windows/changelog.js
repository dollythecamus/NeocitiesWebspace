
import { loadMarkdown } from '/assets/scripts/markdown.js';

let id = "changelog-window";

document.addEventListener("windowOpened", (event) => {

    if (event.detail.id != id)
        return;

    onWindowOpen();
});

async function onWindowOpen()
{
    // load the changelog file and show
    const contentElement = document.getElementById(id).querySelector('#changelog-container');
    contentElement.innerHTML = await loadMarkdown("/changelog.md");

    window.seeWebsiteVersion();

}

document.addEventListener("windowClosed", (event) => {
    // something on windowClosed.
});