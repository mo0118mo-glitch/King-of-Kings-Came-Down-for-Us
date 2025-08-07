const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const saveKeysBtn = document.getElementById('save-keys-btn') || document.getElementById('close-modal-btn'); // In-game it's save, in menu it's close
const closeBtn = document.getElementById('close-modal-btn');
const resetKeysBtn = document.getElementById('reset-keys-btn');

const keyInputs = {
    left: document.getElementById('key-left'),
    down: document.getElementById('key-down'),
    up: document.getElementById('key-up'),
    right: document.getElementById('key-right')
};

const defaultKeys = {
    'ArrowLeft': 0,
    'ArrowDown': 1,
    'ArrowUp': 2,
    'ArrowRight': 3
};

let keyBindings = {};

function loadKeyBindings() {
    const savedKeys = localStorage.getItem('keyBindings');
    if (savedKeys) {
        keyBindings = JSON.parse(savedKeys);
    } else {
        keyBindings = { ...defaultKeys };
    }
    updateKeyInputs();
}

function saveKeyBindings() {
    localStorage.setItem('keyBindings', JSON.stringify(keyBindings));
}

function updateKeyInputs() {
    const keyMap = ['left', 'down', 'up', 'right'];
    for (let i = 0; i < 4; i++) {
        const keyName = Object.keys(keyBindings).find(key => keyBindings[key] === i);
        // Check if the element exists before using it
        if (keyInputs[keyMap[i]]) {
            keyInputs[keyMap[i]].value = keyName || 'N/A';
        }
    }
}

if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
        if (settingsModal) {
            settingsModal.classList.remove('hidden');
        }
    });
}

if(saveKeysBtn) {
    saveKeysBtn.addEventListener('click', () => {
        saveKeyBindings();
        if (settingsModal) {
            settingsModal.classList.add('hidden');
        }
    });
}

if(closeBtn) {
    closeBtn.addEventListener('click', () => {
        if (settingsModal) {
            settingsModal.classList.add('hidden');
        }
    });
}

if(resetKeysBtn){
    resetKeysBtn.addEventListener('click', () => {
        keyBindings = { ...defaultKeys };
        updateKeyInputs();
    });
}

let keyToChange = null;
let currentKeyElement = null;

// Check if keyInputs has valid elements before adding listeners
Object.entries(keyInputs).forEach(([direction, inputElement]) => {
    if (inputElement) { // This check prevents the error
        inputElement.addEventListener('click', (e) => {
            if (currentKeyElement) {
                updateKeyInputs();
            }
            keyToChange = direction;
            currentKeyElement = e.target;
            e.target.value = '...';
        });
    }
});

window.addEventListener('keydown', e => {
    if (keyToChange && currentKeyElement) {
        const newKey = e.key;
        const keyIndexToSet = ['left', 'down', 'up', 'right'].indexOf(keyToChange);

        // Unbind the new key if it's already used
        if (keyBindings[newKey] !== undefined) {
            delete keyBindings[newKey];
        }

        // Unbind the old key for this position
        const oldKey = Object.keys(keyBindings).find(k => keyBindings[k] === keyIndexToSet);
        if (oldKey) {
            delete keyBindings[oldKey];
        }

        keyBindings[newKey] = keyIndexToSet;
        updateKeyInputs();
        keyToChange = null;
        currentKeyElement = null;
    }
});

// Initial load
loadKeyBindings();