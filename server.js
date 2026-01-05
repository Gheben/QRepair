const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const bcrypt = require('bcrypt');
const QRDatabase = require('./database');

const app = express();
const PORT = process.env.PORT || 5126;
const SETTINGS_FILE = './settings.json';

// Trust proxy - importante per reverse proxy (NGINX, Synology)
app.set('trust proxy', 1);

// Inizializza il database
const db = new QRDatabase();

// Inizializza il database (async)
let dbReady = false;
db.init().then(async () => {
    dbReady = true;
    console.log('Database inizializzato');
    
    // Crea utente admin di default se non esistono utenti
    await createDefaultAdmin();
    
    // Migra gli URL vecchi al nuovo formato
    migrateOldUrls();
}).catch(err => {
    console.error('Errore inizializzazione database:', err);
});

// Crea utente admin di default
async function createDefaultAdmin() {
    try {
        const userCount = db.countUsers();
        const demoMode = process.env.DEMO_MODE === 'true';
        
        if (userCount === 0) {
            if (demoMode) {
                // Modalità demo: crea utente demo/demo
                const hashedPassword = await bcrypt.hash('demo', 10);
                db.addUser({
                    username: 'demo',
                    password: hashedPassword,
                    nome: 'Demo User'
                });
                console.log('🎭 DEMO MODE: Utente demo creato (username: demo, password: demo)');
                console.log('⚠️  DEMO MODE: Password e gestione utenti non modificabili');
            } else {
                // Modalità normale: crea utente admin/admin
                const hashedPassword = await bcrypt.hash('admin', 10);
                db.addUser({
                    username: 'admin',
                    password: hashedPassword,
                    nome: 'Amministratore'
                });
                console.log('✅ Utente admin creato (username: admin, password: admin)');
            }
        }
    } catch (error) {
        console.error('Errore creazione admin:', error);
    }
}

// Funzione per migrare gli URL dal vecchio formato al nuovo
function migrateOldUrls() {
    try {
        const allRecords = db.getAll();
        let migratedCount = 0;
        
        allRecords.forEach(record => {
            // Controlla se l'URL contiene parametri (vecchio formato)
            if (record.url && record.url.includes('?') && !record.url.includes('?id=')) {
                // Ricostruisci l'URL con solo l'ID
                const baseUrl = record.url.split('?')[0]; // Prende solo la parte prima di ?
                const newUrl = `${baseUrl}?id=${record.id}`;
                
                // Aggiorna il record
                db.update(record.id, { ...record, url: newUrl });
                migratedCount++;
            }
        });
        
        if (migratedCount > 0) {
            console.log(`✅ Migrati ${migratedCount} URL al nuovo formato`);
        }
    } catch (error) {
        console.error('Errore migrazione URL:', error);
    }
}

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json({ limit: '5mb' })); // Limite per supportare immagini base64

// Configura sessioni
app.use(session({
    secret: process.env.SESSION_SECRET || 'qrcode-manutenzioni-secret-key-2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 ore
        httpOnly: true,
        secure: 'auto', // 'auto' abilita secure solo quando la richiesta è HTTPS
        sameSite: 'lax' // lax funziona sia in sviluppo che in produzione con reverse proxy
    },
    proxy: true // Importante per reverse proxy (NGINX, Synology)
}));

// Middleware per autenticazione
function requireAuth(req, res, next) {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.status(401).json({ success: false, error: 'Non autenticato' });
    }
}

// Rotta principale: redirect alla login
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Middleware per servire pagine HTML senza estensione
app.use((req, res, next) => {
    if (!req.path.includes('.') && req.path !== '/') {
        const htmlPath = path.join(__dirname, req.path + '.html');
        if (fs.existsSync(htmlPath)) {
            return res.sendFile(htmlPath);
        }
    }
    next();
});

app.use(express.static(__dirname)); // Serve i file HTML/CSS/JS

// ==================== ROTTE AUTENTICAZIONE ====================

// Login
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.json({ success: false, error: 'Username e password richiesti' });
    }
    
    try {
        // Username case-insensitive: converte in lowercase
        const user = db.getUserByUsername(username.toLowerCase());
        
        if (!user) {
            return res.json({ success: false, error: 'Credenziali non valide' });
        }
        
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
            return res.json({ success: false, error: 'Credenziali non valide' });
        }
        
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.nome = user.nome;
        
        res.json({ 
            success: true, 
            data: { 
                id: user.id, 
                username: user.username, 
                nome: user.nome 
            } 
        });
    } catch (error) {
        console.error('Errore login:', error);
        res.json({ success: false, error: 'Errore durante il login' });
    }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.json({ success: false, error: 'Errore durante il logout' });
        }
        res.json({ success: true });
    });
});

// Verifica autenticazione
app.get('/api/auth/check', (req, res) => {
    if (req.session && req.session.userId) {
        res.json({ 
            authenticated: true, 
            user: { 
                id: req.session.userId, 
                username: req.session.username, 
                nome: req.session.nome 
            } 
        });
    } else {
        res.json({ authenticated: false });
    }
});

// ==================== FINE ROTTE AUTENTICAZIONE ====================

// Funzioni per gestire le impostazioni
function getSettings() {
    if (fs.existsSync(SETTINGS_FILE)) {
        return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
    }
    return { nomeAzienda: '', telefono: '', logo: null };
}

function saveSettings(settings) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

// Middleware per verificare che il DB sia pronto
app.use('/api', (req, res, next) => {
    if (!dbReady) {
        return res.status(503).json({ 
            success: false, 
            error: 'Database non ancora pronto' 
        });
    }
    next();
});

// ===== API ENDPOINTS =====

/**
 * GET /api/manutenzioni - Ottieni tutte le manutenzioni (PROTETTA)
 */
app.get('/api/manutenzioni', requireAuth, (req, res) => {
    try {
        const records = db.getAll();
        res.json({ success: true, data: records });
    } catch (error) {
        console.error('Errore GET all:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/manutenzioni/:id - Ottieni una manutenzione per ID
 */
app.get('/api/manutenzioni/:id', (req, res) => {
    try {
        const record = db.getById(req.params.id);
        if (record) {
            res.json({ success: true, data: record });
        } else {
            res.status(404).json({ success: false, error: 'Record non trovato' });
        }
    } catch (error) {
        console.error('Errore GET by ID:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/manutenzioni - Aggiungi una nuova manutenzione (PROTETTA)
 */
app.post('/api/manutenzioni', requireAuth, (req, res) => {
    try {
        const { nome, tel, modello, serialNumber, data, url, lingua, scadenza, client_id } = req.body;
        
        if (!nome || !tel || !data) {
            return res.status(400).json({ 
                success: false, 
                error: 'Campi obbligatori: nome, tel, data' 
            });
        }
        
        const newRecord = db.add({
            nome,
            tel,
            modello: modello || '',
            serialNumber: serialNumber || '',
            data,
            dataCreazione: new Date().toISOString(),
            url: url || '',
            lingua: lingua || 'it',
            scadenza: scadenza || null,
            client_id: client_id || null
        });
        
        res.status(201).json({ success: true, data: newRecord });
        console.log(`✅ Nuovo record creato con ID: ${newRecord.id}`);
    } catch (error) {
        console.error('Errore POST:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * PUT /api/manutenzioni/:id - Aggiorna una manutenzione (PROTETTA)
 */
app.put('/api/manutenzioni/:id', requireAuth, (req, res) => {
    try {
        const { nome, tel, modello, serialNumber, data, url, lingua, scadenza, client_id } = req.body;
        
        const success = db.update(req.params.id, {
            nome,
            tel,
            modello: modello || '',
            serialNumber: serialNumber || '',
            data,
            url,
            lingua: lingua || 'it',
            scadenza: scadenza || null,
            client_id: client_id || null
        });
        
        if (success) {
            res.json({ success: true, message: 'Record aggiornato' });
        } else {
            res.status(404).json({ success: false, error: 'Record non trovato' });
        }
    } catch (error) {
        console.error('Errore PUT:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * PUT /api/manutenzioni/:id/data - Aggiorna la data di manutenzione e scadenza (PROTETTA)
 */
app.put('/api/manutenzioni/:id/data', requireAuth, (req, res) => {
    try {
        const { data, scadenza } = req.body;
        
        if (!data) {
            return res.status(400).json({ 
                success: false, 
                error: 'Campo obbligatorio: data' 
            });
        }
        
        const record = db.getById(req.params.id);
        if (!record) {
            return res.status(404).json({ success: false, error: 'Record non trovato' });
        }
        
        // Aggiorna solo data e scadenza (URL rimane uguale)
        const updateData = { ...record, data };
        if (scadenza) {
            updateData.scadenza = scadenza;
        }
        
        const updated = db.update(req.params.id, updateData);
        
        res.json({ success: true, data: updated });
        console.log(`✅ Data aggiornata per ID ${req.params.id}: ${data}${scadenza ? ', Scadenza: ' + scadenza : ''}`);
    } catch (error) {
        console.error('Errore PUT data:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * DELETE /api/manutenzioni/:id - Elimina una manutenzione (PROTETTA)
 */
app.delete('/api/manutenzioni/:id', requireAuth, (req, res) => {
    try {
        const success = db.delete(req.params.id);
        
        if (success) {
            res.json({ success: true, message: 'Record eliminato' });
        } else {
            res.status(404).json({ success: false, error: 'Record non trovato' });
        }
    } catch (error) {
        console.error('Errore DELETE:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/settings - Ottieni le impostazioni del fornitore
 */
app.get('/api/settings', (req, res) => {
    try {
        const settings = getSettings();
        res.json({ success: true, data: settings });
    } catch (error) {
        console.error('Errore GET settings:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/settings - Salva le impostazioni del fornitore (PROTETTA)
 */
app.post('/api/settings', requireAuth, (req, res) => {
    try {
        const { nomeAzienda, telefono, logo } = req.body;
        
        if (!nomeAzienda || !telefono) {
            return res.status(400).json({ 
                success: false, 
                error: 'Campi obbligatori: nomeAzienda, telefono' 
            });
        }
        
        const settings = { nomeAzienda, telefono, logo: logo || null };
        saveSettings(settings);
        res.json({ success: true, data: settings });
    } catch (error) {
        console.error('Errore POST settings:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * DELETE /api/manutenzioni - Cancella tutti i record (PROTETTA)
 */
app.delete('/api/manutenzioni', requireAuth, (req, res) => {
    try {
        const deleted = db.clear();
        res.json({ success: true, message: `${deleted} record eliminati` });
    } catch (error) {
        console.error('Errore DELETE all:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/manutenzioni/search/:query - Ricerca manutenzioni (PROTETTA)
 */
app.get('/api/search/:query', requireAuth, (req, res) => {
    try {
        const results = db.search(req.params.query);
        res.json({ success: true, data: results });
    } catch (error) {
        console.error('Errore SEARCH:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/stats - Ottieni statistiche (PROTETTA)
 */
app.get('/api/stats', requireAuth, (req, res) => {
    try {
        const stats = db.getStats();
        res.json({ success: true, data: stats });
    } catch (error) {
        console.error('Errore STATS:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/count - Conta i record (PROTETTA)
 */
app.get('/api/count', requireAuth, (req, res) => {
    try {
        const count = db.count();
        res.json({ success: true, data: count });
    } catch (error) {
        console.error('Errore COUNT:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/export - Esporta dati (PROTETTA)
 */
app.get('/api/export', requireAuth, (req, res) => {
    try {
        const data = db.exportData();
        res.json({ success: true, data: data });
    } catch (error) {
        console.error('Errore EXPORT:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/import - Importa dati (PROTETTA)
 */
app.post('/api/import', requireAuth, (req, res) => {
    try {
        const { records } = req.body;
        
        if (!Array.isArray(records)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Il campo records deve essere un array' 
            });
        }
        
        const imported = db.importData(records);
        res.json({ 
            success: true, 
            message: `${imported} record importati` 
        });
    } catch (error) {
        console.error('Errore IMPORT:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== ROTTE GESTIONE UTENTI ====================

/**
 * GET /api/users - Ottieni tutti gli utenti (PROTETTA)
 */
app.get('/api/users', requireAuth, (req, res) => {
    try {
        const users = db.getAllUsers();
        // Rimuovi le password dalla risposta
        const usersWithoutPasswords = users.map(u => ({
            id: u.id,
            username: u.username,
            nome: u.nome,
            createdAt: u.createdAt
        }));
        res.json({ success: true, data: usersWithoutPasswords });
    } catch (error) {
        console.error('Errore GET users:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/users - Crea un nuovo utente (PROTETTA)
 */
app.post('/api/users', requireAuth, async (req, res) => {
    try {
        // Blocca creazione utenti in DEMO_MODE
        if (process.env.DEMO_MODE === 'true') {
            return res.status(403).json({ 
                success: false, 
                error: 'Demo mode: User creation is disabled' 
            });
        }
        
        const { username, password, nome } = req.body;
        
        if (!username || !password || !nome) {
            return res.status(400).json({ 
                success: false, 
                error: 'Campi obbligatori: username, password, nome' 
            });
        }
        
        // Validazione password
        if (password.length < 6) {
            return res.status(400).json({ 
                success: false, 
                error: 'La password deve essere di almeno 6 caratteri' 
            });
        }
        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({ 
                success: false, 
                error: 'La password deve contenere almeno una lettera maiuscola' 
            });
        }
        if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
            return res.status(400).json({ 
                success: false, 
                error: 'La password deve contenere almeno un carattere speciale' 
            });
        }
        
        // Verifica se l'username esiste già
        const existing = db.getUserByUsername(username);
        if (existing) {
            return res.status(400).json({ 
                success: false, 
                error: 'Username già esistente' 
            });
        }
        
        // Hash della password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = db.addUser({
            username,
            password: hashedPassword,
            nome
        });
        
        // Rimuovi la password dalla risposta
        const userResponse = {
            id: newUser.id,
            username: newUser.username,
            nome: newUser.nome,
            createdAt: newUser.createdAt
        };
        
        res.status(201).json({ success: true, data: userResponse });
    } catch (error) {
        console.error('Errore POST user:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * PUT /api/users/:id - Aggiorna un utente (PROTETTA)
 */
app.put('/api/users/:id', requireAuth, async (req, res) => {
    try {
        // Blocca modifica utenti in DEMO_MODE
        if (process.env.DEMO_MODE === 'true') {
            return res.status(403).json({ 
                success: false, 
                error: 'Demo mode: User modification is disabled' 
            });
        }
        
        const { username, password, nome } = req.body;
        
        const updateData = {};
        if (username) updateData.username = username;
        if (nome) updateData.nome = nome;
        if (password) {
            // Validazione password
            if (password.length < 6) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'La password deve essere di almeno 6 caratteri' 
                });
            }
            if (!/[A-Z]/.test(password)) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'La password deve contenere almeno una lettera maiuscola' 
                });
            }
            if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'La password deve contenere almeno un carattere speciale' 
                });
            }
            updateData.password = await bcrypt.hash(password, 10);
        }
        
        const success = db.updateUser(req.params.id, updateData);
        
        if (success) {
            res.json({ success: true, message: 'Utente aggiornato' });
        } else {
            res.status(404).json({ success: false, error: 'Utente non trovato' });
        }
    } catch (error) {
        console.error('Errore PUT user:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * DELETE /api/users/:id - Elimina un utente (PROTETTA)
 */
app.delete('/api/users/:id', requireAuth, (req, res) => {
    try {
        // Blocca eliminazione utenti in DEMO_MODE
        if (process.env.DEMO_MODE === 'true') {
            return res.status(403).json({ 
                success: false, 
                error: 'Demo mode: User deletion is disabled' 
            });
        }
        
        // Conta gli utenti prima dell'eliminazione
        const userCount = db.countUsers();
        
        if (userCount <= 1) {
            return res.status(400).json({ 
                success: false, 
                error: 'Impossibile eliminare l\'ultimo utente' 
            });
        }
        
        const success = db.deleteUser(req.params.id);
        
        if (success) {
            res.json({ success: true, message: 'Utente eliminato' });
        } else {
            res.status(404).json({ success: false, error: 'Utente non trovato' });
        }
    } catch (error) {
        console.error('Errore DELETE user:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== FINE ROTTE GESTIONE UTENTI ====================

// ==================== ROTTE GESTIONE CLIENTI ====================

/**
 * GET /api/clienti - Ottieni tutti i clienti (PROTETTA)
 */
app.get('/api/clienti', requireAuth, (req, res) => {
    try {
        const clients = db.getAllClients();
        res.json({ success: true, data: clients });
    } catch (error) {
        console.error('Errore GET clienti:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/clienti/search?q=query - Cerca clienti (PROTETTA)
 */
app.get('/api/clienti/search', requireAuth, (req, res) => {
    try {
        const query = req.query.q || '';
        const clients = db.searchClients(query);
        res.json({ success: true, data: clients });
    } catch (error) {
        console.error('Errore ricerca clienti:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/clienti/:id - Ottieni un cliente per ID (PROTETTA)
 */
app.get('/api/clienti/:id', requireAuth, (req, res) => {
    try {
        const client = db.getClientById(req.params.id);
        if (client) {
            res.json({ success: true, data: client });
        } else {
            res.status(404).json({ success: false, error: 'Cliente non trovato' });
        }
    } catch (error) {
        console.error('Errore GET cliente:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/clienti - Crea un nuovo cliente (PROTETTA)
 */
app.post('/api/clienti', requireAuth, (req, res) => {
    try {
        const { nome, cognome, email, tel, lingua, piva } = req.body;
        
        // Validazione campi obbligatori
        if (!nome || !cognome || !tel || !lingua) {
            return res.status(400).json({ 
                success: false, 
                error: 'Campi obbligatori: nome, cognome, tel, lingua' 
            });
        }
        
        // Validazione lingua
        const validLanguages = ['it', 'en', 'de'];
        if (!validLanguages.includes(lingua.toLowerCase())) {
            return res.status(400).json({ 
                success: false, 
                error: 'Lingua non valida. Valori accettati: it, en, de' 
            });
        }
        
        const newClient = db.addClient({
            nome: nome.trim(),
            cognome: cognome.trim(),
            email: email ? email.trim() : null,
            tel: tel.trim(),
            lingua: lingua.toLowerCase(),
            piva: piva ? piva.trim() : null,
            createdAt: new Date().toISOString()
        });
        
        res.status(201).json({ success: true, data: newClient });
    } catch (error) {
        console.error('Errore POST cliente:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * PUT /api/clienti/:id - Aggiorna un cliente (PROTETTA)
 */
app.put('/api/clienti/:id', requireAuth, (req, res) => {
    try {
        const { nome, cognome, email, tel, lingua, piva } = req.body;
        
        // Validazione campi obbligatori
        if (!nome || !cognome || !tel || !lingua) {
            return res.status(400).json({ 
                success: false, 
                error: 'Campi obbligatori: nome, cognome, tel, lingua' 
            });
        }
        
        // Validazione lingua
        const validLanguages = ['it', 'en', 'de'];
        if (!validLanguages.includes(lingua.toLowerCase())) {
            return res.status(400).json({ 
                success: false, 
                error: 'Lingua non valida. Valori accettati: it, en, de' 
            });
        }
        
        const success = db.updateClient(req.params.id, {
            nome: nome.trim(),
            cognome: cognome.trim(),
            email: email ? email.trim() : null,
            tel: tel.trim(),
            lingua: lingua.toLowerCase(),
            piva: piva ? piva.trim() : null
        });
        
        if (success) {
            res.json({ success: true, message: 'Cliente aggiornato' });
        } else {
            res.status(404).json({ success: false, error: 'Cliente non trovato' });
        }
    } catch (error) {
        console.error('Errore PUT cliente:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * DELETE /api/clienti/:id - Elimina un cliente (PROTETTA)
 */
app.delete('/api/clienti/:id', requireAuth, (req, res) => {
    try {
        const success = db.deleteClient(req.params.id);
        
        if (success) {
            res.json({ success: true, message: 'Cliente eliminato' });
        } else {
            res.status(404).json({ success: false, error: 'Cliente non trovato' });
        }
    } catch (error) {
        console.error('Errore DELETE cliente:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== FINE ROTTE GESTIONE CLIENTI ====================

// Gestione chiusura graceful
process.on('SIGINT', () => {
    console.log('\n🛑 Chiusura server...');
    db.close();
    process.exit(0);
});

// Avvia il server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔════════════════════════════════════════════════╗
║   🚀 Server QR Code Manutenzioni avviato!     ║
╠════════════════════════════════════════════════╣
║                                                ║
║   📍 URL: http://localhost:${PORT}                ║
║   💾 Database: manutenzioni.db                 ║
║   📊 API: http://localhost:${PORT}/api            ║
║                                                ║
║   Apri nel browser:                            ║
║   → http://localhost:${PORT}/login                ║
║   → http://localhost:${PORT}/dashboard            ║
║                                                ║
╚════════════════════════════════════════════════╝
    `);
});
