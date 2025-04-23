let z = 1001;
const openWindows = {};

function spawnWindow(title) {
  // If window already exists, bring it to front
  if (openWindows[title]) {
    const existingWin = openWindows[title];
    existingWin.style.zIndex = z++;
    return;
  }

  const win = document.createElement("div");
  win.className = "window";
  win.style.top = Math.random() * window.innerHeight + "px";
  win.style.left = Math.random() * window.innerWidth + "px";
  win.style.zIndex = z++;

  win.innerHTML = `
    <div class="window-header">${title}
      <button class="close-btn" style="float:right;">✖</button>
    </div>
    <div class="window-content">
    <p>Content for ${title}</p>
    </div>
    <div class="resize-handle"></div>
  `;

  // Close button logic
  win.querySelector(".close-btn").addEventListener("click", () => {
    document.body.removeChild(win);
    delete openWindows[title];
  });

  makeDraggable(win);
  makeResizable(win);
  document.body.appendChild(win);
  openWindows[title] = win;
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
}

function makeResizable(el) {
  const resizeHandle = el.querySelector(".resize-handle");
  resizeHandle.style.position = "absolute";
  resizeHandle.style.width = "10px";
  resizeHandle.style.height = "10px";
  resizeHandle.style.bottom = "0";
  resizeHandle.style.right = "0";
  resizeHandle.style.cursor = "se-resize";
  resizeHandle.style.background = "rgba(0, 0, 0, 0.5)";

  let isResizing = false;

  resizeHandle.addEventListener("mousedown", (e) => {
    isResizing = true;
    e.preventDefault();
    el.style.zIndex = z++;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isResizing) return;
    const rect = el.getBoundingClientRect();
    el.style.width = e.clientX - rect.left + "px";
    el.style.height = e.clientY - rect.top + "px";
  });

  document.addEventListener("mouseup", () => {
    isResizing = false;
  });
}