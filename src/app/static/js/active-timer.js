const urlParams = new URLSearchParams(window.location.search);
let learningTime = parseInt(urlParams.get('learning')) || 30;
let breakTime = parseInt(urlParams.get('break_time')) || 5;
let rewardType = urlParams.get('reward_type') || 'animals'; // Get reward_type

let isLearning = true;
let timeRemaining = learningTime * 60;
let timerInterval;

// Initialize the timer display immediately
function initializeTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById('timer').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById('timer').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

async function showReward() {
    let imageUrl = '';
    let rewardTypeName = rewardType === 'lol_skins' ? 'LOL Skin' : 'Animal';
    let champion = '';
    let skin = '';
    let animalType = '';

    // Get existing rewards from localStorage
    const rewards = JSON.parse(localStorage.getItem('rewards')) || [];

    if (rewardType === 'lol_skins') {
        const champions = ['Ahri', 'Lux', 'Seraphine', 'Lulu', 'Morgana',
            'Yuumi', 'Sona', 'Janna', 'Zyra', 'Heimerdinger', 'Nami', 'Soraka',
            'Jinx', 'MissFortune', 'Ashe', 'Caitlyn', 'Vayne', 'Jhin', 'Kaisa',
            'Katarina', 'Samira', 'Leblanc', 'Senna', 'Smolder', 'Syndra', 'Xayah',
        ];

        let isDuplicate = true;

        while (isDuplicate) {
            const randomChampion = champions[Math.floor(Math.random() * champions.length)];
            const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/13.19.1/data/en_US/champion/${randomChampion}.json`);
            const data = await response.json();
            const skins = data.data[randomChampion].skins;
            const randomSkin = skins[Math.floor(Math.random() * (skins.length - 1)) + 1]; // Exclude default skin
            imageUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${randomChampion}_${randomSkin.num}.jpg`;
            champion = randomChampion;
            skin = randomSkin.name;

            // Check if the reward is a duplicate
            isDuplicate = rewards.some(r => r.champion === champion && r.skin === skin);
        }

    } else {
        let isDuplicate = true;

        // Available animal APIs
        const animalApis = [
            { type: 'Cat', url: 'https://api.thecatapi.com/v1/images/search' },
            { type: 'Dog', url: 'https://api.thedogapi.com/v1/images/search' },
            { type: 'Fox', url: 'https://randomfox.ca/floof/' },
            { type: 'Bunny', url: 'https://api.bunnies.io/v2/loop/random/?media=gif,png' }
        ];

        while (isDuplicate) {
            // Randomly select an API to use
            const randomAnimalApi = animalApis[Math.floor(Math.random() * animalApis.length)];
            animalType = randomAnimalApi.type;

            try {
                const response = await fetch(randomAnimalApi.url);
                const data = await response.json();

                if (animalType === 'Fox') {
                    imageUrl = data.image;
                } else if (animalType === 'Bunny') {
                    imageUrl = data.media.gif || data.media.png;
                } else {
                    imageUrl = data[0].url;
                }

                // Check if the reward is a duplicate
                isDuplicate = rewards.some(r => r.url === imageUrl);
            } catch (error) {
                console.error(`Error fetching ${animalType} image:`, error);
                isDuplicate = false; // Prevent infinite loop in case of API failure
            }
        }
    }

    // Save the reward to localStorage
    const reward = {
        type: rewardTypeName,
        url: imageUrl,
        timestamp: new Date().toLocaleString(),
        champion: champion,
        skin: skin,
        animalType: rewardType === 'lol_skins' ? null : animalType
    };
    saveReward(reward);

    // Display the reward in the pop-up
    const rewardImage = document.getElementById('rewardImage');
    const rewardTitle = document.getElementById('rewardTitle');
    rewardImage.src = imageUrl;

    if (rewardType === 'lol_skins') {
        rewardTitle.textContent = `Your Reward: ${champion} - ${skin}`;
    } else {
        rewardTitle.textContent = `Your Reward: Cute ${animalType}!`;
    }

    const rewardModal = new bootstrap.Modal(document.getElementById('rewardModal'));
    rewardModal.show();
}

function saveReward(reward) {
    // Get existing rewards from localStorage
    const rewards = JSON.parse(localStorage.getItem('rewards')) || [];
    // Add the new reward
    rewards.push(reward);
    // Save back to localStorage
    localStorage.setItem('rewards', JSON.stringify(rewards));
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeRemaining--;
        if (timeRemaining < 0) {
            clearInterval(timerInterval);
            if (isLearning) {
                // Update session statistics
                updateSessionStatistics(learningTime * 60); // Convert minutes to seconds

                // Show the reward pop-up
                showReward();

                // Switch to break timer
                isLearning = false;
                timeRemaining = breakTime * 60;
                document.getElementById('timer-label').textContent = 'Break Time';
                initializeTimerDisplay();
                startTimer();
            } else {
                // Break is over, show controls
                document.getElementById('controls').style.display = 'block';
                document.getElementById('timer-label').textContent = 'Time is up!';
            }
            return;
        }
        updateTimerDisplay();
    }, 1000);
}

function startTimers() {
    window.location.href = `/active-timer?learning=${learningTime}&break_time=${breakTime}&reward_type=${rewardType}`;
}

// Initialize the timer display immediately
initializeTimerDisplay();

// Start the timer automatically
startTimer();