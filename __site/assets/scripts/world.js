import "https://unpkg.com/@panzoom/panzoom@4.6.0/dist/panzoom.min.js";
import { data } from '/assets/scripts/data.js';

const gridConfig = data.grids;

const world = document.getElementById('world');
const panzoom = Panzoom(world, {
  maxScale: 2,
  minScale: 0.33,
});

world.parentElement.addEventListener('wheel', panzoom.zoomWithWheel);

function composeGrids() {
  const grids = world.querySelectorAll('.grid_container');
  grids.forEach(grid => {
    const this_gridConfig = gridConfig[grid.id];
    const areaTemplate = this_gridConfig.area_template.map(row => `"${row}"`).join(' ');
    grid.style.width = this_gridConfig.size[0];
    grid.style.height = this_gridConfig.size[1];
    grid.style.transform = `translate( ${this_gridConfig.position[0]}px, ${this_gridConfig.position[1]}px)`;
    grid.style.display = 'grid';
    grid.style.gridTemplateAreas = areaTemplate;
    grid.style.gridAutoRows = '1fr'; 
    grid.style.gridAutoColumns = '1fr'; 

    this_gridConfig.areas.forEach(area => {
      const section = grid.querySelector(`.${area}`);
      if (section) section.style.gridArea = area;
    });

    if (grid.id == gridConfig._main) { 
      const pos = [parseInt(this_gridConfig.position[0]), parseInt(this_gridConfig.position[1])]
      setTimeout(() => panzoom.pan(pos[0], pos[1]))
    }

  });
}

function wrap(value, min, max) {
  if (value > max)
    value = min
  if (value < min)
    value = max
  return value
}

function composePagination() {
  const pagination = world.querySelectorAll('.pagination');
  pagination.forEach(book => {
    const pages_button_box = book.querySelector(".pagesbuttonbox")
    const pages_container = book.querySelector(".pages")
    let i = 0
    book.dataset.pageIndex = i;
    for (const page of pages_container.children) {
      page.style.display = "none"
    }
    pages_container.children[book.dataset.pageIndex].style.display = "block"

    const next_button = pages_button_box.querySelector(".nextbutton")
    const prev_button = pages_button_box.querySelector(".prevbutton")

    next_button.addEventListener("click", () => {
      pages_container.children[book.dataset.pageIndex].style.display = "none"
      i = wrap(i+1, 0, pages_container.childElementCount -1)
      book.dataset.pageIndex = i;
      pages_container.children[book.dataset.pageIndex].style.display = "block"
    })

    prev_button.addEventListener("click", () => {
      pages_container.children[book.dataset.pageIndex].style.display = "none"
      i = wrap(i-1, 0, pages_container.childElementCount -1)
      book.dataset.pageIndex = i;
      pages_container.children[book.dataset.pageIndex].style.display = "block"
    })

  });
}

composePagination();
composeGrids();