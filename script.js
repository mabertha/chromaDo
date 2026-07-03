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