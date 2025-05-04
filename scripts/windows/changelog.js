
import 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';

let id = "changelog";

function loadMarkdown() {
    fetch('../../changelog.md')
        .then(response => response.text())
        .then(data => {
            const contentElement = document.getElementById(id).querySelector('#changelog-container');

            contentElement.innerHTML = marked.parse(data);
            //document.getElementById(id).innerHTML = marked.parse(data);
        })
        .catch(error => console.error('Error loading markdown file:', error));
}


document.addEventListener("windowOpened", (event) => {

    if (event.detail.id != id)
        return;

    onWindowOpen();
});

async function onWindowOpen()
{
    // load the changelog file and show
    loadMarkdown()
}

document.addEventListener("windowClosed", (event) => {
    // something on windowClosed.
});