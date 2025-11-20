// script.js

const characterDisplay = document.getElementById('main-character');
const textDisplay = document.getElementById('current-text');
const spinButton = document.getElementById('spin-button');
const backgroundMusic = document.getElementById('background-music');
const spinSound = document.getElementById('spin-sound'); 
const heartExplosionContainer = document.getElementById('heart-explosion-container'); 

const DURATION = 3000; 
const TOTAL_CHARACTERS = CHARACTER_LIST.length;
const HEART_COUNT = 30; 

let interval;
let currentIndex = 0; 

function startBackgroundMusic() {
    backgroundMusic.volume = 0.3;
    backgroundMusic.play().catch(error => {
        console.log("Background music autoplay failed:", error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    characterDisplay.src = CHARACTER_LIST[0] || '';
    textDisplay.textContent = "Its time to choose!";
    
    document.addEventListener('click', startBackgroundMusic, { once: true });
});


function startSpin() {
    spinButton.disabled = true;
    textDisplay.textContent = "CHOOSING...";
    
    spinSound.currentTime = 0;
    spinSound.volume = 0.7;
    spinSound.play().catch(e => console.log("Spin sound failed to play:", e));

    interval = setInterval(() => {
        currentIndex = (currentIndex + 1) % TOTAL_CHARACTERS;
        characterDisplay.src = CHARACTER_LIST[currentIndex];
        characterDisplay.style.transform = 'scale(1.05)';
        setTimeout(() => { characterDisplay.style.transform = 'scale(1)'; }, 50);
    }, 100); 

    setTimeout(stopSpin, DURATION);
}

function stopSpin() {
    clearInterval(interval);
    spinSound.pause();

    const winningIndex = Math.floor(Math.random() * TOTAL_CHARACTERS);
    
    characterDisplay.style.transition = `transform ${DURATION / 1000}s ease-out`;
    
    setTimeout(() => {
        const winnerFile = CHARACTER_LIST[winningIndex];
        characterDisplay.src = winnerFile; 
        
        const winnerName = winnerFile.replace('.png', '').replace(/[_.-]/g, ' ').toUpperCase();
        textDisplay.textContent = winnerName;
        
        textDisplay.style.transform = 'scale(1.2)';
        
        createHeartExplosion();

        setTimeout(() => {
            textDisplay.style.transform = 'scale(1)';
            spinButton.disabled = false;
        }, 500); 
    }, DURATION / 2); 
}

function createHeartExplosion() {
    heartExplosionContainer.innerHTML = ''; 
    const SPREAD_DISTANCE = 400; 

    for (let i = 0; i < HEART_COUNT; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        
        const spreadX = (Math.random() - 0.5) * SPREAD_DISTANCE; 
        const spreadY = (Math.random() - 0.5) * SPREAD_DISTANCE; 
        
        heart.style.setProperty('--x', `${spreadX}px`);
        heart.style.setProperty('--y', `${spreadY}px`);
        heartExplosionContainer.appendChild(heart);

        heart.addEventListener('animationend', () => {
            heart.remove();
        });
    }
}


spinButton.addEventListener('click', startSpin);
