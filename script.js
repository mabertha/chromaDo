/* ===== STATE ===== */
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let currentPriority = 'Low';
let darkMode = JSON.parse(localStorage.getItem('darkMode')) ?? true;
let activeTheme = localStorage.getItem('activeTheme') || 'purple-blue';

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
    applyTheme(activeTheme);
    applyDarkMode();
    renderTasks();
    updateStats();
    bindEvents();
    setDefaultDate();
});

/* ===== BIND EVENTS ===== */
function bindEvents() {
    // Add task
    document.getElementById('add-btn').addEventListener('click', addTask);
    document.getElementById('new-task').addEventListener('keydown', e => {
        if (e.key === 'Enter') addTask();
    });

    // Dark mode toggle
    document.getElementById('mode-toggle').addEventListener('click', () => {
        darkMode = !darkMode;
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        applyDarkMode();
    });

    // Theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyTheme(btn.dataset.theme);
        });
    });

    // Priority options
    document.querySelectorAll('.priority-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.priority-option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            currentPriority = opt.dataset.priority;
        });
    });

    // Filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    // Clear completed
    document.getElementById('clear-completed').addEventListener('click', () => {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
        updateStats();
    });
}

/* ===== THEME & DARK MODE ===== */
function applyTheme(theme) {
    activeTheme = theme;
    localStorage.setItem('activeTheme', theme);
    document.body.dataset.activeTheme = theme;

    // sync active class on buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
}

function applyDarkMode() {
    document.body.classList.toggle('light-mode', !darkMode);
    const icon = document.querySelector('#mode-toggle i');
    icon.className = darkMode ? 'fas fa-moon' : 'fas fa-sun';
}

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('task-date').value = today;
}

/* ===== ADD TASK ===== */
function addTask() {
    const input = document.getElementById('new-task');
    const text = input.value.trim();
    if (!text) {
        input.focus();
        input.style.borderColor = 'var(--priority-high)';
        setTimeout(() => input.style.borderColor = '', 1000);
        return;
    }

    const dateVal = document.getElementById('task-date').value;
    const timeVal = document.getElementById('task-time').value;

    const task = {
        id: Date.now(),
        text,
        completed: false,
        priority: currentPriority,
        date: dateVal,
        time: timeVal,
        createdAt: new Date().toISOString()
    };

    tasks.unshift(task);
    saveTasks();
    renderTasks();
    updateStats();

    input.value = '';
    input.focus();
}