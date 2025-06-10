// Planet data with realistic properties (scaled for visualization)
const PLANET_DATA = {
    sun: {
        name: 'Sun',
        radius: 15,
        color: 0xFDB813,
        emissive: 0xFDB813,
        emissiveIntensity: 0.3,
        position: { x: 0, y: 0, z: 0 },
        rotationSpeed: 0.001,
        info: {
            diameter: '1,392,700 km',
            mass: '1.989 × 10³⁰ kg',
            temperature: '5,778 K (surface)',
            composition: 'Hydrogen (~73%), Helium (~25%)'
        }
    },
    
    mercury: {
        name: 'Mercury',
        radius: 1.5,
        color: 0x8C7853,
        orbitRadius: 25,
        orbitSpeed: 0.02,
        rotationSpeed: 0.005,
        tilt: 0.034,
        info: {
            diameter: '4,879 km',
            mass: '3.301 × 10²³ kg',
            distance: '57.9 million km from Sun',
            day: '58.6 Earth days',
            year: '88 Earth days'
        }
    },
    
    venus: {
        name: 'Venus',
        radius: 2.2,
        color: 0xFFC649,
        orbitRadius: 35,
        orbitSpeed: 0.015,
        rotationSpeed: -0.002, // Retrograde rotation
        tilt: 177.4,
        info: {
            diameter: '12,104 km',
            mass: '4.867 × 10²⁴ kg',
            distance: '108.2 million km from Sun',
            day: '243 Earth days',
            year: '225 Earth days'
        }
    },
    
    earth: {
        name: 'Earth',
        radius: 2.5,
        color: 0x6B93D6,
        orbitRadius: 45,
        orbitSpeed: 0.01,
        rotationSpeed: 0.01,
        tilt: 23.5,
        hasAtmosphere: true,
        atmosphereColor: 0x87CEEB,
        info: {
            diameter: '12,756 km',
            mass: '5.972 × 10²⁴ kg',
            distance: '149.6 million km from Sun',
            day: '24 hours',
            year: '365.25 days'
        }
    },
    
    mars: {
        name: 'Mars',
        radius: 2,
        color: 0xCD5C5C,
        orbitRadius: 60,
        orbitSpeed: 0.008,
        rotationSpeed: 0.009,
        tilt: 25.2,
        info: {
            diameter: '6,792 km',
            mass: '6.39 × 10²³ kg',
            distance: '227.9 million km from Sun',
            day: '24.6 hours',
            year: '687 Earth days'
        }
    },
    
    jupiter: {
        name: 'Jupiter',
        radius: 8,
        color: 0xD8CA9D,
        orbitRadius: 90,
        orbitSpeed: 0.005,
        rotationSpeed: 0.02,
        tilt: 3.1,
        hasRings: true,
        info: {
            diameter: '142,984 km',
            mass: '1.898 × 10²⁷ kg',
            distance: '778.5 million km from Sun',
            day: '9.9 hours',
            year: '11.9 Earth years'
        }
    },
    
    saturn: {
        name: 'Saturn',
        radius: 7,
        color: 0xFAD5A5,
        orbitRadius: 120,
        orbitSpeed: 0.003,
        rotationSpeed: 0.018,
        tilt: 26.7,
        hasRings: true,
        ringInnerRadius: 9,
        ringOuterRadius: 15,
        info: {
            diameter: '120,536 km',
            mass: '5.683 × 10²⁶ kg',
            distance: '1.43 billion km from Sun',
            day: '10.7 hours',
            year: '29.4 Earth years'
        }
    },
    
    uranus: {
        name: 'Uranus',
        radius: 4,
        color: 0x4FD0E3,
        orbitRadius: 150,
        orbitSpeed: 0.002,
        rotationSpeed: 0.015,
        tilt: 97.8, // Nearly sideways
        hasRings: true,
        info: {
            diameter: '51,118 km',
            mass: '8.681 × 10²⁵ kg',
            distance: '2.87 billion km from Sun',
            day: '17.2 hours',
            year: '84 Earth years'
        }
    },
    
    neptune: {
        name: 'Neptune',
        radius: 3.8,
        color: 0x4B70DD,
        orbitRadius: 180,
        orbitSpeed: 0.001,
        rotationSpeed: 0.016,
        tilt: 28.3,
        info: {
            diameter: '49,528 km',
            mass: '1.024 × 10²⁶ kg',
            distance: '4.50 billion km from Sun',
            day: '16.1 hours',
            year: '164.8 Earth years'
        }
    }
};

// Configuration constants
const CONFIG = {
    CAMERA: {
        INITIAL_POSITION: { x: 0, y: 50, z: 100 },
        FOV: 75,
        NEAR: 0.1,
        FAR: 2000
    },
    
    LIGHTING: {
        AMBIENT_INTENSITY: 0.2,
        DIRECTIONAL_INTENSITY: 1,
        DIRECTIONAL_POSITION: { x: 0, y: 0, z: 0 }
    },
    
    STARFIELD: {
        COUNT: 10000,
        SIZE: 1000
    },
    
    ANIMATION: {
        DEFAULT_SPEED: 1,
        MAX_SPEED: 5,
        MIN_SPEED: 0
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PLANET_DATA, CONFIG };
}