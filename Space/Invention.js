import * as THREE from 'https://cdn.skypack.dev/three@0.134.0';


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
                orbits: 'Venusian',
                Apoapsis: 2.6,
                Periapsis: 2,
                Period: 5,
                mass: 0.7,
                tilt: 0.0005934119456780721,
                rotationSpeed: 1.0,
                inclination: -Math.PI / 4,
                orbitFocus: 0,
                orbitAngle: 0,
                eccentricity: 0,
                meanAnomaly: 0,
                argumentOfPeriapsis: 0,
                longitudeOfAscendingNode: 0,
                parentOrbit: {},
                precomputedPoints: [],
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

        mesh.position.set(x, y, z);
        planet.mesh.add(mesh)
    }
    else if (inventionConfig.position.state == "orbit")
    {
        const invention = {
            mesh,
            position: inventionConfig.position,
            data: inventionConfig 
        }

        setInventionOrbits(invention, state.planets)
        state.scene.add(mesh); // Attach structure to the planet
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


export function updateInventionOrbits(invention, deltaTime, simSpeeds) {
    const adjDeltaTimeTrans = deltaTime * simSpeeds.translation;
    const adjDeltaTimeRot = deltaTime * simSpeeds.rotation;
  
    if (invention.position.state == "orbit") {
      // Update the mean anomaly incrementally
      const n = 2 * Math.PI / invention.position.orbit.Period; // Mean motion
      invention.position.orbit.currentMeanAnomaly = (invention.position.orbit.currentMeanAnomaly || 0) + n * adjDeltaTimeTrans;
  
      // Keep the mean anomaly within [0, 2π]
      invention.position.orbit.currentMeanAnomaly %= 2 * Math.PI;
  
      // Solve for the new position
      const newPosition = calculateOrbitPositionFromMeanAnomaly(invention.position.orbit, invention.position.orbit.currentMeanAnomaly);
  
      // Update the invention's position
      invention.mesh.position.copy(newPosition.add(invention.position.orbit.orbitFocus));
      
      // Update invention's rotation around its axis
      invention.mesh.rotation.y += invention.position.orbit.rotationSpeed * adjDeltaTimeRot;
    }
  
  }


export function setInventionOrbits(invention, planets) {
    if (invention.position.state == "orbit") {
      const planet = getPlanet(invention.position.planet, planets);
  
      invention.position.orbit.parentOrbit = planet.orbit;
      invention.position.orbit.orbitFocus = planet.center.position;
      // settle planets at periapsis
      const longitudeOfPeriapsis = invention.position.orbit.longitudeOfPeriapsis || 0;
      const periapsisX = invention.position.orbit.Periapsis * Math.cos(longitudeOfPeriapsis);
      const periapsisZ = invention.position.orbit.Periapsis * Math.sin(longitudeOfPeriapsis);
      planet.center.position.set(
        invention.position.orbit.orbitFocus.x + periapsisX,
        0,
        invention.position.orbit.orbitFocus.z + periapsisZ
      );
  
      //invention.position.orbit.precomputedPoints = precomputeOrbitPoints(planet, PRECOMPUTE);
    } 
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

function getPlanet(planet, planets) {
    return planets.find((p) => p.name === planet);
}