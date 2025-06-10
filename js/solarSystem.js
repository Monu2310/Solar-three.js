// Main Solar System class for 3D simulation

class SolarSystem {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        
        // Animation state
        this.animationId = null;
        this.isPaused = false;
        this.globalSpeed = 1;
        this.lastTime = 0;
        
        // Solar system objects
        this.sun = null;
        this.planets = new Map();
        this.orbitLines = new Map();
        this.planetSpeeds = new Map();
        
        // Performance monitoring
        this.performanceMonitor = Utils.createPerformanceMonitor();
        
        // Raycaster for mouse interactions
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        this.init();
    }
    
    init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLighting();
        this.setupControls();
        this.createStarfield();
        this.createSun();
        this.createPlanets();
        this.setupEventListeners();
        this.animate();
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
    }
    
    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(
            CONFIG.CAMERA.FOV,
            aspect,
            CONFIG.CAMERA.NEAR,
            CONFIG.CAMERA.FAR
        );
        
        this.camera.position.set(
            CONFIG.CAMERA.INITIAL_POSITION.x,
            CONFIG.CAMERA.INITIAL_POSITION.y,
            CONFIG.CAMERA.INITIAL_POSITION.z
        );
    }
    
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        this.container.appendChild(this.renderer.domElement);
    }
    
    setupLighting() {
        // Ambient light for overall scene illumination
        const ambientLight = new THREE.AmbientLight(0x404040, CONFIG.LIGHTING.AMBIENT_INTENSITY);
        this.scene.add(ambientLight);
        
        // Point light from the sun
        this.sunLight = new THREE.PointLight(0xFFFFFF, CONFIG.LIGHTING.DIRECTIONAL_INTENSITY, 1000);
        this.sunLight.position.set(0, 0, 0);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.sunLight.shadow.camera.near = 0.5;
        this.sunLight.shadow.camera.far = 500;
        this.scene.add(this.sunLight);
    }
    
    setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 20;
        this.controls.maxDistance = 500;
        this.controls.maxPolarAngle = Math.PI;
        this.controls.autoRotate = false;
        this.controls.autoRotateSpeed = 0.5;
    }
    
    createStarfield() {
        const geometry = Utils.createStarfield(CONFIG.STARFIELD.COUNT, CONFIG.STARFIELD.SIZE);
        const material = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        const starfield = new THREE.Points(geometry, material);
        this.scene.add(starfield);
    }
    
    createSun() {
        const sunData = PLANET_DATA.sun;
        const geometry = new THREE.SphereGeometry(sunData.radius, 32, 32);
        
        // Create sun material with glow effect
        const material = new THREE.MeshBasicMaterial({
            color: sunData.color,
            emissive: sunData.emissive,
            emissiveIntensity: sunData.emissiveIntensity
        });
        
        this.sun = new THREE.Mesh(geometry, material);
        this.sun.userData = { name: sunData.name, data: sunData };
        this.scene.add(this.sun);
        
        // Add sun glow effect
        this.createSunGlow();
    }
    
    createSunGlow() {
        const glowGeometry = new THREE.SphereGeometry(PLANET_DATA.sun.radius * 1.2, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xFDB813,
            transparent: true,
            opacity: 0.3,
            side: THREE.BackSide
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.sun.add(glow);
    }
    
    createPlanets() {
        Object.keys(PLANET_DATA).forEach(key => {
            if (key === 'sun') return;
            
            const planetData = PLANET_DATA[key];
            this.createPlanet(key, planetData);
            this.createOrbitLine(planetData);
            
            // Initialize planet speed
            this.planetSpeeds.set(key, 1);
        });
    }
    
    createPlanet(name, data) {
        const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
        
        // Create planet material
        const material = new THREE.MeshLambertMaterial({
            color: data.color
        });
        
        const planet = new THREE.Mesh(geometry, material);
        planet.userData = { name: data.name, data: data, originalColor: data.color };
        planet.castShadow = true;
        planet.receiveShadow = true;
        
        // Add atmosphere for Earth
        if (data.hasAtmosphere) {
            this.addAtmosphere(planet, data);
        }
        
        // Add rings for gas giants
        if (data.hasRings) {
            this.addRings(planet, data);
        }
        
        // Set initial position
        planet.position.x = data.orbitRadius;
        planet.position.y = 0;
        planet.position.z = 0;
        
        // Apply axial tilt
        if (data.tilt) {
            planet.rotation.z = Utils.degToRad(data.tilt);
        }
        
        this.scene.add(planet);
        this.planets.set(name, {
            mesh: planet,
            angle: Math.random() * Math.PI * 2, // Random starting position
            orbitSpeed: data.orbitSpeed,
            rotationSpeed: data.rotationSpeed
        });
    }
    
    addAtmosphere(planet, data) {
        const atmosphereGeometry = new THREE.SphereGeometry(data.radius * 1.05, 32, 32);
        const atmosphereMaterial = new THREE.MeshBasicMaterial({
            color: data.atmosphereColor,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide
        });
        
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        planet.add(atmosphere);
    }
    
    addRings(planet, data) {
        const innerRadius = data.ringInnerRadius || data.radius * 1.2;
        const outerRadius = data.ringOuterRadius || data.radius * 2;
        
        const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.6
        });
        
        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = Math.PI / 2; // Rotate to be horizontal
        planet.add(rings);
    }
    
    createOrbitLine(data) {
        const points = Utils.createOrbitPath(data.orbitRadius);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0x333333,
            transparent: true,
            opacity: 0.3
        });
        
        const orbitLine = new THREE.Line(geometry, material);
        this.scene.add(orbitLine);
        this.orbitLines.set(data.name.toLowerCase(), orbitLine);
    }
    
    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        // Mouse events for planet interaction
        this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.renderer.domElement.addEventListener('click', this.onMouseClick.bind(this));
    }
    
    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        this.checkPlanetHover();
    }
    
    onMouseClick(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects([this.sun, ...Array.from(this.planets.values()).map(p => p.mesh)]);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            this.focusOnPlanet(object);
        }
    }
    
    checkPlanetHover() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects([this.sun, ...Array.from(this.planets.values()).map(p => p.mesh)]);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            this.showPlanetTooltip(object, event);
            document.body.style.cursor = 'pointer';
        } else {
            this.hidePlanetTooltip();
            document.body.style.cursor = 'default';
        }
    }
    
    showPlanetTooltip(object, event) {
        const tooltip = document.getElementById('planet-tooltip');
        const data = object.userData.data;
        
        tooltip.innerHTML = `
            <strong>${data.name}</strong><br>
            Diameter: ${data.info.diameter}<br>
            ${data.info.distance || 'Center of Solar System'}
        `;
        
        tooltip.style.left = event.clientX + 10 + 'px';
        tooltip.style.top = event.clientY - 30 + 'px';
        tooltip.classList.add('visible');
    }
    
    hidePlanetTooltip() {
        const tooltip = document.getElementById('planet-tooltip');
        tooltip.classList.remove('visible');
    }
    
    focusOnPlanet(planet) {
        const targetPosition = planet.position.clone();
        const distance = planet.userData.data.radius * 5;
        
        const cameraPosition = new THREE.Vector3(
            targetPosition.x + distance,
            targetPosition.y + distance,
            targetPosition.z + distance
        );
        
        // Smooth camera transition
        this.animateCameraTo(cameraPosition, targetPosition);
    }
    
    animateCameraTo(position, target) {
        const startPosition = this.camera.position.clone();
        const startTarget = this.controls.target.clone();
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        
        const animateCamera = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = Utils.easing.easeInOutCubic(progress);
            
            this.camera.position.lerpVectors(startPosition, position, easedProgress);
            this.controls.target.lerpVectors(startTarget, target, easedProgress);
            this.controls.update();
            
            if (progress < 1) {
                requestAnimationFrame(animateCamera);
            }
        };
        
        requestAnimationFrame(animateCamera);
    }
    
    animate(currentTime = 0) {
        this.animationId = requestAnimationFrame(this.animate.bind(this));
        
        if (!this.isPaused) {
            const deltaTime = (currentTime - this.lastTime) * 0.001; // Convert to seconds
            this.lastTime = currentTime;
            
            this.updatePlanets(deltaTime);
            this.updateSun(deltaTime);
        }
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        
        // Update performance monitor
        const fps = this.performanceMonitor.update();
        this.updatePerformanceDisplay(fps);
    }
    
    updatePlanets(deltaTime) {
        this.planets.forEach((planetObj, name) => {
            const planet = planetObj.mesh;
            const data = planet.userData.data;
            const speed = this.planetSpeeds.get(name) * this.globalSpeed;
            
            // Update orbital position
            planetObj.angle += planetObj.orbitSpeed * speed * deltaTime * 60; // 60 for smooth animation
            
            const x = Math.cos(planetObj.angle) * data.orbitRadius;
            const z = Math.sin(planetObj.angle) * data.orbitRadius;
            
            planet.position.x = x;
            planet.position.z = z;
            
            // Update rotation
            planet.rotation.y += planetObj.rotationSpeed * speed * deltaTime * 60;
        });
    }
    
    updateSun(deltaTime) {
        if (this.sun) {
            const sunData = PLANET_DATA.sun;
            this.sun.rotation.y += sunData.rotationSpeed * this.globalSpeed * deltaTime * 60;
        }
    }
    
    updatePerformanceDisplay(fps) {
        // This could be used to display FPS in UI if needed
        if (fps < 30 && !this.lowPerformanceWarning) {
            console.warn('Low performance detected. Consider reducing quality settings.');
            this.lowPerformanceWarning = true;
        }
    }
    
    // Control methods
    pause() {
        this.isPaused = true;
    }
    
    resume() {
        this.isPaused = false;
        this.lastTime = performance.now();
    }
    
    togglePause() {
        if (this.isPaused) {
            this.resume();
        } else {
            this.pause();
        }
        return !this.isPaused;
    }
    
    setGlobalSpeed(speed) {
        this.globalSpeed = Utils.clamp(speed, 0, 5);
    }
    
    setPlanetSpeed(planetName, speed) {
        this.planetSpeeds.set(planetName, Utils.clamp(speed, 0, 5));
    }
    
    resetCamera() {
        this.camera.position.set(
            CONFIG.CAMERA.INITIAL_POSITION.x,
            CONFIG.CAMERA.INITIAL_POSITION.y,
            CONFIG.CAMERA.INITIAL_POSITION.z
        );
        this.controls.target.set(0, 0, 0);
        this.controls.update();
    }
    
    toggleOrbitLines(visible) {
        this.orbitLines.forEach(line => {
            line.visible = visible;
        });
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        window.removeEventListener('resize', this.onWindowResize.bind(this));
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        // Clean up scene
        this.scene.traverse((object) => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SolarSystem;
}