import * as THREE from 'https://cdn.skypack.dev/three@0.134.0';

let translationSimulationSpeed = 1; // Default simulation speed multiplier
let rotationSimulationSpeed = 1; // Default simulation speed multiplier

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
    const parent = planets.find(p => p.name === planet.orbit.orbits);
    planet.orbit.orbitCenter = parent.center.position;
  } else {
    planet.orbit.orbitCenter = new THREE.Vector3(0, 0, 0); // Default to origin if no parent specified
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

  planet.orbit.orbitAngle += planet.orbit.orbitSpeed * adjustedDeltaTime0;

  const x = planet.orbit.orbitCenter.x + planet.orbit.semiMajorAxis * Math.cos(planet.orbit.orbitAngle);
  const z = planet.orbit.orbitCenter.z + planet.orbit.semiMinorAxis * Math.sin(planet.orbit.orbitAngle);
  const y = Math.sin(planet.orbit.inclination) * (planet.orbit.semiMajorAxis * Math.sin(planet.orbit.orbitAngle)); // Apply inclination

  planet.center.position.set(x, y, z);

  // Update planet's rotation around its axis
  planet.mesh.rotation.y += planet.orbit.rotationSpeed * adjustedDeltaTime1;
}

export function createOrbitLine(planets, planet, scene) {
  if (planet.orbit.orbits == null) 
    return

  const segments = 100;
  const points = [];

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x = planet.orbit.semiMajorAxis * Math.cos(angle);
    const z = planet.orbit.semiMinorAxis * Math.sin(angle);
    const y = Math.sin(planet.orbit.inclination || 0) * (planet.orbit.semiMajorAxis * Math.sin(angle)); // Apply inclination
    points.push(new THREE.Vector3(x, y, z));
  }

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
