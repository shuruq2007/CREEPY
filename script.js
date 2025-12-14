document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const speakBtn = document.getElementById('speakBtn');
    const musicBtn = document.getElementById('musicBtn');
    const scareBtn = document.getElementById('scareBtn');
    const creepyMusic = document.getElementById('creepyMusic');
    const voiceAudio = document.getElementById('voiceAudio');
    const hiddenMessage = document.getElementById('hiddenMessage');
    const flash = document.getElementById('flash');
    
    // Text-to-Speech with creepy voice
    function speakCreepyMessage() {
        // Try using Web Speech API first
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance();
            speech.text = "Rayane. I'm under your bed.";
            speech.rate = 0.8; // Slow speed
            speech.pitch = 0.5; // Deep voice
            speech.volume = 1;
            
            // Try to get a creepy voice
            const voices = speechSynthesis.getVoices();
            const creepyVoice = voices.find(voice => 
                voice.name.includes('Google UK English Male') || 
                voice.name.includes('Microsoft David')
            );
            
            if (creepyVoice) {
                speech.voice = creepyVoice;
            }
            
            speechSynthesis.speak(speech);
            
            // Create visual effect when speaking
            document.querySelectorAll('.eye').forEach(eye => {
                eye.style.animation = 'none';
                eye.style.height = '5px';
                setTimeout(() => {
                    eye.style.animation = 'blink 4s infinite';
                }, 1000);
            });
        } else {
            // Fallback to audio file
            voiceAudio.currentTime = 0;
            voiceAudio.play();
        }
    }
    
    // Music control
    let musicPlaying = false;
    function toggleMusic() {
        if (!musicPlaying) {
            creepyMusic.play().catch(e => {
                console.log('Autoplay prevented. Click play button.');
                musicBtn.textContent = '▶️ Play Music (Click)';
            });
            creepyMusic.volume = 0.3;
            musicPlaying = true;
            musicBtn.textContent = '⏸️ Pause Music';
            musicBtn.style.background = '#ff0000';
        } else {
            creepyMusic.pause();
            musicPlaying = false;
            musicBtn.textContent = '🎵 Play Music';
            musicBtn.style.background = '#220000';
        }
    }
    
    // Extra scare effect
    function extraScare() {
        // Flash effect
        flash.style.animation = 'flash 0.5s';
        setTimeout(() => {
            flash.style.animation = '';
        }, 500);
        
        // Show hidden message
        hiddenMessage.style.opacity = '1';
        hiddenMessage.style.transition = 'opacity 2s';
        hiddenMessage.style.transform = 'translate(-50%, -50%) scale(1.5)';
        
        // Make face bigger
        document.querySelector('.creepy-face').style.transform = 'scale(1.3)';
        
        // Random glitch effect
        document.querySelector('.glitch').style.animation = 'glitch 100ms infinite';
        
        // Hide everything after 3 seconds
        setTimeout(() => {
            hiddenMessage.style.opacity = '0';
            hiddenMessage.style.transform = 'translate(-50%, -50%) scale(1)';
            document.querySelector('.creepy-face').style.transform = 'scale(1)';
            document.querySelector('.glitch').style.animation = 'glitch 725ms infinite';
        }, 3000);
        
        // Play extra sound
        const scareSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-horror-fright-scream-387.mp3');
        scareSound.volume = 0.5;
        scareSound.play();
    }
    
    // Create floating particles
    function createParticles() {
        const particles = document.querySelector('.particles');
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = Math.random() * 5 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.background = '#ff0000';
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.top = Math.random() * 100 + 'vh';
            particle.style.opacity = Math.random() * 0.5 + 0.1;
            
            // Animation
            particle.style.animation = `float-around ${Math.random() * 20 + 10}s infinite linear`;
            
            particles.appendChild(particle);
        }
    }
    
    // Create blood drips
    function createBloodDrips() {
        const container = document.querySelector('.container');
        for (let i = 0; i < 5; i++) {
            const drip = document.createElement('div');
            drip.className = 'drip';
            drip.style.left = Math.random() * 100 + '%';
            drip.style.animationDelay = Math.random() * 10 + 's';
            drip.style.animationDuration = Math.random() * 5 + 8 + 's';
            container.appendChild(drip);
        }
    }
    
    // Add mouse move effects
    document.addEventListener('mousemove', function(e) {
        const eyes = document.querySelectorAll('.eye');
        const face = document.querySelector('.face-container');
        const faceRect = face.getBoundingClientRect();
        const faceCenterX = faceRect.left + faceRect.width / 2;
        const faceCenterY = faceRect.top + faceRect.height / 2;
        
        eyes.forEach(eye => {
            const eyeRect = eye.getBoundingClientRect();
            const eyeCenterX = eyeRect.left + eyeRect.width / 2;
            const eyeCenterY = eyeRect.top + eyeRect.height / 2;
            
            const deltaX = e.clientX - eyeCenterX;
            const deltaY = e.clientY - eyeCenterY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const maxDistance = 200;
            
            const moveX = (deltaX / distance) * Math.min(10, distance / 20);
            const moveY = (deltaY / distance) * Math.min(10, distance / 20);
            
            eye.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        // Make face follow cursor slightly
        const faceMoveX = (e.clientX - faceCenterX) / 50;
        const faceMoveY = (e.clientY - faceCenterY) / 50;
        face.style.transform = `translate(${faceMoveX}px, ${faceMoveY}px)`;
    });
    
    // Random scary events
    function randomScareEvent() {
        if (Math.random() > 0.7) {
            setTimeout(() => {
                // Random flash
                flash.style.animation = 'flash 0.2s';
                setTimeout(() => flash.style.animation = '', 200);
                
                // Random sound
                if (Math.random() > 0.5) {
                    const randomSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-creepy-laugh-385.mp3');
                    randomSound.volume = 0.3;
                    randomSound.play();
                }
            }, Math.random() * 10000 + 5000);
        }
    }
    
    // Initialize
    function init() {
        // Make sure voices are loaded
        speechSynthesis.getVoices();
        setTimeout(() => speechSynthesis.getVoices(), 1000);
        
        // Create effects
        createParticles();
        createBloodDrips();
        
        // Start random events
        setInterval(randomScareEvent, 15000);
        
        // Auto-play voice after 2 seconds
        setTimeout(() => {
            speakBtn.textContent = "👁️ SAY IT AGAIN";
            speakBtn.style.background = '#8b0000';
        }, 2000);
        
        // Auto-start music after 3 seconds
        setTimeout(() => {
            if (!musicPlaying) {
                toggleMusic();
            }
        }, 3000);
    }
    
    // Event listeners
    speakBtn.addEventListener('click', speakCreepyMessage);
    musicBtn.addEventListener('click', toggleMusic);
    scareBtn.addEventListener('click', extraScare);
    
    // Auto-play voice on first click anywhere
    let firstClick = true;
    document.addEventListener('click', function() {
        if (firstClick) {
            speakCreepyMessage();
            firstClick = false;
        }
    });
    
    // Initialize
    init();
});
