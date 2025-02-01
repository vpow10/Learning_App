// Function to save a reward to localStorage
function saveReward(reward) {
    const rewards = JSON.parse(localStorage.getItem('rewards')) || [];
    rewards.push(reward);
    localStorage.setItem('rewards', JSON.stringify(rewards));
}

function showMyRewards() {
    const rewards = JSON.parse(localStorage.getItem('rewards')) || [];
    const rewardsContainer = document.getElementById('rewards-container');
    rewardsContainer.innerHTML = ''; // Clear previous content

    if (rewards.length === 0) {
        rewardsContainer.innerHTML = '<p>No rewards yet. Keep studying!</p>';
    } else {
        // Separate rewards into LOL Skins and Animals
        const lolSkins = rewards.filter(reward => reward.type === 'LOL Skin');
        const animals = rewards.filter(reward => reward.type === 'Animal');

        // Display LOL Skins
        if (lolSkins.length > 0) {
            const lolSection = document.createElement('div');
            lolSection.innerHTML = '<h4>LOL Skins</h4>';
            rewardsContainer.appendChild(lolSection);

            const lolGrid = document.createElement('div');
            lolGrid.style.display = 'flex';
            lolGrid.style.flexWrap = 'wrap';
            lolGrid.style.gap = '10px';
            lolGrid.style.marginBottom = '20px'; // Add space between sections

            lolSkins.forEach(reward => {
                const rewardElement = document.createElement('div');
                rewardElement.style.border = '2px solid #d8a7a7';
                rewardElement.style.borderRadius = '10px';
                rewardElement.style.padding = '10px';
                rewardElement.style.width = '200px'; // Fixed width for each reward
                rewardElement.style.textAlign = 'center';
                rewardElement.innerHTML = `
                    <img src="${reward.url}" alt="${reward.type}" style="width: 100%; border-radius: 8px;">
                    <p style="margin-top: 10px; font-size: 14px;">
                        <strong>${reward.champion}</strong><br>
                        ${reward.skin}<br>
                        <small>${reward.timestamp}</small>
                    </p>
                `;
                lolGrid.appendChild(rewardElement);
            });

            rewardsContainer.appendChild(lolGrid);
        }

        // Display Animals
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
                rewardElement.style.width = '200px'; // Fixed width for each reward
                rewardElement.style.textAlign = 'center';
                rewardElement.innerHTML = `
                    <img src="${reward.url}" alt="${reward.type}" style="width: 100%; border-radius: 8px;">
                    <p style="margin-top: 10px; font-size: 14px;">
                        <small>${reward.timestamp}</small>
                    </p>
                `;
                animalGrid.appendChild(rewardElement);
            });

            rewardsContainer.appendChild(animalGrid);
        }
    }

    // Show the modal
    const myRewardsModal = new bootstrap.Modal(document.getElementById('myRewardsModal'));
    myRewardsModal.show();
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
    sessionStorage.setItem('totalLearningTime', 0); // Total learning time in seconds
}
if (!sessionStorage.getItem('totalRewards')) {
    sessionStorage.setItem('totalRewards', 0); // Total rewards earned
}

// Function to update session statistics
function updateSessionStatistics(learningTime) {
    const totalLearningTime = parseInt(sessionStorage.getItem('totalLearningTime')) + learningTime;
    sessionStorage.setItem('totalLearningTime', totalLearningTime);

    const totalRewards = parseInt(sessionStorage.getItem('totalRewards')) + 1;
    sessionStorage.setItem('totalRewards', totalRewards);
}

// Function to display session statistics
function showStatistics() {
    const totalLearningTime = parseInt(sessionStorage.getItem('totalLearningTime')) || 0;
    const totalRewards = parseInt(sessionStorage.getItem('totalRewards')) || 0;

    const statisticsContent = `
        <p>Total Learning Time: ${Math.floor(totalLearningTime / 60)} minutes ${totalLearningTime % 60} seconds</p>
        <p>Total Rewards Earned: ${totalRewards}</p>
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