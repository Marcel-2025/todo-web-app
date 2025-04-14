document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');

    // Load saved tasks from localStorage
    const savedTasks = JSON.parse(localStorage.getItem('todos')) || [];
    savedTasks.forEach(task => addTaskToList(task.text, task.completed));

    // Add new task
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = todoInput.value.trim();

        if (taskText === '') return;

        addTaskToList(taskText, false);
        saveTasksToLocalStorage();

        todoInput.value = '';
    });

    function addTaskToList(text, completed) {
        const listItem = document.createElement('li');

        // Strike-through for completed tasks
        if (completed) {
            listItem.classList.add('completed');
        }

        const taskSpan = document.createElement('span');
        taskSpan.textContent = text;
        taskSpan.addEventListener('click', () => {
            listItem.classList.toggle('completed');
            saveTasksToLocalStorage();
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            listItem.remove();
            saveTasksToLocalStorage();
        });

        listItem.appendChild(taskSpan);
        listItem.appendChild(deleteButton);
        todoList.appendChild(listItem);
    }

    function saveTasksToLocalStorage() {
        const tasks = [];
        todoList.querySelectorAll('li').forEach(listItem => {
            tasks.push({
                text: listItem.querySelector('span').textContent,
                completed: listItem.classList.contains('completed')
            });
        });
        localStorage.setItem('todos', JSON.stringify(tasks));
    }
});