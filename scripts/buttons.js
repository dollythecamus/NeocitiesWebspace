import { applyColors, oppositeColor } from './colors.js';
import { spawnWindow } from './windows.js';

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

const buttons = [];
const currentPositions = [];
const originalPositions = [];

let startX = window.innerWidth/2;
let startY = window.innerHeight/2;

let clickStartPos = { x: 0, y: 0 };
let startTime = Date.now()
let timeSinceClick = 0
const clickTimeThreshold = 100; // milliseconds

let isExpanded = false;
let isDragging = false;
const lastMouse = { x: startX, y: startY };

const layerConfig = [2, 8, 32]; // Max buttons per layer (like electron shells)
const layerSpacing = 85; // Distance between layers

for (let i = 0; i < buttonConfig.length; i++) {
  createButton(buttonConfig[i], i === buttonConfig.length - 1)
}

function createButton(config, is_front) {
  const icon = config.icon;
  const func = config.func
  const btn = document.createElement('div');
  btn.dataset.config = JSON.stringify(config)

  btn.classList.add('button');
  
  if (is_front) 
    {
      btn.classList.add('front');
      const offset = 120; // Offset in pixels
      const positionMap = {
        "top-left": { x: offset, y: offset },
        "top-center": { x: window.innerWidth / 2, y: offset },
        "top-right": { x: window.innerWidth - offset, y: offset },
        "center-left": { x: offset, y: window.innerHeight / 2 },
        "center-center": { x: window.innerWidth / 2, y: window.innerHeight / 2 },
        "center-right": { x: window.innerWidth - offset, y: window.innerHeight / 2 },
        "bottom-left": { x: offset, y: window.innerHeight - offset },
        "bottom-center": { x: window.innerWidth / 2, y: window.innerHeight - offset },
        "bottom-right": { x: window.innerWidth - offset, y: window.innerHeight - offset },
      };

      const position = config.position || "center-center";
      const mappedPosition = positionMap[position] || positionMap["center-center"];
      btn.style.left = `${mappedPosition.x}px`;
      btn.style.top = `${mappedPosition.y}px`;
      startX = mappedPosition.x;
      startY = mappedPosition.y;
    }

  btn.innerText = icon;

  const x = startX;
  const y = startY;
  btn.style.left = `${x}px`;
  btn.style.top = `${y}px`;

  currentPositions.push({ x, y });
  originalPositions.push({ x, y });

  buttons.push(btn);
  document.body.querySelector('nav').appendChild(btn);

  // if there is no function to the button, end the button generation here
  if (func == null)
    return

  btn.addEventListener('click', () => {

    const func_type = func.split(':')[0]

    if (func_type == "window") {
      const window_id = func.split(':')[1]
      spawnWindowFunction(window_id); // duplicate window data, this works
    } else if (func_type == "function") {
      // don't confuse window with my floating windows...
      const functionName = func.split(':')[1];
      if (typeof window[functionName] === "function") {
        window[functionName]();
      }
    }
  }
  );
}

async function spawnWindowFunction(window_id) {
  await spawnWindow(window_id); // spawn window already handles if the window exists or not
}

const frontButton = buttons[buttons.length - 1];
document.body.appendChild(frontButton); // Ensure top in DOM

frontButton.addEventListener('mousedown', (e) => {
  isDragging = true;
  lastMouse.x = e.pageX;
  lastMouse.y = e.pageY;
  clickStartPos.x = e.pageX;
  clickStartPos.y = e.pageY;
  timeSinceClick = Date.now() - startTime
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  if (isExpanded) isExpanded = false;
  lastMouse.x = e.pageX;
  lastMouse.y = e.pageY;
});

frontButton.addEventListener('mouseup', (e) => {
  isDragging = false;
  let timeNow = Date.now() - startTime
  if ((timeNow - timeSinceClick) < clickTimeThreshold) {
    isExpanded = !isExpanded;
  }
});

const followSpeed = 0.2;
const returnSpeed = 0.2;

function update() {
  if (isExpanded) {
    // Arrange buttons in concentric circles around the front button
    const centerX = currentPositions[buttons.length - 1].x;
    const centerY = currentPositions[buttons.length - 1].y;

    let currentLayer = 0;
    let buttonsInLayer = 0;
    let radius = layerSpacing;

    // Calculate the number of buttons in each layer based on the layerConfig
    const layers = [];
    let remainingButtons = buttons.length - 1; // Exclude the front button

    for (let i = 0; i < layerConfig.length && remainingButtons > 0; i++) {
      const buttonsInThisLayer = Math.min(layerConfig[i], remainingButtons);
      layers.push(buttonsInThisLayer);
      remainingButtons -= buttonsInThisLayer;
    }

    for (let i = 0; i < buttons.length - 1; i++) {
      // Move to the next layer if the current one is full
      if (buttonsInLayer >= layers[currentLayer]) {
        currentLayer++;
        buttonsInLayer = 0;
        radius += layerSpacing; // Increase radius for the next layer
      }

      const angle = (2 * Math.PI / layers[currentLayer]) * buttonsInLayer;
      const targetX = centerX + radius * Math.cos(angle);
      const targetY = centerY + radius * Math.sin(angle);

      currentPositions[i].x += (targetX - currentPositions[i].x) * returnSpeed;
      currentPositions[i].y += (targetY - currentPositions[i].y) * returnSpeed;

      buttonsInLayer++;
    }
  } else if (isDragging) {
    // Drag front button
    currentPositions[buttons.length - 1].x = lastMouse.x;
    currentPositions[buttons.length - 1].y = lastMouse.y;

    // And the rest follow
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
        originalPositions[i].x = startX; // Adjust Y positions to stay below the title
        originalPositions[i].y = titleHeight; // Adjust Y positions to stay below the title

      }
    } else {
      for (let i = 0; i < originalPositions.length; i++) {
        originalPositions[i].x = startX; // Reset to original positions for larger screens
        originalPositions[i].y = startY; // Reset to original positions for larger screens
      }
    }

    // i've decided to leave the buttons in the place the user left them.

    // Send front button to return position
    //currentPositions[buttons.length - 1].x += (originalPositions[buttons.length - 1].x - currentPositions[buttons.length - 1].x) * returnSpeed;
    //currentPositions[buttons.length - 1].y += (originalPositions[buttons.length - 1].y - currentPositions[buttons.length - 1].y) * returnSpeed;

    // Front button stays where the user left it 
    // And the rest follow
    for (let i = buttons.length - 2; i >= 0; i--) {
      const target = currentPositions[i + 1];
      const curr = currentPositions[i];
      curr.x += (target.x - curr.x) * followSpeed;
      curr.y += (target.y - curr.y) * followSpeed;
    }
  }
  // Apply positions to DOM
  buttons.forEach((btn, i) => {
    btn.style.left = `${currentPositions[i].x - 30}px`;
    btn.style.top = `${currentPositions[i].y - 30}px`;
  });

  // update loop
  requestAnimationFrame(update);
}

frontButton.addEventListener('touchstart', (e) => {
  isDragging = true;
  let touch = e.touches[0]
  lastMouse.x = touch.screenX;
  lastMouse.y = touch.screenY;
  clickStartPos.x = touch.screenX;
  clickStartPos.y = touch.screenY;
  timeSinceClick = Date.now() - startTime
});

window.addEventListener('touchmove', (e) => {
  if (!isDragging) return; 
  e.preventDefault(); // Prevent scroll
  if (isExpanded) isExpanded = false;
  let touch = e.touches[0];
  lastMouse.x = touch.screenX;
  lastMouse.y = touch.screenY;
});

frontButton.addEventListener('touchend', (e) => {
  isDragging = false;
  let timeNow = Date.now() - startTime
  if ((timeNow - timeSinceClick) < clickTimeThreshold) {
    isExpanded = !isExpanded;
  }
});

export function UpdateButtonColors(colors) {
  buttons.forEach((btn, i) => {
    
    const data = JSON.parse(btn.dataset.config) // color just specifies if it's from the 'lights' or 'darks' set
    const color = data.color
    const opp = oppositeColor(color)
    
    btn.style.backgroundColor = colors[color][i % colors[color].length]; // Cycle through colors
    btn.style.color = colors[opp][i % colors[opp].length]; // Cycle through opposite colors
  });
}

update();
applyColors();