import "https://unpkg.com/@panzoom/panzoom@4.6.0/dist/panzoom.min.js";
import { data } from '/assets/scripts/data.js';

// First, include the Panzoom library in your project
// <script src='https://unpkg.com/@panzoom/panzoom@4.5.1/dist/panzoom.min.js'></script>

const gridConfig = data.grid;

const world = document.getElementById('world');
const panzoom = Panzoom(world, {
  maxScale: 2,
  minScale: 0.33,

  filterKey: () => true
});

// Enable zooming with the mouse wheel
world.parentElement.addEventListener('wheel', panzoom.zoomWithWheel);

function composeGrid() {
  if (!gridConfig || !gridConfig.areas || !gridConfig.area_template) return;

  // Find the main grid container
  const mainGrid = world.querySelector('#main_grid');
  if (!mainGrid) return;

  // Build grid-template-areas string
  const areaTemplate = gridConfig.area_template.map(row => `"${row}"`).join(' ');
  mainGrid.style.width = gridConfig.width;
  mainGrid.style.height = gridConfig.height;
  mainGrid.style.display = 'grid';
  mainGrid.style.gridTemplateAreas = areaTemplate;
  mainGrid.style.gridAutoRows = 'auto'; // You can customize this
  mainGrid.style.gridAutoColumns = 'auto'; // You can customize this

  // Set gridArea for existing sections
  gridConfig.areas.forEach(area => {
    const section = mainGrid.querySelector(`.${area}`);
    if (section) {
      section.style.gridArea = area;
    } else if (area.startsWith('margin')) {
      // Create margin divs if not present
      const marginDiv = document.createElement('div');
      marginDiv.className = `grid-item ${area}`;
      marginDiv.style.gridArea = area;
      marginDiv.style.width = 'auto'; // Ensure margin divs take full width
      marginDiv.style.height = 'auto'; // Ensure margin divs take full height
      marginDiv.style.visibility = 'hidden'; // Hide margin areas visually
      mainGrid.appendChild(marginDiv);
    }
  });
}

// Call composeGrid on page load
composeGrid();