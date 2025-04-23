/// need to add this line to the html file to add the buttons :D
///<!--webpage goes before the scripts :)-->
///<script src="drag-button.js"></script>

const buttonConfig = [
  { icon: '🖥', color: '#f72585', content: 'screen-window' },
  { icon: '📷', color: '#fee440', content: 'stats-window'},
  { icon: '👁👁', color: '#38b000', content: 'gif'},
  { icon: '👅', color: '#a9a2fa', content: 'personal-window'},
  { icon: '🌌', color: '#3a0ca3', content: 'inventions-window'},
  { icon: '🎥', color: '#4cc9f0', content: 'video'},
  { icon: 'Aa', color: '#f9c74f', content: 'text'},
  { icon: '**', color: '#88292c', content: 'text2'}
];

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

for (let i = 0; i < buttonConfig.length; i++) {
    const { icon, color, content , width, height} = buttonConfig[i];
    const btn = document.createElement('div');
    btn.classList.add('button');
    if (i === buttonConfig.length - 1) btn.classList.add('front');
    btn.style.background = color;
    btn.innerText = icon;

    const x = startX + i * offset;
    const y = startY + i * offset;
    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;

    currentPositions.push({ x, y });
    originalPositions.push({ x, y });

    buttons.push(btn);
    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
        if (isExpanded && i !== buttonConfig.length - 1) {
            spawnWindow(icon, `./content/${content}.html`);
        }
    });
}

const frontButton = buttons[buttons.length - 1];
document.body.appendChild(frontButton); // Ensure top in DOM

frontButton.addEventListener('mousedown', (e) => {
    // if (isExpanded) return;
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
    currentPositions[i].x += (startX - currentPositions[i].x) * returnSpeed;
    currentPositions[i].y += ((startY + i * 70) - currentPositions[i].y) * returnSpeed;
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

function spawnWindow(title, contentUrl, width, height) {
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
  win.style.width = width;
  win.style.height = height;

  win.innerHTML = `
    <div class="window-header">${title}
      <button class="close-btn" style="float:right;">✖</button>
    </div>
    <div class="window-content">
      <p>Loading...</p>
    </div>
  `;

  // Close button logic
  win.querySelector(".close-btn").addEventListener("click", () => {
    document.body.removeChild(win);
    delete openWindows[title];
  });

  makeDraggable(win);
  //makeResizable(win);
  document.body.appendChild(win);
  openWindows[title] = win;

  // Load content from the provided URL
  if (contentUrl) {
    fetch(contentUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load content: ${response.statusText}`);
        }
        return response.text();
      })
      .then((html) => {
        win.querySelector(".window-content").innerHTML = html;
      })
      .catch((error) => {
        win.querySelector(".window-content").innerHTML = `<p>Error loading content: ${error.message}</p>`;
      });
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
