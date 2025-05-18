import * as THREE from 'https://cdn.skypack.dev/three@0.134.0';
// functions to add newtonian orbits to the objects

// use this example to create the newtonian orbits
const orbit_example = {
    mass: 1, // Mass of the central body relative to Earth masses
    // Orbital elements
    orbits: 'Sun', // The name of the central body
    imaginary: false, // If true, the orbit point is imaginary, think langrange points and bodies orbiting around eachother
    Apoapsis: 500,
    Periapsis: 500,
    inclination: Math.PI / 4, // Inclination in radians
    longitudeOfAscendingNode: 0,
    argumentOfPeriapsis: 0,
    longitudeOfPeriapsis: 0,
    /// Newtonian
    position: new THREE.Vector3(0, 0, 0), // Initial position
    velocity: new THREE.Vector3(0, 0, 0), // Initial velocity
    acceleration: new THREE.Vector3(0, 0, 0), // Initial acceleration
}

const GRAVITY = 0.08; // Gravitational constant, needs adjusting

export function orbitalToNewtonian(orbit, planets, parentName = "Star") {
    if(orbit.orbits == null) {
        return {position: new THREE.Vector3(0, 0, 0), velocity: new THREE.Vector3(0, 0, 0)};
    }

    const parent = getPlanet(planets, parentName);
    const parentNewtonian = orbitalToNewtonian(parent.orbit, planets, parent.orbit.orbits);

    // Semi-major axis and eccentricity
    const a = (orbit.Apoapsis + orbit.Periapsis) / 2;
    const e = (orbit.Apoapsis - orbit.Periapsis) / (orbit.Apoapsis + orbit.Periapsis);
  
    // Position at periapsis
    const r = orbit.Periapsis;
    const xOrbital = r * Math.cos(0); // True anomaly = 0 at periapsis
    const zOrbital = r * Math.sin(0);
  
    // Velocity at periapsis
    const vOrbital = Math.sqrt(GRAVITY * parent.orbit.mass * (2 / r - 1 / a));
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

    const positionRelativeToParent = new THREE.Vector3(finalX, finalY, finalZ);

    // Rotate velocity
    const vx1 = vxOrbital * cosω - vzOrbital * sinω;
    const vz1 = vxOrbital * sinω + vzOrbital * cosω;

    const vx2 = vx1;
    const vy2 = vz1 * sini;
    const vz2 = vz1 * cosi;

    const finalVx = vx2 * cosΩ - vy2 * sinΩ;
    const finalVy = vx2 * sinΩ + vy2 * cosΩ;
    const finalVz = vz2;

    const velocityRelativeToParent = new THREE.Vector3(finalVx, finalVy, finalVz);

    // Add parent's position and velocity to get the global position and velocity
    const globalPosition = parentNewtonian.position.clone().add(positionRelativeToParent);
    const globalVelocity = parentNewtonian.velocity.clone().add(velocityRelativeToParent);

    return { position: globalPosition, velocity: globalVelocity };
}

export function updateOrbitPosition(orbit, Bodies, deltaTime, simSpeed) {

    if (orbit.orbits == null || orbit.imaginary) {
        return orbit.position.clone();
    }

    // Reset acceleration
    orbit.acceleration.set(0, 0, 0);

    // Calculate net gravitational force from all other planets
    Bodies.forEach((body) => {
    if (!isSameOrbit(orbit, body.orbit || body.imaginary)) {
        const force = calculateGravitationalForce(orbit, body.orbit);
        const acceleration = force.divideScalar(orbit.mass);
        orbit.acceleration.add(acceleration);
    }
    });

    // Update velocity and position using the acceleration
    orbit.velocity.add(orbit.acceleration.clone().multiplyScalar(deltaTime * simSpeed));
    orbit.position.add(orbit.velocity.clone().multiplyScalar(deltaTime * simSpeed));
    return orbit.position.clone();
}

function calculateGravitationalForce(orbit1, orbit2) {
    const distanceVector = new THREE.Vector3().subVectors(orbit2.position, orbit1.position);
    const distance = distanceVector.length();
    const forceMagnitude = (GRAVITY * orbit1.mass * orbit2.mass) / (distance * distance);
    const force = distanceVector.normalize().multiplyScalar(forceMagnitude);
    return force;
}

export function computeOrbitPointsForward(orbit, Bodies, simSpeed, ammount = 100) {
    
    let points = [];
    points.push(orbit.position.clone());
    
    let clonedBodies = Bodies.map(body => ({
        ...body,
        orbit: {
            ...body.orbit,
            position: body.orbit.position.clone(),
            velocity: body.orbit.velocity.clone(),
            acceleration: body.orbit.acceleration.clone()
        }
    }));

    for (let i = 0; i <= ammount; i++) {
        
        clonedBodies.forEach((body) => {
            if (body.orbit.imaginary) {return;}
            let pos = updateOrbitPosition(body.orbit, clonedBodies, 0.032, simSpeed);
            if (isSameOrbit(orbit, body.orbit))
                { points.push(pos.clone()); }
        });

    }

    return points

}

function getPlanet(planets, target) {
    const parent = planets.find((p) => p.name === target);
    return parent;
  }

function isSameOrbit(orbit1, orbit2) {
    return orbit1.orbits === orbit2.orbits && orbit1.Apoapsis === orbit2.Apoapsis && orbit1.Periapsis === orbit2.Periapsis;
}