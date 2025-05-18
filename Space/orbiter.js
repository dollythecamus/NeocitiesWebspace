// functions to add newtonian orbits to the objects

// use this example to create the newtonian orbits
const orbit_example = {
    mass: 1, // Mass of the central body relative to Earth masses
    // Orbital elements
    orbits: 'Sun', // The name of the central body
    Apoapsis: 500,
    Periapsis: 500,
    inclination: Math.PI / 4, // Inclination in radians
    longitudeOfAscendingNode: 0,
    argumentOfPeriapsis: 0,
    /// Newtonian
    position: new THREE.Vector3(0, 0, 0), // Initial position
    velocity: new THREE.Vector3(0, 0, 0), // Initial velocity
    acceleration: new THREE.Vector3(0, 0, 0), // Initial acceleration
}

const GRAVITY = 6.67430e-2; // Gravitational constant, needs adjusting

export function orbitalToNewtonian(orbit, centralMass) {
  
    // Semi-major axis and eccentricity
    const a = (orbit.Apoapsis + orbit.Periapsis) / 2;
    const e = (orbit.Apoapsis - orbit.Periapsis) / (orbit.Apoapsis + orbit.Periapsis);
  
    // Position at periapsis
    const r = orbit.Periapsis;
    const xOrbital = r * Math.cos(0); // True anomaly = 0 at periapsis
    const zOrbital = r * Math.sin(0);
  
    // Velocity at periapsis
    const vOrbital = Math.sqrt(GRAVITY * centralMass * (2 / r - 1 / a));
    const vxOrbital = 0; // Radial velocity is 0 at periapsis
    const vzOrbital = vOrbital;
  
    // Orbital plane to 3D space rotations
    const Ω = orbit.longitudeOfAscendingNode || 0; // Longitude of ascending node
    const i = orbit.inclination || 0; // Inclination
    const ω = orbit.argumentOfPeriapsis || 0; // Argument of periapsis
  
    // Rotation matrices
    const cosΩ = Math.cos(Ω), sinΩ = Math.sin(Ω);
    const cosi = Math.cos(i), sini = Math.sin(i);
    const cosω = Math.cos(ω), sinω = Math.sin(ω);
  
    // Rotate position
    const x1 = xOrbital * cosω - zOrbital * sinω;
    const z1 = xOrbital * sinω + zOrbital * cosω;
  
    const x2 = x1;
    const y2 = z1 * sini;
    const z2 = z1 * cosi;
  
    const finalX = x2 * cosΩ - y2 * sinΩ;
    const finalY = x2 * sinΩ + y2 * cosΩ;
    const finalZ = z2;
  
    const position = new THREE.Vector3(finalX, finalY, finalZ);
  
    // Rotate velocity
    const vx1 = vxOrbital * cosω - vzOrbital * sinω;
    const vz1 = vxOrbital * sinω + vzOrbital * cosω;
  
    const vx2 = vx1;
    const vy2 = vz1 * sini;
    const vz2 = vz1 * cosi;
  
    const finalVx = vx2 * cosΩ - vy2 * sinΩ;
    const finalVy = vx2 * sinΩ + vy2 * cosΩ;
    const finalVz = vz2;
  
    const velocity = new THREE.Vector3(finalVx, finalVy, finalVz);
  
    return { position, velocity };
}

export function updateOrbitPosition(orbit, Bodies, deltaTime, simSpeeds) {

    // Reset acceleration
    orbit.acceleration.set(0, 0, 0);

    // Calculate net gravitational force from all other planets
    Bodies.forEach((body) => {
    if (orbit.position !== body.position) {
        const force = calculateGravitationalForce(orbit, body);
        const acceleration = force.divideScalar(orbit.mass);
        orbit.acceleration.add(acceleration);
    }
    });

    // Update velocity and position using the acceleration
    orbit.velocity.add(orbit.acceleration.clone().multiplyScalar(deltaTime * simSpeeds.translation));
    orbit.position.add(orbit.velocity.clone().multiplyScalar(deltaTime * simSpeeds.translation));
}

function calculateGravitationalForce(orbit1, orbit2) {
    const distanceVector = new THREE.Vector3().subVectors(orbit2.position, orbit1.position);
    const distance = distanceVector.length();
    const forceMagnitude = (GRAVITY * orbit1.mass * orbit2.mass) / (distance * distance);
    const force = distanceVector.normalize().multiplyScalar(forceMagnitude);
    return force;
}

export function computeOrbitPointsForward(orbit, Bodies, ammount = 100, simSpeeds) {
    
    let position = orbit.position.clone();
    for (let i = 0; i <= ammount; i++) {
        // Reset acceleration
        let acceleration = new THREE.Vector3(0, 0, 0);

        // Calculate net gravitational force from all other planets
        Bodies.forEach((body) => {
        if (orbit.position !== body.position) {
            const force = calculateGravitationalForce(planet, otherPlanet);
            const acceleration = force.divideScalar(orbit.mass);
            acceleration.add(acceleration);
        }
        });

        // Update velocity and position using the acceleration
        let velocity = acceleration.clone().multiplyScalar(simSpeeds.points);
        let offset = velocity.clone().multiplyScalar(simSpeeds.points);

        points.push(position.add(offset));
    }

    return points

}