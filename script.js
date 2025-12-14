document.addEventListener('DOMContentLoaded', function() {
    console.log("🔥 SCREAMING TOM GAME LOADED - WITH REAL WOMAN SCREAMS! 🔥");
    
    // Game state
    const gameState = {
        taps: 0,
        screamLevel: 1,
        fearLevel: 0,
        totalScreams: 0,
        loudestScream: 0,
        screamCombo: 0,
        totalScreamIntensity: 0,
        isScreaming: false,
        currentVolume: 0.3,
        lastScreamType: ""
    };

    // SCREAM SOUNDS - REAL WOMAN SCREAMS
    const screamSounds = {
        woman1: document.getElementById('scream1'),
        woman2: document.getElementById('scream2'),
        woman3: document.getElementById('scream3'),
        whisper: document.getElementById('whisper1'),
        bed: document.getElementById('bedVoice'),
        terror: document.getElementById('terrorScream')
    };

    // SCREAM PHRASES (displayed in bubble)
    const screamPhrases = {
        woman1: ["RAYANE!", "I'M HERE!", "LOOK AT ME!", "AAAAHHHH!"],
        woman2: ["NO! NO!", "GET AWAY!", "HELP ME!", "SCREEEECH!"],
        woman3: ["UNDER THE BED!", "I CAN SEE YOU!", "DON'T SLEEP!", "WAKE UP!"],
        whisper: ["pssst... rayane...", "i'm under here...", "come closer...", "shhh..."],
        bed: ["*bed creaks*", "under your bed...", "right below you...", "*scratching*"],
        terror: ["AAAAAAAAHHHH!!!", "TERROR!", "NIGHTMARE!", "HORROR!"]
    };

    // DOM Elements
    const screamingTom = document.getElementById('screamingTom');
    const tapCountEl = document.getElementById('tapCount');
    const screamLevelEl = document.getElementById('screamLevel');
    const fearLevelEl = document.getElementById('fearLevel');
    const totalScreamsEl = document.getElementById('totalScreams');
    const loudestScreamEl = document.getElementById('loudestScream');
    const screamComboEl = document.getElementById('screamCombo');
    const avgScreamEl = document.getElementById('avgScream');
    const screamBubble = document.getElementById('screamBubble');
    const screamText = document.getElementById('screamText');
    const messageText = document.getElementById('messageText');
    const lastScreamEl = document.getElementById('lastScream');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');
    const meterFill = document.getElementById('meterFill');
    const screenFlash = document.getElementById('screenFlash');
    const backgroundAmbiance = document.getElementById('backgroundAmbiance');
    const heartbeat = document.getElementById('heartbeat');

    // Initialize all sounds
    function initializeSounds() {
        // Set initial volumes
        Object.values(screamSounds).forEach(sound => {
            sound.volume = gameState.currentVolume;
        });
        
        backgroundAmbiance.volume = 0.2;
        heartbeat.volume = 0;
        
        // Start ambiance
        backgroundAmbiance.play().catch(e => {
            console.log("Ambiance autoplay blocked - will play on first interaction");
        });
        
        // Create audio unlocker
        const unlockAudio = () => {
            const silentAudio = new Audio();
            silentAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ';
            silentAudio.volume = 0.001;
            silentAudio.play().then(() => {
                console.log("Audio context unlocked!");
                showMessage("Audio ready! Tap the screaming face!");
            }).catch(console.error);
        };
        
        // Unlock on first click
        document.addEventListener('click', function unlock() {
            unlockAudio();
            document.removeEventListener('click', unlock);
        }, { once: true });
    }

    // Play a SCREAM
    function playScream(type = 'woman1', intensity = 1) {
        if (gameState.isScreaming) return;
        
        gameState.isScreaming = true;
        gameState.totalScreams++;
        gameState.totalScreamIntensity += intensity;
        
        // Update scream combo
        gameState.screamCombo++;
        if (intensity > gameState.loudestScream) {
            gameState.loudestScream = intensity;
        }
        
        // Update display
        updateStats();
        
        // Get random phrase for this scream type
        const phrases = screamPhrases[type];
        const phrase = phrases[Math.floor(Math.random() * phrases.length)];
        
        // Show in bubble
        showScreamBubble(phrase);
        lastScreamEl.textContent = phrase;
        gameState.lastScreamType = type;
        
        // Play the scream sound
        const screamSound = screamSounds[type];
        if (screamSound) {
            screamSound.currentTime = 0;
            screamSound.volume = gameState.currentVolume * intensity;
            screamSound.play().catch(e => {
                console.log("Scream blocked - user needs to interact");
                showMessage("Click the SCREAM NOW button to play sound!");
            });
        }
        
        // Visual effects based on intensity
        triggerScreamEffects(intensity);
        
        // Increase fear level
        gameState.fearLevel = Math.min(100, gameState.fearLevel + (intensity * 5));
        
        // Update scream level (every 3 screams)
        if (gameState.totalScreams % 3 === 0 && gameState.screamLevel < 10) {
            gameState.screamLevel++;
            showMessage(`SCREAM LEVEL UP! Now at level ${gameState.screamLevel}`);
            increaseHeartbeat();
        }
        
        // Reset screaming flag after sound completes
        setTimeout(() => {
            gameState.isScreaming = false;
        }, 2000);
        
        return intensity;
    }

    // Trigger visual effects for scream
    function triggerScreamEffects(intensity) {
        // Screen flash
        const flashIntensity = Math.min(0.8, intensity * 0.3);
        screenFlash.style.opacity = flashIntensity;
        setTimeout(() => {
            screenFlash.style.opacity = 0;
        }, 100);
        
        // Character animation
        screamingTom.style.animation = 'shake-hard 0.3s';
        setTimeout(() => {
            screamingTom.style.animation = '';
        }, 300);
        
        // Mouth animation
        const mouth = document.querySelector('.screaming-mouth');
        mouth.style.height = `${70 + (intensity * 30)}px`;
        setTimeout(() => {
            mouth.style.height = '70px';
        }, 500);
        
        // Eyes animation
        const eyes = document.querySelectorAll('.eye');
        eyes.forEach(eye => {
            eye.style.height = '10px';
            setTimeout(() => {
                eye.style.height = '90px';
            }, 200);
        });
        
        // Update intensity meter
        const meterPercent = Math.min(100, intensity * 25);
        meterFill.style.width = `${meterPercent}%`;
        
        // Create scream particles
        createScreamParticles(intensity);
    }

    // Create visual scream particles
    function createScreamParticles(intensity) {
        const container = document.querySelector('.scream-particles');
        const particleCount = Math.min(50, intensity * 20);
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: ${Math.random() * 20 + 5}px;
                height: ${Math.random() * 20 + 5}px;
                background: ${Math.random() > 0.5 ? '#ff0000' : '#ff6b6b'};
                border-radius: 50%;
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
                opacity: ${Math.random() * 0.5 + 0.3};
                animation: scream-particle ${Math.random() * 2 + 1}s forwards;
                z-index: 100;
                pointer-events: none;
            `;
            
            // Add keyframes for particle animation
            const keyframes = `
                @keyframes scream-particle {
                    0% {
                        transform: translate(0, 0) scale(1);
                        opacity: 0.8;
                    }
                    100% {
                        transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(0);
                        opacity: 0;
                    }
                }
            `;
            
            // Add styles if not already added
            if (!document.getElementById('particle-styles')) {
                const style = document.createElement('style');
                style.id = 'particle-styles';
                style.textContent = keyframes;
                document.head.appendChild(style);
            }
            
            container.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 2000);
        }
    }

    // Show scream bubble
    function showScreamBubble(text) {
        screamText.textContent = text;
        screamBubble.style.opacity = '1';
        
        // Hide after 2 seconds
        setTimeout(() => {
            screamBubble.style.opacity = '0';
        }, 2000);
    }

    // Update all stats
    function updateStats() {
        tapCountEl.textContent = gameState.taps;
        screamLevelEl.textContent = gameState.screamLevel;
        fearLevelEl.textContent = `${gameState.fearLevel}%`;
        totalScreamsEl.textContent = gameState.totalScreams;
        loudestScreamEl.textContent = gameState.loudestScream.toFixed(1);
        screamComboEl.textContent = gameState.screamCombo;
        
        const avg = gameState.totalScreams > 0 ? 
            (gameState.totalScreamIntensity / gameState.totalScreams).toFixed(1) : 0;
        avgScreamEl.textContent = avg;
    }

    // Show message
    function showMessage(text) {
        messageText.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${text}`;
    }

    // Increase heartbeat sound
    function increaseHeartbeat() {
        if (heartbeat.volume < 0.5) {
            heartbeat.volume += 0.1;
            if (heartbeat.paused) {
                heartbeat.play();
            }
        }
    }

    // Decrease heartbeat
    function decreaseHeartbeat() {
        if (heartbeat.volume > 0) {
            heartbeat.volume = Math.max(0, heartbeat.volume - 0.1);
            if (heartbeat.volume === 0) {
                heartbeat.pause();
            }
        }
    }

    // Event Listeners

    // Tap the screaming face
    screamingTom.addEventListener('click', function(e) {
        e.stopPropagation();
        gameState.taps++;
        
        // Play scream with random intensity
        const intensity = 1 + (Math.random() * gameState.screamLevel * 0.3);
        playScream('woman1', intensity);
        
        showMessage(`Scream intensity: ${intensity.toFixed(1)}x`);
    });

    // SCREAM NOW button
    document.getElementById('screamBtn').addEventListener('click', function() {
        const intensity = 1 + (Math.random() * gameState.screamLevel * 0.4);
        playScream('woman1', intensity);
        showMessage(`LOUD WOMAN SCREAM! Intensity: ${intensity.toFixed(1)}x`);
    });

    // Whisper button
    document.getElementById('whisperBtn').addEventListener('click', function() {
        playScream('whisper', 0.5);
        showMessage("Creepy whisper... shhh...");
        decreaseHeartbeat();
    });

    // Under Bed button
    document.getElementById('bedBtn').addEventListener('click', function() {
        playScream('bed', 0.7);
        showMessage("*creaking sounds from under the bed*");
    });

    // Max Terror button
    document.getElementById('terrorBtn').addEventListener('click', function() {
        const intensity = 2 + (Math.random() * gameState.screamLevel * 0.5);
        playScream('terror', intensity);
        showMessage(`MAX TERROR! Intensity: ${intensity.toFixed(1)}x`);
        increaseHeartbeat();
    });

    // Scream library buttons
    document.querySelectorAll('.scream-option').forEach(button => {
        button.addEventListener('click', function() {
            const screamType = this.getAttribute('data-scream');
            const intensity = screamType === 'terror' ? 1.8 : 
                             screamType === 'woman2' ? 1.3 : 1;
            
            playScream(screamType, intensity);
            showMessage(`Playing: ${this.textContent}`);
        });
    });

    // Volume slider
    volumeSlider.addEventListener('input', function() {
        const volume = this.value / 100;
        gameState.currentVolume = volume;
        volumeValue.textContent = `${this.value}%`;
        
        // Update all scream volumes
        Object.values(screamSounds).forEach(sound => {
            sound.volume = volume;
        });
        
        // Update background ambiance
        backgroundAmbiance.volume = volume * 0.3;
        
        // Visual feedback
        const eyes = document.querySelectorAll('.eye');
        const glowSize = 30 + (volume * 70);
        
        eyes.forEach(eye => {
            eye.style.boxShadow = `
                inset 0 0 30px #000,
                0 0 ${20 + volume * 40}px #ff0000,
                0 0 ${40 + volume * 60}px #ff0000
            `;
        });
    });

    // Random auto-screams (for extra creepiness)
    function startRandomScreams() {
        setInterval(() => {
            if (Math.random() < 0.1 && !gameState.isScreaming) { // 10% chance
                const types = ['whisper', 'bed', 'woman1'];
                const type = types[Math.floor(Math.random() * types.length)];
                const intensity = type === 'whisper' ? 0.3 : 0.6;
                
                playScream(type, intensity);
                showMessage("Random scream... he's watching...");
            }
        }, 10000); // Every 10 seconds
    }

    // Initialize game
    function initGame() {
        initializeSounds();
        updateStats();
        startRandomScreams();
        showMessage("Tap the SCREAMING FACE to hear woman screams!");
        
        // Create blood effect particles
        createBloodEffect();
        
        console.log(`
        ============================================
        SCREAMING TOM GAME - READY!
        ============================================
        Features:
        • REAL WOMAN SCREAMS (not text-to-speech)
        • Intensity meter
        • Scream statistics
        • Volume control
        • Random auto-screams
        • Fear level tracking
        • Visual scream effects
        ============================================
        `);
    }

    // Create blood effect in background
    function createBloodEffect() {
        const container = document.querySelector('.blood-effect');
        for (let i = 0; i < 20; i++) {
            const blood = document.createElement('div');
            blood.style.cssText = `
                position: absolute;
                width: ${Math.random() * 100 + 50}px;
                height: ${Math.random() * 100 + 50}px;
                background: radial-gradient(circle, rgba(139,0,0,0.3) 0%, transparent 70%);
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.2 + 0.1};
                pointer-events: none;
                z-index: 0;
            `;
            container.appendChild(blood);
        }
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        switch(e.key.toLowerCase()) {
            case ' ':
            case 's':
                const intensity = 1 + (Math.random() * gameState.screamLevel * 0.3);
                playScream('woman1', intensity);
                break;
            case 'w':
                playScream('whisper', 0.5);
                break;
            case 'b':
                playScream('bed', 0.7);
                break;
            case 't':
                playScream('terror', 1.8);
                break;
            case 'arrowup':
                volumeSlider.value = Math.min(100, parseInt(volumeSlider.value) + 10);
                volumeSlider.dispatchEvent(new Event('input'));
                break;
            case 'arrowdown':
                volumeSlider.value = Math.max(0, parseInt(volumeSlider.value) - 10);
                volumeSlider.dispatchEvent(new Event('input'));
                break;
        }
    });

    // Initialize the game
    initGame();
});
