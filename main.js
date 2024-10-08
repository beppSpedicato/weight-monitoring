const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    // Crea la finestra del browser.
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Per sicurezza puoi includere un preload, o rimuovere questa riga
            nodeIntegration: true, // Permette di usare Node.js nel tuo script
            contextIsolation: false // Disabilita il contesto isolato
        }
    });

    // Carica il file HTML della tua app.
    win.loadFile('index.html');
}

// Lancia la finestra quando Electron è pronto
app.whenReady().then(createWindow);

// Chiude l'applicazione su macOS quando tutte le finestre sono chiuse
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Riapre la finestra se l'app viene riaperta su macOS
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
