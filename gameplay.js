const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const comboElement = document.getElementById('combo');
const healthBar = document.getElementById('health-bar');
const healthText = document.getElementById('health-text');

const urlParams = new URLSearchParams(window.location.search);
const songId = urlParams.get('song');
const difficulty = urlParams.get('difficulty');

if (!songs[songId] || !songs[songId][difficulty]) {
    alert('곡 정보를 불러오는 데 실패했습니다. 게임 선택 화면으로 돌아갑니다.');
    window.location.href = 'game.html';
}

const noteData = JSON.parse(JSON.stringify(songs[songId][difficulty]));

// Game constants
const noteSize = 40;
const keyCount = 4;
const keyPositions = [100, 180, 260, 340];
const judgmentLineY = 500;
const travelTime = 1500;

const JUDGMENT = {
    PERFECT: { window: 45,  text: 'Perfect', health: 5 },
    GOOD:    { window: 90,  text: 'Good',    health: 1 },
    BAD:     { window: 130, text: 'Bad',     health: -1 },
    SUCH:    { window: 160, text: 'Such',    health: -5 },
    MISS:    { window: 160, text: 'Miss',    health: -7 }
};

// Game state
let notes = [];
let combo = 0;
let health = 50; // Start health at 50%
let startTime = 0;
let keysHeld = [false, false, false, false];
let judgmentText = '';
let judgmentTextAlpha = 0;
let gameEnded = false;

// Jesus arms elements
const jesusLeftArm = document.querySelector('.jesus .left-arm');
const jesusRightArm = document.querySelector('.jesus .right-arm');

// Audio element
const gameAudio = document.getElementById('game-audio');
const gameAudioMiracle = document.getElementById('game-audio-miracle');
const startOverlay = document.getElementById('start-overlay');
const startGameButton = document.getElementById('start-game-button');

// Helper function to get complementary color
function getComplementaryColor(hexColor) {
    const colorMap = {
        'cyan': 'red',
        'red': 'cyan',
        'lime': 'magenta',
        'white': 'black',
        'magenta': 'lime',
        'orange': 'blue',
        'saddlebrown': 'lightblue' // For cross skin
    };
    return colorMap[hexColor] || 'gray'; // Default to gray if not found
}

function setupInputListeners() {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
}

function handleKeyDown(e) {
    if (gameEnded || !settingsModal.classList.contains('hidden')) return;
    const keyIndex = keyBindings[e.key];
    if (keyIndex !== undefined && !keysHeld[keyIndex]) {
        keysHeld[keyIndex] = true;
        checkHit(keyIndex);

        // Animate Jesus's arms based on key pressed
        if (songId === 'obyeongieo') {
            if (keyIndex === 0) { // Left
                if (jesusLeftArm) jesusLeftArm.classList.add('arm-left-move');
            } else if (keyIndex === 1) { // Down
                if (jesusLeftArm) jesusLeftArm.classList.add('arm-down-move');
                if (jesusRightArm) jesusRightArm.classList.add('arm-down-move');
            } else if (keyIndex === 2) { // Up
                if (jesusLeftArm) jesusLeftArm.classList.add('arm-up-move');
                if (jesusRightArm) jesusRightArm.classList.add('arm-up-move');
            } else if (keyIndex === 3) { // Right
                if (jesusRightArm) jesusRightArm.classList.add('arm-right-move');
            }
        }
    }
}

function handleKeyUp(e) {
    if (gameEnded || !settingsModal.classList.contains('hidden')) return;
    const keyIndex = keyBindings[e.key];
    if (keyIndex !== undefined) {
        keysHeld[keyIndex] = false;

        // Reset Jesus's arms position
        if (songId === 'obyeongieo') {
            if (keyIndex === 0) {
                if (jesusLeftArm) jesusLeftArm.classList.remove('arm-left-move');
            } else if (keyIndex === 1) {
                if (jesusLeftArm) jesusLeftArm.classList.remove('arm-down-move');
                if (jesusRightArm) jesusRightArm.classList.remove('arm-down-move');
            } else if (keyIndex === 2) {
                if (jesusLeftArm) jesusLeftArm.classList.remove('arm-up-move');
                if (jesusRightArm) jesusRightArm.classList.remove('arm-up-move');
            } else if (keyIndex === 3) {
                if (jesusRightArm) jesusRightArm.classList.remove('arm-right-move');
            }
        }
    }
}

function startGame() {
    loadKeyBindings();
    setupInputListeners();

    const backBtn = document.getElementById('back-to-menu-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            gameEnded = true; // Stop the game loop
            if (gameAudio) gameAudio.pause(); // Pause audio
            if (gameAudioMiracle) gameAudioMiracle.pause(); // Pause miracle audio
            window.location.href = 'game.html';
        });
    }

    // Show background based on song
    const obyeongieoBg = document.getElementById('background-obyeongieo');
    const walkonwaterBg = document.getElementById('background-walkonwater');
    const prayerBg = document.getElementById('background-prayer');

    // Hide all backgrounds first
    if (obyeongieoBg) obyeongieoBg.classList.add('hidden');
    if (walkonwaterBg) walkonwaterBg.classList.add('hidden');
    if (prayerBg) prayerBg.classList.add('hidden');

    // Show the correct background
    if (songId === 'obyeongieo' && obyeongieoBg) {
        obyeongieoBg.classList.remove('hidden');
    } else if (songId === 'walkonwater' && walkonwaterBg) {
        walkonwaterBg.classList.remove('hidden');
    } else if (songId === 'prayer' && prayerBg) {
        prayerBg.classList.remove('hidden');
    }

    // Show start overlay and wait for user interaction
    // Play audio based on songId
    let currentAudio = null;
    if (songId === 'obyeongieo') {
        currentAudio = gameAudio;
    } else if (songId === 'miracle' || songId === 'walkonwater' || songId === 'prayer') {
        currentAudio = gameAudioMiracle;
    }

    if (startOverlay && startGameButton) {
        startOverlay.classList.remove('hidden');
        startGameButton.addEventListener('click', () => {
            startOverlay.classList.add('hidden');
            if (currentAudio) {
                currentAudio.play().catch(e => console.error("Audio play failed:", e));
                currentAudio.onplay = () => {
                    startTime = Date.now(); // Sync game start with audio play
                    update();
                };
            } else {
                startTime = Date.now();
                update();
            }
        });
    } else {
        // Fallback if overlay elements are not found (shouldn't happen)
        startTime = Date.now();
        update();
    }

    health = 50; // Set starting health to 50
    updateHealthDisplay();
}

function createNote(noteInfo) {
    notes.push({
        x: keyPositions[noteInfo.key],
        y: 0,
        key: noteInfo.key,
        time: noteInfo.time,
        hit: false,
        isLongNote: noteInfo.duration > 0,
        duration: noteInfo.duration || 0,
        releasedEarly: false // Add this flag
    });
}

function update() {
    if (gameEnded) return;
    const currentTime = Date.now() - startTime;

    if (noteData.length === 0 && notes.length === 0) {
        endGame();
        return;
    }

    while (noteData.length > 0 && noteData[0].time < currentTime + travelTime) {
        createNote(noteData.shift());
    }

    for (let i = notes.length - 1; i >= 0; i--) {
        const note = notes[i];
        const spawnTime = note.time - travelTime;
        const progress = (currentTime - spawnTime) / travelTime;
        note.y = progress * judgmentLineY;

        // Handle long notes that have been hit
        if (note.isLongNote && note.hit) {
            const endTime = note.time + note.duration;
            // Check for early release
            if (!keysHeld[note.key] && currentTime < endTime && !note.releasedEarly) {
                note.releasedEarly = true; // Mark as released early once
                showJudgment(JUDGMENT.BAD); // Penalty for releasing early
            }

            // The note's head should stay at the judgment line
            note.y = judgmentLineY;

            // Check for successful completion or end of note
            if (currentTime >= endTime) {
                if (!note.releasedEarly) {
                    let playerCoins = parseInt(localStorage.getItem('playerCoins') || '0');
                    playerCoins += 5; // 롱노트 성공 코인
                    localStorage.setItem('playerCoins', playerCoins);

                    showJudgment(JUDGMENT.PERFECT); // Reward for holding till the end
                }
                notes.splice(i, 1); // Remove note after it's finished
                continue;
            }
        }

        // Handle missed notes
        if (currentTime > note.time + JUDGMENT.MISS.window && !note.hit) {
            showJudgment(JUDGMENT.MISS);
            notes.splice(i, 1);
        }
    }

    draw();
    requestAnimationFrame(update);
}

function updateHealthDisplay() {
    health = Math.max(0, Math.min(100, health));
    healthText.textContent = Math.round(health);
    healthBar.style.width = health + '%';
    healthBar.style.backgroundColor = health > 50 ? 'green' : (health > 20 ? 'orange' : 'red');

    if (health <= 0 && !gameEnded) {
        handleGameFailure("체력이 0%가 되어 실패했습니다!");
    }
}

function showJudgment(judgment, penalty = false) {
    let playerCoins = parseInt(localStorage.getItem('playerCoins') || '0');

    switch(judgment.text) {
        case 'Perfect':
            playerCoins += 5;
            break;
        case 'Good':
            playerCoins += 3;
            break;
    }
    localStorage.setItem('playerCoins', playerCoins);

    health += judgment.health;
    updateHealthDisplay();

    if (!penalty) {
        if (judgment.health >= 0) combo++; else combo = 0;
    }
    
    judgmentText = judgment.text;
    judgmentTextAlpha = 1.0;
    comboElement.textContent = combo;
}

function checkHit(keyIndex) {
    const currentTime = Date.now() - startTime;
    let noteWasHit = false;

    for (let i = notes.length - 1; i >= 0; i--) {
        const note = notes[i];
        if (note.key === keyIndex && !note.hit) {
            const timeError = Math.abs(note.time - currentTime);
            let currentJudgment = null;

            if (timeError < JUDGMENT.PERFECT.window) currentJudgment = JUDGMENT.PERFECT;
            else if (timeError < JUDGMENT.GOOD.window) currentJudgment = JUDGMENT.GOOD;
            else if (timeError < JUDGMENT.BAD.window) currentJudgment = JUDGMENT.BAD;
            else if (timeError < JUDGMENT.SUCH.window) currentJudgment = JUDGMENT.SUCH;

            if (currentJudgment) {
                note.hit = true;
                noteWasHit = true;
                // For long notes, judgment is handled at the end of the note.
                // For regular notes, show judgment now.
                if (!note.isLongNote) {
                    showJudgment(currentJudgment);
                    notes.splice(i, 1);
                }
                break;
            }
        }
    }

    if (!noteWasHit) {
        showJudgment({ text: 'Miss', health: -3 }, true);
    }
}

function endGame() {
    gameEnded = true;
    if (gameAudio) gameAudio.pause(); // Pause audio on game end
    if (gameAudioMiracle) gameAudioMiracle.pause(); // Pause miracle audio on game end
    if (health >= 50) {
        handleGameClear();
    } else {
        handleGameFailure("최종 체력이 50% 미만입니다.");
    }
}

function handleGameClear() {
    // Save the clear status for the specific song and difficulty
    localStorage.setItem(`cleared_${songId}_${difficulty}`, 'true');

    // Unlock shop if prayer hard is cleared
    if (songId === 'prayer' && difficulty === 'hard') {
        localStorage.setItem('shopUnlocked', 'true');
        alert('스킨 상점이 해금되었습니다!');
    }

    alert(translations[localStorage.getItem('language') || 'ko'].clear_message);
    window.location.href = 'game.html';
}

function handleGameFailure(message) {
    gameEnded = true;
    const failureModal = document.getElementById('failure-modal');
    const failureReason = document.getElementById('failure-reason');
    const exitBtn = document.getElementById('exit-to-menu-btn');

    failureReason.textContent = message;
    failureModal.classList.remove('hidden');

    exitBtn.onclick = () => {
        window.location.href = 'game.html';
    };
}

function drawNoteShape(x, y, rotation, skinColor, skinShape) {
    ctx.save();
    ctx.translate(x, y); // Translate to the center of the note
    ctx.fillStyle = skinColor;

    if (skinShape === 'cross') {
        const armThickness = noteSize / 4;
        const halfThickness = armThickness / 2;
        const shortArmLength = noteSize / 2; // Length from center to end of short arm
        const longArmLength = noteSize;     // Length from center to end of long arm

        // Draw the central square
        ctx.fillRect(-halfThickness, -halfThickness, armThickness, armThickness);

        // Draw arms based on the original rotation value
        if (rotation === 0) { // Up arrow: Long arm is UP
            // Long arm UP
            ctx.fillRect(-halfThickness, -longArmLength, armThickness, longArmLength);
            // Short arm DOWN
            ctx.fillRect(-halfThickness, halfThickness, armThickness, shortArmLength);
            // Short arm LEFT
            ctx.fillRect(-shortArmLength, -halfThickness, shortArmLength, armThickness);
            // Short arm RIGHT
            ctx.fillRect(halfThickness, -halfThickness, shortArmLength, armThickness);
        } else if (rotation === 180) { // Down arrow: Long arm is DOWN
            // Short arm UP
            ctx.fillRect(-halfThickness, -shortArmLength, armThickness, shortArmLength);
            // Long arm DOWN
            ctx.fillRect(-halfThickness, halfThickness, armThickness, longArmLength);
            // Short arm LEFT
            ctx.fillRect(-shortArmLength, -halfThickness, shortArmLength, armThickness);
            // Short arm RIGHT
            ctx.fillRect(halfThickness, -halfThickness, shortArmLength, armThickness);
        } else if (rotation === -90) { // Left arrow: Long arm is LEFT
            // Short arm UP
            ctx.fillRect(-halfThickness, -shortArmLength, armThickness, shortArmLength);
            // Short arm DOWN
            ctx.fillRect(-halfThickness, halfThickness, armThickness, shortArmLength);
            // Long arm LEFT
            ctx.fillRect(-longArmLength, -halfThickness, longArmLength, armThickness);
            // Short arm RIGHT
            ctx.fillRect(halfThickness, -halfThickness, shortArmLength, armThickness);
        } else if (rotation === 90) { // Right arrow: Long arm is RIGHT
            // Short arm UP
            ctx.fillRect(-halfThickness, -shortArmLength, armThickness, shortArmLength);
            // Short arm DOWN
            ctx.fillRect(-halfThickness, halfThickness, armThickness, shortArmLength);
            // Short arm LEFT
            ctx.fillRect(-shortArmLength, -halfThickness, shortArmLength, armThickness);
            // Long arm RIGHT
            ctx.fillRect(halfThickness, -halfThickness, longArmLength, armThickness);
        }

    } else { // Default arrow shape
        ctx.rotate(rotation * Math.PI / 180); // Apply rotation only for arrow shape
        ctx.beginPath();
        ctx.moveTo(0, -noteSize / 2);
        ctx.lineTo(noteSize / 2, noteSize / 2);
        ctx.lineTo(-noteSize / 2, noteSize / 2);
        ctx.closePath();
        ctx.fill();
    }
    ctx.restore();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let equippedSkin;
    try {
        equippedSkin = JSON.parse(localStorage.getItem('equippedSkin'));
        // Handle cases where old string value might be present
        if (typeof equippedSkin === 'string') {
            equippedSkin = { color: equippedSkin, shape: 'arrow' };
        } else if (!equippedSkin || !equippedSkin.color) {
            equippedSkin = { color: 'cyan', shape: 'arrow' };
        }
    } catch (e) {
        equippedSkin = { color: 'cyan', shape: 'arrow' };
    }

    // Draw judgment line arrows (fixed, not affected by skin)
    for (let i = 0; i < keyCount; i++) {
        let isHoldingLongNote = false;
        // Check if there's an active long note being held on this key
        for (const note of notes) {
            if (note.key === i && note.isLongNote && note.hit) {
                isHoldingLongNote = true;
                break;
            }
        }

        const rotation = [-90, 180, 0, 90][i];
        // The judgment line should only turn gold if a key is held AND it's not for an active long note.
        const color = keysHeld[i] && !isHoldingLongNote ? 'gold' : '#888';
        drawNoteShape(keyPositions[i], judgmentLineY, rotation, color, equippedSkin.shape);
    }

    for (const note of notes) {
        if (note.y > -noteSize && note.y < canvas.height + noteSize) {
            const rotation = [-90, 180, 0, 90][note.key];
            if (note.isLongNote) {
                const longNoteColor = getComplementaryColor(equippedSkin.color); // 보색 적용
                const length = (note.duration / travelTime) * judgmentLineY;
                let tailY = note.y - length;

                // If the long note is hit, its head stays at the judgment line
                // and the tail shrinks over time.
                if (note.hit) {
                    const currentTime = Date.now() - startTime;
                    const timePassed = currentTime - note.time;
                    const progress = Math.max(0, timePassed / note.duration);
                    
                    const currentLength = length * (1 - progress);
                    tailY = judgmentLineY - currentLength;
                }

                ctx.fillStyle = longNoteColor;
                // Only draw the part of the tail that is above the judgment line
                if (tailY < judgmentLineY) {
                    ctx.fillRect(note.x - noteSize / 4, tailY, noteSize / 2, judgmentLineY - tailY);
                }
                // Draw the head
                drawNoteShape(note.x, note.y, rotation, longNoteColor, equippedSkin.shape);
            } else {
                drawNoteShape(note.x, note.y, rotation, equippedSkin.color, equippedSkin.shape);
            }
        }
    }

    if (judgmentTextAlpha > 0) {
        ctx.font = 'bold 48px sans-serif';
        ctx.fillStyle = `rgba(255, 255, 255, ${judgmentTextAlpha})`;
        ctx.textAlign = 'center';
        ctx.fillText(judgmentText, canvas.width / 2, 250);
        judgmentTextAlpha -= 0.02;
    }
}

startGame();