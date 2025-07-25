import "https://unpkg.com/@panzoom/panzoom@4.6.0/dist/panzoom.min.js";
import { data } from '/assets/scripts/data.js';

const gridConfig = data.grid;

const world = document.getElementById('world');
const panzoom = Panzoom(world, {
  maxScale: 2,
  minScale: 0.33,

  filterKey: () => true
});

world.parentElement.addEventListener('wheel', panzoom.zoomWithWheel);

function composeGrid() {
  if (!gridConfig || !gridConfig.areas || !gridConfig.area_template) return;

  const mainGrid = world.querySelector('#main_grid');
  if (!mainGrid) return;

  const areaTemplate = gridConfig.area_template.map(row => `"${row}"`).join(' ');
  mainGrid.style.width = gridConfig.width;
  mainGrid.style.height = gridConfig.height;
  mainGrid.style.display = 'grid';
  mainGrid.style.gridTemplateAreas = areaTemplate;
  mainGrid.style.gridAutoRows = '1fr'; 
  mainGrid.style.gridAutoColumns = '1fr'; 

  gridConfig.areas.forEach(area => {
    const section = mainGrid.querySelector(`.${area}`);
    if (section) section.style.gridArea = area;
  });
}

composeGrid();