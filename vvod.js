let eventsData = [];

// Функция загрузки данных из файла data.json
function loadDepartments() {
    fetch('data.json', { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            eventsData = data.event;
            const decadesSet = new Set();
            const themesSet = new Set();

            // Проверка наличия данных и их типа
            if (eventsData && Array.isArray(eventsData)) {
                eventsData.forEach(event => {
                    // Извлечение года и десятилетия из даты события
                    const [year] = event.Date.split('-');
                    const decade = Math.floor(year / 10) * 10;
                    decadesSet.add(decade);

                    // Извлечение тем из события
                    if (event.sci_theme && Array.isArray(event.sci_theme)) {
                        event.sci_theme.forEach(theme => {
                            themesSet.add(theme.Name);
                        });
                    }
                });

                // Заполнение выпадающего списка десятилетий
                const decadeSelect = document.getElementById('decadeSelect');
                decadesSet.forEach(decade => {
                    const option = document.createElement('option');
                    option.value = decade;
                    option.textContent = `${decade}s`;
                    decadeSelect.appendChild(option);
                });

                // Заполнение выпадающего списка тем
                const themeSelect = document.getElementById('themeSelect');
                themesSet.forEach(theme => {
                    const option = document.createElement('option');
                    option.value = theme;
                    option.textContent = theme;
                    themeSelect.appendChild(option);
                });

                // Добавление обработчиков событий для фильтрации
                decadeSelect.addEventListener('change', filterEvents);
                themeSelect.addEventListener('change', filterEvents);
            }
        })
        .catch(error => {
            console.error('Error loading events:', error);
            alert('Failed to load event data. Please try again later.');
        });
}

// Функция фильтрации событий по выбранным критериям
function filterEvents() {
    const selectedDecade = document.getElementById('decadeSelect').value;
    const selectedTheme = document.getElementById('themeSelect').value;

    // Фильтрация и отображение событий
    if (selectedDecade !== 'all' || selectedTheme !== 'all') {
        displayYears(selectedDecade, selectedTheme);
    } else {
        document.querySelector('.event__departments').innerHTML = '';
    }
}

// Функция отображения событий по выбранным десятилетию и теме
function displayYears(decade, theme) {
    const eventsMap = new Map();

    // Фильтрация событий по критериям
    eventsData.forEach(event => {
        const [year] = event.Date.split('-');
        const eventDecade = Math.floor(year / 10) * 10;
        if ((decade === 'all' || eventDecade == decade) && 
            (theme === 'all' || event.sci_theme.some(t => t.Name === theme))) {
            if (!eventsMap.has(year)) {
                eventsMap.set(year, []);
            }
            eventsMap.get(year).push(event);
        }
    });

    // Отображение кнопок с годами и названиями событий
    const departmentsContainer = document.querySelector('.event__departments');
    departmentsContainer.innerHTML = '';

    eventsMap.forEach((events, year) => {
        events.forEach(event => {
            const button = document.createElement('button');
            button.className = 'btn';
            button.textContent = `${year} - ${event.Name}`;
            button.setAttribute('data-year', year);
            button.addEventListener('click', () => {
                // Переход на страницу event.html при нажатии на кнопку
                window.location.href = 'event.html#target-section';
            });
            departmentsContainer.appendChild(button);
        });
    });
}

// Запуск функции загрузки данных после загрузки DOM
document.addEventListener('DOMContentLoaded', loadDepartments);