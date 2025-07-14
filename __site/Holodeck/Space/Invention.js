import * as THREE from 'https://cdn.skypack.dev/three@0.134.0';
import { orbitalToNewtonian, updateOrbitPosition} from './orbiter.js';


export const inventionsData = [
    {
        title: "Project A",
        description: "Description A",
        type: "",
        mesh: "",
        position: {
            planet: "Terrestrial",
            state: "surface",
            latitude: 45,
            longitude: -30
        }
    },
    {
        title: "Project B",
        description: "Description B",
        type: "",
        mesh: "",
        position: {
            state: "orbit",
            planet: "Venusian",
            orbit: {
                mass: 1, // in kilograms, i suppose. // the inventions won't actually attract eachother or anything in the simulation, the valid bodies are just the planets, should be fine.
                // Orbital elements
                orbits: 'Venusian', // The name of the central body
                imaginary: false, // If true, the orbit point is imaginary, think langrange points and bodies orbiting around eachother
                Apoapsis: 2,
                Periapsis: 2,
                inclination: Math.PI / 4, // Inclination in radians
                longitudeOfAscendingNode: 0,
                argumentOfPeriapsis: 0,
                longitudeOfPeriapsis: 0,
                /// Newtonian
                position: new THREE.Vector3(0, 0, 0), // Initial position
                velocity: new THREE.Vector3(0, 0, 0), // Initial velocity
                acceleration: new THREE.Vector3(0, 0, 0), // Initial acceleration
            }
        }
    }
]

export function CreateInvention(inventionConfig, state) {
    // Add structures for projects
    const structureGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const structureMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const mesh = new THREE.Mesh(structureGeometry, structureMaterial);

    if (inventionConfig.position.state == "surface")
    {
        const planet = getPlanet(inventionConfig.position.planet, state.planets)

        // Convert latitude and longitude to spherical coordinates
        const phi = (90 - inventionConfig.position.latitude) * (Math.PI / 180); // latitude to polar angle
        const theta = (inventionConfig.position.longitude + 180) * (Math.PI / 18); // longitude to azimuthal angle

        // Calculate position on the planet's surface
        const x = planet.radius * Math.sin(phi) * Math.cos(theta);
        const y = planet.radius * Math.cos(phi);
        const z = planet.radius * Math.sin(phi) * Math.sin(theta);

        // Calculate the normal vector at the surface point
        const normal = new THREE.Vector3(x, y, z).normalize();

        // Create a quaternion to align the mesh's up direction with the normal
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

        // Apply the quaternion to the mesh's rotation
        mesh.quaternion.copy(quaternion);

        mesh.position.set(x, y, z);
        planet.mesh.add(mesh) // Attach structure to the planet
    }
    else if (inventionConfig.position.state == "orbit")
    {
        const invention = {
            mesh,
            position: inventionConfig.position,
            data: inventionConfig 
        }

        setInventionOrbits(invention, state.planets)
        state.scene.add(mesh);
    }


    return {
        mesh,
        title: inventionConfig.title,
        position: inventionConfig.position,
        data: inventionConfig 
    }
}


export function enableInventionRaycast(invention, camera, domElement) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  domElement.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObject(invention.mesh);
    if (hits.length > 0) {
      console.log(`You clicked ${invention.title} !`);
    }
  });
}


export function updateInventionOrbits(invention, planets, deltaTime, simSpeed) {
  
    if (invention.position.state == "orbit") {

      updateOrbitPosition(invention.position.orbit, planets, deltaTime, simSpeed.translation);
      invention.mesh.position.copy(invention.position.orbit.position);
    }
}


export function setInventionOrbits(invention, planets) {
    if (invention.position.state == "orbit") {
      const initial = orbitalToNewtonian(invention.position.orbit, planets, invention.position.planet);
      invention.position.orbit.position.copy(initial.position);
      invention.position.orbit.velocity.copy(initial.velocity);
    } 
}


function getPlanet(planet, planets) {
    return planets.find((p) => p.name === planet);
}