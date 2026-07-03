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

/* ===== RENDER TASKS ===== */
function renderTasks() {
    const list = document.getElementById('task-list');

    let filtered = tasks.filter(t => {
        if (currentFilter === 'active') return !t.completed;
        if (currentFilter === 'completed') return t.completed;
        return true;
    });

    if (filtered.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-${currentFilter === 'completed' ? 'check-double' : 'tasks'}"></i>
                <h3>${currentFilter === 'completed' ? 'No completed tasks' : currentFilter === 'active' ? 'No active tasks' : 'No tasks yet'}</h3>
                <p>${currentFilter === 'all' ? 'Add your first task to get started' : ''}</p>
            </div>`;
        return;
    }

    list.innerHTML = filtered.map(task => createTaskHTML(task)).join('');

    // Bind task-level events
    list.querySelectorAll('.task-checkbox').forEach(cb => {
        cb.addEventListener('click', () => toggleComplete(parseInt(cb.dataset.id)));
    });
    list.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => startEdit(parseInt(btn.dataset.id)));
    });
    list.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteTask(parseInt(btn.dataset.id)));
    });
}

function createTaskHTML(task) {
    const isOverdue = isTaskOverdue(task);
    const priorityClass = task.priority.toLowerCase();
    const dateLabel = formatDateLabel(task.date, task.time);

    return `
    <div class="task-item priority-${priorityClass} ${task.completed ? 'completed' : ''}" data-id="${task.id}">
        <div class="task-checkbox" data-id="${task.id}" role="checkbox" aria-checked="${task.completed}" tabindex="0">
            ${task.completed ? '<i class="fas fa-check"></i>' : ''}
        </div>
        <div class="task-body">
            <div class="task-text">${escapeHTML(task.text)}</div>
            <div class="task-meta">
                ${dateLabel ? `<span class="task-date-label"><i class="fas fa-calendar-alt"></i> ${dateLabel}</span>` : ''}
                <span class="priority-badge ${priorityClass}">${task.priority}</span>
                ${isOverdue && !task.completed ? '<span class="overdue-badge"><i class="fas fa-exclamation-circle"></i> Overdue</span>' : ''}
            </div>
        </div>
        <div class="task-actions">
            <button class="edit-btn" data-id="${task.id}" title="Edit task"><i class="fas fa-pen"></i></button>
            <button class="delete-btn" data-id="${task.id}" title="Delete task"><i class="fas fa-trash"></i></button>
        </div>
    </div>`;
}
