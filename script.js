document.getElementById('weightForm').addEventListener('submit', function (event) {
    event.preventDefault();
    
    // Ottieni il peso inserito
    const weight = parseFloat(document.getElementById('weight').value);
    if (isNaN(weight)) return;

    // Ottieni la data attuale (solo anno, mese e giorno)
    const now = new Date();
    const today = now.toISOString().split('T')[0];  // Formato YYYY-MM-DD

    // Recupera i dati dal localStorage
    const weightData = JSON.parse(localStorage.getItem('weights')) || [];

    // Verifica se c'è già un peso per oggi
    const existingEntryIndex = weightData.findIndex(entry => entry.date === today);

    if (existingEntryIndex >= 0) {
        // Se esiste già un peso per oggi, sovrascrivilo
        weightData[existingEntryIndex].weight = weight;
    } else {
        // Altrimenti, aggiungi un nuovo record
        weightData.push({ weight, date: today });
    }

    // Salva i dati aggiornati nel localStorage
    localStorage.setItem('weights', JSON.stringify(weightData));

    // Aggiorna la tabella
    updateWeeklyTable();

    // Resetta il form
    document.getElementById('weight').value = '';
});

// Funzione per aggiornare la tabella con la media settimanale
function updateWeeklyTable() {
    const weightData = JSON.parse(localStorage.getItem('weights')) || [];
    const weeklyAverages = calculateWeeklyAverages(weightData);

    const tableBody = document.querySelector('#weeklyTable tbody');
    tableBody.innerHTML = '';

    weeklyAverages.forEach((week, index) => {
        const row = document.createElement('tr');
        const weekCell = document.createElement('td');
        const averageCell = document.createElement('td');

        weekCell.textContent = `Settimana ${index + 1} (${week.start} - ${week.end})`;
        averageCell.textContent = week.average.toFixed(2);

        row.appendChild(weekCell);
        row.appendChild(averageCell);
        tableBody.appendChild(row);
    });
}

// Funzione per calcolare la media settimanale dei pesi
function calculateWeeklyAverages(weightData) {
    const weeks = {};

    weightData.forEach(entry => {
        const date = new Date(entry.date);
        const weekYear = `${getWeekNumber(date)}-${date.getFullYear()}`;

        if (!weeks[weekYear]) {
            weeks[weekYear] = {
                sum: 0,
                count: 0,
                start: date.toLocaleDateString(),
                end: date.toLocaleDateString(),
            };
        }

        weeks[weekYear].sum += entry.weight;
        weeks[weekYear].count += 1;
        weeks[weekYear].end = date.toLocaleDateString();  // update end of the week
    });

    return Object.values(weeks).map(week => ({
        start: week.start,
        end: week.end,
        average: week.sum / week.count
    }));
}

// Funzione per ottenere il numero della settimana in un anno
function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// Inizializza la tabella al caricamento della pagina
window.onload = updateWeeklyTable;
