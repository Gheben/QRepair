const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

class QRDatabase {
    constructor(dbPath = './manutenzioni.db') {
        this.dbPath = dbPath;
        this.db = null;
    }

    /**
     * Inizializza il database
     */
    async init() {
        const SQL = await initSqlJs();
        
        // Carica il database esistente se esiste
        if (fs.existsSync(this.dbPath)) {
            const buffer = fs.readFileSync(this.dbPath);
            this.db = new SQL.Database(buffer);
            console.log('✅ Database caricato');
            this.migrateDatabase(); // Aggiungi colonna lingua se non esiste
        } else {
            // Crea un nuovo database
            this.db = new SQL.Database();
            this.createTables();
            this.save();
            console.log('✅ Database creato');
        }
    }

    /**
     * Migrazione database - aggiunge colonna lingua se non esiste
     */
    migrateDatabase() {
        try {
            // Controlla se la colonna lingua esiste già
            const tableInfo = this.db.exec("PRAGMA table_info(manutenzioni)");
            const columns = tableInfo[0]?.values.map(v => v[1]) || [];
            
            if (!columns.includes('lingua')) {
                console.log('🔄 Aggiunta colonna "lingua" al database...');
                this.db.run("ALTER TABLE manutenzioni ADD COLUMN lingua TEXT DEFAULT 'it'");
                this.save();
                console.log('✅ Colonna "lingua" aggiunta con successo');
            }
            
            if (!columns.includes('scadenza')) {
                console.log('🔄 Aggiunta colonna "scadenza" al database...');
                this.db.run("ALTER TABLE manutenzioni ADD COLUMN scadenza TEXT");
                this.save();
                console.log('✅ Colonna "scadenza" aggiunta con successo');
            }
            
            if (!columns.includes('serialNumber')) {
                console.log('🔄 Aggiunta colonna "serialNumber" al database...');
                this.db.run("ALTER TABLE manutenzioni ADD COLUMN serialNumber TEXT");
                this.save();
                console.log('✅ Colonna "serialNumber" aggiunta con successo');
            }
            
            // Controlla se la tabella users esiste
            const tables = this.db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
            if (!tables || tables.length === 0) {
                console.log('🔄 Creazione tabella "users"...');
                this.db.run(`
                    CREATE TABLE users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        username TEXT UNIQUE NOT NULL,
                        password TEXT NOT NULL,
                        nome TEXT NOT NULL,
                        createdAt TEXT NOT NULL
                    )
                `);
                this.db.run('CREATE INDEX IF NOT EXISTS idx_username ON users(username)');
                this.save();
                console.log('✅ Tabella "users" creata con successo');
            }
            
            // Controlla se la tabella clienti esiste
            const clientiTables = this.db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name='clienti'");
            if (!clientiTables || clientiTables.length === 0) {
                console.log('🔄 Creazione tabella "clienti"...');
                this.db.run(`
                    CREATE TABLE clienti (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        nome TEXT NOT NULL,
                        cognome TEXT NOT NULL,
                        email TEXT,
                        tel TEXT NOT NULL,
                        lingua TEXT NOT NULL,
                        piva TEXT,
                        createdAt TEXT NOT NULL
                    )
                `);
                this.db.run('CREATE INDEX IF NOT EXISTS idx_cliente_tel ON clienti(tel)');
                this.db.run('CREATE INDEX IF NOT EXISTS idx_cliente_nome ON clienti(nome, cognome)');
                this.save();
                console.log('✅ Tabella "clienti" creata con successo');
            }
        } catch (error) {
            console.error('Errore durante la migrazione:', error);
        }
    }

    /**
     * Crea le tabelle
     */
    createTables() {
        this.db.run(`
            CREATE TABLE IF NOT EXISTS manutenzioni (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                tel TEXT NOT NULL,
                modello TEXT,
                serialNumber TEXT,
                data TEXT NOT NULL,
                dataCreazione TEXT NOT NULL,
                url TEXT NOT NULL,
                lingua TEXT DEFAULT 'it',
                scadenza TEXT
            )
        `);
        
        this.db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                nome TEXT NOT NULL,
                createdAt TEXT NOT NULL
            )
        `);
        
        this.db.run(`
            CREATE TABLE IF NOT EXISTS clienti (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                cognome TEXT NOT NULL,
                email TEXT,
                tel TEXT NOT NULL,
                lingua TEXT NOT NULL,
                piva TEXT,
                createdAt TEXT NOT NULL
            )
        `);
        
        this.db.run('CREATE INDEX IF NOT EXISTS idx_nome ON manutenzioni(nome)');
        this.db.run('CREATE INDEX IF NOT EXISTS idx_tel ON manutenzioni(tel)');
        this.db.run('CREATE INDEX IF NOT EXISTS idx_data ON manutenzioni(dataCreazione)');
        this.db.run('CREATE INDEX IF NOT EXISTS idx_username ON users(username)');
        this.db.run('CREATE INDEX IF NOT EXISTS idx_cliente_tel ON clienti(tel)');
        this.db.run('CREATE INDEX IF NOT EXISTS idx_cliente_nome ON clienti(nome, cognome)');
    }

    /**
     * Salva il database su disco
     */
    save() {
        const data = this.db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(this.dbPath, buffer);
    }

    /**
     * Aggiungi un record
     */
    add(data) {
        const stmt = this.db.prepare(`
            INSERT INTO manutenzioni (nome, tel, modello, serialNumber, data, dataCreazione, url, lingua, scadenza)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run([
            data.nome,
            data.tel,
            data.modello || '',
            data.serialNumber || '',
            data.data,
            data.dataCreazione || new Date().toISOString(),
            data.url,
            data.lingua || 'it',
            data.scadenza || null
        ]);
        
        stmt.free();
        
        // Ottieni l'ID dell'ultimo inserimento
        const result = this.db.exec('SELECT last_insert_rowid() as id');
        const id = result[0].values[0][0];
        
        this.save();
        return { id, ...data };
    }

    /**
     * Ottieni tutti i record
     */
    getAll() {
        const result = this.db.exec('SELECT * FROM manutenzioni ORDER BY dataCreazione DESC');
        
        if (result.length === 0) return [];
        
        const columns = result[0].columns;
        const values = result[0].values;
        
        return values.map(row => {
            const obj = {};
            columns.forEach((col, index) => {
                obj[col] = row[index];
            });
            return obj;
        });
    }

    /**
     * Ottieni un record per ID
     */
    getById(id) {
        const stmt = this.db.prepare('SELECT * FROM manutenzioni WHERE id = ?');
        stmt.bind([id]);
        
        const result = [];
        while (stmt.step()) {
            result.push(stmt.getAsObject());
        }
        
        stmt.free();
        return result[0] || null;
    }

    /**
     * Aggiorna un record
     */
    update(id, data) {
        const stmt = this.db.prepare(`
            UPDATE manutenzioni 
            SET nome = ?, tel = ?, modello = ?, serialNumber = ?, data = ?, url = ?, lingua = ?, scadenza = ?
            WHERE id = ?
        `);
        
        stmt.run([
            data.nome,
            data.tel,
            data.modello || '',
            data.serialNumber || '',
            data.data,
            data.url,
            data.lingua || 'it',
            data.scadenza || null,
            id
        ]);
        
        stmt.free();
        this.save();
        return true;
    }

    /**
     * Elimina un record
     */
    delete(id) {
        const stmt = this.db.prepare('DELETE FROM manutenzioni WHERE id = ?');
        stmt.run([id]);
        stmt.free();
        this.save();
        return true;
    }

    /**
     * Cancella tutti i record
     */
    clear() {
        this.db.run('DELETE FROM manutenzioni');
        this.save();
        return true;
    }

    /**
     * Conta i record
     */
    count() {
        const result = this.db.exec('SELECT COUNT(*) as count FROM manutenzioni');
        if (result.length === 0) return 0;
        return result[0].values[0][0];
    }

    /**
     * Ricerca globale
     */
    search(query) {
        const stmt = this.db.prepare(`
            SELECT * FROM manutenzioni 
            WHERE nome LIKE ? OR tel LIKE ? OR modello LIKE ? OR serialNumber LIKE ?
            ORDER BY dataCreazione DESC
        `);
        
        const searchPattern = `%${query}%`;
        stmt.bind([searchPattern, searchPattern, searchPattern, searchPattern]);
        
        const results = [];
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        
        stmt.free();
        return results;
    }

    /**
     * Ottieni statistiche
     */
    getStats() {
        const total = this.count();
        
        // Manutenzioni di questo mese
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
        
        const stmt1 = this.db.prepare(`
            SELECT COUNT(*) as count FROM manutenzioni 
            WHERE dataCreazione >= ? AND dataCreazione <= ?
        `);
        stmt1.bind([startOfMonth, endOfMonth]);
        stmt1.step();
        const thisMonth = stmt1.getAsObject().count;
        stmt1.free();
        
        // Clienti unici
        const stmt2 = this.db.prepare('SELECT COUNT(DISTINCT tel) as count FROM manutenzioni');
        stmt2.step();
        const uniqueClients = stmt2.getAsObject().count;
        stmt2.free();
        
        // Top modelli
        const result = this.db.exec(`
            SELECT modello, COUNT(*) as count 
            FROM manutenzioni 
            WHERE modello != ''
            GROUP BY modello 
            ORDER BY count DESC 
            LIMIT 5
        `);
        
        let topModels = [];
        if (result.length > 0) {
            const columns = result[0].columns;
            const values = result[0].values;
            topModels = values.map(row => ({
                modello: row[0],
                count: row[1]
            }));
        }
        
        return {
            total,
            thisMonth,
            uniqueClients,
            topModels
        };
    }

    /**
     * Esporta tutti i dati
     */
    exportData() {
        return this.getAll();
    }

    /**
     * Importa dati
     */
    importData(records) {
        const stmt = this.db.prepare(`
            INSERT INTO manutenzioni (nome, tel, modello, data, dataCreazione, url)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        
        records.forEach(record => {
            stmt.run([
                record.nome,
                record.tel,
                record.modello || '',
                record.data,
                record.dataCreazione || new Date().toISOString(),
                record.url
            ]);
        });
        
        stmt.free();
        this.save();
        return records.length;
    }

    /**
     * Chiudi il database
     */
    close() {
        if (this.db) {
            this.save();
            this.db.close();
        }
    }

    // ===== METODI PER GESTIONE UTENTI =====

    /**
     * Ottieni tutti gli utenti
     */
    getAllUsers() {
        const stmt = this.db.prepare('SELECT id, username, nome, createdAt FROM users ORDER BY id');
        const users = [];
        while (stmt.step()) {
            users.push(stmt.getAsObject());
        }
        stmt.free();
        return users;
    }

    /**
     * Ottieni utente per username
     */
    getUserByUsername(username) {
        const stmt = this.db.prepare('SELECT * FROM users WHERE username = ?');
        stmt.bind([username]);
        let user = null;
        if (stmt.step()) {
            user = stmt.getAsObject();
        }
        stmt.free();
        return user;
    }

    /**
     * Aggiungi un nuovo utente
     */
    addUser(data) {
        const stmt = this.db.prepare(`
            INSERT INTO users (username, password, nome, createdAt)
            VALUES (?, ?, ?, ?)
        `);
        
        stmt.run([
            data.username,
            data.password, // Deve essere già hashata
            data.nome,
            data.createdAt || new Date().toISOString()
        ]);
        
        stmt.free();
        
        // Ottieni l'ID dell'ultimo inserimento
        const result = this.db.exec('SELECT last_insert_rowid() as id');
        const id = result[0].values[0][0];
        
        this.save();
        return { id, ...data };
    }

    /**
     * Aggiorna un utente
     */
    updateUser(id, data) {
        const stmt = this.db.prepare(`
            UPDATE users 
            SET username = ?, nome = ?, password = ?
            WHERE id = ?
        `);
        
        stmt.run([
            data.username,
            data.nome,
            data.password, // Deve essere già hashata se cambiata
            id
        ]);
        
        stmt.free();
        this.save();
        return true;
    }

    /**
     * Elimina un utente
     */
    deleteUser(id) {
        const stmt = this.db.prepare('DELETE FROM users WHERE id = ?');
        stmt.run([id]);
        stmt.free();
        this.save();
        return true;
    }

    /**
     * Conta gli utenti
     */
    countUsers() {
        const result = this.db.exec('SELECT COUNT(*) as count FROM users');
        return result[0].values[0][0];
    }
    // ===== METODI PER GESTIONE CLIENTI =====

    /**
     * Ottieni tutti i clienti
     */
    getAllClients() {
        const stmt = this.db.prepare('SELECT * FROM clienti ORDER BY cognome, nome');
        const clients = [];
        while (stmt.step()) {
            clients.push(stmt.getAsObject());
        }
        stmt.free();
        return clients;
    }

    /**
     * Ottieni cliente per ID
     */
    getClientById(id) {
        const stmt = this.db.prepare('SELECT * FROM clienti WHERE id = ?');
        stmt.bind([id]);
        let client = null;
        if (stmt.step()) {
            client = stmt.getAsObject();
        }
        stmt.free();
        return client;
    }

    /**
     * Ottieni cliente per telefono
     */
    getClientByTel(tel) {
        const stmt = this.db.prepare('SELECT * FROM clienti WHERE tel = ?');
        stmt.bind([tel]);
        let client = null;
        if (stmt.step()) {
            client = stmt.getAsObject();
        }
        stmt.free();
        return client;
    }

    /**
     * Cerca clienti per nome/cognome
     */
    searchClients(query) {
        const stmt = this.db.prepare(`
            SELECT * FROM clienti 
            WHERE nome LIKE ? OR cognome LIKE ? OR tel LIKE ?
            ORDER BY cognome, nome
        `);
        const searchTerm = `%${query}%`;
        stmt.bind([searchTerm, searchTerm, searchTerm]);
        const clients = [];
        while (stmt.step()) {
            clients.push(stmt.getAsObject());
        }
        stmt.free();
        return clients;
    }

    /**
     * Aggiungi un nuovo cliente
     */
    addClient(data) {
        const stmt = this.db.prepare(`
            INSERT INTO clienti (nome, cognome, email, tel, lingua, piva, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run([
            data.nome,
            data.cognome,
            data.email || null,
            data.tel,
            data.lingua,
            data.piva || null,
            data.createdAt || new Date().toISOString()
        ]);
        
        stmt.free();
        
        // Ottieni l'ID dell'ultimo inserimento
        const result = this.db.exec('SELECT last_insert_rowid() as id');
        const id = result[0].values[0][0];
        
        this.save();
        return { id, ...data };
    }

    /**
     * Aggiorna un cliente
     */
    updateClient(id, data) {
        const stmt = this.db.prepare(`
            UPDATE clienti 
            SET nome = ?, cognome = ?, email = ?, tel = ?, lingua = ?, piva = ?
            WHERE id = ?
        `);
        
        stmt.run([
            data.nome,
            data.cognome,
            data.email || null,
            data.tel,
            data.lingua,
            data.piva || null,
            id
        ]);
        
        stmt.free();
        this.save();
        return true;
    }

    /**
     * Elimina un cliente
     */
    deleteClient(id) {
        const stmt = this.db.prepare('DELETE FROM clienti WHERE id = ?');
        stmt.run([id]);
        stmt.free();
        this.save();
        return true;
    }

    /**
     * Conta i clienti
     */
    countClients() {
        const result = this.db.exec('SELECT COUNT(*) as count FROM clienti');
        return result[0]?.values[0][0] || 0;
    }}

module.exports = QRDatabase;
