// Timer Variables
let timerMinutes = 25;
let timerSeconds = 0;
let interval = null;
let isRunning = false;
let currentMode = 'work';

const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const startBtn = document.getElementById('startBtn');
const workModeBtn = document.getElementById('workMode');
const breakModeBtn = document.getElementById('breakMode');

function updateDisplay() {
    minutesEl.textContent = String(timerMinutes).padStart(2, '0');
    secondsEl.textContent = String(timerSeconds).padStart(2, '0');
}

function setMode(mode) {
    currentMode = mode;
    clearInterval(interval);
    isRunning = false;
    startBtn.textContent = 'START';

    if (mode === 'work') {
        timerMinutes = 25;
        workModeBtn.classList.add('active');
        breakModeBtn.classList.remove('active');
    } else {
        timerMinutes = 5;
        breakModeBtn.classList.add('active');
        workModeBtn.classList.remove('active');
    }
    timerSeconds = 0;
    updateDisplay();
}

function toggleTimer() {
    if (isRunning) {
        clearInterval(interval);
        isRunning = false;
        startBtn.textContent = 'START';
    } else {
        isRunning = true;
        startBtn.textContent = 'PAUSE';
        interval = setInterval(() => {
            if (timerSeconds === 0) {
                if (timerMinutes === 0) {
                    clearInterval(interval);
                    alert(currentMode === 'work' ? 'Work session complete! Take a break.' : 'Break over! Back to work.');
                    resetTimer();
                    return;
                }
                timerMinutes--;
                timerSeconds = 59;
            } else {
                timerSeconds--;
            }
            updateDisplay();
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(interval);
    isRunning = false;
    startBtn.textContent = 'START';
    if (currentMode === 'work') {
        timerMinutes = 25;
    } else {
        timerMinutes = 5;
    }
    timerSeconds = 0;
    updateDisplay();
}

// Task Management with LocalStorage
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

let tasks = JSON.parse(localStorage.getItem('cyber_tasks')) || [];

function saveTasks() {
    localStorage.setItem('cyber_tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';
    if (tasks.length === 0) {
        taskList.innerHTML = '<li style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 10px;">No objectives added yet.</li>';
        return;
    }

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <span>${task.text}</span>
            <div class="task-actions">
                <button class="complete-btn" onclick="toggleTask(${index})">✔</button>
                <button class="delete-btn" onclick="deleteTask(${index})">✖</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;
    tasks.push({ text: text, completed: false });
    taskInput.value = '';
    saveTasks();
    renderTasks();
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// Allow Enter key to add task
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Initial Render
renderTasks();
updateDisplay();