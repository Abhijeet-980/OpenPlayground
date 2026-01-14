document.addEventListener('DOMContentLoaded', () => {
    // State
    let currentDate = new Date();
    let selectedDate = new Date();
    let entries = JSON.parse(localStorage.getItem('gratitude_entries')) || {};

    // DOM Elements
    const calendarDays = document.getElementById('calendar-days');
    const monthYearDisplay = document.getElementById('current-month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const gratitudeInput = document.getElementById('gratitude-input');
    const displayDayName = document.getElementById('display-day-name');
    const displayFullDate = document.getElementById('display-full-date');
    const saveStatus = document.getElementById('save-status');
    const streakCount = document.getElementById('streak-count');
    const totalEntriesDisplay = document.getElementById('total-entries');
    const dailyQuote = document.getElementById('daily-quote');
    const shareBtn = document.getElementById('share-btn');
    const exportBtn = document.getElementById('export-btn');

    // Quotes
    const quotes = [
        "Gratitude turns what we have into enough.",
        "When you are grateful, fear disappears and abundance appears.",
        "Gratitude is a powerful catalyst for happiness.",
        "Enjoy the little things, for one day you may look back and realize they were the big things.",
        "The more grateful I am, the more beauty I see.",
        "Gratitude is the healthiest of all human emotions.",
        "Silent gratitude isn't very much to anyone.",
        "Gratitude is not only the greatest of virtues, but the parent of all others."
    ];

    // Initialize
    function init() {
        renderCalendar();
        updateEntryDisplay();
        updateStats();
        setRandomQuote();

        // Event Listeners
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });

        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });

        gratitudeInput.addEventListener('input', debounce(saveEntry, 1000));

        shareBtn.addEventListener('click', shareContent);
        exportBtn.addEventListener('click', exportJournal);
    }

    // Calendar Functions
    function renderCalendar() {
        calendarDays.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        monthYearDisplay.textContent = new Intl.DateTimeFormat('en-US', {
            month: 'long',
            year: 'numeric'
        }).format(currentDate);

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Add empty cells for days from previous month
        for (let i = 0; i < firstDayOfMonth; i++) {
            const cell = document.createElement('div');
            cell.classList.add('calendar-day', 'empty');
            calendarDays.appendChild(cell);
        }

        // Add actual days
        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement('div');
            cell.classList.add('calendar-day');
            cell.textContent = day;

            const cellDate = new Date(year, month, day);
            const dateStr = formatDateKey(cellDate);

            if (isSameDate(cellDate, selectedDate)) {
                cell.classList.add('active');
            }

            if (entries[dateStr]) {
                cell.classList.add('has-entry');
            }

            cell.addEventListener('click', () => {
                selectDate(new Date(year, month, day));
            });

            calendarDays.appendChild(cell);
        }
    }

    function selectDate(date) {
        selectedDate = date;
        updateEntryDisplay();
        renderCalendar();

        // Focus input if selecting today
        if (isSameDate(date, new Date())) {
            gratitudeInput.focus();
        }
    }

    // Storage Functions
    function saveEntry() {
        const dateStr = formatDateKey(selectedDate);
        const content = gratitudeInput.value.trim();

        if (content) {
            entries[dateStr] = content;
        } else {
            delete entries[dateStr];
        }

        localStorage.setItem('gratitude_entries', JSON.stringify(entries));

        showSaveStatus();
        updateStats();
        renderCalendar();
    }

    function updateEntryDisplay() {
        const dayOptions = { weekday: 'long' };
        const dateOptions = { month: 'long', day: 'numeric', year: 'numeric' };

        displayDayName.textContent = isSameDate(selectedDate, new Date())
            ? 'Today'
            : new Intl.DateTimeFormat('en-US', dayOptions).format(selectedDate);

        displayFullDate.textContent = new Intl.DateTimeFormat('en-US', dateOptions).format(selectedDate);

        const dateStr = formatDateKey(selectedDate);
        gratitudeInput.value = entries[dateStr] || '';
    }

    // Stats & UI Helpers
    function updateStats() {
        const total = Object.keys(entries).length;
        totalEntriesDisplay.textContent = total;
        streakCount.textContent = calculateStreak();
    }

    function calculateStreak() {
        let streak = 0;
        let checkDate = new Date();
        checkDate.setHours(0, 0, 0, 0);

        // Check today first, if not today, check yesterday
        let dateStr = formatDateKey(checkDate);
        if (!entries[dateStr]) {
            checkDate.setDate(checkDate.getDate() - 1);
            dateStr = formatDateKey(checkDate);
        }

        while (entries[dateStr]) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
            dateStr = formatDateKey(checkDate);
        }

        return streak;
    }

    function showSaveStatus() {
        saveStatus.classList.add('visible');
        setTimeout(() => {
            saveStatus.classList.remove('visible');
        }, 2000);
    }

    function showToast(message) {
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toast-message');
        toastMsg.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    function setRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        dailyQuote.textContent = `"${quotes[randomIndex]}"`;
    }

    function shareContent() {
        const content = gratitudeInput.value.trim();
        if (!content) {
            showToast("Write something first to share your joy!");
            return;
        }

        const text = `Today, I'm grateful for: ${content} #Gratitude #OpenPlayground`;
        if (navigator.share) {
            navigator.share({
                title: 'Daily Gratitude',
                text: text,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(text);
            showToast("Copied to clipboard! Share it anywhere.");
        }
    }

    function exportJournal() {
        const journalData = JSON.stringify(entries, null, 2);
        const blob = new Blob([journalData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gratitude-journal.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast("Journal exported successfully!");
    }

    // Utilities
    function formatDateKey(date) {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }

    function isSameDate(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    init();
});
