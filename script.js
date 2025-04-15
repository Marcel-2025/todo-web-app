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
    const languageSelect = document.getElementById('language-select');
    const appTitle = document.getElementById('app-title');

    let tasks = JSON.parse(localStorage.getItem('todos')) || [];

    // Language data
    const languages = {
        en: {
            appTitle: "Enhanced ToDo App",
            searchPlaceholder: "Search tasks...",
            addTaskPlaceholder: "Add a new task",
            categories: {
                all: "All Categories",
                work: "Work",
                personal: "Personal",
                shopping: "Shopping"
            },
            addButton: "Add",
            exportButton: "Export Tasks",
            progressCompleted: "% completed",
            toggleDarkMode: "Toggle Dark Mode"
        },
        de: {
            appTitle: "Erweiterte ToDo-App",
            searchPlaceholder: "Aufgaben suchen...",
            addTaskPlaceholder: "Neue Aufgabe hinzufügen",
            categories: {
                all: "Alle Kategorien",
                work: "Arbeit",
                personal: "Persönlich",
                shopping: "Einkaufen"
            },
            addButton: "Hinzufügen",
            exportButton: "Aufgaben exportieren",
            progressCompleted: "% abgeschlossen",
            toggleDarkMode: "Dunkelmodus umschalten"
        }
    };

    // Get saved language or default to English
    const savedLanguage = localStorage.getItem('language') || 'en';
    languageSelect.value = savedLanguage;
    applyLanguage(savedLanguage);

    // Apply language changes
    languageSelect.addEventListener('change', () => {
        const selectedLanguage = languageSelect.value;
        localStorage.setItem('language', selectedLanguage);
        applyLanguage(selectedLanguage);
    });

    function applyLanguage(language) {
        const lang = languages[language];

        appTitle.textContent = lang.appTitle;
        searchInput.placeholder = lang.searchPlaceholder;
        todoInput.placeholder = lang.addTaskPlaceholder;
        filterCategory.querySelectorAll('option')[0].textContent = lang.categories.all;
        filterCategory.querySelectorAll('option')[1].textContent = lang.categories.work;
        filterCategory.querySelectorAll('option')[2].textContent = lang.categories.personal;
        filterCategory.querySelectorAll('option')[3].textContent = lang.categories.shopping;
        categoryInput.querySelectorAll('option')[0].textContent = lang.categories.work;
        categoryInput.querySelectorAll('option')[1].textContent = lang.categories.personal;
        categoryInput.querySelectorAll('option')[2].textContent = lang.categories.shopping;
        todoForm.querySelector('button').textContent = lang.addButton;
        exportButton.textContent = lang.exportButton;
        darkModeToggle.textContent = lang.toggleDarkMode;
        updateProgress();
    }

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
                <span>${task.text} (${languages[savedLanguage].categories[task.category] || task.category}, Fällig: ${task.dueDate || 'Keine'})</span>
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
        progressText.textContent = `${Math.round(progress)} ${languages[savedLanguage].progressCompleted}`;
    };

    // Other existing logic...

    renderTasks();
});