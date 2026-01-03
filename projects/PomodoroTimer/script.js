let timer;
let isRunning = false;
let timeLeft = 25 * 60;
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const modeBtns = document.querySelectorAll('.mode-btn');
const modes = { 'workBtn': 25, 'shortBreakBtn': 5, 'longBreakBtn': 15 };

function updateDisplay() {
    let m = Math.floor(timeLeft / 60);
    let s = timeLeft % 60;
    minutesDisplay.textContent = m < 10 ? '0' + m : m;
    secondsDisplay.textContent = s < 10 ? '0' + s : s;
    document.title = `${minutesDisplay.textContent}:${secondsDisplay.textContent} - Focus Timer`;
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    startBtn.classList.add('hidden');
    pauseBtn.classList.remove('hidden');
    timer = setInterval(() => {
        if (timeLeft > 0) { timeLeft--; updateDisplay(); }
        else { clearInterval(timer); isRunning = false; alert("Time's up!"); resetTimer(); }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
    startBtn.classList.remove('hidden');
    pauseBtn.classList.add('hidden');
}

function resetTimer() {
    pauseTimer();
    const activeMode = document.querySelector('.mode-btn.active').id;
    timeLeft = modes[activeMode] * 60;
    updateDisplay();
}

modeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        modeBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        timeLeft = modes[e.target.id] * 60;
        resetTimer();
    });
});

document.getElementById('startBtn').addEventListener('click', startTimer);
document.getElementById('pauseBtn').addEventListener('click', pauseTimer);
document.getElementById('resetBtn').addEventListener('click', resetTimer);
updateDisplay();