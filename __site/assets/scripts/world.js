import "https://unpkg.com/@panzoom/panzoom@4.6.0/dist/panzoom.min.js";

// First, include the Panzoom library in your project
// <script src='https://unpkg.com/@panzoom/panzoom@4.5.1/dist/panzoom.min.js'></script>

const world = document.getElementById('world');
const panzoom = Panzoom(world, {
  maxScale: 2,
  minScale: 0.5,

  filterKey: () => true
});

// Enable zooming with the mouse wheel
world.parentElement.addEventListener('wheel', panzoom.zoomWithWheel);