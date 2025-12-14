document.addEventListener('DOMContentLoaded', function() {
    // Game state
    const gameState = {
        taps: 0,
        creepLevel: 1,
        isScareMode: false,
        isRecording: false,
        startTime: Date.now(),
        lastPhrase: "Rayane, I'm under your bed"
    };

    // DOM Elements
    const creepyTom = document.getElementById('creepyTom');
    const tapCountEl = document.getElementById('tapCount');
    const creepLevelEl = document.getElementById('creepLevel');
    const timerEl = document.getElementById('timer');
    const thoughtBubble = document.getElementById('thoughtBubble');
    const bubbleText = document.getElementById('bubbleText');
    const messageText = document.getElementById('messageText');
    const recordingIndicator = document.getElementById('recordingIndicator');
    const flash = document.getElementById('flash');

    // Audio elements
    const creepyVoice = document.getElementById('creepyVoice');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const tapSound = document.getElementById('tapSound');
    const scareSound = document.getElementById('scareSound');

    // Phrases database
    const creepyPhrases = [
        "Rayane, I'm under your bed",
        "I can see you sleeping",
        "Don't look under the bed",
        "I'm right behind you",
        "Your bed is my home now",
        "Shhh... go back to sleep",
        "I watch you every night",
        "We're closer than you think",
        "Your shadow isn't yours",
        "I'm in your closet too"
    ];

    // Initialize game
    function initGame() {
        // Start timer
        updateTimer();
        setInterval(updateTimer, 1000);
        
        // Start background music (quiet)
        backgroundMusic.volume = 0.2;
        backgroundMusic.play().catch(e => {
            console.log('Music autoplay blocked. User needs to interact first.');
        });
        
        // Create floating eyes
        createFloatingEyes();
        
        // Update initial message
        updateMessage("Tap the cat to start!");
    }

    // Update timer display
    function updateTimer() {
        const elapsed = Date.now() - gameState.startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Tap handler - MAIN GAME MECHANIC
    creepyTom.addEventListener('click', function(e) {
        e.stopPropagation();
        handleTap();
    });

    // Button tap handler
    document.getElementById('tapBtn').addEventListener('click', handleTap);

    function handleTap() {
        // Increment taps
        gameState.taps++;
        tapCountEl.textContent = gameState.taps;
        
        // Increase creep level every 5 taps
        if (gameState.taps % 5 === 0 && gameState.creepLevel < 10) {
            gameState.creepLevel++;
            creepLevelEl.textContent = gameState.creepLevel;
            updateCreepyAppearance();
        }
        
        // Play tap sound
        playTapSound();
        
        // Animate character
        animateTap();
        
        // Make Tom say something creepy
        const phrase = getRandomCreepyPhrase();
        gameState.lastPhrase = phrase;
        speakCreepyPhrase(phrase);
        
        // Show in thought bubble
        showThoughtBubble(phrase);
        
        // Update message
        updateMessage(`He said: "${phrase}"`);
        
        // Random scare effect occasionally
        if (Math.random() < 0.2) {
            randomScareEffect();
        }
    }

    // Voice recording handler
    document.getElementById('voiceBtn').addEventListener('click', function() {
        if (!gameState.isRecording) {
            startVoiceRecording();
        } else {
            stopVoiceRecording();
        }
    });

    // Scare mode handler
    document.getElementById('scareBtn').addEventListener('click', function() {
        gameState.isScareMode = !gameState.isScareMode;
        const btn = document.getElementById('scareBtn');
        
        if (gameState.isScareMode) {
            btn.innerHTML = '<i class="fas fa-skull"></i> NORMAL MODE';
            btn.style.background = 'linear-gradient(45deg, #ff0000, #ff6b6b)';
            updateMessage("SCARE MODE ACTIVATED! Things just got creepier...");
            scareSound.play();
            flashScreen();
        } else {
            btn.innerHTML = '<i class="fas fa-ghost"></i> SCARE MODE';
            btn.style.background = 'linear-gradient(45deg, #330000, #8b0000)';
            updateMessage("Back to normal... for now.");
        }
        
        updateCreepyAppearance();
    });

    // Reset handler
    document.getElementById('resetBtn').addEventListener('click', function() {
        if (confirm("Reset the game? This will clear all taps and creep level.")) {
            gameState.taps = 0;
            gameState.creepLevel = 1;
            gameState.isScareMode = false;
            
            tapCountEl.textContent = '0';
            creepLevelEl.textContent = '1';
            
            document.getElementById('scareBtn').innerHTML = '<i class="fas fa-ghost"></i> SCARE MODE';
            document.getElementById('scareBtn').style.background = 'linear-gradient(45deg, #330000, #8b0000)';
            
            updateCreepyAppearance();
            updateMessage("Game reset. Start tapping again!");
            showThoughtBubble("I'm back...");
        }
    });

    // Item click handlers
    document.getElementById('bedItem').addEventListener('click', function() {
        speakCreepyPhrase("*creaking bed sounds* I'm right under here...");
        updateMessage("You checked under the bed. Bad idea.");
    });

    document.getElementById('knifeItem').addEventListener('click', function() {
        const phrase = "I have something sharp for you...";
        speakCreepyPhrase(phrase);
        updateMessage("That sounded sharp and pointy!");
        playScareSound();
    });

    document.getElementById('musicItem').addEventListener('click', function() {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            updateMessage("Creepy music playing...");
        } else {
            backgroundMusic.pause();
            updateMessage("Music stopped. Too quiet now...");
        }
    });

    document.getElementById('lightItem').addEventListener('click', function() {
        document.body.classList.toggle('lights-off');
        if (document.body.classList.contains('lights-off')) {
            updateMessage("Lights off! Can you see him?");
            flashScreen(0.1);
        } else {
            updateMessage("Lights on. But he's still there...");
        }
    });

    // Speak creepy phrase
    function speakCreepyPhrase(phrase) {
        // Use Text-to-Speech API
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(phrase);
            
            // Make voice creepy based on creep level
            utterance.rate = 0.7 + (gameState.creepLevel * 0.03);
            utterance.pitch = 0.5 - (gameState.creepLevel * 0.05);
            utterance.volume = 0.8;
            
            // Get available voices
            const voices = speechSynthesis.getVoices();
            if (voices.length > 0) {
                // Prefer male/deep voices
                const deepVoice = voices.find(v => 
                    v.name.includes('Google UK English Male') || 
                    v.name.includes('Microsoft David') ||
                    v.name.toLowerCase().includes('male')
                );
                
                if (deepVoice) {
                    utterance.voice = deepVoice;
                }
            }
            
            // Speak
            speechSynthesis.speak(utterance);
            
            // Animate mouth while speaking
            animateMouthSpeaking();
        } else {
            // Fallback to playing creepy sound
            creepyVoice.currentTime = 0;
            creepyVoice.play();
        }
    }

    // Get random creepy phrase
    function getRandomCreepyPhrase() {
        if (Math.random() < 0.3 && gameState.taps > 0) {
            // 30% chance to repeat last phrase
            return gameState.lastPhrase;
        }
        
        // Otherwise random phrase
        const index = Math.floor(Math.random() * creepyPhrases.length);
        return creepyPhrases[index];
    }

    // Show thought bubble
    function showThoughtBubble(text) {
        bubbleText.textContent = text;
        thoughtBubble.style.opacity = '1';
        
        // Hide after 3 seconds
        setTimeout(() => {
            thoughtBubble.style.opacity = '0';
        }, 3000);
    }

    // Update message
    function updateMessage(text) {
        messageText.innerHTML = text;
    }

    // Animate on tap
    function animateTap() {
        // Bounce effect
        creepyTom.style.transform = 'scale(0.95)';
        setTimeout(() => {
            creepyTom.style.transform = 'scale(1)';
        }, 100);
        
        // Close eyes briefly
        const eyes = document.querySelectorAll('.eye');
        eyes.forEach(eye => {
            eye.style.height = '10px';
            setTimeout(() => {
                eye.style.height = '70px';
            }, 200);
        });
        
        // Open mouth
        const mouth = document.querySelector('.mouth');
        mouth.style.height = '60px';
        setTimeout(() => {
            mouth.style.height = '40px';
        }, 300);
    }

    // Animate mouth while speaking
    function animateMouthSpeaking() {
        const mouth = document.querySelector('.mouth');
        let count = 0;
        const max = 6;
        
        const interval = setInterval(() => {
            mouth.style.height = count % 2 === 0 ? '60px' : '30px';
            count++;
            
            if (count >= max) {
                clearInterval(interval);
                mouth.style.height = '40px';
            }
        }, 200);
    }

    // Update creepy appearance based on level
    function updateCreepyAppearance() {
        const face = document.querySelector('.face');
        const eyes = document.querySelectorAll('.eye');
        const body = document.querySelector('.body');
        const glow = document.querySelector('.glow');
        
        // Calculate intensity based on creep level and scare mode
        const intensity = gameState.isScareMode ? 
            gameState.creepLevel * 2 : 
            gameState.creepLevel;
        
        // Update colors and effects
        const redValue = Math.min(255, 100 + (intensity * 15));
        const glowSize = 100 + (intensity * 20);
        
        // Apply effects
        face.style.boxShadow = `inset 0 0 ${30 + intensity * 5}px #000, 0 0 ${30 + intensity * 10}px rgb(${redValue}, 0, 0)`;
        
        eyes.forEach(eye => {
            eye.style.background = `rgb(${redValue}, ${Math.max(0, 100 - intensity * 10)}, 0)`;
            eye.style.boxShadow = `inset 0 0 20px #000, 0 0 ${20 + intensity * 5}px rgb(${redValue}, 0, 0)`;
        });
        
        glow.style.width = `${glowSize}px`;
        glow.style.height = `${glowSize}px`;
        
        // If scare mode, add shake animation
        if (gameState.isScareMode) {
            creepyTom.style.animation = 'shake 0.5s infinite';
        } else {
            creepyTom.style.animation = '';
        }
    }

    // Play tap sound
    function playTapSound() {
        tapSound.currentTime = 0;
        tapSound.volume = 0.3;
        tapSound.play();
    }

    // Play scare sound
    function playScareSound() {
        scareSound.currentTime = 0;
        scareSound.volume = 0.5;
        scareSound.play();
    }

    // Flash screen
    function flashScreen(intensity = 0.7) {
        flash.style.opacity = intensity;
        setTimeout(() => {
            flash.style.opacity = 0;
        }, 200);
    }

    // Random scare effect
    function randomScareEffect() {
        if (Math.random() < 0.3) {
            flashScreen(0.3);
        }
        
        if (Math.random() < 0.2 && gameState.creepLevel > 3) {
            playScareSound();
        }
    }

    // Voice recording functions
    function startVoiceRecording() {
        updateMessage("Listening... say something!");
        recordingIndicator.style.display = 'block';
        gameState.isRecording = true;
        
        // In a real app, you would use the Web Audio API here
        // For this demo, we'll simulate it
        setTimeout(() => {
            if (gameState.isRecording) {
                const simulatedText = "I heard that...";
                speakCreepyPhrase(simulatedText);
                showThoughtBubble(simulatedText);
                updateMessage(`He repeated: "${simulatedText}"`);
                stopVoiceRecording();
            }
        }, 3000);
    }

    function stopVoiceRecording() {
        recordingIndicator.style.display = 'none';
        gameState.isRecording = false;
        updateMessage("Ready for more taps!");
    }

    // Create floating eyes in background
    function createFloatingEyes() {
        const container = document.querySelector('.floating-eyes');
        for (let i = 0; i < 12; i++) {
            const eye = document.createElement('div');
            eye.style.cssText = `
                position: absolute;
                width: ${Math.random() * 40 + 20}px;
                height: ${Math.random() * 40 + 20}px;
                background: radial-gradient(circle, #ff0000 30%, #8b0000 70%);
                border-radius: 50%;
                opacity: ${Math.random() * 0.3 + 0.1};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 10}s infinite ease-in-out ${Math.random() * 5}s;
                box-shadow: 0 0 20px #ff0000;
            `;
            container.appendChild(eye);
        }
    }

    // Add some CSS for lights-off mode
    const style = document.createElement('style');
    style.textContent = `
        .lights-off {
            background: #000 !important;
            filter: brightness(0.3);
        }
        
        .lights-off .character {
            filter: brightness(1.5) contrast(1.5);
        }
        
        .lights-off .eye {
            animation: none !important;
            box-shadow: 0 0 40px #ff0000 !important;
        }
    `;
    document.head.appendChild(style);

    // Load voices for speech synthesis
    speechSynthesis.getVoices();
    setTimeout(() => speechSynthesis.getVoices(), 1000);

    // Initialize the game
    initGame();

    // Instructions in console
    console.log(`
    ========================================
    CREEPY TOM GAME - CONTROLS
    ========================================
    TAP THE CAT: He repeats creepy phrases
    SAY SOMETHING: He tries to repeat you
    SCARE MODE: Makes everything creepier
    ITEMS: Click for extra effects
    ========================================
    Built-in phrases include:
    "Rayane, I'm under your bed"
    "I can see you sleeping"
    "Don't look under the bed"
    ...and more!
    ========================================
    `);
});
