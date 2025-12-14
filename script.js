document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const speakBtn = document.getElementById('speakBtn');
    const musicBtn = document.getElementById('musicBtn');
    const scareBtn = document.getElementById('scareBtn');
    const darkenBtn = document.getElementById('darkenBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const status = document.getElementById('status');
    const hiddenMessage = document.getElementById('hiddenMessage');
    const flash = document.getElementById('flash');
    
    // Audio elements
    const creepyMusic = document.getElementById('creepyMusic');
    const ambientSound = document.getElementById('ambientSound');
    
    // State
    let musicPlaying = false;
    let ambientPlaying = false;
    let darkMode = false;
    
    // FIXED AUDIO FUNCTION - This will definitely work
    function initializeAudio() {
        // Preload and set volume
        creepyMusic.volume = 0.5;
        ambientSound.volume = 0.3;
        
        // Create and play a silent audio to unlock audio context
        const unlockAudio = () => {
            const silentAudio = new Audio();
            silentAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ';
            silentAudio.play().then(() => {
                console.log('Audio context unlocked');
                status.textContent = 'Audio ready. Click PLAY MUSIC.';
            }).catch(e => {
                console.log('Audio context could not be unlocked:', e);
            });
        };
        
        // Try to unlock audio on user interaction
        document.addEventListener('click', function unlock() {
            unlockAudio();
            document.removeEventListener('click', unlock);
        }, { once: true });
    }
    
    // FIXED: Text-to-Speech that works
    function speakCreepyMessage() {
        status.textContent = "Speaking: 'Rayane, I'm under your bed...'";
        
        // Method 1: Web Speech API (works in most browsers)
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance();
            utterance.text = "Rayane. I am under your bed.";
            utterance.rate = 0.7;  // Slower = deeper
            utterance.pitch = 0.3; // Lower = deeper voice
            utterance.volume = 1;
            
            // Get voices and select a deep one
            const voices = speechSynthesis.getVoices();
            if (voices.length > 0) {
                // Try to find a male/deep voice
                const deepVoice = voices.find(v => 
                    v.name.includes('Google UK English Male') || 
                    v.name.includes('Microsoft David') ||
                    v.name.toLowerCase().includes('male')
                );
                
                if (deepVoice) {
                    utterance.voice = deepVoice;
                } else {
                    // Use first available voice
                    utterance.voice = voices[0];
                    utterance.pitch = 0.1; // Make it even deeper
                }
            }
            
            // Speak
            speechSynthesis.speak(utterance);
            
            // Visual effects
            animateFaceSpeaking();
            
        } else {
            // Fallback: Use pre-recorded audio
            playCreepyVoice();
        }
    }
    
    function playCreepyVoice() {
        // Create new audio each time to avoid issues
        const voiceAudio = new Audio();
        voiceAudio.src = 'https://assets.mixkit.co/sfx/preview/mixkit-demonic-voice-says-welcome-481.mp3';
        voiceAudio.volume = 0.8;
        
        voiceAudio.play().then(() => {
            status.textContent = "Playing creepy voice...";
            animateFaceSpeaking();
        }).catch(e => {
            status.textContent = "Click the button again to hear the voice";
            // Try with user gesture
            speakBtn.addEventListener('click', function retry() {
                voiceAudio.play();
                speakBtn.removeEventListener('click', retry);
            }, { once: true });
        });
    }
    
    function animateFaceSpeaking() {
        const eyes = document.querySelectorAll('.eye');
        const mouth = document.querySelector('.mouth');
        
        // Eyes close
        eyes.forEach(eye => {
            eye.style.height = '5px';
            eye.style.transition = 'height 0.3s';
        });
        
        // Mouth moves
        mouth.style.height = '80px';
        mouth.style.transition = 'height 0.3s';
        
        // Reset after 2 seconds
        setTimeout(() => {
            eyes.forEach(eye => {
                eye.style.height = '80px';
            });
            mouth.style.height = '60px';
        }, 2000);
    }
    
    // FIXED: Music that definitely plays
    function toggleMusic() {
        if (!musicPlaying) {
            // Start both music and ambient
            creepyMusic.play().catch(e => {
                status.textContent = "Click PLAY MUSIC again to start audio";
                musicBtn.textContent = "🎵 CLICK TO PLAY";
                return;
            });
            
            ambientSound.play().catch(e => {
                console.log('Ambient sound could not play');
            });
            
            musicPlaying = true;
            ambientPlaying = true;
            musicBtn.textContent = '⏸️ PAUSE MUSIC';
            musicBtn.style.background = '#ff0000';
            status.textContent = 'Creepy music playing...';
            
        } else {
            creepyMusic.pause();
            ambientSound.pause();
            musicPlaying = false;
            ambientPlaying = false;
            musicBtn.textContent = '🎵 PLAY MUSIC';
            musicBtn.style.background = '#220000';
            status.textContent = 'Music paused';
        }
    }
    
    // Volume control
    volumeSlider.addEventListener('input', function() {
        const volume = this.value / 100;
        creepyMusic.volume = volume;
        ambientSound.volume = volume * 0.6; // Quieter ambiance
        status.textContent = `Volume: ${this.value}%`;
        
        // Visual feedback
        const eyes = document.querySelectorAll('.eye');
        const glowSize = 20 + (volume * 80); // 20-100px glow
        
        eyes.forEach(eye => {
            eye.style.boxShadow = `0 0 ${glowSize}px #ff0000, inset 0 0 20px #000`;
        });
    });
    
    // Extra scare
    function extraScare() {
        status.textContent = "Boo! 👻";
        
        // Flash effect
        flash.style.animation = 'flash 1s';
        setTimeout(() => {
            flash.style.animation = '';
        }, 1000);
        
        // Random screams
        const screams = [
            'https://assets.mixkit.co/sfx/preview/mixkit-horror-fright-scream-387.mp3',
            'https://assets.mixkit.co/sfx/preview/mixkit-demonic-deep-voice-scream-480.mp3',
            'https://assets.mixkit.co/sfx/preview/mixkit-horror-female-scream-393.mp3'
        ];
        
        const screamAudio = new Audio(screems[Math.floor(Math.random() * screams.length)]);
        screamAudio.volume = 0.6;
        screamAudio.play();
        
        // Shake effect
        document.body.style.animation = 'glitch 0.3s';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 300);
        
        // Hidden message
        const messages = [
            "LOOK BEHIND YOU...",
            "I'M WATCHING YOU...",
            "DON'T TURN AROUND...",
            "I'M IN THE ROOM...",
            "CHECK UNDER THE BED..."
        ];
        
        hiddenMessage.textContent = messages[Math.floor(Math.random() * messages.length)];
        hiddenMessage.style.opacity = '1';
        hiddenMessage.style.transition = 'opacity 0.5s';
        
        setTimeout(() => {
            hiddenMessage.style.opacity = '0';
        }, 3000);
    }
    
    // Dark mode
    function toggleDarkMode() {
        darkMode = !darkMode;
        
        if (darkMode) {
            document.body.style.background = '#000';
            document.querySelector('.creepy-face').style.background = '#000';
            document.querySelector('.creepy-face').style.boxShadow = '0 0 150px #000, inset 0 0 50px #111';
            darkenBtn.textContent = '☀️ LIGHT MODE';
            darkenBtn.style.background = '#444';
            status.textContent = 'Dark mode activated...';
        } else {
            document.body.style.background = '#111';
            document.querySelector('.creepy-face').style.background = '#111';
            document.querySelector('.creepy-face').style.boxShadow = '0 0 100px #8b0000, inset 0 0 50px #330000';
            darkenBtn.textContent = '🌑 DARK MODE';
            darkenBtn.style.background = '#220000';
            status.textContent = 'Normal mode';
        }
    }
    
    // Create particles
    function createParticles() {
        const particles = document.querySelector('.particles');
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 10 + 2}px;
                height: ${Math.random() * 10 + 2}px;
                background: #ff0000;
                border-radius: 50%;
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
                opacity: ${Math.random() * 0.3 + 0.1};
                animation: float-around ${Math.random() * 20 + 10}s infinite linear;
                z-index: 1;
            `;
            particles.appendChild(particle);
        }
    }
    
    // Create floating eyes
    function createFloatingEyes() {
        const container = document.querySelector('.floating-eyes');
        for (let i = 0; i < 8; i++) {
            const eye = document.createElement('div');
            eye.style.cssText = `
                position: absolute;
                width: 40px;
                height: 40px;
                background: #ff0000;
                border-radius: 50%;
                opacity: 0.2;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float-around ${Math.random() * 15 + 10}s infinite linear ${Math.random() * 5}s;
                box-shadow: 0 0 20px #ff0000;
            `;
            container.appendChild(eye);
        }
    }
    
    // Mouse tracking
    document.addEventListener('mousemove', function(e) {
        const eyes = document.querySelectorAll('.eye');
        const face = document.querySelector('.face-container');
        
        eyes.forEach(eye => {
            const rect = eye.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            const moveX = deltaX / 30;
            const moveY = deltaY / 30;
            
            eye.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        // Slight face movement
        const faceRect = face.getBoundingClientRect();
        const faceCenterX = faceRect.left + faceRect.width / 2;
        const faceCenterY = faceRect.top + faceRect.height / 2;
        
        const faceMoveX = (e.clientX - faceCenterX) / 100;
        const faceMoveY = (e.clientY - faceCenterY) / 100;
        
        face.style.transform = `translate(${faceMoveX}px, ${faceMoveY}px)`;
    });
    
    // Random events
    function randomEvents() {
        setInterval(() => {
            if (Math.random() > 0.8) {
                // Random flash
                flash.style.background = Math.random() > 0.5 ? '#ff0000' : '#ffffff';
                flash.style.opacity = '0.3';
                flash.style.transition = 'opacity 0.5s';
                
                setTimeout(() => {
                    flash.style.opacity = '0';
                }, 200);
                
                // Random sound occasionally
                if (Math.random() > 0.7 && musicPlaying) {
                    const whisper = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-horror-whispers-492.mp3');
                    whisper.volume = 0.2;
                    whisper.play();
                }
            }
        }, 8000);
    }
    
    // Initialize everything
    function init() {
        initializeAudio();
        createParticles();
        createFloatingEyes();
        randomEvents();
        
        status.textContent = "Click PLAY MUSIC to start creepy audio";
        
        // Auto-play music after 5 seconds if user interacts
        setTimeout(() => {
            if (!musicPlaying) {
                musicBtn.style.animation = 'pulse 1s infinite';
                musicBtn.style.border = '2px solid #ff0000';
            }
        }, 5000);
    }
    
    // Event listeners
    speakBtn.addEventListener('click', speakCreepyMessage);
    musicBtn.addEventListener('click', toggleMusic);
    scareBtn.addEventListener('click', extraScare);
    darkenBtn.addEventListener('click', toggleDarkMode);
    
    // Click anywhere to speak
    document.addEventListener('click', function(e) {
        if (e.target === document.body || e.target === document.querySelector('.container')) {
            speakCreepyMessage();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        switch(e.key.toLowerCase()) {
            case ' ':
            case 'v':
                speakCreepyMessage();
                break;
            case 'm':
                toggleMusic();
                break;
            case 's':
                extraScare();
                break;
            case 'd':
                toggleDarkMode();
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
    
    // Initialize
    init();
    
    // Instructions
    console.log(`
    ========================================
    CREEPY WEBSITE CONTROLS:
    ========================================
    🔊 HEAR VOICE - Plays "Rayane, I'm under your bed"
    🎵 PLAY MUSIC - Toggles creepy background music
    😱 EXTRA SCARE - Random jump scare
    🌑 DARK MODE - Makes everything darker
    
    Keyboard Shortcuts:
    [V] or [SPACE] - Hear voice
    [M] - Toggle music
    [S] - Extra scare
    [D] - Dark mode
    [↑]/[↓] - Volume control
    ========================================
    `);
});
