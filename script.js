document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const categoryInput = document.getElementById('category-input');
    const dueDateInput = document.getElementById('due-date-input');
    const todoList = document.getElementById('todo-list');
    const searchInput = document.getElementById('search-input');
    const filterCategory = document.getElementById('filter-category');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const exportButton = document.getElementById('export-tasks');
    const importInput = document.getElementById('import-tasks');
    const darkModeToggle = document.getElementById('toggle-dark-mode');

    let tasks = JSON.parse(localStorage.getItem('todos')) || [];

    const saveTasks = () => {
        localStorage.setItem('todos', JSON.stringify(tasks));
        updateProgress();
    };

    const renderTasks = () => {
        todoList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            const matchesSearch = task.text.toLowerCase().includes(searchInput.value.toLowerCase());
            const matchesCategory = filterCategory.value === 'all' || task.category === filterCategory.value;
            return matchesSearch && matchesCategory;
        });

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${task.text} (${task.category}, Due: ${task.dueDate || 'None'})</span>
                <button>Delete</button>
            `;
            li.querySelector('button').addEventListener('click', () => {
                tasks = tasks.filter(t => t !== task);
                saveTasks();
                renderTasks();
            });
            if (task.completed) li.classList.add('completed');
            li.addEventListener('click', () => {
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
            });
            todoList.appendChild(li);
        });
        updateProgress();
    };

    const updateProgress = () => {
        const completedTasks = tasks.filter(task => task.completed).length;
        const totalTasks = tasks.length;
        const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        progressBar.value = progress;
        progressText.textContent = `${Math.round(progress)}% completed`;
    };

    todoForm.addEventListener('submit', e => {
        e.preventDefault();
        const newTask = {
            text: todoInput.value,
            category: categoryInput.value,
            dueDate: dueDateInput.value,
            completed: false
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        todoInput.value = '';
        dueDateInput.value = '';
    });

    searchInput.addEventListener('input', renderTasks);
    filterCategory.addEventListener('change', renderTasks);

    exportButton.addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(tasks)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tasks.json';
        a.click();
    });

    importInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                tasks = JSON.parse(reader.result);
                saveTasks();
                renderTasks();
            };
            reader.readAsText(file);
        }
    });

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    renderTasks();
});