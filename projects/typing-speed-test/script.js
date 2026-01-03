/**
 * Typing Speed Test - Core JavaScript
 * Features: WPM calculation, Accuracy tracking, Leaderboard, Difficulty levels
 */

// ===================================
// Sentence Database by Difficulty
// ===================================
const sentences = {
    easy: [
        "The quick brown fox jumps over the lazy dog.",
        "A journey of a thousand miles begins with a single step.",
        "Practice makes perfect.",
        "Actions speak louder than words.",
        "Time flies when you are having fun.",
        "The early bird catches the worm.",
        "Every cloud has a silver lining.",
        "Keep your friends close and your enemies closer.",
        "What goes around comes around.",
        "Better late than never.",
        "Simple is the best way to go.",
        "Cats love to sleep all day long.",
        "The sun rises in the east every morning.",
        "Good things come to those who wait.",
        "A picture is worth a thousand words."
    ],
    medium: [
        "The only way to do great work is to love what you do and never give up on your dreams.",
        "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "In the middle of difficulty lies opportunity for those who seek it with determination.",
        "Life is what happens when you are busy making other plans for the future.",
        "The greatest glory in living lies not in never falling, but in rising every time we fall.",
        "It does not matter how slowly you go as long as you do not stop moving forward.",
        "The future belongs to those who believe in the beauty of their dreams and work hard.",
        "You must be the change you wish to see in the world around you every single day.",
        "Education is the most powerful weapon which you can use to change the world for good.",
        "The best time to plant a tree was twenty years ago. The second best time is now."
    ],
    hard: [
        "The development of full artificial intelligence could spell the end of the human race, but it could also be the greatest achievement in our history if we handle it responsibly.",
        "Programming is not about typing, it's about thinking. The most valuable skill a developer can have is the ability to break down complex problems into simple, manageable pieces.",
        "Quantum computing represents a fundamental shift in computational paradigms, leveraging the principles of superposition and entanglement to solve previously intractable problems.",
        "The intersection of technology and creativity has given rise to unprecedented opportunities for innovation, challenging us to reimagine the boundaries of what is possible.",
        "Machine learning algorithms have revolutionized the way we process and analyze data, enabling systems to learn from experience and improve their performance over time.",
        "Cybersecurity has become increasingly critical as our digital infrastructure expands, requiring constant vigilance and sophisticated defensive measures to protect sensitive information.",
        "The blockchain technology underlying cryptocurrencies offers a decentralized approach to maintaining secure, transparent, and immutable records across distributed networks.",
        "Software architecture decisions made early in a project can have profound implications on scalability, maintainability, and the overall success of the application.",
        "Understanding the intricacies of asynchronous programming is essential for building responsive applications that can handle multiple operations concurrently without blocking.",
        "The principles of clean code emphasize readability, simplicity, and maintainability, recognizing that code is read far more often than it is written by developers."
    ]
};

// ===================================
// State Management
// ===================================
let state = {
    difficulty: 'easy',
    currentText: '',
    typedText: '',
    isRunning: false,
    startTime: null,
    timerInterval: null,
    correctChars: 0,
    incorrectChars: 0,
    currentIndex: 0
};

// ===================================
// DOM Elements
// ===================================
const elements = {
    textDisplay: document.getElementById('textDisplay'),
    typingInput: document.getElementById('typingInput'),
    startBtn: document.getElementById('startBtn'),
    resetBtn: document.getElementById('resetBtn'),
    timer: document.getElementById('timer'),
    wpm: document.getElementById('wpm'),
    accuracy: document.getElementById('accuracy'),
    chars: document.getElementById('chars'),
    progressFill: document.getElementById('progressFill'),
    resultsModal: document.getElementById('resultsModal'),
    finalWpm: document.getElementById('finalWpm'),
    finalAccuracy: document.getElementById('finalAccuracy'),
    finalTime: document.getElementById('finalTime'),
    finalDifficulty: document.getElementById('finalDifficulty'),
    playerName: document.getElementById('playerName'),
    saveScoreBtn: document.getElementById('saveScoreBtn'),
    saveScoreSection: document.getElementById('saveScoreSection'),
    tryAgainBtn: document.getElementById('tryAgainBtn'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    leaderboardTable: document.getElementById('leaderboardTable'),
    difficultyBtns: document.querySelectorAll('.diff-btn'),
    filterBtns: document.querySelectorAll('.filter-btn')
};

// ===================================
// Utility Functions
// ===================================
function getRandomSentence(difficulty) {
    const sentenceList = sentences[difficulty];
    return sentenceList[Math.floor(Math.random() * sentenceList.length)];
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function calculateWPM(charCount, timeInSeconds) {
    if (timeInSeconds === 0) return 0;
    const words = charCount / 5; // Standard: 5 chars = 1 word
    const minutes = timeInSeconds / 60;
    return Math.round(words / minutes);
}

function calculateAccuracy(correct, total) {
    if (total === 0) return 100;
    return Math.round((correct / total) * 100);
}

// ===================================
// Display Functions
// ===================================
function renderText() {
    const chars = state.currentText.split('');
    let html = '';

    chars.forEach((char, index) => {
        let className = 'char';

        if (index < state.currentIndex) {
            // Already typed
            if (state.typedText[index] === char) {
                className += ' correct';
            } else {
                className += ' incorrect';
            }
        } else if (index === state.currentIndex) {
            className += ' current';
        }

        // Handle spaces for visibility
        const displayChar = char === ' ' ? '&nbsp;' : char;
        html += `<span class="${className}">${displayChar}</span>`;
    });

    elements.textDisplay.innerHTML = html;
}

function updateStats() {
    const elapsed = state.startTime ? Math.floor((Date.now() - state.startTime) / 1000) : 0;
    const totalTyped = state.correctChars + state.incorrectChars;

    elements.timer.textContent = formatTime(elapsed);
    elements.wpm.textContent = calculateWPM(state.correctChars, elapsed);
    elements.accuracy.textContent = calculateAccuracy(state.correctChars, totalTyped) + '%';
    elements.chars.textContent = `${state.currentIndex}/${state.currentText.length}`;

    // Update progress bar
    const progress = (state.currentIndex / state.currentText.length) * 100;
    elements.progressFill.style.width = `${progress}%`;
}

function updateDifficultyButtons() {
    elements.difficultyBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.difficulty === state.difficulty);
    });
}

// ===================================
// Game Logic
// ===================================
function startTest() {
    // Get a random sentence
    state.currentText = getRandomSentence(state.difficulty);
    state.typedText = '';
    state.currentIndex = 0;
    state.correctChars = 0;
    state.incorrectChars = 0;
    state.isRunning = true;
    state.startTime = Date.now();

    // Update UI
    renderText();
    elements.textDisplay.classList.add('active');
    elements.typingInput.disabled = false;
    elements.typingInput.value = '';
    elements.typingInput.focus();
    elements.startBtn.disabled = true;
    elements.resetBtn.disabled = false;

    // Disable difficulty selection during test
    elements.difficultyBtns.forEach(btn => btn.disabled = true);

    // Start timer
    elements.timerInterval = setInterval(updateStats, 100);
}

function endTest() {
    state.isRunning = false;
    clearInterval(elements.timerInterval);

    const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
    const totalTyped = state.correctChars + state.incorrectChars;
    const finalWpm = calculateWPM(state.correctChars, elapsed);
    const finalAccuracy = calculateAccuracy(state.correctChars, totalTyped);

    // Update final stats
    elements.finalWpm.textContent = finalWpm;
    elements.finalAccuracy.textContent = finalAccuracy + '%';
    elements.finalTime.textContent = formatTime(elapsed);
    elements.finalDifficulty.textContent = state.difficulty.charAt(0).toUpperCase() + state.difficulty.slice(1);

    // Store results for saving
    state.finalResults = {
        wpm: finalWpm,
        accuracy: finalAccuracy,
        time: elapsed,
        difficulty: state.difficulty
    };

    // Show modal
    elements.resultsModal.classList.add('active');
    elements.saveScoreSection.style.display = 'flex';
    elements.playerName.value = '';
    elements.playerName.focus();
}

function resetTest() {
    state.isRunning = false;
    state.typedText = '';
    state.currentIndex = 0;
    state.correctChars = 0;
    state.incorrectChars = 0;
    state.startTime = null;
    clearInterval(elements.timerInterval);

    // Reset UI
    elements.textDisplay.innerHTML = '<span class="placeholder-text">Click "Start Test" to begin...</span>';
    elements.textDisplay.classList.remove('active');
    elements.typingInput.disabled = true;
    elements.typingInput.value = '';
    elements.startBtn.disabled = false;
    elements.resetBtn.disabled = true;
    elements.timer.textContent = '0:00';
    elements.wpm.textContent = '0';
    elements.accuracy.textContent = '100%';
    elements.chars.textContent = '0/0';
    elements.progressFill.style.width = '0%';

    // Re-enable difficulty selection
    elements.difficultyBtns.forEach(btn => btn.disabled = false);
}

function handleTyping(e) {
    if (!state.isRunning) return;

    const typed = e.target.value;
    state.typedText = typed;
    state.currentIndex = typed.length;

    // Calculate correct/incorrect
    state.correctChars = 0;
    state.incorrectChars = 0;

    for (let i = 0; i < typed.length; i++) {
        if (typed[i] === state.currentText[i]) {
            state.correctChars++;
        } else {
            state.incorrectChars++;
        }
    }

    renderText();
    updateStats();

    // Check if test is complete
    if (typed.length >= state.currentText.length) {
        endTest();
    }
}

// ===================================
// Max-Heap Data Structure for Leaderboard
// ===================================
// We use a Min-Heap internally to track the MINIMUM score
// This allows efficient removal of lowest performer when heap is full

class LeaderboardHeap {
    constructor(maxSize = 10) {
        this.maxSize = maxSize;
        this.heap = []; // Min-heap based on WPM (lowest WPM at top for easy removal)
    }

    // Get parent index
    parentIndex(i) {
        return Math.floor((i - 1) / 2);
    }

    // Get left child index
    leftChildIndex(i) {
        return 2 * i + 1;
    }

    // Get right child index
    rightChildIndex(i) {
        return 2 * i + 2;
    }

    // Swap two elements
    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    // Compare function - returns true if a has lower priority (lower WPM)
    hasLowerPriority(a, b) {
        // Primary: lower WPM has lower priority
        if (a.wpm !== b.wpm) return a.wpm < b.wpm;
        // Secondary: lower accuracy has lower priority
        if (a.accuracy !== b.accuracy) return a.accuracy < b.accuracy;
        // Tertiary: older entries have lower priority
        return a.date < b.date;
    }

    // Heapify up - maintain heap property after insertion
    heapifyUp(index) {
        while (index > 0) {
            const parent = this.parentIndex(index);
            // Min-heap: parent should have lower priority (lower WPM)
            if (this.hasLowerPriority(this.heap[parent], this.heap[index])) {
                break;
            }
            this.swap(index, parent);
            index = parent;
        }
    }

    // Heapify down - maintain heap property after removal
    heapifyDown(index) {
        const size = this.heap.length;
        while (true) {
            let smallest = index;
            const left = this.leftChildIndex(index);
            const right = this.rightChildIndex(index);

            // Find smallest among current, left child, and right child
            if (left < size && this.hasLowerPriority(this.heap[left], this.heap[smallest])) {
                smallest = left;
            }
            if (right < size && this.hasLowerPriority(this.heap[right], this.heap[smallest])) {
                smallest = right;
            }

            if (smallest === index) break;

            this.swap(index, smallest);
            index = smallest;
        }
    }

    // Get minimum element (lowest WPM)
    peek() {
        return this.heap.length > 0 ? this.heap[0] : null;
    }

    // Remove and return minimum element
    extractMin() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown(0);
        return min;
    }

    // Insert new entry - automatically removes lowest performer if full
    insert(entry) {
        entry.date = Date.now();

        if (this.heap.length < this.maxSize) {
            // Heap not full, just add
            this.heap.push(entry);
            this.heapifyUp(this.heap.length - 1);
            return { added: true, removed: null };
        }

        // Heap is full - check if new entry is better than minimum
        const min = this.peek();
        if (this.hasLowerPriority(min, entry)) {
            // New entry is better, remove minimum and add new
            const removed = this.extractMin();
            this.heap.push(entry);
            this.heapifyUp(this.heap.length - 1);
            return { added: true, removed: removed };
        }

        // New entry is worse than all existing entries
        return { added: false, removed: null };
    }

    // Get all entries sorted by WPM (descending)
    getSortedEntries() {
        return [...this.heap].sort((a, b) => {
            if (b.wpm !== a.wpm) return b.wpm - a.wpm;
            if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
            return b.date - a.date;
        });
    }

    // Get current size
    size() {
        return this.heap.length;
    }

    // Check if empty
    isEmpty() {
        return this.heap.length === 0;
    }

    // Load from array (rebuild heap)
    loadFromArray(entries) {
        this.heap = [];
        entries.forEach(entry => this.insert(entry));
    }

    // Get raw heap data for storage
    toArray() {
        return [...this.heap];
    }
}

// Global leaderboard heap instance
const leaderboardHeap = new LeaderboardHeap(10);

// ===================================
// Leaderboard Functions
// ===================================
function getLeaderboard() {
    const data = localStorage.getItem('typingSpeedLeaderboard');
    return data ? JSON.parse(data) : [];
}

function loadLeaderboardHeap() {
    const entries = getLeaderboard();
    leaderboardHeap.loadFromArray(entries);
}

function saveLeaderboardToStorage() {
    const entries = leaderboardHeap.toArray();
    localStorage.setItem('typingSpeedLeaderboard', JSON.stringify(entries));
}

function saveToLeaderboard(entry) {
    const result = leaderboardHeap.insert(entry);

    if (result.added) {
        saveLeaderboardToStorage();

        // Show notification about auto-removal if applicable
        if (result.removed) {
            showAutoRemovalNotification(result.removed);
        }
    }

    return result;
}

function showAutoRemovalNotification(removedEntry) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'auto-removal-notification';
    notification.innerHTML = `
        <i class="ri-information-line"></i>
        <span>Leaderboard full! Removed lowest score: ${removedEntry.name} (${removedEntry.wpm} WPM)</span>
    `;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function renderLeaderboard(filter = 'all') {
    let entries = leaderboardHeap.getSortedEntries();

    if (filter !== 'all') {
        entries = entries.filter(entry => entry.difficulty === filter);
    }

    if (entries.length === 0) {
        elements.leaderboardTable.innerHTML = `
            <div class="leaderboard-empty">
                <i class="ri-trophy-line"></i>
                <p>No scores yet. Be the first!</p>
            </div>
        `;
        return;
    }

    // Show heap info
    let html = `
        <div class="heap-info">
            <i class="ri-database-2-line"></i>
            <span>Using Max-Heap • ${leaderboardHeap.size()}/${leaderboardHeap.maxSize} entries • Auto-removes lowest scores</span>
        </div>
    `;

    entries.forEach((entry, index) => {
        let rankClass = '';
        if (index === 0) rankClass = 'gold';
        else if (index === 1) rankClass = 'silver';
        else if (index === 2) rankClass = 'bronze';

        html += `
            <div class="leaderboard-entry ${rankClass}">
                <span class="rank">#${index + 1}</span>
                <span class="player-name">${escapeHtml(entry.name)}</span>
                <span class="entry-wpm">${entry.wpm} WPM</span>
                <span class="entry-accuracy">${entry.accuracy}%</span>
                <span class="entry-difficulty ${entry.difficulty}">${entry.difficulty}</span>
            </div>
        `;
    });

    elements.leaderboardTable.innerHTML = html;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===================================
// Event Listeners
// ===================================
function initEventListeners() {
    // Start button
    elements.startBtn.addEventListener('click', startTest);

    // Reset button
    elements.resetBtn.addEventListener('click', resetTest);

    // Typing input
    elements.typingInput.addEventListener('input', handleTyping);

    // Prevent paste
    elements.typingInput.addEventListener('paste', (e) => e.preventDefault());

    // Difficulty buttons
    elements.difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!state.isRunning) {
                state.difficulty = btn.dataset.difficulty;
                updateDifficultyButtons();
            }
        });
    });

    // Save score button
    elements.saveScoreBtn.addEventListener('click', () => {
        const name = elements.playerName.value.trim();
        if (!name) {
            elements.playerName.focus();
            elements.playerName.style.borderColor = 'var(--error)';
            return;
        }
        elements.playerName.style.borderColor = '';

        saveToLeaderboard({
            name: name,
            wpm: state.finalResults.wpm,
            accuracy: state.finalResults.accuracy,
            difficulty: state.finalResults.difficulty
        });

        elements.saveScoreSection.style.display = 'none';
        renderLeaderboard();
    });

    // Enter key to save score
    elements.playerName.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            elements.saveScoreBtn.click();
        }
    });

    // Try again button
    elements.tryAgainBtn.addEventListener('click', () => {
        elements.resultsModal.classList.remove('active');
        resetTest();
        setTimeout(startTest, 100);
    });

    // Close modal button
    elements.closeModalBtn.addEventListener('click', () => {
        elements.resultsModal.classList.remove('active');
        resetTest();
    });

    // Close modal on outside click
    elements.resultsModal.addEventListener('click', (e) => {
        if (e.target === elements.resultsModal) {
            elements.resultsModal.classList.remove('active');
            resetTest();
        }
    });

    // Filter buttons
    elements.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderLeaderboard(btn.dataset.filter);
        });
    });

    // Keyboard shortcut: Enter to start
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !state.isRunning && document.activeElement !== elements.playerName) {
            if (!elements.startBtn.disabled) {
                startTest();
            }
        }
        // Escape to reset
        if (e.key === 'Escape') {
            if (elements.resultsModal.classList.contains('active')) {
                elements.resultsModal.classList.remove('active');
                resetTest();
            } else if (state.isRunning) {
                resetTest();
            }
        }
    });
}

// ===================================
// Theme Sync - Match main site theme
// ===================================
function syncTheme() {
    // Check if we came from main site and get its theme
    try {
        const mainTheme = localStorage.getItem('theme');
        if (mainTheme) {
            document.documentElement.setAttribute('data-theme', mainTheme);
        }
    } catch (e) {
        // Fallback to system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }
}

// ===================================
// Initialize
// ===================================
function init() {
    syncTheme();
    loadLeaderboardHeap();
    initEventListeners();
    renderLeaderboard();
    updateDifficultyButtons();
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
