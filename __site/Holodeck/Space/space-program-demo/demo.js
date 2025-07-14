import {updateOrbitPosition, orbitalToNewtonian} from "../orbiter.js"

const vessel = {
    name: "Test Vessel",
    orbit: {
        mass: 0, // Mass of the central body relative to Earth masses (zero if it is a vessel)
        // Orbital elements
        Orbits: 'Earth',
        Apoapsis: 500,
        Periapsis: 500,
        inclination: Math.PI / 4, // Inclination in radians
        longitudeOfAscendingNode: 0,
        argumentOfPeriapsis: 0,
        /// Newtonian
        position: new THREE.Vector3(0, 0, 0), // Initial position
        velocity: new THREE.Vector3(0, 0, 0), // Initial velocity
        acceleration: new THREE.Vector3(0, 0, 0), // Initial acceleration
    },
}

const planets = [
    {
      name: 'Sun',
      radius: 100,
      orbit: {
        orbits: null,
        mass: 3000.0,
      },
      rotation: {
        speed: 0.01,
        tilt: 0.00322
      }
    },
    {
      name: 'Earth',
      radius: 1.0,
      orbit: {
        orbits: 'Sun',
        mass: 1.0,
        // Orbital elements
        Apoapsis: 950,
        Periapsis: 900,
        Period: 365,
        inclination: Math.PI / 30, // Inclination in radians
        longitudeOfAscendingNode: 0,
        argumentOfPeriapsis: 0,
        /// Newtonian
        position: new THREE.Vector3(0, 0, 0), // Initial position
        velocity: new THREE.Vector3(0, 0, 0), // Initial velocity
        acceleration: new THREE.Vector3(0, 0, 0), // Initial acceleration
      },
      rotation: {
        period: 24.0 , // hours
        tilt: Math.PI / 9,
      }
    },
    {
      name: 'Moon',
      radius: 0.1,
      orbit: {
        orbits: 'Sun',
        mass: 0.16,
        // Orbital elements
        Apoapsis: 950,
        Periapsis: 900,
        Period: 365,
        inclination: Math.PI / 30, // Inclination in radians
        longitudeOfAscendingNode: 0,
        argumentOfPeriapsis: 0,
        /// Newtonian
        position: new THREE.Vector3(0, 0, 0), // Initial position
        velocity: new THREE.Vector3(0, 0, 0), // Initial velocity
        acceleration: new THREE.Vector3(0, 0, 0), // Initial acceleration
      },
      rotation: {
        period: 24.0 , // hours
        tilt: Math.PI / 9,
      }
    }
]


