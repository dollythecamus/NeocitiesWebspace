import * as THREE from 'https://cdn.skypack.dev/three@0.134.0';

let translationSimulationSpeed = 1; // Default simulation speed multiplier
let rotationSimulationSpeed = 1; // Default simulation speed multiplier

const GRAVITATION = 0.1; // Gravitational constant (arbitrary units)
const START_TIME = Date.now(); // Start time for the simulation
const PRECOMPUTE = 100

export function setSimulationSpeeds(translationSpeed, rotationSpeed) {
  translationSimulationSpeed = translationSpeed;
  rotationSimulationSpeed = rotationSpeed;
}

export function createPlanet(config, scene) {
  const texture = new THREE.TextureLoader().load(config.texture_path);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;

  const geometry = new THREE.SphereGeometry(config.radius, 16, 16);
  const material = new THREE.MeshBasicMaterial({ map: texture });

  const mesh = new THREE.Mesh(geometry, material);
  
  mesh.rotation.z = config.orbit.tilt; // Apply tilt to the planet
  
  const point = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0)]);
  const center = new THREE.Line(point, new THREE.LineBasicMaterial({ color: 0x0000ff }));
  
  center.add(mesh);
  scene.add(center);
  
  return {
    mesh,
    center,
    name: config.name || "Planet",
    color: config.color || 0xffffff,
    texture_path: config.color || "munely.png",
    radius: config.radius || 1,
    orbit: config.orbit || {} 
  };
}

export function setPlanetOrbits(planets, planet)
{
  if (planet.orbit.orbits != null) {
    const parent = getParent(planets, planet);
 
    planet.orbit.parentOrbit = parent.orbit;
    planet.orbit.orbitFocus = parent.center.position;
    // settle planets at periapsis
    planet.center.position.set(planet.orbit.orbitFocus.x + planet.orbit.Periapsis, 0, planet.orbit.orbitFocus.z);
    planet.orbit.precomputedPoints = precomputeOrbitPoints(planet, PRECOMPUTE);
  } else {
    planet.orbit.orbitFocus = new THREE.Vector3(0, 0, 0); // Default to origin if no parent specified
  }
}

export function addProjectToPlanet(planet, project) {

  // Add structures for projects
  const structureGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const structureMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const structure = new THREE.Mesh(structureGeometry, structureMaterial);

  // Convert latitude and longitude to spherical coordinates
  const phi = (90 - project.position.lat) * (Math.PI / 180); // latitude to polar angle
  const theta = (project.position.lon + 180) * (Math.PI / 18); // longitude to azimuthal angle

  // Calculate position on the planet's surface
  const x = planet.radius * Math.sin(phi) * Math.cos(theta);
  const y = planet.radius * Math.cos(phi);
  const z = planet.radius * Math.sin(phi) * Math.sin(theta);

  structure.position.set(x, y, z);

  planet.mesh.add(structure); // Attach structure to the planet
}

export function enablePlanetRaycast(planet, camera, domElement) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  domElement.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObject(planet.mesh);
    if (hits.length > 0) {
      console.log(`You clicked ${planet.name || "a planet"}!`);
    }
  });
}

export function updatePlanet(planet, deltaTime) {
  const adjustedDeltaTime0 = deltaTime * translationSimulationSpeed;
  const adjustedDeltaTime1 = deltaTime * rotationSimulationSpeed;

  if (planet.orbit.orbits != null) {
    //interpolate between precomputed points
      const t = (Date.now() - START_TIME) * adjustedDeltaTime0 / planet.orbit.Period;
      const index = Math.floor(t * PRECOMPUTE) % PRECOMPUTE;
      const nextIndex = (index + 1) % PRECOMPUTE;

      const alpha = (t * PRECOMPUTE) % 1; // Fractional part for interpolation
      const currentPoint = planet.orbit.precomputedPoints[index];
      const nextPoint = planet.orbit.precomputedPoints[nextIndex];

      // Linear interpolation between the two points
      planet.center.position.lerpVectors(currentPoint, nextPoint, alpha);
  }

  // Update planet's rotation around its axis
  planet.mesh.rotation.y += planet.orbit.rotationSpeed * adjustedDeltaTime1;
}

export function createOrbitLine(planets, planet, scene) {
  if (planet.orbit.orbits == null) 
    return

  const segments = 100;
  const points = precomputeOrbitPoints(planet, segments);

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0x888888 });
  const line = new THREE.LineLoop(geometry, material);
  if (planet.orbit.orbits == "Star") {
    scene.add(line);
  }
  else {
    const parentPlanet = planets.find(p => p.name === planet.orbit.orbits);
    parentPlanet.center.add(line);
  }
}

export function precomputeOrbitPoints(planet, segments = 100) {
  const points = [];
  const start = planet.center.position;
  let prev = start;
  for (let i = 0; i <= segments; i++) {
    const deltaTime = 0.016;
    points.push(calculateNextOrbitPosition(planet.orbit, prev, deltaTime));
    prev = points[i];
  }
  return points;
}

export function calculateNextOrbitPosition(orbit, currentPosition, deltaTime) {
  // Calculate the semi-major axis and eccentricity
  const semiMajorAxis = (orbit.Periapsis + orbit.Apoapsis) / 2;
  const e = orbit.eccentricity || (orbit.Apoapsis - orbit.Periapsis) / (orbit.Apoapsis + orbit.Periapsis);

  // Calculate the mean motion (n)
  const n = 2 * Math.PI / orbit.Period;

  // Calculate the current true anomaly from the current position
  const currentRadius = currentPosition.length();
  const currentTrueAnomaly = Math.atan2(currentPosition.z, currentPosition.x);

  // Calculate the mean anomaly (M) from the true anomaly
  const E = 2 * Math.atan(Math.sqrt((1 - e) / (1 + e)) * Math.tan(currentTrueAnomaly / 2));
  const M = E - e * Math.sin(E);

  // Update the mean anomaly with the time delta
  const newM = M + n * deltaTime;

  // Solve Kepler's equation for the new eccentric anomaly (E) using Newton's method
  let newE = newM; // Initial guess
  for (let i = 0; i < 10; i++) {
    newE = newE - (newE - e * Math.sin(newE) - newM) / (1 - e * Math.cos(newE));
  }

  // Calculate the new true anomaly
  const newTrueAnomaly = 2 * Math.atan2(
    Math.sqrt(1 + e) * Math.sin(newE / 2),
    Math.sqrt(1 - e) * Math.cos(newE / 2)
  );

  // Calculate the new orbital radius
  const newRadius = semiMajorAxis * (1 - e * e) / (1 + e * Math.cos(newTrueAnomaly));

  // Convert polar coordinates to Cartesian coordinates
  const x = newRadius * Math.cos(newTrueAnomaly);
  const z = newRadius * Math.sin(newTrueAnomaly);

  // Apply inclination (if any)
  const inclination = orbit.inclination || 0;
  const cosInclination = Math.cos(inclination);
  const sinInclination = Math.sin(inclination);
  const finalX = x;
  const finalY = z * cosInclination - z * sinInclination;
  const finalZ = z * sinInclination + z * cosInclination;

  let newPosition = new THREE.Vector3(finalX, finalY, finalZ);
  let center = orbit.orbitFocus || new THREE.Vector3(0, 0, 0);

  // Return the new position as a THREE.Vector3
  return newPosition.add(center);
}

function getParent(planets, planet)
{
  const parent = planets.find(p => p.name === planet.orbit.orbits);
  return parent
}