const players = document.querySelectorAll('.player');
const aCategoryInputs = document.querySelectorAll('.category-a .category-box');
const bCategoryInputs = document.querySelectorAll('.category-b .category-box');
const smallClearButtons = document.querySelectorAll('.small-clear-button');

// Rastgele isim atama fonksiyonu
const distributeNames = () => {
    // A ve B kategorilerindeki inputları ve isimleri al
    const aInputs = Array.from(aCategoryInputs);
    const bInputs = Array.from(bCategoryInputs);
    const aNames = aInputs.map(input => input.value).filter(name => name);
    const bNames = bInputs.map(input => input.value).filter(name => name);

    // Kırmızı ve gri takım oyuncu dizinleri
    const redTeamIndexes = Array.from({ length: 7 }, (_, i) => i); // 0-6 arasındaki indeksler
    const grayTeamIndexes = Array.from({ length: 7 }, (_, i) => i + 7); // 7-13 arasındaki indeksler

    // İsimleri ve oyuncuları rastgele karıştır
    const shuffleArray = (array) => array.sort(() => 0.5 - Math.random());
    const shuffledANames = shuffleArray(aNames);
    const shuffledBNames = shuffleArray(bNames);
    const shuffledRedTeamIndexes = shuffleArray(redTeamIndexes);
    const shuffledGrayTeamIndexes = shuffleArray(grayTeamIndexes);

    // Kırmızı takım oyuncularını ve inputlarını sıfırla
    redTeamIndexes.forEach(index => {
        players[index].querySelector('.name').textContent = ''; // Oyuncu ismini temizle
    });

    // Gri takım oyuncularını ve inputlarını sıfırla
    grayTeamIndexes.forEach(index => {
        players[index].querySelector('.name').textContent = ''; // Oyuncu ismini temizle
    });

    // Karıştırılmış isimleri kırmızı takıma dağıt
    shuffledANames.forEach((name, index) => {
        const playerIndex = shuffledRedTeamIndexes[index];
        players[playerIndex].querySelector('.name').textContent = name;

        // Category box'taki ilgili input kutusunu güncelle
        aInputs[playerIndex].value = name;
    });

    // Boş kalan A kutularını temizle
    for (let i = shuffledANames.length; i < aInputs.length; i++) {
        aInputs[i].value = '';
    }

    // Karıştırılmış isimleri gri takıma dağıt
    shuffledBNames.forEach((name, index) => {
        const playerIndex = shuffledGrayTeamIndexes[index];
        players[playerIndex].querySelector('.name').textContent = name;

        // Category box'taki ilgili input kutusunu güncelle
        bInputs[playerIndex - 7].value = name;
    });

    // Boş kalan B kutularını temizle
    for (let i = shuffledBNames.length; i < bInputs.length; i++) {
        bInputs[i].value = '';
    }
};


const clearSmallInput = (event) => {
    const inputField = event.target.previousElementSibling;

    // Input kutusunun bulunduğu kategori
    const isCategoryA = event.target.closest('.category-a');
    const isCategoryB = event.target.closest('.category-b');

    // Input kutusunun sırasını al
    const inputIndex = Array.from(isCategoryA ? aCategoryInputs : bCategoryInputs).indexOf(inputField);

    // Oyuncu ismini temizle
    if (isCategoryA) {
        players[inputIndex].querySelector('.name').textContent = '';
    } else if (isCategoryB) {
        players[inputIndex + 7].querySelector('.name').textContent = '';
    }

    // Input kutusunu temizle
    inputField.value = '';
};

// Butonlara olay dinleyicileri
document.getElementById('distributeNamesButton').addEventListener('click', distributeNames);
smallClearButtons.forEach(button => {
    button.addEventListener('click', clearSmallInput);
});

// Mevcut sürükle ve bırak işlevselliği
const saha = document.getElementById('saha');

players.forEach(player => {
    player.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text', player.id);
    });

    player.addEventListener('dragend', () => {
        player.style.transition = 'top 0.2s, left 0.2s'; // Yumuşak geçiş
    });
});

saha.addEventListener('dragover', (e) => {
    e.preventDefault();
});

// Sürükle ve bırak olayları
players.forEach(player => {
    player.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text', player.id);
        // Fare imlecinin başlangıç konumunu kaydedin
        const rect = player.getBoundingClientRect();
        e.dataTransfer.setData('offsetX', e.clientX - rect.left);
        e.dataTransfer.setData('offsetY', e.clientY - rect.top);
    });
});

saha.addEventListener('dragover', (e) => {
    e.preventDefault();
});

saha.addEventListener('drop', (e) => {
    e.preventDefault();
    const playerId = e.dataTransfer.getData('text');
    const player = document.getElementById(playerId);

    // Fare imlecinin başlangıçta oyuncuya göre olan offset'ini alın
    const offsetX = parseFloat(e.dataTransfer.getData('offsetX'));
    const offsetY = parseFloat(e.dataTransfer.getData('offsetY'));

    // Sahanın konum ve boyut bilgileri
    const sahaRect = saha.getBoundingClientRect();

    // Yeni pozisyonu hesaplayın
    const newLeft = e.clientX - sahaRect.left - offsetX;
    const newTop = e.clientY - sahaRect.top - offsetY;

    // Oyuncuyu yeni pozisyona yerleştirin
    player.style.position = 'absolute';
    player.style.left = `${newLeft}px`;
    player.style.top = `${newTop}px`;

    // Akıcı bir geçiş için stil ekleyin
    player.style.transition = 'top 0.1s ease-out, left 0.1s ease-out';
});


// Sıfırla butonu
const resetInputs = () => {
// A ve B kategorilerindeki kutuları temizle
aCategoryInputs.forEach(input => input.value = '');
bCategoryInputs.forEach(input => input.value = '');

// Sahadaki oyuncu isimlerini temizle
players.forEach(player => {
    player.querySelector('.name').textContent = ''; // Oyuncu isimlerini sıfırla
});
};

// Sıfırla butonu clickleme
document.getElementById('resetButton').addEventListener('click', resetInputs);

async function captureScreenshot() {
    const saha = document.querySelector('.saha');

    // Import html2canvas library dynamically
    if (!window.html2canvas) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
        document.head.appendChild(script);

        await new Promise(resolve => {
            script.onload = resolve;
        });
    }

    // Capture screenshot of the green box
    html2canvas(saha).then(async canvas => {
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

        // Copy the screenshot to clipboard
        try {
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);
            alert('Ekran Görüntüsü Alındı!.');
        } catch (error) {
            console.error('Alınamadı!:', error);
        }
    });
}
function redirectTo(url) {
    // Yeni sekmede ilgili URL'ye yönlendir
    window.open(url, '_blank');
}
// Oyuncu ekleme ve çıkarma işlevleri
const addPlayerToTeam = (team) => {
    const category = team === 1 ? document.querySelector('.category-a') : document.querySelector('.category-b');
    const saha = document.getElementById('saha');

    // Oyuncu sayısı kontrolü (en fazla 11)
    const currentPlayerCount = category.querySelectorAll('.category-item').length;
    if (currentPlayerCount >= 11) {
        alert('Bu takımda en fazla 11 oyuncu olabilir!');
        return;
    }

    // Yeni bir oyuncu divi oluştur
    const newPlayerDiv = document.createElement('div');
    newPlayerDiv.classList.add('category-item');

    const playerLabel = document.createElement('span');
    playerLabel.classList.add('category-label');
    const playerCount = currentPlayerCount + 1;
    playerLabel.textContent = `${playerCount}.`;

    const playerInput = document.createElement('input');
    playerInput.type = 'text';
    playerInput.classList.add('category-box');
    playerInput.placeholder = 'İsim';

    const removeButton = document.createElement('button');
    removeButton.classList.add('small-clear-button');
    removeButton.textContent = 'X';
    removeButton.addEventListener('click', () => {
        // Oyuncuyu sahadan ve kategoriden kaldır
        saha.removeChild(document.getElementById(`team${team}-player${playerCount}`));
        category.removeChild(newPlayerDiv);
    });

    newPlayerDiv.appendChild(playerLabel);
    newPlayerDiv.appendChild(playerInput);
    newPlayerDiv.appendChild(removeButton);

    category.appendChild(newPlayerDiv);

    // Sahaya yeni oyuncu ekle
    const newPlayerOnField = document.createElement('div');
    newPlayerOnField.id = `team${team}-player${playerCount}`;
    newPlayerOnField.classList.add('player');

    // Takıma göre renk ve konum ayarı
    const box = document.createElement('div');
    box.classList.add('box', team === 1 ? 'red' : 'yellow');
    box.textContent = 'P'; // Varsayılan oyuncu tipi

    const name = document.createElement('div');
    name.classList.add('name');
    name.textContent = `Oyuncu ${playerCount}`;

    newPlayerOnField.appendChild(box);
    newPlayerOnField.appendChild(name);

    // Konum belirleme
    if (team === 1) {
        newPlayerOnField.style.top = `${50 + (playerCount - 1) * 10}px`;
        newPlayerOnField.style.left = `200px`;
    } else {
        newPlayerOnField.style.top = `${50 + (playerCount - 1) * 10}px`;
        newPlayerOnField.style.left = `400px`;
    }

    newPlayerOnField.draggable = true;
    saha.appendChild(newPlayerOnField);
};

const removePlayerFromTeam = (team) => {
    const category = team === 1 ? document.querySelector('.category-a') : document.querySelector('.category-b');
    const players = category.querySelectorAll('.category-item');

    // Oyuncu sayısı kontrolü (en az 7)
    if (players.length <= 7) {
        alert('Bu takımda en az 7 oyuncu olmalı!');
        return;
    }

    // Son oyuncuyu sil
    const lastPlayer = players[players.length - 1];
    const playerCount = players.length;
    const saha = document.getElementById('saha');
    saha.removeChild(document.getElementById(`team${team}-player${playerCount}`));
    category.removeChild(lastPlayer);
};

// Olay dinleyicilerini düğmelere ekle
const addPlayer1Button = document.getElementById('addPlayer1');
const addPlayer2Button = document.getElementById('addPlayer2');
const removePlayer1Button = document.getElementById('removePlayer1');
const removePlayer2Button = document.getElementById('removePlayer2');

addPlayer1Button.addEventListener('click', () => addPlayerToTeam(1));
addPlayer2Button.addEventListener('click', () => addPlayerToTeam(2));
removePlayer1Button.addEventListener('click', () => removePlayerFromTeam(1));
removePlayer2Button.addEventListener('click', () => removePlayerFromTeam(2));

