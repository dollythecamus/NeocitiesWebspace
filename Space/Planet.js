import * as THREE from 'https://cdn.skypack.dev/three@0.134.0';
import { updateOrbitPosition, orbitalToNewtonian, computeOrbitPointsForward} from './orbiter.js';

export const planetsData = {
  planets: [
    {
      name: 'Star',
      radius: 20,
      texture_path: '',
      color: '#FFFF00',
      camera_focus: true,
      orbit: {
        orbits: null,
        mass: 300.0,
        rotationSpeed: 0.01,
        tilt: 0.00322
      }
    },
    {
      name: 'Martian',
      texture_path: 'TMP_Planets/Martian.png',
      color: '#FF0000',
      radius: 0.5,
      camera_focus: true,
      orbit: {
        orbits: 'Star',
        Apoapsis: 40,
        Periapsis: 35,
        Period: 104,
        mass: 0.6,
        tilt: 0.0005934119456780721,
        rotationSpeed: 1.0,
        inclination: 0.00322
      }
    },
    {
      name: 'Venusian',
      texture_path: 'TMP_Planets/Venusian.png',
      color: '#FF00FF',
      radius: 1.1,
      camera_focus: true,
      orbit: {
        orbits: 'Star',
        Apoapsis: 80,
        Periapsis: 75,
        Period: 280,
        mass: 1.1,
        tilt: 0.0005934119456780721,
        rotationSpeed: 1.0,
        inclination: 0.12217304763960307,
      }
    },
    {
      name: 'Terrestrial',
      texture_path: 'TMP_Planets/Terrestrial.png',
      color: '#FFFFFF',
      radius: 1,
      camera_focus: true,
      orbit: {
        orbits: 'Star',
        Apoapsis: 140,
        Periapsis: 135,
        Period: 365,
        mass: 1.0,
        rotationSpeed: 1.0,
        tilt: 0.0005934119456780721,
      }
    },
    {
      name: 'Moon',
      radius: 0.3,
      texture_path: 'TMP_Planets/Martian.png',
      color: '#FFFFFF',
      camera_focus: true,
      orbit: {
        orbits: 'Terrestrial',
        mass: 0.16,
        Apoapsis: 5.0,
        Periapsis: 5.0,
        Period: 28.0,
        rotationSpeed: 0.5,
        tilt: Math.PI / 2,
        inclination: Math.PI / 2,
      }
    }, 
    {
      name: 'Binary1',
      texture_path: '',
      color: '#0000FF',
      radius: 0.5,
      camera_focus: true,
      orbit: {
        orbits: 'Star',
        Apoapsis: 240,
        Periapsis: 150,
        argumentOfPeriapsis: Math.PI,
        longitudeOfAscendingNode: 0,
        mass: 0.6,
        tilt: 0.0005934119456780721,
        rotationSpeed: 1.0,
        inclination: -Math.PI / 4,
      }
    },
    {
      name: 'Binary2',
      texture_path: '',
      color: '#FF0000',
      radius: 0.5,
      camera_focus: true,
      orbit: {
        orbits: 'Binary1',
        Apoapsis: 5,
        Periapsis: 5,
        mass: 0.6,
        tilt: 0.0005934119456780721,
        rotationSpeed: 1.0,
        inclination: -Math.PI / 4,
        argumentOfPeriapsis: 0,
        longitudeOfAscendingNode: 0,
      }
    },
    {
      name: 'Giant',
      texture_path: '',
      color: '#FF0000',
      radius: 6.0,
      camera_focus: true,
      orbit: {
        orbits: 'Star',
        Apoapsis: 300,
        Periapsis: 320,
        Period: 2050,
        mass: 18.0,
        tilt: 0.0005934119456780721,
        rotationSpeed: 1.0,
        inclination: -Math.PI / 4,
        argumentOfPeriapsis: 0,
        longitudeOfAscendingNode: 0,
      }
    },
    {
      name: 'Io',
      texture_path: '',
      color: '#FFFF00',
      radius: 0.6,
      camera_focus: true,
      orbit: {
        orbits: 'Giant',
        Apoapsis: 16,
        Periapsis: 15,
        Period: 86,
        mass: 0.7,
        tilt: 0.0005934119456780721,
        rotationSpeed: 1.0,
        inclination: -Math.PI / 4,
        argumentOfPeriapsis: 0,
        longitudeOfAscendingNode: 0,
        parentOrbit: {},
      }
    }
  ]
};

export function createPlanet(config, scene) {

  let material;
  if (config.texture_path) {
    const texture = new THREE.TextureLoader().load(config.texture_path);
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    material = new THREE.MeshBasicMaterial({ map: texture });
  } else {
    material = new THREE.MeshBasicMaterial({ color: config.color });
  }

  const geometry = new THREE.SphereGeometry(config.radius, 16, 16);

  const mesh = new THREE.Mesh(geometry, material);

  mesh.rotation.z = config.orbit.tilt; // Apply tilt to the planet

  const point = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0)]);
  const center = new THREE.Line(point, new THREE.LineBasicMaterial({ color: 0x0000ff }));

  center.add(mesh);
  scene.add(center);

  const planet_orbit = {
    mass: config.orbit.mass, // Mass of the central body relative to Earth masses
    // Orbital elements
    orbits: config.orbit.orbits, // The name of the central body
    Apoapsis: config.orbit.Apoapsis,
    Periapsis: config.orbit.Periapsis,
    imaginary: config.orbit.imaginary || false,
    inclination: config.orbit.inclination || 0, // Inclination in radians
    longitudeOfAscendingNode: config.orbit.longitudeOfAscendingNode || 0,
    argumentOfPeriapsis: config.orbit.argumentOfPeriapsis || 0,
    longitudeOfPeriapsis: config.orbit.longitudeOfPeriapsis || 0,
    /// Newtonian
    position: new THREE.Vector3(0, 0, 0), // Initial position
    velocity: new THREE.Vector3(0, 0, 0), // Initial velocity
    acceleration: new THREE.Vector3(0, 0, 0), // Initial acceleration
  }

  return {
    mesh,
    center,
    camera_focus: config.camera_focus,
    name: config.name || 'Planet',
    color: config.color || 0xffffff,
    texture_path: config.color || 'munely.png',
    radius: config.radius || 1,
    orbit: planet_orbit
  }
};

export function setPlanetOrbits(planets, planet) {
  // calculating orbit from a keplerian to a newtonian
  let initial = {position: new THREE.Vector3(0, 0, 0), velocity: new THREE.Vector3(0, 0, 0)};
  if (planet.orbit.orbits != null) {
    initial = orbitalToNewtonian(planet.orbit, planets, planet.orbit.orbits);
  }

  planet.center.position.copy(initial.position);

  const planet_orbit = {
    mass: planet.orbit.mass, // Mass of the central body relative to Earth masses
    // Orbital elements
    orbits: planet.orbit.orbits, // The name of the central body
    Apoapsis: planet.orbit.Apoapsis,
    Periapsis: planet.orbit.Periapsis,
    imaginary: planet.orbit.imaginary || false,
    inclination: planet.orbit.inclination, // Inclination in radians
    longitudeOfAscendingNode: planet.orbit.longitudeOfAscendingNode,
    argumentOfPeriapsis: planet.orbit.argumentOfPeriapsis,
    longitudeOfPeriapsis: planet.orbit.longitudeOfPeriapsis,
    /// Newtonian
    position: initial.position, // Initial position
    velocity: initial.velocity, // Initial velocity
    acceleration: new THREE.Vector3(0, 0, 0), // Initial acceleration
  }

  planet.orbit = planet_orbit;
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
      console.log(`You clicked ${planet.name || 'a planet'}!`);
    }
  });
}

export function updatePlanet(planet, planets, deltaTime, simSpeed) {

  if (planet.orbit.orbits != null) {

    updateOrbitPosition(planet.orbit, planets, deltaTime, simSpeed);
    planet.center.position.copy(planet.orbit.position);
    
  }
}

export function createOrbitLine(planets, planet, scene, simSpeed) {
  if (planet.orbit.orbits == null || planet.orbit.imaginary) return;

  const segments = 512;
  const points = computeOrbitPointsForward(planet.orbit, planets, simSpeed.points, segments);

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0x888888 });
  const line = new THREE.Line(geometry, material);
  scene.add(line);
  return line;
}

export function computeOrbitPoints(planet, segments = 100) {
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const meanAnomaly = (2 * Math.PI * i) / segments;
    const position = calculateOrbitPositionFromMeanAnomaly(planet.orbit, meanAnomaly);
    points.push(position);
  }
  return points;
}

export function calculateOrbitPositionFromMeanAnomaly(orbit, meanAnomaly) {
  // Solve Kepler's equation for Eccentric Anomaly (E) using Newton's method
  let E = meanAnomaly; // Initial guess

  const a = (orbit.Periapsis + orbit.Apoapsis) / 2; // Semi-major axis
  const c = a - orbit.Periapsis; // Distance from center to focus
  orbit.eccentricity = c / a; // Eccentricity

  const e = orbit.eccentricity;
  for (let i = 0; i < 5; i++) {
    // Iterate to refine E
    E = E - (E - e * Math.sin(E) - meanAnomaly) / (1 - e * Math.cos(E));
  }

  // True anomaly (ν)
  const trueAnomaly = 2 * Math.atan2(
    Math.sqrt(1 + e) * Math.sin(E / 2),
    Math.sqrt(1 - e) * Math.cos(E / 2)
  );

  // Orbital radius (r)
  const semiMajorAxis = (orbit.Periapsis + orbit.Apoapsis) / 2;
  const radius = (semiMajorAxis * (1 - e * e)) / (1 + e * Math.cos(trueAnomaly));

  // Convert polar coordinates to Cartesian coordinates in the orbital plane
  const xOrbital = radius * Math.cos(trueAnomaly);
  const zOrbital = radius * Math.sin(trueAnomaly);
  //const yOrbital = 0; // Assuming no inclination in the orbital plane

  // Apply rotations for Ω, i, and ω
  const Ω = orbit.longitudeOfAscendingNode || 0; // Longitude of ascending node
  const i = orbit.inclination || 0; // Inclination
  const ω = orbit.argumentOfPeriapsis || 0; // Argument of periapsis

  // Rotation matrices
  const cosΩ = Math.cos(Ω),
    sinΩ = Math.sin(Ω);
  const cosi = Math.cos(i),
    sini = Math.sin(i);
  const cosω = Math.cos(ω),
    sinω = Math.sin(ω);

  // Rotate by ω (argument of periapsis)
  const x1 = xOrbital * cosω - zOrbital * sinω;
  const z1 = xOrbital * sinω + zOrbital * cosω;

  // Rotate by i (inclination)
  const x2 = x1;
  const y2 = z1 * sini;
  const z2 = z1 * cosi;

  // Rotate by Ω (longitude of ascending node)
  const finalX = x2 * cosΩ - y2 * sinΩ;
  const finalY = x2 * sinΩ + y2 * cosΩ;
  const finalZ = z2;

  // Return the position as a THREE.Vector3
  return new THREE.Vector3(finalX, finalY, finalZ);
}

function getParent(planets, planet) {
  const parent = planets.find((p) => p.name === planet.orbit.orbits);
  return parent;
}