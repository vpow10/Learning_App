let learningTime = 30; // Initial learning time in minutes
let breakTime = 5; // Initial break time in minutes
let rewardType = new URLSearchParams(window.location.search).get('reward_type') || 'animals'; // Get reward_type from URL

// Update timer display
function updateTimerDisplay() {
    document.getElementById('learning-timer').textContent = `${learningTime}:00`;
    document.getElementById('break-timer').textContent = `${breakTime < 10 ? '0' : ''}${breakTime}:00`;
}

// Adjust time for learning or break
function adjustTime(timerType, minutes) {
    if (timerType === 'learning') {
        learningTime += minutes;
        if (learningTime < 5) learningTime = 1;
        if (learningTime > 60) learningTime = 60;
    } else if (timerType === 'break') {
        breakTime += minutes;
        if (breakTime < 1) breakTime = 1;
        if (breakTime > 15) breakTime = 15;
    }
    updateTimerDisplay();
}

// Start timers and redirect to active-timer page
function startTimers() {
    window.location.href = `/active-timer?learning=${learningTime}&break_time=${breakTime}&reward_type=${rewardType}`;
}

// Initialize the timer display
updateTimerDisplay();
