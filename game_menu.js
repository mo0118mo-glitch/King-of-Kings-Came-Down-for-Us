document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const songs = {
        obyeongieo: document.getElementById('song-obe'),
        miracle: document.getElementById('song-miracle'),
        prayer: document.getElementById('song-prayer')
    };
    const wipSong = document.getElementById('song-wip');

    // --- Unlock Logic ---

    // Function to get clear status
    const getClearStatus = (song, diff) => localStorage.getItem(`cleared_${song}_${diff}`) === 'true';

    // Get clear status for all difficulties
    const clears = {
        obyeongieo: {
            easy: getClearStatus('obyeongieo', 'easy'),
            normal: getClearStatus('obyeongieo', 'normal'),
            hard: getClearStatus('obyeongieo', 'hard')
        },
        miracle: {
            easy: getClearStatus('miracle', 'easy'),
            normal: getClearStatus('miracle', 'normal'),
            hard: getClearStatus('miracle', 'hard')
        }
    };

    // --- Update UI based on clear status ---

    // 1. Obyeongieo (오병이어)
    const obNormalBtn = document.getElementById('obyeongieo-normal');
    const obHardBtn = document.getElementById('obyeongieo-hard');

    if (!clears.obyeongieo.easy) {
        obNormalBtn.classList.add('locked');
        obNormalBtn.onclick = (e) => { e.preventDefault(); alert('Easy 모드를 먼저 클리어하세요.'); };
    }
    if (!clears.obyeongieo.normal) {
        obHardBtn.classList.add('locked');
        obHardBtn.onclick = (e) => { e.preventDefault(); alert('Normal 모드를 먼저 클리어하세요.'); };
    }

    // 2. Miracle (물위를 걷는 기적)
    if (clears.obyeongieo.hard) {
        songs.miracle.classList.remove('locked');
        songs.miracle.innerHTML = `
            <h2><span data-translate-key="song_miracle">물위를 걷는 기적</span></h2>
            <div class="difficulty">
                <span data-translate-key="difficulty">난이도 설정:</span>
                <button id="miracle-easy" onclick="location.href='play.html?song=miracle&difficulty=easy'">Easy</button>
                <button id="miracle-normal" class="locked" onclick="event.preventDefault(); alert('Easy 모드를 먼저 클리어하세요.');">Normal</button>
                <button id="miracle-hard" class="locked" onclick="event.preventDefault(); alert('Normal 모드를 먼저 클리어하세요.');">Hard</button>
            </div>`;
        
        const miracleNormalBtn = document.getElementById('miracle-normal');
        const miracleHardBtn = document.getElementById('miracle-hard');

        if (clears.miracle.easy) {
            miracleNormalBtn.classList.remove('locked');
            miracleNormalBtn.onclick = () => location.href = 'play.html?song=miracle&difficulty=normal';
        }
        if (clears.miracle.normal) {
            miracleHardBtn.classList.remove('locked');
            miracleHardBtn.onclick = () => location.href = 'play.html?song=miracle&difficulty=hard';
        }

    } else {
        songs.miracle.onclick = () => {
            const lang = localStorage.getItem('language') || 'ko';
            alert(translations[lang].locked_obe_hard);
        };
    }

    // 3. Prayer (예수님의 기도)
    if (clears.miracle.hard) {
        songs.prayer.classList.remove('locked');
        songs.prayer.innerHTML = `
            <h2><span data-translate-key="song_prayer">예수님의 기도</span></h2>
            <div class="difficulty">
                <span data-translate-key="difficulty">난이도 설정:</span>
                <button id="prayer-easy" onclick="location.href='play.html?song=prayer&difficulty=easy'">Easy</button>
                <button id="prayer-normal" class="locked" onclick="event.preventDefault(); alert('Easy 모드를 먼저 클리어하세요.');">Normal</button>
                <button id="prayer-hard" class="locked" onclick="event.preventDefault(); alert('Normal 모드를 먼저 클리어하세요.');">Hard</button>
            </div>`;

        const prayerNormalBtn = document.getElementById('prayer-normal');
        const prayerHardBtn = document.getElementById('prayer-hard');

        if (getClearStatus('prayer', 'easy')) {
            prayerNormalBtn.classList.remove('locked');
            prayerNormalBtn.onclick = () => location.href = 'play.html?song=prayer&difficulty=normal';
        }
        if (getClearStatus('prayer', 'normal')) {
            prayerHardBtn.classList.remove('locked');
            prayerHardBtn.onclick = () => location.href = 'play.html?song=prayer&difficulty=hard';
        }

    } else {
        songs.prayer.onclick = () => {
            const lang = localStorage.getItem('language') || 'ko';
            alert(translations[lang].locked_miracle_hard);
        };
    }
    
    // 4. WIP Song
    if (wipSong) {
        wipSong.onclick = () => {
            const lang = localStorage.getItem('language') || 'ko';
            alert(translations[lang].wip_text);
        };
    }

    // Re-apply translations after dynamic content generation
    setLanguage(localStorage.getItem('language') || 'ko');
});