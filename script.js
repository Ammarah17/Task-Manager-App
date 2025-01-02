document.getElementById('taskForm').addEventListener('submit', addTask);
document.getElementById('priorityFilter').addEventListener('change', filterTasks);
document.getElementById('dateFilter').addEventListener('change', filterTasks);
document.getElementById('searchBar').addEventListener('input', searchTasks);
document.getElementById('statusFilter').addEventListener('change', filterTasks);

document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);

function addTask(event) {
    event.preventDefault();

    const taskTitle = document.getElementById('taskTitle').value.trim();
    const taskDescription = document.getElementById('taskDescription').value.trim();
    const taskDueDate = document.getElementById('taskDueDate').value.trim();
    const taskPriority = document.getElementById('taskPriority').value;

    if (!taskTitle || !taskDueDate) {
        alert('Please provide a task title and due date!');
        return;
    }

    const taskList = document.getElementById('taskList');
    const li = createTaskElement(taskTitle, taskDescription, taskDueDate, taskPriority, 'pending');

    taskList.appendChild(li);
    saveTaskToLocalStorage(taskTitle, taskDescription, taskDueDate, taskPriority, 'pending');

    document.getElementById('taskForm').reset();
}

function createTaskElement(title, description, dueDate, priority, status) {
    const li = document.createElement('li');

    li.setAttribute('data-priority', priority);
    li.setAttribute('data-due-date', dueDate);
    li.setAttribute('data-title', title.toLowerCase());
    li.setAttribute('data-description', description.toLowerCase());
    li.setAttribute('data-status', status);

    li.innerHTML = `
        <div>
            <input type="checkbox" class="task-checkbox" ${status === 'completed' ? 'checked' : ''}>
            <strong class="task-title">${title}</strong> 
            <span class="priority ${priority.toLowerCase()}">(${priority} Priority)</span><br>
            <span class="task-desc">${description}</span><br>
            <em class="task-due-date">Due: ${dueDate}</em>
        </div>
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
    `;

    const checkbox = li.querySelector('.task-checkbox');
    checkbox.addEventListener('change', () => {
        toggleTaskStatus(li, checkbox.checked);
        updateTaskInLocalStorage(title, description, dueDate, priority, checkbox.checked ? 'completed' : 'pending');
    });

    const editBtn = li.querySelector('.edit');
    editBtn.addEventListener('click', () => editTask(li));

    const deleteBtn = li.querySelector('.delete');
    deleteBtn.addEventListener('click', () => {
        taskList.removeChild(li);
        removeTaskFromLocalStorage(title);
    });

    if (status === 'completed') {
        li.classList.add('completed');
    }

    return li;
}

function toggleTaskStatus(taskElement, isCompleted) {
    if (isCompleted) {
        taskElement.classList.add('completed');
        taskElement.setAttribute('data-status', 'completed');
    } else {
        taskElement.classList.remove('completed');
        taskElement.setAttribute('data-status', 'pending');
    }
    filterTasks();
}

function filterTasks() {
    const priorityFilter = document.getElementById('priorityFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const taskList = document.getElementById('taskList');
    const tasks = taskList.querySelectorAll('li');

    tasks.forEach(task => {
        const matchesPriority = priorityFilter === '' || task.getAttribute('data-priority') === priorityFilter;
        const matchesDate = dateFilter === '' || task.getAttribute('data-due-date') === dateFilter;
        const matchesStatus = statusFilter === '' || task.getAttribute('data-status') === statusFilter;

        task.style.display = matchesPriority && matchesDate && matchesStatus ? '' : 'none';
    });
}

function searchTasks() {
    const query = document.getElementById('searchBar').value.toLowerCase();
    const taskList = document.getElementById('taskList');
    const tasks = taskList.querySelectorAll('li');

    tasks.forEach(task => {
        const title = task.getAttribute('data-title');
        const description = task.getAttribute('data-description');

        task.style.display = title.includes(query) || description.includes(query) ? '' : 'none';
    });
}

function editTask(taskElement) {
    const taskTitle = taskElement.querySelector('.task-title').textContent;
    const taskDescription = taskElement.querySelector('.task-desc').textContent;
    const taskDueDate = taskElement.querySelector('.task-due-date').textContent.replace('Due: ', '');
    const taskPriority = taskElement.querySelector('.priority').textContent.replace(/[\(\)]/g, '').split(' ')[0];

    document.getElementById('taskTitle').value = taskTitle;
    document.getElementById('taskDescription').value = taskDescription;
    document.getElementById('taskDueDate').value = taskDueDate;
    document.getElementById('taskPriority').value = taskPriority;

    taskElement.remove();
    removeTaskFromLocalStorage(taskTitle);
}

// Local Storage Functions
function saveTaskToLocalStorage(title, description, dueDate, priority, status) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ title, description, dueDate, priority, status });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskList = document.getElementById('taskList');

    tasks.forEach(task => {
        const li = createTaskElement(task.title, task.description, task.dueDate, task.priority, task.status);
        taskList.appendChild(li);
    });
}

function updateTaskInLocalStorage(title, description, dueDate, priority, status) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.title === title && task.dueDate === dueDate);

    if (taskIndex > -1) {
        tasks[taskIndex] = { title, description, dueDate, priority, status };
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function removeTaskFromLocalStorage(title) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter(task => task.title !== title);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}







