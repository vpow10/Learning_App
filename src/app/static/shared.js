// Function to save a reward to localStorage
function saveReward(reward) {
    const rewards = JSON.parse(localStorage.getItem('rewards')) || [];
    rewards.push(reward);
    localStorage.setItem('rewards', JSON.stringify(rewards));
}

// Function to display rewards in the modal
function showMyRewards() {
    const rewards = JSON.parse(localStorage.getItem('rewards')) || [];
    const rewardsContainer = document.getElementById('rewards-container');
    rewardsContainer.innerHTML = ''; // Clear previous content

    if (rewards.length === 0) {
        rewardsContainer.innerHTML = '<p>No rewards yet. Keep studying!</p>';
    } else {
        rewards.forEach(reward => {
            const rewardElement = document.createElement('div');
            rewardElement.style.flex = '1 1 200px'; // Responsive layout
            rewardElement.innerHTML = `
                <img src="${reward.url}" alt="${reward.type}" style="width: 100%; border-radius: 10px;">
                <p style="text-align: center; margin-top: 5px;">
                    ${reward.type === 'LOL Skin' ? `${reward.champion} - ${reward.skin}` : reward.type} - ${reward.timestamp}
                </p>
            `;
            rewardsContainer.appendChild(rewardElement);
        });
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