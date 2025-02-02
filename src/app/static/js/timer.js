let learningTime = 30; // Initial learning time in minutes
let breakTime = 5; // Initial break time in minutes
let rewardType = new URLSearchParams(window.location.search).get('reward_type') || 'animals'; // Get reward_type from URL

function updateTimerDisplay() {
    document.getElementById('learning-timer').textContent = `${learningTime}:00`;
    document.getElementById('break-timer').textContent = `${breakTime < 10 ? '0' : ''}${breakTime}:00`;
}

function adjustTime(timerType, minutes) {
    if (timerType === 'learning') {
        learningTime = Math.max(1, Math.min(60, learningTime + minutes));
    } else if (timerType === 'break') {
        breakTime = Math.max(1, Math.min(15, breakTime + minutes));
    }
    updateTimerDisplay();
}

function startTimers() {
    window.location.href = `/active-timer?learning=${learningTime}&break_time=${breakTime}&reward_type=${rewardType}`;
}

// Initialize the timer display
updateTimerDisplay();

// Cherry blossom animation
function createCherryBlossoms() {
    const container = document.getElementById("cherry-blossoms");
    for (let i = 10; i <= 90; i += 10) {
        let blossom = document.createElement("div");
        blossom.classList.add("cherry-blossom");
        blossom.style.left = `${i}%`;
        blossom.style.animationDelay = `${i * 0.2}s`;
        blossom.textContent = "🌸";
        container.appendChild(blossom);
    }
}
createCherryBlossoms();
