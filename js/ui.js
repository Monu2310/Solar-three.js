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
        this.setupNavigation();
        this.setupGlobalControls();
        this.setupPlanetControls();
        this.setupCameraControls();
        this.setupEventListeners();
        this.setupPerformanceMonitoring();
        this.hideLoading();
        this.addEntranceAnimations();
    }
    
    setupNavigation() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Fullscreen toggle
        const fullscreenToggle = document.getElementById('fullscreen-toggle');
        fullscreenToggle.addEventListener('click', () => {
            this.toggleFullscreen();
        });
        
        // Panel collapse
        const panelCollapse = document.getElementById('panel-collapse');
        panelCollapse.addEventListener('click', () => {
            this.toggleControlPanel();
        });
    }
    
    setupGlobalControls() {
        // Enhanced pause/resume button
        const pauseBtn = document.getElementById('pause-resume');
        const missionStatus = document.getElementById('mission-status');
        const currentSpeed = document.getElementById('current-speed');
        
        pauseBtn.addEventListener('click', () => {
            const isRunning = this.solarSystem.togglePause();
            
            // Update button
            const btnIcon = pauseBtn.querySelector('.btn-icon');
            const btnText = pauseBtn.querySelector('.btn-text');
            
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
        });
        
        // Enhanced global speed control
        const globalSpeedSlider = document.getElementById('global-speed');
        const globalSpeedValue = document.getElementById('global-speed-value');
        
        globalSpeedSlider.addEventListener('input', (e) => {
            const speed = parseFloat(e.target.value);
            this.solarSystem.setGlobalSpeed(speed);
            globalSpeedValue.textContent = speed.toFixed(1) + 'x';
            currentSpeed.textContent = speed.toFixed(1) + 'x';
            
            // Update slider track fill
            this.updateSliderTrack(globalSpeedSlider);
        });
        
        // Initialize slider track
        this.updateSliderTrack(globalSpeedSlider);
    }
    
    setupPlanetControls() {
        const controlsContainer = document.getElementById('planet-controls');
        
        Object.keys(PLANET_DATA).forEach((key, index) => {
            if (key === 'sun') return;
            
            const planetData = PLANET_DATA[key];
            const controlElement = this.createEnhancedPlanetControl(key, planetData);
            controlsContainer.appendChild(controlElement);
            
            // Add staggered entrance animation
            setTimeout(() => {
                controlElement.classList.add('animate-fadeInUp');
            }, index * 100);
        });
    }
    
    createEnhancedPlanetControl(planetKey, planetData) {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'planet-control';
        controlDiv.style.opacity = '0';
        
        const planetType = this.getPlanetType(planetKey);
        const planetEmoji = this.getPlanetEmoji(planetKey);
        
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
        
        // Add enhanced event listeners
        const slider = controlDiv.querySelector(`#${planetKey}-speed`);
        const valueDisplay = controlDiv.querySelector(`#${planetKey}-speed-value`);
        
        slider.addEventListener('input', (e) => {
            const speed = parseFloat(e.target.value);
            this.solarSystem.setPlanetSpeed(planetKey, speed);
            valueDisplay.textContent = speed.toFixed(1) + 'x';
            this.updateSliderTrack(slider);
            
            // Add haptic feedback on mobile
            if (navigator.vibrate && speed > 0) {
                navigator.vibrate(10);
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
        const percentage = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
        const track = slider.parentElement.querySelector('.slider-track');
        if (track) {
            track.style.background = `linear-gradient(90deg, var(--cosmic-gold) 0%, var(--cosmic-pink) ${percentage}%, rgba(255,255,255,0.1) ${percentage}%)`;
        }
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
        // Enhanced reset camera button
        const resetCameraBtn = document.getElementById('reset-camera');
        resetCameraBtn.addEventListener('click', () => {
            this.solarSystem.resetCamera();
            
            // Add visual feedback
            resetCameraBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                resetCameraBtn.style.transform = '';
            }, 150);
            
            this.showNotification('🎯 Camera view reset', 'success', 2000);
        });
        
        // Enhanced camera speed control
        const cameraSpeedSlider = document.getElementById('camera-speed');
        cameraSpeedSlider.addEventListener('input', (e) => {
            const speed = parseFloat(e.target.value);
            if (this.solarSystem.controls) {
                this.solarSystem.controls.rotateSpeed = speed;
                this.solarSystem.controls.panSpeed = speed;
                this.solarSystem.controls.zoomSpeed = speed;
            }
            this.updateSliderTrack(cameraSpeedSlider);
        });
        
        // Initialize camera slider track
        this.updateSliderTrack(cameraSpeedSlider);
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
        const controlPanel = document.querySelector('.control-panel');
        const collapseIcon = document.querySelector('.collapse-icon');
        
        this.isControlPanelCollapsed = !this.isControlPanelCollapsed;
        
        if (this.isControlPanelCollapsed) {
            if (window.innerWidth <= 768) {
                controlPanel.classList.add('collapsed');
            } else {
                controlPanel.style.transform = 'translateX(calc(100% - 60px))';
            }
            collapseIcon.textContent = '⋮';
        } else {
            controlPanel.classList.remove('collapsed');
            controlPanel.style.transform = 'translateX(0)';
            collapseIcon.textContent = '⋯';
        }
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
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    document.getElementById('pause-resume').click();
                    break;
                case 'KeyR':
                    e.preventDefault();
                    document.getElementById('reset-camera').click();
                    break;
                case 'KeyT':
                    e.preventDefault();
                    document.getElementById('theme-toggle').click();
                    break;
                case 'KeyH':
                    e.preventDefault();
                    this.toggleControlPanel();
                    break;
            }
        });
        
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
    
    toggleControlPanel() {
        const controlPanel = document.querySelector('.control-panel');
        this.isControlPanelCollapsed = !this.isControlPanelCollapsed;
        
        if (this.isControlPanelCollapsed) {
            controlPanel.style.transform = 'translateX(100%)';
        } else {
            controlPanel.style.transform = 'translateX(0)';
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
    
    hideLoading() {
        const loading = document.getElementById('loading');
        setTimeout(() => {
            loading.classList.add('hidden');
            setTimeout(() => {
                loading.style.display = 'none';
            }, 500);
        }, 1000);
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
    
    destroy() {
        // Save preferences before destroying
        this.savePreferences();
        
        // Cancel animation frame
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeydown);
    }
    
    updatePlanetInfo(planetName, newInfo) {
        // This could be used to dynamically update planet information
        const planet = this.solarSystem.planets.get(planetName.toLowerCase());
        if (planet) {
            planet.mesh.userData.data.info = { ...planet.mesh.userData.data.info, ...newInfo };
        }
    }
    
    // Method to export current state
    exportState() {
        const state = {
            globalSpeed: this.solarSystem.globalSpeed,
            planetSpeeds: Object.fromEntries(this.solarSystem.planetSpeeds),
            theme: this.isDarkTheme ? 'dark' : 'light',
            cameraPosition: this.solarSystem.camera.position.toArray(),
            cameraTarget: this.solarSystem.controls.target.toArray()
        };
        
        return JSON.stringify(state, null, 2);
    }
    
    // Method to import state
    importState(stateJson) {
        try {
            const state = JSON.parse(stateJson);
            
            // Apply global speed
            if (state.globalSpeed !== undefined) {
                this.solarSystem.setGlobalSpeed(state.globalSpeed);
                document.getElementById('global-speed').value = state.globalSpeed;
                document.getElementById('global-speed-value').textContent = state.globalSpeed.toFixed(1) + 'x';
            }
            
            // Apply planet speeds
            if (state.planetSpeeds) {
                Object.entries(state.planetSpeeds).forEach(([planet, speed]) => {
                    this.solarSystem.setPlanetSpeed(planet, speed);
                    const slider = document.getElementById(`${planet}-speed`);
                    const valueDisplay = document.getElementById(`${planet}-speed-value`);
                    if (slider && valueDisplay) {
                        slider.value = speed;
                        valueDisplay.textContent = speed.toFixed(1) + 'x';
                    }
                });
            }
            
            // Apply theme
            if (state.theme && state.theme !== (this.isDarkTheme ? 'dark' : 'light')) {
                this.toggleTheme();
            }
            
            // Apply camera position
            if (state.cameraPosition && state.cameraTarget) {
                this.solarSystem.camera.position.fromArray(state.cameraPosition);
                this.solarSystem.controls.target.fromArray(state.cameraTarget);
                this.solarSystem.controls.update();
            }
            
            this.showNotification('State imported successfully!', 'success');
        } catch (error) {
            this.showNotification('Error importing state: ' + error.message, 'error');
        }
    }
    
    destroy() {
        // Save preferences before destroying
        this.savePreferences();
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeydown);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIController;
}