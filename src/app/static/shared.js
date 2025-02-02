// Function to save a reward to localStorage
function saveReward(reward) {
    const rewards = JSON.parse(localStorage.getItem('rewards')) || [];
    rewards.push(reward);
    localStorage.setItem('rewards', JSON.stringify(rewards));
}

async function showMyRewards() {
    const rewards = JSON.parse(localStorage.getItem('rewards')) || [];
    const rewardsContainer = document.getElementById('rewards-container');
    rewardsContainer.innerHTML = ''; // Clear previous content

    if (rewards.length === 0) {
        rewardsContainer.innerHTML = '<p>No rewards yet. Keep studying!</p>';
        return;
    }

    // Group rewards by champion (only for LOL Skins)
    const lolRewards = rewards.filter(reward => reward.type === 'LOL Skin');
    const animals = rewards.filter(reward => reward.type === 'Animal');

    const groupedLolRewards = {};
    lolRewards.forEach(reward => {
        if (!groupedLolRewards[reward.champion]) {
            groupedLolRewards[reward.champion] = [];
        }
        groupedLolRewards[reward.champion].push(reward);
    });

    // Fetch total skins for each champion (only if not cached)
    let championSkinData = JSON.parse(localStorage.getItem('championSkinData')) || {};

    for (const champion of Object.keys(groupedLolRewards)) {
        if (!championSkinData[champion]) {
            try {
                const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/13.19.1/data/en_US/champion/${champion}.json`);
                const data = await response.json();
                championSkinData[champion] = data.data[champion].skins.length - 1; // Exclude default skin
            } catch (error) {
                console.error(`Error fetching skins for ${champion}:`, error);
                championSkinData[champion] = '?'; // Fallback if API fails
            }
        }
    }

    // Save fetched data to localStorage to avoid redundant API calls
    localStorage.setItem('championSkinData', JSON.stringify(championSkinData));

    // Display LOL Skins grouped by champion
    for (const [champion, skins] of Object.entries(groupedLolRewards)) {
        const totalSkins = championSkinData[champion] || '?';
        const championSection = document.createElement('div');
        championSection.innerHTML = `<h4>${champion} (${skins.length}/${totalSkins} skins)</h4>`;
        rewardsContainer.appendChild(championSection);

        const lolGrid = document.createElement('div');
        lolGrid.style.display = 'flex';
        lolGrid.style.flexWrap = 'wrap';
        lolGrid.style.gap = '10px';
        lolGrid.style.marginBottom = '20px';

        skins.forEach(reward => {
            const rewardElement = document.createElement('div');
            rewardElement.style.border = '2px solid #d8a7a7';
            rewardElement.style.borderRadius = '10px';
            rewardElement.style.padding = '10px';
            rewardElement.style.width = '200px';
            rewardElement.style.textAlign = 'center';
            rewardElement.innerHTML = `
                <img src="${reward.url}" alt="${reward.type}" style="width: 100%; border-radius: 8px;">
                <p style="margin-top: 10px; font-size: 14px;">
                    <strong>${reward.champion}</strong><br>
                    ${reward.skin}<br>
                    <small>${reward.timestamp}</small>
                </p>
                <button onclick="confirmDeleteReward('${reward.url}')" style="margin-top: 5px; padding: 5px 10px; background-color: red; color: white; border: none; border-radius: 5px; cursor: pointer;">Delete</button>
            `;
            lolGrid.appendChild(rewardElement);
        });

        rewardsContainer.appendChild(lolGrid);
    }

    // Display Animal Rewards
    if (animals.length > 0) {
        const animalSection = document.createElement('div');
        animalSection.innerHTML = '<h4>Animals</h4>';
        rewardsContainer.appendChild(animalSection);

        const animalGrid = document.createElement('div');
        animalGrid.style.display = 'flex';
        animalGrid.style.flexWrap = 'wrap';
        animalGrid.style.gap = '10px';

        animals.forEach(reward => {
            const rewardElement = document.createElement('div');
            rewardElement.style.border = '2px solid #d8a7a7';
            rewardElement.style.borderRadius = '10px';
            rewardElement.style.padding = '10px';
            rewardElement.style.width = '200px';
            rewardElement.style.textAlign = 'center';
            rewardElement.innerHTML = `
                <img src="${reward.url}" alt="${reward.type}" style="width: 100%; border-radius: 8px;">
                <p style="margin-top: 10px; font-size: 14px;">
                    <small>${reward.timestamp}</small>
                </p>
                <button onclick="confirmDeleteReward('${reward.url}')" style="margin-top: 5px; padding: 5px 10px; background-color: red; color: white; border: none; border-radius: 5px; cursor: pointer;">Delete</button>
            `;
            animalGrid.appendChild(rewardElement);
        });

        rewardsContainer.appendChild(animalGrid);
    }

    // Show the modal
    const myRewardsModal = new bootstrap.Modal(document.getElementById('myRewardsModal'));
    myRewardsModal.show();
}


// Function to confirm deletion
function confirmDeleteReward(url) {
    if (confirm('Are you sure you want to delete this reward? This action cannot be undone.')) {
        deleteReward(url);
    }
}

// Function to delete a reward
function deleteReward(url) {
    let rewards = JSON.parse(localStorage.getItem('rewards')) || [];
    rewards = rewards.filter(reward => reward.url !== url); // Remove selected reward
    localStorage.setItem('rewards', JSON.stringify(rewards));
    showMyRewards(); // Refresh the rewards display
}


// Add event listener for the "My Rewards" button
document.addEventListener('DOMContentLoaded', () => {
    const myRewardsButton = document.getElementById('my-rewards-button');
    if (myRewardsButton) {
        myRewardsButton.addEventListener('click', showMyRewards);
    }
});
// Initialize session statistics
if (!sessionStorage.getItem('totalLearningTime')) {
    sessionStorage.setItem('totalLearningTime', 0); // Session learning time in seconds
}
if (!sessionStorage.getItem('totalRewards')) {
    sessionStorage.setItem('totalRewards', 0); // Session rewards earned
}

// Initialize all-time statistics in localStorage
if (!localStorage.getItem('allTimeLearningTime')) {
    localStorage.setItem('allTimeLearningTime', 0);
}
if (!localStorage.getItem('allTimeRewards')) {
    localStorage.setItem('allTimeRewards', 0);
}

// Function to update statistics
function updateSessionStatistics(learningTime) {
    // Update session statistics
    const totalLearningTime = parseInt(sessionStorage.getItem('totalLearningTime')) + learningTime;
    sessionStorage.setItem('totalLearningTime', totalLearningTime);

    const totalRewards = parseInt(sessionStorage.getItem('totalRewards')) + 1;
    sessionStorage.setItem('totalRewards', totalRewards);

    // Update all-time statistics
    const allTimeLearningTime = parseInt(localStorage.getItem('allTimeLearningTime')) + learningTime;
    localStorage.setItem('allTimeLearningTime', allTimeLearningTime);

    const allTimeRewards = parseInt(localStorage.getItem('allTimeRewards')) + 1;
    localStorage.setItem('allTimeRewards', allTimeRewards);
}

// Function to display statistics
function showStatistics() {
    const totalLearningTime = parseInt(sessionStorage.getItem('totalLearningTime')) || 0;
    const totalRewards = parseInt(sessionStorage.getItem('totalRewards')) || 0;

    const allTimeLearningTime = parseInt(localStorage.getItem('allTimeLearningTime')) || 0;
    const allTimeRewards = parseInt(localStorage.getItem('allTimeRewards')) || 0;

    const statisticsContent = `
        <p><strong>Session Statistics</strong></p>
        <p>Total Learning Time: ${Math.floor(totalLearningTime / 60)} minutes ${totalLearningTime % 60} seconds</p>
        <p>Total Rewards Earned: ${totalRewards}</p>
        <hr>
        <p><strong>All-Time Statistics</strong></p>
        <p>Total Learning Time: ${Math.floor(allTimeLearningTime / 60)} minutes ${allTimeLearningTime % 60} seconds</p>
        <p>Total Rewards Earned: ${allTimeRewards}</p>
    `;

    const statisticsContainer = document.getElementById('statistics-container');
    statisticsContainer.innerHTML = statisticsContent;

    // Show the statistics modal
    const statisticsModal = new bootstrap.Modal(document.getElementById('statisticsModal'));
    statisticsModal.show();
}


// Add event listener for the "Statistics" button
document.addEventListener('DOMContentLoaded', () => {
    const statisticsButton = document.getElementById('statistics-button');
    if (statisticsButton) {
        statisticsButton.addEventListener('click', showStatistics);
    }
});

// For deleting rewards
function deleteReward(url) {
    let rewards = JSON.parse(localStorage.getItem('rewards')) || [];
    rewards = rewards.filter(reward => reward.url !== url); // Remove by URL
    localStorage.setItem('rewards', JSON.stringify(rewards));
}

function deleteChampionRewards(championName) {
    let rewards = JSON.parse(localStorage.getItem('rewards')) || [];
    rewards = rewards.filter(reward => reward.champion !== championName); // Remove all skins from a champion
    localStorage.setItem('rewards', JSON.stringify(rewards));
}

function deleteAnimalRewards() {
    let rewards = JSON.parse(localStorage.getItem('rewards')) || [];
    rewards = rewards.filter(reward => reward.type !== 'Animal'); // Remove all animal rewards
    localStorage.setItem('rewards', JSON.stringify(rewards));
}

function clearAllRewards() {
    localStorage.removeItem('rewards'); // Deletes only the rewards
}
