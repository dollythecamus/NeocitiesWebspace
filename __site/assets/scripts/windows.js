import { getSiteGeneratedColors } from "/assets/scripts/colors.js";
import { data } from '/assets/scripts/data.js';

const windowsConfig = data.windows;

let z = 1001;
const openWindows = {};

// open windows at the start marked with start = true
Object.keys(windowsConfig).forEach(id => {
    if (windowsConfig[id].start) {
        spawnWindow(id);
    }
});

export async function spawnWindow(id) {
    const windowData = windowsConfig[id]
    const contentUrl = `/assets/windows/${windowData.contentUrl}`
    const scriptUrl = windowData.scriptUrl ? `/assets/scripts/windows/${windowData.scriptUrl}` : null;
    const title = windowData.title
    // If window already exists, bring it to front
    if (openWindows[id]) {
        const existingWin = openWindows[id];
        existingWin.style.zIndex = z++;
        return;
    }

    const win = document.createElement("div");
    win.className = "window";
    win.id = id;
    win.style.top = Math.random() * window.innerHeight * 0.8 + "px";
    win.style.left = Math.random() * window.innerWidth * 0.8 + "px";
    win.style.zIndex = z++;

    win.innerHTML = `
    <div class="window-header">${title}
      <button class="close-btn" style="float:right;">✖</button>
    </div>
    <div class="window-content">
      <p>Loading...</p>
    </div>
  `;

    makeDraggable(win);
    //makeResizable(win);
    document.body.querySelector('#floating-windows').appendChild(win);
    openWindows[id] = win;

    let html = await loadContent(contentUrl);
    win.querySelector(".window-content").innerHTML = html;

    // Load and execute the script if specified in window data
    if (scriptUrl) {
        if (!document.querySelector(`script[src="${scriptUrl}"]`)) {
            // if the script is not already loaded
            try {
                const script = document.createElement("script");
                script.src = scriptUrl;
                script.async = true;
                script.type = "module"
                script.onload = () => {
                    console.log(`Script loaded: ${scriptUrl}`);
                    document.dispatchEvent(new CustomEvent("windowOpened", { detail: { id } }));
                }
                script.onerror = () => console.error(`Failed to load script: ${scriptUrl}`);
                document.body.appendChild(script);
            } catch (error) {
                console.error(`Error loading script: ${error.message}`);
            }
        }
        else{
            document.dispatchEvent(new CustomEvent("windowOpened", { detail: { id } }));
        }
    }
    else{
        document.dispatchEvent(new CustomEvent("windowOpened", { detail: { id } }));
    }

    // Close button logic
    win.querySelector(".close-btn").addEventListener("click", () => {

        document.dispatchEvent(new CustomEvent("windowClosed", { detail: {id: id} }));

        document.body.querySelector('#floating-windows').removeChild(win);
        delete openWindows[id];
    });

    UpdateWindowColors(getSiteGeneratedColors());
}

async function loadContent(contentUrl) {
    // Load content from the provided URL
    if (contentUrl) {
        try {
            const response = await fetch(contentUrl);
            if (!response.ok) {
                throw new Error(`Failed to load content: ${response.statusText}`);
            }
            return await response.text();
        } catch (error) {
            return `<p>Error loading content: ${error.message}</p><p>${contentUrl}</p>`;
        }
    }
}

function makeDraggable(el) {
    let offsetX, offsetY, isDragging = false;

    const header = el.querySelector(".window-header");
    header.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - el.offsetLeft;
        offsetY = e.clientY - el.offsetTop;
        el.style.zIndex = z++;
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        el.style.left = e.clientX - offsetX + "px";
        el.style.top = e.clientY - offsetY + "px";
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    /// touch events

    document.addEventListener('touchend', (e) => {
        isDragging = false;
    });

    header.addEventListener('touchstart', (e) => {
        isDragging = true;
        const touch = e.touches[0];
        offsetX = touch.clientX - el.offsetLeft;
        offsetY = touch.clientY - el.offsetTop;
        el.style.zIndex = z++;
    });
    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        el.style.left = touch.clientX - offsetX + "px";
        el.style.top = touch.clientY - offsetY + "px";
    });
}

export function UpdateWindowColors(colors) {
    const windows = document.querySelectorAll('.window');
    windows.forEach(win => {
        win.style.backgroundColor = colors.darks[1]; // Change window background color
    });

    const headers = document.querySelectorAll('.window-header');
    headers.forEach(header => {
        header.style.backgroundColor = colors.lights[2]; // Change header background color
        header.style.color = colors.darks[2]; // Change header text color
    });

    const windowContents = document.querySelectorAll('.window-content');
    windowContents.forEach(content => {
        content.style.backgroundColor = colors.darks[4]; // Change content background color
        content.style.color = colors.lights[4]; // Change content text color
    });

    const closeButtons = document.querySelectorAll('.close-btn');
    closeButtons.forEach(btn => {
        btn.style.backgroundColor = colors.lights[3]; // Change close button background color
        btn.style.color = colors.darks[3]; // Change close button text color
    });
}
