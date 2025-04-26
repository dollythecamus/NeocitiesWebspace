import { applyColors ,generateRandomColors} from './colors.js';
import { setSimulationSpeeds , setOrbitLinesVisible} from '../Planets/solar-controls.js';


let data = {};

async function loadData(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load data: ${response.statusText}`);
    }
    data = await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Dynamically set the data path
// data_path MUST be set in the main script tag of the page. 
await loadData(data_path);

const buttonConfig = data.buttons;
const windowsconfig = data.windows;

const buttons = [];
const currentPositions = [];
const originalPositions = [];

const startX = 100;
const startY = 100;
const offset = 3;

let clickStartPos = { x: 0, y: 0 };
const clickThreshold = 100; // pixels

let isExpanded = false;
let isDragging = false;
const lastMouse = { x: startX, y: startY };

// todo next: use the generated colors to get the button colors

for (let i = 0; i < buttonConfig.length; i++) {
    const { icon, color, window} = buttonConfig[i];
    const btn = document.createElement('div');
    btn.classList.add('button');
    if (i === buttonConfig.length - 1) btn.classList.add('front');

    // button colors is now in applyColors from colors.js
    // btn.style.background = color;

    btn.innerText = icon;
    
    const x = startX + i * offset;
    const y = startY + i * offset;
    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;
    
    currentPositions.push({ x, y });
    originalPositions.push({ x, y });
    
    buttons.push(btn);
    document.body.appendChild(btn);
    
    if (window != "null")
    {
      btn.addEventListener('click', () => {
        //console.log(windowsconfig[window])
        let dupe = Object.assign({}, windowsconfig[window]) 
        on_buttonClick(dupe); // duplicate window data, this works
        }
      );
    }
}

async function on_buttonClick(window) {
  await spawnWindow(window);
}

const frontButton = buttons[buttons.length - 1];
document.body.appendChild(frontButton); // Ensure top in DOM

frontButton.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastMouse.x = e.pageX;
    lastMouse.y = e.pageY;
    clickStartPos.x = e.pageX;
    clickStartPos.y = e.pageY;
    requestAnimationFrame(update);
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    lastMouse.x = e.pageX;
    lastMouse.y = e.pageY;
});

frontButton.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    
    isDragging = false;
    
    if (isExpanded){
        isExpanded = false;
        return;
    }
    
    const dx = e.pageX - clickStartPos.x;
    const dy = e.pageY - clickStartPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
  
    if (distance < clickThreshold && !isExpanded) {
      isExpanded = true;
    }
  });
  

const followSpeed = 0.03;
const returnSpeed = 0.04;

function update() {
if (isExpanded) {
    // Spread buttons vertically downward
    for (let i = 0; i < buttons.length; i++) {
    currentPositions[i].x += (originalPositions[i].x - currentPositions[i].x) * returnSpeed;
    currentPositions[i].y += ((originalPositions[i].y + i * 70) - currentPositions[i].y) * returnSpeed;
    }
} else if (isDragging) {
    // Drag front button
    currentPositions[buttons.length - 1].x = lastMouse.x;
    currentPositions[buttons.length - 1].y = lastMouse.y;

    for (let i = buttons.length - 2; i >= 0; i--) {
    const target = currentPositions[i + 1];
    const curr = currentPositions[i];
    curr.x += (target.x - curr.x) * followSpeed;
    curr.y += (target.y - curr.y) * followSpeed;
    }
} else {

    // Adjust button positions for responsiveness
    const titleHeight = 300; // Adjust this value based on your title height
    const mobileThreshold = 768; // Screen width threshold for mobile

    if (window.innerWidth < mobileThreshold) {
      for (let i = 0; i < originalPositions.length; i++) {
        originalPositions[i].x = startX; + i * offset; // Adjust Y positions to stay below the title
        originalPositions[i].y = titleHeight; + i * offset; // Adjust Y positions to stay below the title
      
      }
    } else {
      for (let i = 0; i < originalPositions.length; i++) {
        originalPositions[i].x = startX + i * offset; // Reset to original positions for larger screens
        originalPositions[i].y = startY + i * offset; // Reset to original positions for larger screens
      }
    }

    // Return to stack position
    for (let i = 0; i < buttons.length; i++) {
    currentPositions[i].x += (originalPositions[i].x - currentPositions[i].x) * returnSpeed;
    currentPositions[i].y += (originalPositions[i].y - currentPositions[i].y) * returnSpeed;
    }
}

// Apply positions to DOM
buttons.forEach((btn, i) => {
    btn.style.left = `${currentPositions[i].x - 30}px`;
    btn.style.top = `${currentPositions[i].y - 30}px`;
});

requestAnimationFrame(update);
}
update();


let touchStartTime = 0; // Track the time when touch starts
const touchThreshold = 750; // Time threshold in milliseconds

frontButton.addEventListener('touchstart', (e) => {
  
  const touch = e.touches[0];
  lastMouse.x = touch.pageX;
  lastMouse.y = touch.pageY;

  // Uses a time dealy to determine if the touch is a long press, it's a weird solution but i hope it works
  touchStartTime = Date.now(); // Record the touch start time

  isDragging = true;
  
  requestAnimationFrame(update);
});

window.addEventListener('touchmove', (e) => {
  if (!isDragging) return;

  const touch = e.touches[0];
  lastMouse.x = touch.pageX;
  lastMouse.y = touch.pageY;
});

frontButton.addEventListener('touchend', (e) => {
  isDragging = false;

  const touchDuration = Date.now() - touchStartTime; // Calculate touch duration

  if (touchDuration < touchThreshold) {
    // If touch duration is below the threshold, toggle expansion
    isExpanded = false;
  }

});

// Floating Windows
//////////////////////


let z = 1001;
const openWindows = {};

async function spawnWindow(data) {
  const contentUrl = `../windows/${data.contentUrl}`
  const scriptUrl = data.scriptUrl ? `../scripts/windows/${data.scriptUrl}` : null;
  const title = data.title
  const id = data.id
  // If window already exists, bring it to front
  if (openWindows[title]) {
    const existingWin = openWindows[title];
    existingWin.style.zIndex = z++;
    return;
  }

  const win = document.createElement("div");
  win.className = "window";
  win.style.top = Math.random() * window.innerHeight*0.8 + "px";
  win.style.left = Math.random() * window.innerWidth*0.8 + "px";
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
  document.body.appendChild(win);
  openWindows[title] = win;
  
  let html = await loadContent(contentUrl);
  win.querySelector(".window-content").innerHTML = html;
  
  // Dispatch a custom "windowOpened" event
    const windowOpenedEvent = new CustomEvent("windowOpened", { detail: { id, win, contentUrl} });
    document.dispatchEvent(windowOpenedEvent);
  
  // Load and execute the script if specified in window data
  if (scriptUrl) {
    try {
      const script = document.createElement("script");
      script.src = scriptUrl;
      script.async = true;
      script.type = "module"
      script.onload = () => console.log(`Script loaded: ${scriptUrl}`);
      script.onerror = () => console.error(`Failed to load script: ${scriptUrl}`);
      document.body.appendChild(script);
    } catch (error) {
      console.error(`Error loading script: ${error.message}`);
    }
  }

  // Close button logic
  win.querySelector(".close-btn").addEventListener("click", () => {
    document.body.removeChild(win);
    delete openWindows[title];

    // Dispatch a custom "windowClosed" event
    const windowClosedEvent = new CustomEvent("windowClosed", { detail: { id} });
    document.dispatchEvent(windowClosedEvent);
  });
  applyColors();
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

export function UpdateWindowColors(colors)
{
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

export function UpdateButtonColors(colors) {
  buttons.forEach((btn, i) => {
    btn.style.backgroundColor = colors.lights[i % colors.lights.length]; // Cycle through light colors
    btn.style.color = colors.darks[i % colors.darks.length]; // Cycle through dark colors
  });
}

// Example: Listening for the "windowOpened" event
document.addEventListener("windowOpened", (e) => {
  const { id, win, contentUrl } = e.detail;

  // I gotta be careful using this.

  //console.log(`Window opened: ${title}`);

  // Specify different functions for different windows
  if (id === "colors-window") {
    document.getElementById("generate-color").addEventListener("click", () => {
      generateRandomColors();
      applyColors();
    });

  } else if (id === "solar-controls") {
    
    // Add event listener for simulation speed slider
    const speedSlider = document.getElementById('simulation-speed');
    speedSlider.addEventListener('input', (e) => {
      const speed = parseFloat(e.target.value);
      setSimulationSpeeds(speed, 1.0);
    });
    
    const orbitLinesCheckbox = document.getElementById('orbit-lines');
    orbitLinesCheckbox.addEventListener('change', (e) => {
      const visible = e.target.checked;
      setOrbitLinesVisible(visible)
    });

  } else {
    //console.log(`No specific function for window: ${title}`);
  }

});

// Example: Listening for the "windowClosed" event
document.addEventListener("windowClosed", (e) => {
  console.log(`Window closed: ${e.detail.title}`);
  // Run your custom logic here
});

applyColors();