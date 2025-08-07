const translations = {
    en: {
        // Main Menu
        main_title: "King of Kings, Came Down for Us",
        start_game: "Start Game",
        game_story: "Game Story",
        settings: "Settings",
        // Settings Modal
        key_settings_title: "Key Settings",
        key_left: "Left:",
        key_down: "Down:",
        key_up: "Up:",
        key_right: "Right:",
        save: "Save",
        reset: "Reset",
        close: "Close",
        // Story Page
        story_text: "Jesus, the King of Kings, comes down to sing for us!",
        back: "Back",
        // Game Menu
        song_obe: "The Five Loaves and Two Fish",
        song_miracle: "Walking on Water",
        song_prayer: "The Lord's Prayer",
        difficulty: "Difficulty:",
        locked_obe_hard: "Clear 'The Five Loaves and Two Fish' on Hard to unlock.",
        locked_miracle_hard: "Clear 'Walking on Water' on Hard to unlock.",
        wip_title: "In Development",
        wip_text: "Developing the Crucifixion, the Resurrection, and more!",
        // In-Game
        combo: "Combo",
        health: "Health",
        clear_message: "Clear!",
        fail_message: "Failed!",
        fail_reason_health: "Final health was below 50%.",
        fail_reason_zero: "Health reached 0%."
    },
    ko: {
        // Main Menu
        main_title: "왕중왕, 우릴위해 내려오시다.",
        start_game: "게임 시작",
        game_story: "게임 스토리 설정",
        settings: "설정",
        // Settings Modal
        key_settings_title: "키 설정",
        key_left: "왼쪽:",
        key_down: "아래:",
        key_up: "위:",
        key_right: "오른쪽:",
        save: "저장",
        reset: "초기화",
        close: "닫기",
        // Story Page
        story_text: "왕중왕이신 예수님이 우릴위해 내려오셔서 노래를 부르신다!",
        back: "돌아가기",
        // Game Menu
        song_obe: "오병이어",
        song_miracle: "물위를 걷는 기적",
        song_prayer: "예수님의 기도",
        difficulty: "난이도 설정:",
        locked_obe_hard: "'오병이어' 하드 모드를 클리어해야 해금됩니다.",
        locked_miracle_hard: "'물위를 걷는 기적' 하드 모드를 클리어해야 해금됩니다.",
        wip_title: "개발중",
        wip_text: "십자가와 예수님의 부활 등을 개발중입니다!",
        // In-Game
        combo: "콤보",
        health: "체력",
        clear_message: "클리어!",
        fail_message: "실패!",
        fail_reason_health: "최종 체력이 50% 미만입니다.",
        fail_reason_zero: "체력이 0%가 되어 실패했습니다!"
    }
};

function setLanguage(lang) {
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-translate-key]').forEach(element => {
        const key = element.getAttribute('data-translate-key');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const langKoBtn = document.getElementById('lang-ko');
    const langEnBtn = document.getElementById('lang-en');

    if(langKoBtn && langEnBtn){
        langKoBtn.addEventListener('click', () => setLanguage('ko'));
        langEnBtn.addEventListener('click', () => setLanguage('en'));
    }

    // Set initial language
    const savedLang = localStorage.getItem('language') || 'ko';
    setLanguage(savedLang);
});
