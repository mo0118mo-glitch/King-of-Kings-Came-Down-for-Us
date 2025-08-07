document.addEventListener('DOMContentLoaded', () => {
    const cheatBtn = document.getElementById('cheat-code-btn');
    const shopBtn = document.getElementById('shop-btn');

    // Check if shop is unlocked
    if (localStorage.getItem('shopUnlocked') === 'true') {
        if(shopBtn) shopBtn.classList.remove('hidden');
    }

    if (cheatBtn) {
        cheatBtn.addEventListener('click', () => {
            const code = prompt('코드를 입력하세요:');
            if (code === 'jesus' || code === '예수님') {
                // Unlock all difficulties for all songs as a bonus
                localStorage.setItem('cleared_obyeongieo_easy', 'true');
                localStorage.setItem('cleared_obyeongieo_normal', 'true');
                localStorage.setItem('cleared_obyeongieo_hard', 'true');
                localStorage.setItem('cleared_miracle_easy', 'true');
                localStorage.setItem('cleared_miracle_normal', 'true');
                localStorage.setItem('cleared_miracle_hard', 'true');
                alert('치트 활성화: 모든 곡과 난이도가 해금되었습니다!');
                // No reload needed, changes will be visible on the next screen
            } else if (code === '예수님 외에는 다른 길은 없다.') {
                localStorage.setItem('shopUnlocked', 'true');
                localStorage.setItem('unlockedCrossSkin', 'true');
                alert('특별 스킨 상점이 해금되었습니다!');
                location.reload();
                alert('잘못된 코드입니다.');
            }
        });
    }
});
