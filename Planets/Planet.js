import * as THREE from 'https://cdn.skypack.dev/three@0.134.0';

let simulationSpeed = 1; // Default simulation speed multiplier

export function setSimulationSpeed(speed) {
  simulationSpeed = speed;
}

export function createPlanet(config, scene, projects_list) {
  const texture = new THREE.TextureLoader().load(config.texture_path);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;

  const geometry = new THREE.SphereGeometry(config.radius, 16, 16);
  const material = new THREE.MeshBasicMaterial({ map: texture });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const tilt = config.tilt || 0; // tilt in radians
  const rotationSpeed = config.rotationSpeed || 0.01; // radians/sec
  const inclination = config.inclination || 0; // inclination in radians

  mesh.rotation.z = tilt; // Apply tilt to the planet

  // Add structures for projects
  config.projects.forEach((projectName) => {
      const project = projects_list.find(p => p.title === projectName);
      if (project) {
          const structureGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
          const structureMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
          const structure = new THREE.Mesh(structureGeometry, structureMaterial);

          // Convert latitude and longitude to spherical coordinates
          const phi = (90 - project.position.lat) * (Math.PI / 180); // latitude to polar angle
          const theta = (project.position.lon + 180) * (Math.PI / 18); // longitude to azimuthal angle

          // Calculate position on the planet's surface
          const x = config.radius * Math.sin(phi) * Math.cos(theta);
          const y = config.radius * Math.cos(phi);
          const z = config.radius * Math.sin(phi) * Math.sin(theta);

          structure.position.set(x, y, z);

          mesh.add(structure); // Attach structure to the planet
          //structure.userData = { title: project.title, description: project.description }; // Store project data
      }
    });

  return {
    mesh,
    name: config.name || "Planet",
    color: config.color || 0xffffff,
    texture_path: config.color || "munely.png",
    radius: config.radius || 1,
    orbitCenter: config.orbitCenter || new THREE.Vector3(0, 0, 0),
    semiMajorAxis: config.semiMajorAxis || 2,
    semiMinorAxis: config.semiMinorAxis || 1.5,
    orbitSpeed: config.orbitSpeed || 0.5, // radians/sec
    orbitAngle: config.initialAngle || 0,
    tilt,
    rotationSpeed,
    inclination,
  };
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
  const adjustedDeltaTime = deltaTime * simulationSpeed;

  planet.orbitAngle += planet.orbitSpeed * adjustedDeltaTime;

  const x = planet.orbitCenter.x + planet.semiMajorAxis * Math.cos(planet.orbitAngle);
  const z = planet.orbitCenter.z + planet.semiMinorAxis * Math.sin(planet.orbitAngle);
  const y = Math.sin(planet.inclination) * (planet.semiMajorAxis * Math.sin(planet.orbitAngle)); // Apply inclination

  planet.mesh.position.set(x, y, z);

  // Update planet's rotation around its axis
  planet.mesh.rotation.y += planet.rotationSpeed * adjustedDeltaTime;
}

export function createOrbitLine(config, scene) {
  const segments = 100;
  const points = [];

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x = config.semiMajorAxis * Math.cos(angle);
    const z = config.semiMinorAxis * Math.sin(angle);
    const y = Math.sin(config.inclination || 0) * (config.semiMajorAxis * Math.sin(angle)); // Apply inclination
    points.push(new THREE.Vector3(x, y, z));
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0x888888 });
  const line = new THREE.LineLoop(geometry, material);
  scene.add(line);
}
