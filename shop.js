document.addEventListener('DOMContentLoaded', () => {
    const playerCoinsDisplay = document.getElementById('player-coins');
    const skinList = document.getElementById('skin-list');

    // --- 데이터 로드 ---
    let playerCoins = parseInt(localStorage.getItem('playerCoins') || '0');
    const unlockedSkins = JSON.parse(localStorage.getItem('unlockedSkins') || '["cyan"]'); // 기본 스킨
    const equippedSkin = localStorage.getItem('equippedSkin') || 'cyan';

    playerCoinsDisplay.textContent = playerCoins;

    // --- 사용 가능한 스킨 목록 ---
    const availableSkins = {
        // 이름: { price: 가격, color: CSS 색상 코드 }
        '기본 (하늘)': { price: 0, color: 'cyan' },
        '열정 (빨강)': { price: 100, color: 'red' },
        '희망 (초록)': { price: 100, color: 'lime' },
        '순수 (하양)': { price: 100, color: 'white' },
        '신비 (보라)': { price: 100, color: 'magenta' },
        '활기 (주황)': { price: 100, color: 'orange' },
    };

    // 치트키로 해금된 특별 스킨 추가
    if (localStorage.getItem('unlockedCrossSkin') === 'true') {
        availableSkins['십자가 (갈색)'] = { price: 0, color: 'saddlebrown', shape: 'cross' };
    }

    // --- 상점 UI 렌더링 ---
    function renderSkins() {
        skinList.innerHTML = '';
        for (const skinName in availableSkins) {
            const skin = availableSkins[skinName];
            const skinItem = document.createElement('div');
            skinItem.className = 'skin-item';

            let buttonHtml;
            if (unlockedSkins.includes(skin.color)) {
                if (equippedSkin === skin.color) {
                    buttonHtml = `<button disabled>장착중</button>`;
                } else {
                    buttonHtml = `<button class="equip-btn" data-skin-color="${skin.color}">장착</button>`;
                }
            } else {
                buttonHtml = `<button class="buy-btn" data-skin-name="${skinName}">${skin.price} 코인</button>`;
            }

            skinItem.innerHTML = `
                <span style="color: ${skin.color};">■</span> ${skinName}
                ${buttonHtml}
            `;
            skinList.appendChild(skinItem);
        }
    }

    renderSkins();

    // --- 이벤트 리스너 (구매 및 장착) ---
    skinList.addEventListener('click', (e) => {
        // 구매 버튼 클릭
        if (e.target.classList.contains('buy-btn')) {
            const skinName = e.target.dataset.skinName;
            const skinToBuy = availableSkins[skinName];

            if (playerCoins >= skinToBuy.price) {
                playerCoins -= skinToBuy.price;
                unlockedSkins.push(skinToBuy.color);

                localStorage.setItem('playerCoins', playerCoins);
                localStorage.setItem('unlockedSkins', JSON.stringify(unlockedSkins));

                playerCoinsDisplay.textContent = playerCoins;
                alert(`${skinName} 스킨을 구매했습니다!`);
                renderSkins(); // UI 업데이트
            } else {
                alert('코인이 부족합니다.');
            }
        }

        // 장착 버튼 클릭
        if (e.target.classList.contains('equip-btn')) {
            const skinColor = e.target.dataset.skinColor;
            const skinToEquip = Object.values(availableSkins).find(s => s.color === skinColor);
            const skinData = {
                color: skinToEquip.color,
                shape: skinToEquip.shape || 'arrow' // 기본 모양은 arrow
            };
            localStorage.setItem('equippedSkin', JSON.stringify(skinData));
            alert('스킨을 장착했습니다.');
            location.reload(); // 페이지 새로고침으로 상태 반영
        }
    });
});
