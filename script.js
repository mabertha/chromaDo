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