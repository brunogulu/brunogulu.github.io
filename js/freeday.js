/**
 * Rotación de 4 semanas (Lunes → Domingo)
 * Semana 1: D D F F N N N
 * Semana 2: F F D D F F F
 * Semana 3: N N F F D D D
 * Semana 4: F F N N F F F
 *
 * CYCLE_START debe ser un LUNES que corresponda a la Semana 1.
 * Ajustalo a tu primer lunes real de Semana 1.
 */
const CYCLE_START = new Date(2026, 8, 14); // lunes 5 ene 2026 — CAMBIAR SI HACE FALTA

const WEEKS = [
    ["D", "D", "F", "F", "N", "N", "N"],
    ["F", "F", "D", "D", "F", "F", "F"],
    ["N", "N", "F", "F", "D", "D", "D"],
    ["F", "F", "N", "N", "F", "F", "F"],
];

const MONTHS_ES = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const MS_DAY = 24 * 60 * 60 * 1000;

let viewYear;
let viewMonth; // 0-11

function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function mondayOf(date) {
    const d = startOfDay(date);
    const dow = d.getDay(); // 0 dom … 6 sáb
    const offset = dow === 0 ? -6 : 1 - dow;
    d.setDate(d.getDate() + offset);
    return d;
}

function daysBetween(a, b) {
    return Math.round((startOfDay(b) - startOfDay(a)) / MS_DAY);
}

function shiftFor(date) {
    const weekStart = mondayOf(date);
    const cycleMonday = mondayOf(CYCLE_START);
    const weeks = Math.floor(daysBetween(cycleMonday, weekStart) / 7);
    const weekIndex = ((weeks % 4) + 4) % 4;
    const mondayBased = date.getDay() === 0 ? 6 : date.getDay() - 1; // lun=0 … dom=6
    return WEEKS[weekIndex][mondayBased];
}

function renderCalendar() {
    const title = document.getElementById("monthAndYear");
    const grid = document.getElementById("calendarContent");
    title.textContent = `${MONTHS_ES[viewMonth]} ${viewYear}`;
    grid.innerHTML = "";

    const first = new Date(viewYear, viewMonth, 1);
    const lastDate = new Date(viewYear, viewMonth + 1, 0).getDate();
    const leadingEmpties = first.getDay(); // domingo primero

    for (let i = 0; i < leadingEmpties; i++) {
        const empty = document.createElement("div");
        empty.className = "day-cell empty";
        grid.appendChild(empty);
    }

    const today = startOfDay(new Date());

    for (let day = 1; day <= lastDate; day++) {
        const date = new Date(viewYear, viewMonth, day);
        const shift = shiftFor(date);
        const cell = document.createElement("div");
        cell.className = `day-cell ${shift}`;
        if (startOfDay(date).getTime() === today.getTime()) {
            cell.classList.add("today");
        }
        cell.innerHTML = `<span class="num">${day}</span><span class="shift">${shift}</span>`;
        grid.appendChild(cell);
    }
}

function changeMonth(delta) {
    viewMonth += delta;
    if (viewMonth < 0) {
        viewMonth = 11;
        viewYear -= 1;
    } else if (viewMonth > 11) {
        viewMonth = 0;
        viewYear += 1;
    }
    renderCalendar();
}

document.addEventListener("DOMContentLoaded", () => {
    const now = new Date();
    viewYear = now.getFullYear();
    viewMonth = now.getMonth();

    document.getElementById("switchLeft").addEventListener("click", () => changeMonth(-1));
    document.getElementById("switchRight").addEventListener("click", () => changeMonth(1));

    renderCalendar();
});
