// content.js
// :D

import 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';

// can't fetch them dinamically because neocities forbids it. i suppose it's a good call on them to prevent me from trying to make a giant stupid website idk
const mdFiles = [];
let currentIndex = 0

let id = "content-window";

// tool to download the markdown files into a list.md file to be loaded from the list
async function TOOL_fetchMarkdownFiles() {
    try {
        const response = await fetch('../content/');
        const data = await response.text();
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(data, 'text/html');
        const links = htmlDoc.querySelectorAll('a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href.endsWith('.md') && href != 'list.md') {
                mdFiles.push(href);
            }
        });
    } catch (error) {
        console.error('Error fetching markdown file list:', error);
    }

    try {
        const listContent = mdFiles.join('\n');
        const blob = new Blob([listContent], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = '../content/list.md';
        a.click();
        URL.revokeObjectURL(a.href);
    } catch (error) {
        console.error('Error writing markdown file list:', error);
    }
}
async function fetchMarkdownFiles()
{
    try {
        const response = await fetch('../content/list.md');
        const data = await response.text();
        mdFiles.push(...data.split('\n').filter(file => file.trim().endsWith('.md')));
    } catch (error) {
        console.error('Error reading markdown file list:', error);
    }
}

// Shuffle the markdown files array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function loadMarkdown(index) {
    fetch(`${mdFiles[index]}`)
        .then(response => response.text())
        .then(data => {
            const contentElement = document.getElementById(id).querySelector('#content-container');

            contentElement.innerHTML = marked.parse(data);
            //document.getElementById(id).innerHTML = marked.parse(data);
        })
        .catch(error => console.error('Error loading markdown file:', error));
}

function nextMarkdown() {
    currentIndex = (currentIndex + 1) % mdFiles.length;
    loadMarkdown(currentIndex);
}

function prevMarkdown() {
    currentIndex = (currentIndex - 1 + mdFiles.length) % mdFiles.length;
    loadMarkdown(currentIndex);
}

document.addEventListener("windowOpened", (event) => {

    if (event.detail.id != id)
        return;

    onWindowOpen();
});

async function onWindowOpen()
{
    //TOOL_fetchMarkdownFiles()

    // Create navigation buttons
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.onclick = prevMarkdown;

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.onclick = nextMarkdown;

    await fetchMarkdownFiles()
    shuffleArray(mdFiles)
    loadMarkdown(currentIndex)

    let content = document.getElementById(id).querySelector('.window-content').querySelector('div')
    content.appendChild(prevButton);
    content.appendChild(nextButton);
}

document.addEventListener("windowClosed", (event) => {
    // something on windowClosed.
});