document.addEventListener("DOMContentLoaded", function () {
    const TODAY = new Date();
    let currentYear = TODAY.getFullYear();
    let currentMonth = TODAY.getMonth();

    // Elementos DOM
    const monthAndYear = document.getElementById("monthAndYear"); // header del calendario
    const calendarDiv = document.getElementById("calendarContent"); // body del calendario
    const switchLeft = document.getElementById("switchLeft"); // botón mes anterior
    const switchRight = document.getElementById("switchRight"); // botón mes siguiente

    // Listeners
    switchLeft.addEventListener("click", prevMonth);
    switchRight.addEventListener("click", nextMonth);

    // Definir inicio de ciclo y el patrón de turno
    // const STARTING_DATE = new Date(2024, 5, 1); // 1 de Junio de 2024 - Comienzo del ciclo (viejo)
    const STARTING_DATE = new Date(2025, 00, 31); // 1 de Junio de 2024 - Comienzo del ciclo (nuevo post-vacaciones)
    const SHIFT = "DDDLLLNNNLLL";
    const shiftLength = SHIFT.length;

    function generateCalendar(year, month) {
        // Comienzo del mes
        let firstDayOfMonth = new Date(year, month).getDay();
        let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        // Mostrar mes y año en el header del calendario
        const nameCurrentMonth = (new Date(year, month)).toLocaleDateString("es-AR", { month: "long" });
        monthAndYear.textContent = `${nameCurrentMonth} ${currentYear}`;

        calendarDiv.innerHTML = ""; // Limpio el calendario
        const fragment = document.createDocumentFragment();

        let date = 1;
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 7; j++) {
                // Rellenar la cuadrícula con los días del mes
                const dayDiv = document.createElement('div');
                // Estilos Bootstrap
                dayDiv.classList.add("fs-5");
                dayDiv.classList.add("text-white-50");

                if (i === 0 && j < firstDayOfMonth) {
                    // Espacios en blanco antes del primer día del mes
                    dayDiv.textContent = "";
                    fragment.appendChild(dayDiv);
                } else if (date <= daysInMonth) {
                    const dayClass = getShift(STARTING_DATE, date, shiftLength);
                    dayDiv.classList.add(dayClass);
                    dayDiv.textContent = date;
                    fragment.appendChild(dayDiv);
                    // Resaltar hoy
                    if (date === TODAY.getDate() && month === TODAY.getMonth() && year === TODAY.getFullYear()) {
                        dayDiv.classList.toggle("text-white-50");
                        dayDiv.classList.add("fw-bold");
                    }

                    date++;
                } else {
                    // Espacios en blanco después del último día del mes
                    dayDiv.textContent = "";
                    fragment.appendChild(dayDiv);
                }
            }
        }
        calendarDiv.appendChild(fragment);
    }

    generateCalendar(currentYear, currentMonth);

    function prevMonth() {
        currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
        currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
        generateCalendar(currentYear, currentMonth);
    }

    function nextMonth() {
        currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
        currentMonth = (currentMonth + 1) % 12;
        generateCalendar(currentYear, currentMonth);
    }

    // CALCULAR DIAS LABORALES Y FRANCOS
    function getShift(STARTING_DATE, date, shiftLength) {
        const dateTarget = new Date(currentYear, currentMonth, date);

        // Fecha posterior a STARTING_DATE
        if (dateTarget >= STARTING_DATE) {
            const daysFromStart = Math.abs(dateTarget - STARTING_DATE) / 1000 / 3600 / 24;
            const residual = daysFromStart % shiftLength;

            if ((residual >= 0) && (residual < 3)) { return 'day' }
            if ((residual >= 3) && (residual < 6)) { return 'free' }
            if ((residual >= 6) && (residual < 9)) { return 'night' }
            if ((residual >= 9) && (residual < 12)) { return 'free' }
        }

        // Fecha anterior a STARTING_DATE
        if (dateTarget < STARTING_DATE) {
            const oneDayInMs = 1 * 24 * 3600 * 1000; // Un día en milisegundos
            const daysFromStart = Math.abs(dateTarget - (STARTING_DATE - oneDayInMs)) / 1000 / 3600 / 24;
            const residual = daysFromStart % shiftLength;

            if ((residual >= 0) && (residual < 3)) { return 'free' }
            if ((residual >= 3) && (residual < 6)) { return 'night' }
            if ((residual >= 6) && (residual < 9)) { return 'free' }
            if ((residual >= 9) && (residual < 12)) { return 'day' }
        }
    }
});
