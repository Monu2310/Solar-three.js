// Cosmic Explorer - Advanced 3D Solar System Simulation

class CosmicExplorerApp {
    constructor() {
        this.solarSystem = null;
        this.uiController = null;
        this.isInitialized = false;
        this.loadingSteps = [
            'Initializing quantum space-time...',
            'Calibrating stellar coordinates...',
            'Loading planetary data...',
            'Establishing orbital mechanics...',
            'Activating mission control...',
            'Preparing for exploration...'
        ];
        this.currentStep = 0;
        
        this.init();
    }
    
    async init() {
        try {
            // Show enhanced loading
            this.showLoadingProgress();
            
            // Comprehensive system checks
            if (!this.checkSystemCompatibility()) {
                return;
            }
                 // Initialize with better error handling
        await this.initializeWithProgress();
        
        // Mark as ready
        this.isInitialized = true;
        
        // Setup advanced features after UI is ready
        setTimeout(() => {
            this.setupAdvancedFeatures();
        }, 1000);
        
        console.log('🌌 Cosmic Explorer initialized successfully!');
            
        } catch (error) {
            console.error('🚨 Failed to initialize Cosmic Explorer:', error);
            this.displayError('Failed to initialize the cosmic simulation: ' + error.message);
        }
    }
    
    checkSystemCompatibility() {
        const issues = [];
        
        // WebGL check
        if (!this.checkWebGLSupport()) {
            issues.push('WebGL support is required');
        }
        
        // Three.js check
        if (typeof THREE === 'undefined') {
            issues.push('Three.js library failed to load');
        }
        
        // Performance check
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl');
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                console.log('🖥️ Graphics Renderer:', renderer);
            }
        }
        
        if (issues.length > 0) {
            this.displayError('System compatibility issues detected:\n' + issues.join('\n'));
            return false;
        }
        
        return true;
    }
    
    async showLoadingProgress() {
        const progressText = document.querySelector('.progress-text');
        const progressFill = document.querySelector('.progress-fill');
        
        for (let i = 0; i < this.loadingSteps.length; i++) {
            if (progressText) {
                progressText.textContent = this.loadingSteps[i];
            }
            if (progressFill) {
                progressFill.style.width = `${(i + 1) / this.loadingSteps.length * 90}%`;
            }
            await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
        }
    }
    
    async initializeWithProgress() {
        // Initialize solar system
        await this.initializeSolarSystem();
        
        // Initialize UI with delay for smooth experience
        await new Promise(resolve => setTimeout(resolve, 200));
        this.initializeUI();
        
        // Setup error handling
        this.setupErrorHandling();
        
        // Setup performance monitoring
        this.setupAdvancedPerformanceMonitoring();
    }
    
    setupAdvancedFeatures() {
        // Enhanced keyboard shortcuts
        this.setupAdvancedKeyboardShortcuts();
        
        // Mouse gesture support
        this.setupMouseGestures();
        
        // Visibility change handling
        this.setupVisibilityHandling();
        
        // Window focus handling
        this.setupFocusHandling();
        
        // Advanced analytics
        this.setupAnalytics();
    }
    
    setupAdvancedKeyboardShortcuts() {
        console.log('⌨️ Setting up keyboard shortcuts...');
        console.log('UIController available:', this.uiController ? '✅' : '❌');
        
        const shortcuts = {
            'Space': () => document.getElementById('pause-resume')?.click(),
            'KeyR': () => document.getElementById('reset-camera')?.click(),
            'KeyT': () => document.getElementById('theme-toggle')?.click(),
            'KeyH': () => {
                console.log('🎹 H key pressed - attempting to toggle panel');
                if (this.uiController?.toggleControlPanel) {
                    this.uiController.toggleControlPanel();
                } else {
                    console.error('❌ UIController or toggleControlPanel method not available');
                }
            },
            'KeyF': () => document.getElementById('fullscreen-toggle')?.click(),
            'Escape': () => {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
            },
            'ArrowUp': () => this.adjustGlobalSpeed(0.1),
            'ArrowDown': () => this.adjustGlobalSpeed(-0.1),
            'Digit1': () => this.focusOnPlanet('mercury'),
            'Digit2': () => this.focusOnPlanet('venus'),
            'Digit3': () => this.focusOnPlanet('earth'),
            'Digit4': () => this.focusOnPlanet('mars'),
            'Digit5': () => this.focusOnPlanet('jupiter'),
            'Digit6': () => this.focusOnPlanet('saturn'),
            'Digit7': () => this.focusOnPlanet('uranus'),
            'Digit8': () => this.focusOnPlanet('neptune'),
            'Digit0': () => this.focusOnSun()
        };
        
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return;
            
            const action = shortcuts[e.code];
            if (action) {
                console.log(`🎹 Keyboard shortcut triggered: ${e.code}`);
                e.preventDefault();
                action();
            }
        });
        
        console.log('✅ Keyboard shortcuts initialized with', Object.keys(shortcuts).length, 'shortcuts');
    }
    
    setupMouseGestures() {
        let gestureStartTime = 0;
        let gestureStartPos = { x: 0, y: 0 };
        
        document.addEventListener('mousedown', (e) => {
            if (e.button === 1) { // Middle mouse button
                gestureStartTime = Date.now();
                gestureStartPos = { x: e.clientX, y: e.clientY };
            }
        });
        
        document.addEventListener('mouseup', (e) => {
            if (e.button === 1) {
                const duration = Date.now() - gestureStartTime;
                const distance = Math.sqrt(
                    Math.pow(e.clientX - gestureStartPos.x, 2) + 
                    Math.pow(e.clientY - gestureStartPos.y, 2)
                );
                
                if (duration < 200 && distance < 10) {
                    // Middle click gesture - toggle pause
                    document.getElementById('pause-resume')?.click();
                }
            }
        });
    }
    
    setupVisibilityHandling() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause when tab is hidden to save resources
                if (this.solarSystem && !this.solarSystem.isPaused) {
                    this.solarSystem.pause();
                    this._wasPausedByVisibility = false;
                } else {
                    this._wasPausedByVisibility = true;
                }
            } else {
                // Resume if it wasn't manually paused
                if (this.solarSystem && !this._wasPausedByVisibility) {
                    this.solarSystem.resume();
                }
            }
        });
    }
    
    setupFocusHandling() {
        window.addEventListener('blur', () => {
            // Reduce performance when window loses focus
            if (this.solarSystem?.renderer) {
                this.solarSystem.renderer.setPixelRatio(Math.min(window.devicePixelRatio * 0.5, 1));
            }
        });
        
        window.addEventListener('focus', () => {
            // Restore performance when window gains focus
            if (this.solarSystem?.renderer) {
                this.solarSystem.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            }
        });
    }
    
    setupAnalytics() {
        // Track user interactions (privacy-friendly)
        const analytics = {
            sessionStart: Date.now(),
            interactions: 0,
            planetsViewed: new Set(),
            featuresUsed: new Set()
        };
        
        // Track planet views
        document.addEventListener('click', (e) => {
            analytics.interactions++;
            if (e.target.closest('.planet-control')) {
                const planet = e.target.closest('.planet-control').querySelector('.planet-name')?.textContent;
                if (planet) analytics.planetsViewed.add(planet);
            }
        });
        
        // Track feature usage
        ['pause-resume', 'reset-camera', 'theme-toggle', 'fullscreen-toggle'].forEach(id => {
            document.getElementById(id)?.addEventListener('click', () => {
                analytics.featuresUsed.add(id);
            });
        });
        
        // Log session summary (for development)
        window.addEventListener('beforeunload', () => {
            const sessionDuration = Date.now() - analytics.sessionStart;
            console.log('🌌 Session Summary:', {
                duration: Math.round(sessionDuration / 1000) + 's',
                interactions: analytics.interactions,
                planetsViewed: analytics.planetsViewed.size,
                featuresUsed: analytics.featuresUsed.size
            });
        });
    }
    
    adjustGlobalSpeed(delta) {
        const slider = document.getElementById('global-speed');
        if (slider) {
            const newValue = Math.max(0, Math.min(5, parseFloat(slider.value) + delta));
            slider.value = newValue;
            slider.dispatchEvent(new Event('input'));
        }
    }
    
    focusOnPlanet(planetName) {
        const planet = this.solarSystem?.planets.get(planetName);
        if (planet) {
            this.solarSystem.focusOnPlanet(planet.mesh);
            this.uiController?.showNotification(`🔭 Focusing on ${planetName.charAt(0).toUpperCase() + planetName.slice(1)}`, 'info', 2000);
        }
    }
    
    focusOnSun() {
        if (this.solarSystem?.sun) {
            this.solarSystem.focusOnPlanet(this.solarSystem.sun);
            this.uiController?.showNotification('☀️ Focusing on the Sun', 'info', 2000);
        }
    }
    
    setupAdvancedPerformanceMonitoring() {
        let performanceData = {
            frameCount: 0,
            lowFpsCount: 0,
            averageFps: 60,
            memoryUsage: 0
        };
        
        const monitor = () => {
            if (!this.isInitialized) return;
            
            performanceData.frameCount++;
            
            // Check memory usage if available
            if (performance.memory) {
                performanceData.memoryUsage = performance.memory.usedJSHeapSize / 1048576; // MB
            }
            
            // Every 60 frames (roughly 1 second)
            if (performanceData.frameCount % 60 === 0) {
                const fps = this.solarSystem?.performanceMonitor?.fps || 60;
                performanceData.averageFps = (performanceData.averageFps * 0.9) + (fps * 0.1);
                
                if (fps < 30) {
                    performanceData.lowFpsCount++;
                    
                    if (performanceData.lowFpsCount >= 3) {
                        this.optimizePerformance();
                        performanceData.lowFpsCount = 0;
                    }
                } else {
                    performanceData.lowFpsCount = Math.max(0, performanceData.lowFpsCount - 1);
                }
                
                // Auto-adjust quality based on performance
                this.autoAdjustQuality(performanceData.averageFps);
            }
            
            requestAnimationFrame(monitor);
        };
        
        requestAnimationFrame(monitor);
    }
    
    autoAdjustQuality(avgFps) {
        if (!this.solarSystem?.renderer) return;
        
        const currentPixelRatio = this.solarSystem.renderer.getPixelRatio();
        
        if (avgFps < 40 && currentPixelRatio > 1) {
            // Reduce quality
            this.solarSystem.renderer.setPixelRatio(Math.max(currentPixelRatio * 0.8, 1));
        } else if (avgFps > 55 && currentPixelRatio < window.devicePixelRatio) {
            // Increase quality
            this.solarSystem.renderer.setPixelRatio(Math.min(currentPixelRatio * 1.1, window.devicePixelRatio));
        }
    }
    
    checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return !!gl;
        } catch (e) {
            return false;
        }
    }
    
    async initializeSolarSystem() {
        const container = document.getElementById('canvas-container');
        if (!container) {
            throw new Error('Canvas container not found');
        }
        
        // Create the solar system
        this.solarSystem = new SolarSystem(container);
        
        // Wait for initial render
        await new Promise(resolve => {
            const checkRender = () => {
                if (this.solarSystem.renderer && this.solarSystem.scene) {
                    resolve();
                } else {
                    requestAnimationFrame(checkRender);
                }
            };
            checkRender();
        });
    }
    
    initializeUI() {
        if (!this.solarSystem) {
            throw new Error('Solar system must be initialized before UI');
        }
        
        console.log('🎮 Creating UIController...');
        this.uiController = new UIController(this.solarSystem);
        console.log('✅ UIController created successfully');
        
        // Add additional UI enhancements
        this.setupKeyboardHelp();
        this.setupPerformanceMonitoring();
    }
    
    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.displayError('An unexpected error occurred. Please refresh the page.');
        });
        
        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.displayError('An unexpected error occurred. Please refresh the page.');
        });
    }
    
    setupKeyboardHelp() {
        // Add help modal functionality
        const helpModal = this.createHelpModal();
        document.body.appendChild(helpModal);
        
        // Show help on F1 or '?'
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F1' || (e.shiftKey && e.key === '?')) {
                e.preventDefault();
                this.showHelp();
            }
        });
        
        // Add help button to control panel
        const controlPanel = document.querySelector('.panel-header');
        const helpBtn = document.createElement('button');
        helpBtn.textContent = '?';
        helpBtn.className = 'theme-toggle';
        helpBtn.title = 'Show Keyboard Shortcuts';
        helpBtn.style.marginLeft = '10px';
        helpBtn.addEventListener('click', () => this.showHelp());
        controlPanel.appendChild(helpBtn);
    }
    
    createHelpModal() {
        const modal = document.createElement('div');
        modal.id = 'help-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: none;
            justify-content: center;
            align-items: center;
        `;
        
        modal.innerHTML = `
            <div style="
                background: var(--bg-color, #1a1a2e);
                color: var(--text-color, white);
                padding: 30px;
                border-radius: 12px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                border: 1px solid rgba(255, 255, 255, 0.2);
            ">
                <h2 style="margin-top: 0; text-align: center;">Keyboard Shortcuts</h2>
                <div style="display: grid; grid-template-columns: auto 1fr; gap: 15px; margin: 20px 0;">
                    <strong>Space:</strong> <span>Pause/Resume animation</span>
                    <strong>R:</strong> <span>Reset camera view</span>
                    <strong>T:</strong> <span>Toggle dark/light theme</span>
                    <strong>H:</strong> <span>Hide/show control panel</span>
                    <strong>F1 or ?:</strong> <span>Show this help</span>
                    <strong>Mouse:</strong> <span>Orbit, zoom, pan camera</span>
                    <strong>Click:</strong> <span>Focus on planet</span>
                    <strong>Hover:</strong> <span>Show planet info</span>
                </div>
                
                <h3>Features:</h3>
                <ul style="margin: 15px 0; padding-left: 20px;">
                    <li>Individual planet speed controls</li>
                    <li>Global speed adjustment</li>
                    <li>Realistic orbital mechanics</li>
                    <li>Planetary information tooltips</li>
                    <li>Mobile-responsive design</li>
                    <li>Camera focusing on planets</li>
                    <li>Theme switching</li>
                </ul>
                
                <div style="text-align: center; margin-top: 30px;">
                    <button id="close-help" style="
                        background: #2196F3;
                        border: none;
                        color: white;
                        padding: 10px 20px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 16px;
                    ">Close</button>
                </div>
            </div>
        `;
        
        // Close modal functionality
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.id === 'close-help') {
                this.hideHelp();
            }
        });
        
        return modal;
    }
    
    showHelp() {
        const modal = document.getElementById('help-modal');
        modal.style.display = 'flex';
    }
    
    hideHelp() {
        const modal = document.getElementById('help-modal');
        modal.style.display = 'none';
    }
    
    setupPerformanceMonitoring() {
        // Monitor performance and adjust quality if needed
        let fpsCounter = 0;
        let lowFpsCount = 0;
        
        const monitorPerformance = () => {
            fpsCounter++;
            
            if (fpsCounter % 60 === 0) { // Check every 60 frames
                const fps = this.solarSystem.performanceMonitor.fps;
                
                if (fps < 30) {
                    lowFpsCount++;
                    
                    if (lowFpsCount >= 3) { // 3 consecutive low FPS readings
                        this.optimizePerformance();
                        lowFpsCount = 0;
                    }
                } else {
                    lowFpsCount = 0;
                }
            }
            
            if (this.isInitialized) {
                requestAnimationFrame(monitorPerformance);
            }
        };
        
        requestAnimationFrame(monitorPerformance);
    }
    
    optimizePerformance() {
        if (!this.solarSystem || !this.solarSystem.renderer) return;
        
        // Reduce pixel ratio on low-performance devices
        const currentPixelRatio = this.solarSystem.renderer.getPixelRatio();
        if (currentPixelRatio > 1) {
            this.solarSystem.renderer.setPixelRatio(Math.max(currentPixelRatio * 0.75, 1));
            console.log('Performance optimization: Reduced pixel ratio');
        }
        
        // Disable shadows if performance is still poor
        if (this.solarSystem.renderer.shadowMap.enabled) {
            this.solarSystem.renderer.shadowMap.enabled = false;
            console.log('Performance optimization: Disabled shadows');
        }
        
        // Show performance notification
        if (this.uiController) {
            this.uiController.showNotification(
                'Performance optimization applied. Some visual effects may be reduced.',
                'info',
                5000
            );
        }
    }
    
    displayError(message) {
        // Hide loading screen
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
        }
        
        // Create error display
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #f44336;
            color: white;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            max-width: 500px;
            width: 90%;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;
        
        errorDiv.innerHTML = `
            <h2 style="margin-top: 0;">Error</h2>
            <p style="margin: 20px 0; line-height: 1.5;">${message}</p>
            <button onclick="location.reload()" style="
                background: white;
                color: #f44336;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
                font-size: 16px;
            ">Reload Page</button>
        `;
        
        document.body.appendChild(errorDiv);
    }
    
    // Public methods for external control
    pause() {
        if (this.solarSystem) {
            this.solarSystem.pause();
        }
    }
    
    resume() {
        if (this.solarSystem) {
            this.solarSystem.resume();
        }
    }
    
    resetCamera() {
        if (this.solarSystem) {
            this.solarSystem.resetCamera();
        }
    }
    
    exportState() {
        if (this.uiController) {
            return this.uiController.exportState();
        }
        return null;
    }
    
    importState(stateJson) {
        if (this.uiController) {
            this.uiController.importState(stateJson);
        }
    }
    
    
    destroy() {
        this.isInitialized = false;
        
        if (this.uiController) {
            this.uiController.destroy();
        }
        
        if (this.solarSystem) {
            this.solarSystem.destroy();
        }
        
        // Remove help modal
        const helpModal = document.getElementById('help-modal');
        if (helpModal) {
            helpModal.remove();
        }
        
        console.log('🌌 Cosmic Explorer session ended');
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM ready, initializing Cosmic Explorer...');
    
    // Add loading screen enhancement
    const loadingText = document.querySelector('.loading-text h2');
    if (loadingText) {
        loadingText.textContent = 'Initializing Cosmic Explorer';
    }
    
    // Global app instance
    window.cosmicExplorer = new CosmicExplorerApp();
    
    // Expose enhanced debug methods
    window.cosmicDebug = {
        pause: () => window.cosmicExplorer.solarSystem?.pause(),
        resume: () => window.cosmicExplorer.solarSystem?.resume(),
        resetCamera: () => window.cosmicExplorer.solarSystem?.resetCamera(),
        toggleTheme: () => window.cosmicExplorer.uiController?.toggleTheme(),
        focusPlanet: (name) => window.cosmicExplorer.focusOnPlanet(name),
        exportState: () => window.cosmicExplorer.uiController?.exportState(),
        importState: (state) => window.cosmicExplorer.uiController?.importState(state),
        getPerformance: () => ({
            fps: window.cosmicExplorer.solarSystem?.performanceMonitor?.fps,
            renderer: window.cosmicExplorer.solarSystem?.renderer?.info
        }),
        testMissionControl: () => {
            console.log('🧪 Testing Mission Control...');
            const pauseBtn = document.getElementById('pause-resume');
            const missionStatus = document.getElementById('mission-status');
            const globalSpeed = document.getElementById('global-speed');
            
            console.log('Pause button:', pauseBtn ? '✅' : '❌');
            console.log('Mission status:', missionStatus ? '✅' : '❌');
            console.log('Global speed:', globalSpeed ? '✅' : '❌');
            console.log('UIController:', window.cosmicExplorer?.uiController ? '✅' : '❌');
            console.log('SolarSystem:', window.cosmicExplorer?.solarSystem ? '✅' : '❌');
            
            if (pauseBtn) {
                console.log('🎯 Attempting pause button click...');
                pauseBtn.click();
            }
        },
        testSliders: () => {
            console.log('🎚️ Testing Sliders...');
            
            // Test global speed slider
            const globalSpeed = document.getElementById('global-speed');
            if (globalSpeed) {
                console.log('✅ Global speed slider found');
                globalSpeed.value = '2.0';
                globalSpeed.dispatchEvent(new Event('input'));
                console.log('🔄 Triggered global speed change to 2.0x');
            } else {
                console.log('❌ Global speed slider not found');
            }
            
            // Test planet sliders
            const planetNames = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
            planetNames.forEach(planet => {
                const slider = document.getElementById(`${planet}-speed`);
                if (slider) {
                    console.log(`✅ ${planet} slider found`);
                    slider.value = '1.5';
                    slider.dispatchEvent(new Event('input'));
                    console.log(`🔄 Triggered ${planet} speed change to 1.5x`);
                } else {
                    console.log(`❌ ${planet} slider not found`);
                }
            });
            
            // Test camera speed slider
            const cameraSpeed = document.getElementById('camera-speed');
            if (cameraSpeed) {
                console.log('✅ Camera speed slider found');
                cameraSpeed.value = '1.2';
                cameraSpeed.dispatchEvent(new Event('input'));
                console.log('🔄 Triggered camera speed change to 1.2x');
            } else {
                console.log('❌ Camera speed slider not found');
            }
        },
        refreshSliders: () => {
            console.log('🔄 Refreshing all sliders...');
            if (window.cosmicExplorer?.uiController?.refreshAllSliders) {
                window.cosmicExplorer.uiController.refreshAllSliders();
            } else {
                console.log('❌ UIController or refreshAllSliders method not available');
            }
        },
        testKeyboardShortcuts: () => {
            console.log('⌨️ Testing keyboard shortcuts...');
            const shortcuts = {
                'Space': 'Pause/Resume',
                'KeyR': 'Reset Camera', 
                'KeyT': 'Toggle Theme',
                'KeyH': 'Hide/Show Panel',
                'KeyF': 'Toggle Fullscreen'
            };
            
            Object.entries(shortcuts).forEach(([key, description]) => {
                console.log(`Testing ${key} (${description})...`);
                const event = new KeyboardEvent('keydown', { code: key });
                document.dispatchEvent(event);
            });
        },
        testTogglePanel: () => {
            console.log('🔄 Testing panel toggle...');
            if (window.cosmicExplorer?.uiController?.toggleControlPanel) {
                window.cosmicExplorer.uiController.toggleControlPanel();
            } else {
                console.log('❌ UIController or toggleControlPanel method not available');
            }
        },
        debugPlanetControls: () => {
            console.log('🪐 Debugging planet controls...');
            const container = document.getElementById('planet-controls');
            console.log('Container found:', container ? '✅' : '❌');
            console.log('Container children:', container?.children.length || 0);
            console.log('PLANET_DATA:', typeof PLANET_DATA !== 'undefined' ? '✅' : '❌');
            
            if (window.cosmicExplorer?.uiController) {
                console.log('🔧 Re-running setupPlanetControls...');
                window.cosmicExplorer.uiController.setupPlanetControls();
            }
        },
        createMissingPlanetControls: () => {
            console.log('🛠️ Manually creating planet controls...');
            const container = document.getElementById('planet-controls');
            if (!container) {
                console.log('❌ No container found');
                return;
            }
            
            // Clear existing content
            container.innerHTML = '';
            
            if (typeof PLANET_DATA === 'undefined') {
                console.log('❌ PLANET_DATA not available');
                return;
            }
            
            Object.keys(PLANET_DATA).forEach(key => {
                if (key === 'sun') return;
                
                const planetData = PLANET_DATA[key];
                const controlDiv = document.createElement('div');
                controlDiv.className = 'planet-control';
                controlDiv.style.cssText = 'background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 16px; margin-bottom: 12px; opacity: 1;';
                
                controlDiv.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                        <div style="width: 12px; height: 12px; border-radius: 50%; background-color: #${planetData.color.toString(16).padStart(6, '0')};"></div>
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: white;">${planetData.name}</div>
                            <div style="font-size: 12px; opacity: 0.7;">Planet</div>
                        </div>
                        <span style="font-weight: 600; color: var(--cosmic-gold);">1.0x</span>
                    </div>
                    <div style="position: relative;">
                        <input type="range" id="${key}-speed" min="0" max="5" step="0.1" value="1" 
                               style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; -webkit-appearance: none;">
                    </div>
                `;
                
                container.appendChild(controlDiv);
                console.log(`✅ Created control for ${key}`);
            });
        }
    };
    
    // Add easter egg
    console.log(`
    🌌 Welcome to Cosmic Explorer! 🌌
    
    Keyboard Shortcuts:
    Space - Pause/Resume
    R - Reset Camera
    T - Toggle Theme
    F - Toggle Fullscreen
    H - Hide/Show Controls
    1-8 - Focus on Planets
    0 - Focus on Sun
    ↑↓ - Adjust Speed
    
    Debug: window.cosmicDebug
    `);
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.cosmicExplorer) {
        window.cosmicExplorer.destroy();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CosmicExplorerApp;
}