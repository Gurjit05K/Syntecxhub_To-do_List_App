// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');
const pendingCount = document.getElementById('pendingCount');
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialize tasks array from localStorage or empty array
let tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
let currentFilter = 'all';

// Initialize the app
function initApp() {
    renderTasks();
    updateStats();
    
    // Set up event listeners
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    
    // Filter button event listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Set current filter and render tasks
            currentFilter = button.getAttribute('data-filter');
            renderTasks();
        });
    });
}

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    // Create new task object
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    // Add to tasks array
    tasks.unshift(newTask);
    
    // Save to localStorage
    saveTasks();
    
    // Clear input and render tasks
    taskInput.value = '';
    renderTasks();
    updateStats();
    
    // Show success message
    showNotification('Task added successfully!');
}

// Delete a task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
    
    // Show notification
    showNotification('Task deleted!');
}

// Toggle task completion status
function toggleTaskCompletion(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    
    saveTasks();
    renderTasks();
    updateStats();
    
    // Show notification based on new status
    const task = tasks.find(t => t.id === id);
    const message = task.completed ? 'Task marked as complete! ✅' : 'Task marked as pending!';
    showNotification(message);
}

// Render tasks based on current filter
function renderTasks() {
    // Filter tasks based on current filter
    let filteredTasks = tasks;
    if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    // Clear task list
    taskList.innerHTML = '';
    
    // Show empty state if no tasks
    if (filteredTasks.length === 0) {
        emptyState.style.display = 'block';
        taskList.appendChild(emptyState);
        return;
    }
    
    // Hide empty state
    emptyState.style.display = 'none';
    
    // Render each task
    filteredTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.setAttribute('data-id', task.id);
        
        taskItem.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            <div class="task-actions">
                <button class="task-btn complete-btn" title="${task.completed ? 'Mark as pending' : 'Mark as complete'}">
                    ${task.completed ? '↩️' : ''}
                </button>
                <button class="task-btn delete-btn" title="Delete task">
                    ❌
                </button>
            </div>
        `;
        
        // Add event listeners to action buttons
        const completeBtn = taskItem.querySelector('.complete-btn');
        const deleteBtn = taskItem.querySelector('.delete-btn');
        const checkbox = taskItem.querySelector('.task-checkbox');
        
        completeBtn.addEventListener('click', () => toggleTaskCompletion(task.id));
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));
        
        taskList.appendChild(taskItem);
    });
}

// Update task statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    
    totalCount.textContent = total;
    completedCount.textContent = completed;
    pendingCount.textContent = pending;
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

// Show notification
function showNotification(message) {
    // Remove any existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', initApp);