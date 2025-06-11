// Enhanced UI Controller for Cosmic Explorer

class UIController {
    constructor(solarSystem) {
        this.solarSystem = solarSystem;
        this.isDarkTheme = true;
        this.isControlPanelCollapsed = false;
        this.isFullscreen = false;
        this.animationFrameId = null;
        
        this.init();
    }
    
    init() {
        // Add defensive DOM ready check
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeUI());
        } else {
            this.initializeUI();
        }
    }
    
    initializeUI() {
        console.log('🎮 Initializing UI Controller...');
        
        try {
            this.setupNavigation();
            this.setupGlobalControls();
            this.setupCameraControls();
            this.setupEventListeners();
            this.setupPerformanceMonitoring();
            this.hideLoading();
            this.addEntranceAnimations();
            
            // Setup planet controls after a short delay to ensure DOM is ready
            setTimeout(() => {
                this.setupPlanetControls();
            }, 500);
            
            // Initialize sliders after everything is set up
            setTimeout(() => {
                this.initializeAllSliders();
            }, 1000);
            
            console.log('✅ UI Controller initialized successfully');
        } catch (error) {
            console.error('❌ UI Controller initialization failed:', error);
            this.showError('Failed to initialize mission control: ' + error.message);
        }
    }
    
    setupNavigation() {
        console.log('🧭 Setting up navigation controls...');
        
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
            console.log('✅ Theme toggle connected');
        } else {
            console.warn('⚠️ Theme toggle button not found');
        }
        
        // Fullscreen toggle
        const fullscreenToggle = document.getElementById('fullscreen-toggle');
        if (fullscreenToggle) {
            fullscreenToggle.addEventListener('click', () => {
                this.toggleFullscreen();
            });
            console.log('✅ Fullscreen toggle connected');
        } else {
            console.warn('⚠️ Fullscreen toggle button not found');
        }
        
        // Panel collapse
        const panelCollapse = document.getElementById('panel-collapse');
        if (panelCollapse) {
            panelCollapse.addEventListener('click', () => {
                this.toggleControlPanel();
            });
            console.log('✅ Panel collapse connected');
        } else {
            console.warn('⚠️ Panel collapse button not found');
        }
    }
    
    setupGlobalControls() {
        console.log('🎛️ Setting up global controls...');
        
        // Enhanced pause/resume button
        const pauseBtn = document.getElementById('pause-resume');
        const missionStatus = document.getElementById('mission-status');
        const currentSpeed = document.getElementById('current-speed');
        
        if (!pauseBtn) {
            console.error('❌ Pause/resume button not found!');
            return;
        }
        
        if (!missionStatus) {
            console.error('❌ Mission status element not found!');
            return;
        }
        
        if (!currentSpeed) {
            console.error('❌ Current speed element not found!');
            return;
        }
        
        console.log('✅ Found all global control elements');
        
        pauseBtn.addEventListener('click', () => {
            try {
                console.log('🔄 Toggling pause state...');
                
                if (!this.solarSystem || typeof this.solarSystem.togglePause !== 'function') {
                    console.error('❌ SolarSystem not available or missing togglePause method');
                    this.showError('Solar system not ready yet. Please wait a moment.');
                    return;
                }
                
                const isRunning = this.solarSystem.togglePause();
                console.log(`Mission is now: ${isRunning ? 'RUNNING' : 'PAUSED'}`);
                
                // Update button
                const btnIcon = pauseBtn.querySelector('.btn-icon');
                const btnText = pauseBtn.querySelector('.btn-text');
                
                if (!btnIcon || !btnText) {
                    console.error('❌ Button elements not found');
                    return;
                }
                
                if (isRunning) {
                    btnIcon.textContent = '⏸️';
                    btnText.textContent = 'Pause Mission';
                    pauseBtn.classList.remove('paused');
                    missionStatus.textContent = 'ACTIVE';
                    missionStatus.className = 'status-value active';
                } else {
                    btnIcon.textContent = '▶️';
                    btnText.textContent = 'Resume Mission';
                    pauseBtn.classList.add('paused');
                    missionStatus.textContent = 'PAUSED';
                    missionStatus.className = 'status-value paused';
                }
                
                // Add button animation
                pauseBtn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    pauseBtn.style.transform = '';
                }, 150);
                
                console.log('✅ UI updated successfully');
            } catch (error) {
                console.error('❌ Error in pause toggle:', error);
                this.showError('Error controlling mission: ' + error.message);
            }
        });
        
        // Enhanced global speed control
        const globalSpeedSlider = document.getElementById('global-speed');
        const globalSpeedValue = document.getElementById('global-speed-value');
        
        if (globalSpeedSlider && globalSpeedValue) {
            globalSpeedSlider.addEventListener('input', (e) => {
                try {
                    const speed = parseFloat(e.target.value);
                    
                    if (!this.solarSystem || typeof this.solarSystem.setGlobalSpeed !== 'function') {
                        console.error('❌ SolarSystem not available for speed control');
                        return;
                    }
                    
                    this.solarSystem.setGlobalSpeed(speed);
                    globalSpeedValue.textContent = speed.toFixed(1) + 'x';
                    currentSpeed.textContent = speed.toFixed(1) + 'x';
                    
                    // Update slider track fill
                    this.updateSliderTrack(globalSpeedSlider);
                    
                    console.log(`Speed set to: ${speed.toFixed(1)}x`);
                } catch (error) {
                    console.error('❌ Error setting speed:', error);
                    this.showError('Error setting speed: ' + error.message);
                }
            });
            
            // Initialize slider track
            this.updateSliderTrack(globalSpeedSlider);
            console.log('✅ Global speed control connected');
        } else {
            console.warn('⚠️ Global speed control elements not found');
        }
    }
    
    setupPlanetControls() {
        console.log('🪐 Setting up planet controls...');
        
        const controlsContainer = document.getElementById('planet-controls');
        if (!controlsContainer) {
            console.error('❌ Planet controls container not found!');
            return;
        }
        
        if (typeof PLANET_DATA === 'undefined') {
            console.error('❌ PLANET_DATA not loaded!');
            return;
        }
        
        console.log('🌍 PLANET_DATA available with keys:', Object.keys(PLANET_DATA));
        
        let planetCount = 0;
        Object.keys(PLANET_DATA).forEach((key, index) => {
            if (key === 'sun') return;
            
            try {
                console.log(`🪐 Creating control for ${key}...`);
                const planetData = PLANET_DATA[key];
                const controlElement = this.createEnhancedPlanetControl(key, planetData);
                
                if (controlElement) {
                    controlsContainer.appendChild(controlElement);
                    planetCount++;
                    console.log(`✅ Added ${key} control to container`);
                    
                    // Make visible immediately and add staggered entrance animation
                    setTimeout(() => {
                        controlElement.style.opacity = '1';
                        controlElement.classList.add('animate-fadeInUp');
                    }, index * 100 + 100);
                } else {
                    console.error(`❌ Failed to create control element for ${key}`);
                }
            } catch (error) {
                console.error(`❌ Error creating control for ${key}:`, error);
            }
        });
        
        console.log(`✅ Created ${planetCount} planet controls total`);
        console.log(`📊 Container now has ${controlsContainer.children.length} children`);
        
        // Fallback: Make sure all planet controls are visible after a delay
        setTimeout(() => {
            const planetControls = controlsContainer.querySelectorAll('.planet-control');
            planetControls.forEach((control, index) => {
                if (control.style.opacity === '0' || !control.style.opacity) {
                    console.log(`🔧 Making planet control ${index} visible (fallback)`);
                    control.style.opacity = '1';
                    control.style.transform = 'translateY(0)';
                }
            });
        }, 2000);
    }
    
    createEnhancedPlanetControl(planetKey, planetData) {
        console.log(`🔧 Creating control for ${planetKey}...`);
        
        if (!planetData) {
            console.error(`❌ No planet data provided for ${planetKey}`);
            return null;
        }
        
        const controlDiv = document.createElement('div');
        controlDiv.className = 'planet-control';
        controlDiv.style.opacity = '0.3'; // Start slightly visible for debugging
        
        const planetType = this.getPlanetType(planetKey);
        const planetEmoji = this.getPlanetEmoji(planetKey);
        
        console.log(`🎨 Rendering ${planetKey} with color: ${planetData.color}`);
        
        try {
            controlDiv.innerHTML = `
                <div class="planet-info">
                    <div class="planet-color" style="background-color: #${planetData.color.toString(16).padStart(6, '0')}"></div>
                    <div class="planet-details">
                        <span class="planet-name">${planetEmoji} ${planetData.name}</span>
                        <span class="planet-type">${planetType}</span>
                    </div>
                    <span class="speed-value" id="${planetKey}-speed-value">1.0x</span>
                </div>
                <div class="slider-container">
                    <input type="range" 
                           id="${planetKey}-speed" 
                           class="cosmic-slider"
                           min="0" 
                           max="5" 
                           step="0.1" 
                           value="1"
                           data-planet="${planetKey}">
                    <div class="slider-track"></div>
                </div>
            `;
            
            console.log(`✅ HTML generated for ${planetKey}`);
        } catch (error) {
            console.error(`❌ Error generating HTML for ${planetKey}:`, error);
            return null;
        }
        
        // Add enhanced event listeners
        const slider = controlDiv.querySelector(`#${planetKey}-speed`);
        const valueDisplay = controlDiv.querySelector(`#${planetKey}-speed-value`);
        
        if (!slider || !valueDisplay) {
            console.error(`❌ Slider elements not found for ${planetKey}`);
            return controlDiv;
        }
        
        slider.addEventListener('input', (e) => {
            try {
                const speed = parseFloat(e.target.value);
                console.log(`🪐 Setting ${planetKey} speed to ${speed.toFixed(1)}x`);
                
                if (!this.solarSystem || typeof this.solarSystem.setPlanetSpeed !== 'function') {
                    console.error('❌ SolarSystem not available for planet speed control');
                    this.showError('Solar system not ready for planet control');
                    return;
                }
                
                this.solarSystem.setPlanetSpeed(planetKey, speed);
                valueDisplay.textContent = speed.toFixed(1) + 'x';
                this.updateSliderTrack(slider);
                
                // Add haptic feedback on mobile
                if (navigator.vibrate && speed > 0) {
                    navigator.vibrate(10);
                }
                
                console.log(`✅ ${planetKey} speed updated successfully`);
            } catch (error) {
                console.error(`❌ Error setting ${planetKey} speed:`, error);
                this.showError(`Error controlling ${planetKey}: ${error.message}`);
            }
        });
        
        // Enhanced hover effects
        controlDiv.addEventListener('mouseenter', () => {
            this.highlightPlanet(planetKey, true);
            controlDiv.style.transform = 'translateY(-2px)';
        });
        
        controlDiv.addEventListener('mouseleave', () => {
            this.highlightPlanet(planetKey, false);
            controlDiv.style.transform = '';
        });
        
        // Initialize slider track
        this.updateSliderTrack(slider);
        
        return controlDiv;
    }
    
    getPlanetType(planetKey) {
        const types = {
            mercury: 'Terrestrial',
            venus: 'Terrestrial', 
            earth: 'Terrestrial',
            mars: 'Terrestrial',
            jupiter: 'Gas Giant',
            saturn: 'Gas Giant',
            uranus: 'Ice Giant',
            neptune: 'Ice Giant'
        };
        return types[planetKey] || 'Planet';
    }
    
    getPlanetEmoji(planetKey) {
        const emojis = {
            mercury: '☿️',
            venus: '♀️',
            earth: '🌍',
            mars: '♂️',
            jupiter: '♃',
            saturn: '♄',
            uranus: '♅',
            neptune: '♆'
        };
        return emojis[planetKey] || '🪐';
    }
    
    updateSliderTrack(slider) {
        if (!slider) {
            console.warn('⚠️ updateSliderTrack: slider is null');
            return;
        }
        
        try {
            const min = parseFloat(slider.min) || 0;
            const max = parseFloat(slider.max) || 5;
            const value = parseFloat(slider.value) || 0;
            const percentage = ((value - min) / (max - min)) * 100;
            
            const track = slider.parentElement?.querySelector('.slider-track');
            
            if (track) {
                // Create a smooth gradient that shows the current value
                const gradientStops = `var(--cosmic-gold) 0%, var(--cosmic-pink) ${percentage}%, rgba(255,255,255,0.1) ${percentage}%, rgba(255,255,255,0.05) 100%`;
                track.style.background = `linear-gradient(90deg, ${gradientStops})`;
                track.style.opacity = '1';
                console.log(`🎚️ Updated slider track: ${percentage.toFixed(1)}% (value: ${value})`);
            } else {
                console.warn('⚠️ Slider track element not found for slider:', slider.id);
                // Fallback: create the track if it doesn't exist
                this.createSliderTrack(slider);
            }
        } catch (error) {
            console.error('❌ Error updating slider track:', error);
        }
    }
    
    createSliderTrack(slider) {
        if (!slider.parentElement) {
            console.warn('⚠️ Slider has no parent element:', slider.id);
            return;
        }
        
        const existingTrack = slider.parentElement.querySelector('.slider-track');
        if (existingTrack) {
            console.log('✅ Slider track already exists for:', slider.id);
            return; // Already exists
        }
        
        const track = document.createElement('div');
        track.className = 'slider-track';
        track.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            background: linear-gradient(90deg, var(--cosmic-gold) 0%, var(--cosmic-pink) 0%, rgba(255,255,255,0.1) 0%);
            border-radius: 3px;
            transition: background 0.3s ease;
            pointer-events: none;
            z-index: 1;
        `;
        
        slider.parentElement.appendChild(track);
        console.log('✅ Created missing slider track for:', slider.id);
        
        // Update the track immediately with current value
        setTimeout(() => {
            this.updateSliderTrack(slider);
        }, 10);
    }
    
    highlightPlanet(planetKey, highlight) {
        const planet = this.solarSystem.planets.get(planetKey);
        if (planet) {
            const originalColor = planet.mesh.userData.originalColor;
            if (highlight) {
                planet.mesh.material.color.setHex(0xFFFFFF);
                planet.mesh.material.emissive.setHex(originalColor);
                planet.mesh.material.emissiveIntensity = 0.3;
            } else {
                planet.mesh.material.color.setHex(originalColor);
                planet.mesh.material.emissive.setHex(0x000000);
                planet.mesh.material.emissiveIntensity = 0;
            }
        }
    }
    
    
    setupCameraControls() {
        console.log('📷 Setting up camera controls...');
        
        // Enhanced reset camera button
        const resetCameraBtn = document.getElementById('reset-camera');
        if (resetCameraBtn) {
            resetCameraBtn.addEventListener('click', () => {
                try {
                    if (!this.solarSystem || typeof this.solarSystem.resetCamera !== 'function') {
                        console.error('❌ SolarSystem not available for camera reset');
                        this.showError('Camera controls not ready yet');
                        return;
                    }
                    
                    this.solarSystem.resetCamera();
                    
                    // Add visual feedback
                    resetCameraBtn.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        resetCameraBtn.style.transform = '';
                    }, 150);
                    
                    this.showNotification('🎯 Camera view reset', 'success', 2000);
                    console.log('✅ Camera reset successfully');
                } catch (error) {
                    console.error('❌ Error resetting camera:', error);
                    this.showError('Error resetting camera: ' + error.message);
                }
            });
            console.log('✅ Camera reset button connected');
        } else {
            console.warn('⚠️ Camera reset button not found');
        }
        
        // Enhanced camera speed control
        const cameraSpeedSlider = document.getElementById('camera-speed');
        if (cameraSpeedSlider) {
            cameraSpeedSlider.addEventListener('input', (e) => {
                try {
                    const speed = parseFloat(e.target.value);
                    
                    if (!this.solarSystem || !this.solarSystem.controls) {
                        console.warn('⚠️ Camera controls not available yet');
                        return;
                    }
                    
                    this.solarSystem.controls.rotateSpeed = speed;
                    this.solarSystem.controls.panSpeed = speed;
                    this.solarSystem.controls.zoomSpeed = speed;
                    
                    this.updateSliderTrack(cameraSpeedSlider);
                    console.log(`📷 Camera speed set to: ${speed.toFixed(1)}x`);
                } catch (error) {
                    console.error('❌ Error setting camera speed:', error);
                    this.showError('Error controlling camera speed: ' + error.message);
                }
            });
            
            // Initialize camera slider track
            this.updateSliderTrack(cameraSpeedSlider);
            console.log('✅ Camera speed control connected');
        } else {
            console.warn('⚠️ Camera speed slider not found');
        }
    }
    
    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        const body = document.body;
        const themeToggle = document.getElementById('theme-toggle');
        const btnIcon = themeToggle.querySelector('.btn-icon');
        
        // Add transition effect
        body.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        
        if (this.isDarkTheme) {
            body.classList.remove('light-theme');
            btnIcon.textContent = '🌙';
            this.solarSystem.scene.background.setHex(0x000000);
            this.showNotification('🌙 Dark mode enabled', 'info', 2000);
        } else {
            body.classList.add('light-theme');
            btnIcon.textContent = '☀️';
            this.solarSystem.scene.background.setHex(0x87CEEB);
            this.showNotification('☀️ Light mode enabled', 'info', 2000);
        }
        
        // Add theme toggle animation
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 500);
        
        // Save theme preference
        localStorage.setItem('cosmicExplorerTheme', this.isDarkTheme ? 'dark' : 'light');
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                this.isFullscreen = true;
                const btnIcon = document.getElementById('fullscreen-toggle').querySelector('.btn-icon');
                btnIcon.textContent = '⛶';
                this.showNotification('🖥️ Entered fullscreen mode', 'success', 2000);
            }).catch(err => {
                this.showNotification('❌ Fullscreen not supported', 'error', 3000);
            });
        } else {
            document.exitFullscreen().then(() => {
                this.isFullscreen = false;
                const btnIcon = document.getElementById('fullscreen-toggle').querySelector('.btn-icon');
                btnIcon.textContent = '⛶';
                this.showNotification('🪟 Exited fullscreen mode', 'info', 2000);
            });
        }
    }
    
    toggleControlPanel() {
        console.log('🔄 Toggling control panel...');
        
        const controlPanel = document.querySelector('.control-panel');
        const collapseIcon = document.querySelector('.collapse-icon');
        
        if (!controlPanel) {
            console.error('❌ Control panel not found');
            this.showError('Control panel not found');
            return;
        }
        
        this.isControlPanelCollapsed = !this.isControlPanelCollapsed;
        console.log(`Panel collapsed state: ${this.isControlPanelCollapsed}`);
        
        if (this.isControlPanelCollapsed) {
            if (window.innerWidth <= 768) {
                controlPanel.classList.add('collapsed');
                console.log('📱 Added collapsed class for mobile');
            } else {
                controlPanel.style.transform = 'translateX(calc(100% - 60px))';
                console.log('🖥️ Applied desktop collapse transform');
            }
            if (collapseIcon) {
                collapseIcon.textContent = '⋮';
            }
        } else {
            controlPanel.classList.remove('collapsed');
            controlPanel.style.transform = 'translateX(0)';
            if (collapseIcon) {
                collapseIcon.textContent = '⋯';
            }
            console.log('✅ Panel expanded');
        }
        
        // Add visual feedback
        controlPanel.style.transition = 'transform 0.3s ease';
        this.showNotification(
            this.isControlPanelCollapsed ? '📱 Panel collapsed' : '📱 Panel expanded', 
            'info', 
            1500
        );
    }
    
    setupPerformanceMonitoring() {
        const fpsValue = document.getElementById('fps-value');
        
        const updatePerformance = () => {
            if (this.solarSystem && this.solarSystem.performanceMonitor) {
                const fps = this.solarSystem.performanceMonitor.update();
                fpsValue.textContent = fps;
                
                // Color-code FPS
                if (fps >= 55) {
                    fpsValue.style.color = 'var(--cosmic-gold)';
                } else if (fps >= 30) {
                    fpsValue.style.color = 'var(--cosmic-pink)';
                } else {
                    fpsValue.style.color = '#e74c3c';
                }
            }
            
            this.animationFrameId = requestAnimationFrame(updatePerformance);
        };
        
        updatePerformance();
    }
    
    addEntranceAnimations() {
        // Animate navigation
        setTimeout(() => {
            document.querySelector('.cosmic-nav').classList.add('animate-fadeInUp');
        }, 100);
        
        // Animate control panel
        setTimeout(() => {
            document.querySelector('.control-panel').classList.add('animate-slideInRight');
        }, 300);
        
        // Animate performance indicator
        setTimeout(() => {
            document.querySelector('.performance-indicator').classList.add('animate-fadeInUp');
        }, 500);
    }
    
    setupEventListeners() {
        // Touch/mobile gestures
        if (Utils.isMobile()) {
            this.setupMobileControls();
        }
        
        // Load saved preferences
        this.loadPreferences();
    }
    
    setupMobileControls() {
        // Add mobile-specific optimizations
        const controlPanel = document.querySelector('.control-panel');
        
        // Make control panel collapsible on mobile
        const header = controlPanel.querySelector('.panel-header h2');
        header.style.cursor = 'pointer';
        header.addEventListener('click', () => {
            this.toggleControlPanel();
        });
        
        // Reduce control sensitivity on mobile
        if (this.solarSystem.controls) {
            this.solarSystem.controls.rotateSpeed = 0.5;
            this.solarSystem.controls.panSpeed = 0.5;
            this.solarSystem.controls.zoomSpeed = 0.8;
        }
    }
    
    loadPreferences() {
        // Load theme preference
        const savedTheme = localStorage.getItem('solarSystemTheme');
        if (savedTheme === 'light' && this.isDarkTheme) {
            this.toggleTheme();
        }
        
        // Load speed preferences
        Object.keys(PLANET_DATA).forEach(key => {
            if (key === 'sun') return;
            
            const savedSpeed = localStorage.getItem(`planet-${key}-speed`);
            if (savedSpeed) {
                const speed = parseFloat(savedSpeed);
                const slider = document.getElementById(`${key}-speed`);
                const valueDisplay = document.getElementById(`${key}-speed-value`);
                
                if (slider && valueDisplay) {
                    slider.value = speed;
                    valueDisplay.textContent = speed.toFixed(1) + 'x';
                    this.solarSystem.setPlanetSpeed(key, speed);
                }
            }
        });
        
        // Load global speed preference
        const savedGlobalSpeed = localStorage.getItem('global-speed');
        if (savedGlobalSpeed) {
            const speed = parseFloat(savedGlobalSpeed);
            const globalSpeedSlider = document.getElementById('global-speed');
            const globalSpeedValue = document.getElementById('global-speed-value');
            
            globalSpeedSlider.value = speed;
            globalSpeedValue.textContent = speed.toFixed(1) + 'x';
            this.solarSystem.setGlobalSpeed(speed);
        }
    }
    
    savePreferences() {
        // Save planet speeds
        Object.keys(PLANET_DATA).forEach(key => {
            if (key === 'sun') return;
            
            const slider = document.getElementById(`${key}-speed`);
            if (slider) {
                localStorage.setItem(`planet-${key}-speed`, slider.value);
            }
        });
        
        // Save global speed
        const globalSpeedSlider = document.getElementById('global-speed');
        if (globalSpeedSlider) {
            localStorage.setItem('global-speed', globalSpeedSlider.value);
        }
    }
    
    showPlanetTooltip(object, event) {
        const tooltip = document.getElementById('planet-tooltip');
        const data = object.userData.data;
        const title = tooltip.querySelector('.tooltip-title');
        const type = tooltip.querySelector('.tooltip-type');
        const stats = tooltip.querySelector('.tooltip-stats');
        
        title.textContent = data.name;
        type.textContent = this.getPlanetType(data.name.toLowerCase());
        
        stats.innerHTML = `
            <div style="margin-bottom: 8px;"><strong>Diameter:</strong> ${data.info.diameter}</div>
            <div style="margin-bottom: 8px;"><strong>Distance:</strong> ${data.info.distance || 'Center of Solar System'}</div>
            ${data.info.day ? `<div style="margin-bottom: 8px;"><strong>Day Length:</strong> ${data.info.day}</div>` : ''}
            ${data.info.year ? `<div><strong>Year Length:</strong> ${data.info.year}</div>` : ''}
        `;
        
        // Position tooltip
        const rect = this.solarSystem.renderer.domElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        tooltip.style.left = (x + 15) + 'px';
        tooltip.style.top = (y - 50) + 'px';
        
        // Show with animation
        tooltip.classList.add('visible');
    }
    
    hideLoading() {
        const loading = document.getElementById('loading');
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        // Animate progress to 100%
        progressFill.style.width = '100%';
        progressText.textContent = 'Mission ready!';
        
        setTimeout(() => {
            loading.classList.add('hidden');
            setTimeout(() => {
                loading.style.display = 'none';
                // Refresh all sliders after loading is complete
                this.refreshAllSliders();
                
                // Check if planet controls were created, if not create them
                setTimeout(() => {
                    const container = document.getElementById('planet-controls');
                    if (container && container.children.length === 0) {
                        console.log('🔧 Planet controls missing after loading, creating them now...');
                        this.setupPlanetControls();
                    }
                }, 500);
            }, 800);
        }, 1500);
    }
    
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const colors = {
            error: '#e74c3c',
            success: '#27ae60',
            info: 'var(--cosmic-gold)',
            warning: '#f39c12'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%) translateY(-30px);
            background: rgba(26, 26, 46, 0.95);
            backdrop-filter: blur(20px);
            color: white;
            padding: 15px 25px;
            border-radius: 12px;
            z-index: 10000;
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            border-left: 4px solid ${colors[type]};
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            font-weight: 500;
            max-width: 300px;
            text-align: center;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(-50%) translateY(0)';
        });
        
        // Remove after duration
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(-30px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 400);
        }, duration);
    }
    
    showError(message) {
        console.error('🚨 UI Error:', message);
        this.showNotification(message, 'error', 5000);
    }
    
    loadPreferences() {
        // Load theme preference
        const savedTheme = localStorage.getItem('cosmicExplorerTheme');
        if (savedTheme === 'light' && this.isDarkTheme) {
            this.toggleTheme();
        }
        
        // Load speed preferences with animation
        Object.keys(PLANET_DATA).forEach((key, index) => {
            if (key === 'sun') return;
            
            setTimeout(() => {
                const savedSpeed = localStorage.getItem(`planet-${key}-speed`);
                if (savedSpeed) {
                    const speed = parseFloat(savedSpeed);
                    const slider = document.getElementById(`${key}-speed`);
                    const valueDisplay = document.getElementById(`${key}-speed-value`);
                    
                    if (slider && valueDisplay) {
                        slider.value = speed;
                        valueDisplay.textContent = speed.toFixed(1) + 'x';
                        this.solarSystem.setPlanetSpeed(key, speed);
                        this.updateSliderTrack(slider);
                    }
                }
            }, index * 50);
        });
        
        // Load global speed preference
        const savedGlobalSpeed = localStorage.getItem('global-speed');
        if (savedGlobalSpeed) {
            const speed = parseFloat(savedGlobalSpeed);
            const globalSpeedSlider = document.getElementById('global-speed');
            const globalSpeedValue = document.getElementById('global-speed-value');
            const currentSpeed = document.getElementById('current-speed');
            
            globalSpeedSlider.value = speed;
            globalSpeedValue.textContent = speed.toFixed(1) + 'x';
            currentSpeed.textContent = speed.toFixed(1) + 'x';
            this.solarSystem.setGlobalSpeed(speed);
            this.updateSliderTrack(globalSpeedSlider);
        }
    }
    
    initializeAllSliders() {
        console.log('🎚️ Initializing all sliders...');
        
        // Global speed slider
        const globalSpeedSlider = document.getElementById('global-speed');
        if (globalSpeedSlider) {
            this.updateSliderTrack(globalSpeedSlider);
            console.log('✅ Global speed slider initialized');
        }
        
        // Camera speed slider
        const cameraSpeedSlider = document.getElementById('camera-speed');
        if (cameraSpeedSlider) {
            this.updateSliderTrack(cameraSpeedSlider);
            console.log('✅ Camera speed slider initialized');
        }
        
        // Planet sliders
        Object.keys(PLANET_DATA).forEach(key => {
            if (key === 'sun') return;
            
            const planetSlider = document.getElementById(`${key}-speed`);
            if (planetSlider) {
                this.updateSliderTrack(planetSlider);
                console.log(`✅ ${key} slider initialized`);
            }
        });
        
        console.log('🎚️ All sliders initialized successfully');
    }
    
    refreshAllSliders() {
        console.log('🔄 Refreshing all sliders...');
        
        const allSliders = document.querySelectorAll('.cosmic-slider');
        let refreshCount = 0;
        
        allSliders.forEach(slider => {
            try {
                // Ensure the slider has a track
                this.createSliderTrack(slider);
                
                // Update the visual state
                this.updateSliderTrack(slider);
                
                // Trigger any associated value displays
                const valueDisplay = document.querySelector(`#${slider.id}-value`);
                if (valueDisplay && slider.value) {
                    valueDisplay.textContent = parseFloat(slider.value).toFixed(1) + 'x';
                }
                
                refreshCount++;
                console.log(`✅ Refreshed slider: ${slider.id}`);
            } catch (error) {
                console.error(`❌ Error refreshing slider ${slider.id}:`, error);
            }
        });
        
        console.log(`🔄 Refreshed ${refreshCount} sliders successfully`);
    }
}