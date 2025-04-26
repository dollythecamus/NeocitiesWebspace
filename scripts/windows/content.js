// content.js
// :D

import 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';

// get all markdown files in content folder
const mdFiles = [];

async function fetchMarkdownFiles() {
    try {
        const response = await fetch('../content/');
        const data = await response.text();
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(data, 'text/html');
        const links = htmlDoc.querySelectorAll('a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href.endsWith('.md')) {
                mdFiles.push(href);
            }
        });
    } catch (error) {
        console.error('Error fetching markdown file list:', error);
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
            document.getElementById('content').innerHTML = marked.parse(data);
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

await fetchMarkdownFiles()

// Create navigation buttons
const prevButton = document.createElement('button');
prevButton.textContent = 'Previous';
prevButton.onclick = prevMarkdown;

const nextButton = document.createElement('button');
nextButton.textContent = 'Next';
nextButton.onclick = nextMarkdown;

let currentIndex = 0

shuffleArray(mdFiles)
loadMarkdown(currentIndex)

content = document.getElementById('content-window')
content.appendChild(prevButton);
content.appendChild(nextButton);