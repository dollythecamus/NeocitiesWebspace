import * as THREE from 'https://cdn.skypack.dev/three@0.134.0';
import { createRenderer, renderLoop } from './Renderer.js';
import { createPlanet, updatePlanet, enablePlanetRaycast, createOrbitLine } from './Planet.js';

const state = {
  scene: null,
  camera: null,
  renderer: null,
  planets: [],
  focusedPlanetIndex: 0,
  controls: null, 
};

// Init renderer
Object.assign(state, createRenderer());

// Create multiple planets
const orbits = [
    {
      name: "Martian1",
      semiMajorAxis: 4,
      semiMinorAxis: 3.5,
      orbitSpeed: 1.8,
      color: 0xff0000,
      texture_path: 'TMP_Planets/Martian.png',
      radius: 0.5,
      tilt: 0.034 * (Math.PI / 180), // tilt in radians
      rotationSpeed: 1.0, // radians/sec
      inclination: 7 * (Math.PI / 180), // inclination in radians
      projects: [
        "Project C"
    ],
    },
    {
      name: "Venusian",
      semiMajorAxis: 8,
      semiMinorAxis: 7.8,
      orbitSpeed: 1.4,
      color: 0x00ff00,
      texture_path: 'TMP_Planets/Venusian.png',
      radius: 1.1,
      tilt: 177.4 * (Math.PI / 180), // tilt in radians
      rotationSpeed: 2.5, // radians/sec
      inclination: 3.4 * (Math.PI / 180), // inclination in radians
      projects: [
        "Project A"
      ],
    },
    {
      name: "Terrestrial",
      semiMajorAxis: 14,
      semiMinorAxis: 13.5,
      orbitSpeed: 1.0,
      color: 0x0000ff,
      texture_path: 'TMP_Planets/Terrestrial.png',
      radius: 1,
      tilt: 27.5 * (Math.PI / 180), // tilt in radians
      rotationSpeed: 3.0, // radians/sec
      inclination: 0, // inclination in radians
      projects: [
        "Project B"
        ],
    }
  ];

const projects = [ 
    { title: "Project A", description: "Description A", position: { lat: 45, lon: -30} },
    { title: "Project B", description: "Description B", position: { lat: 45, lon: -30} },
    { title: "Project C", description: "Description C", position: { lat: 45, lon: -30} },
  ];

// Create planets and add them to the scene
state.planets = orbits.map((config) => {
    const planet = createPlanet(config, state.scene, projects);
    planet.name = config.name;
    planet.color = config.color;
    planet.texture_path = config.texture_path;
    
    enablePlanetRaycast(planet, state.camera, state.renderer.domElement);
    createOrbitLine(config, state.scene);
    return planet;
});

// Define moons for planets
const moons = [
    {
        name: "Moon",
        parentPlanet: "Earth",
        semiMajorAxis: 3,
        semiMinorAxis: 2.9,
        orbitSpeed: 2.0,
        color: 0xaaaaaa,
        radius: 0.3,
        tilt: 6.68 * (Math.PI / 180), // tilt in radians
        rotationSpeed: 0.5, // radians/sec
        inclination: 5.145 * (Math.PI / 180), // inclination in radians
    }
];

// Create moons and add them to their parent planets
moons.forEach((config) => {
    const parentPlanet = state.planets.find(p => p.name === config.parentPlanet);
    if (parentPlanet) {
        const moon = createPlanet(config, state.scene, projects);
        moon.name = config.name;
        moon.color = config.color;

        // Set the moon's orbit center to the parent planet's position
        moon.orbitCenter = parentPlanet.mesh.position;

        // Add the moon to the state's planets array for updates
        state.planets.push(moon);
    }
});

// Central star
const starGeometry = new THREE.SphereGeometry(3, 16, 16);
const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const star = new THREE.Mesh(starGeometry, starMaterial);
state.scene.add(star);

window.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault(); // stop browser from switching elements
  
      state.focusedPlanetIndex = (state.focusedPlanetIndex + 1) % state.planets.length;
      const targetPlanet = state.planets[state.focusedPlanetIndex];
  
      // Move OrbitControls target to this planet
      state.controls.target.copy(targetPlanet.mesh.position);
      state.controls.update();
    }
  });

// Patch in update logic
state.update = function(deltaTime) {
  for (const planet of state.planets) {
    updatePlanet(planet, deltaTime);
  }
};

// Render loop
renderLoop(state);

