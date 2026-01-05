/**
 * Database Manager - IndexedDB
 * Gestisce tutte le operazioni sul database locale
 */

class QRDatabase {
    constructor() {
        this.dbName = 'QRManutentioniDB';
        this.version = 1;
        this.storeName = 'manutenzioni';
        this.db = null;
    }

    /**
     * Inizializza il database
     */
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                console.error('Errore apertura database:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('✅ Database inizializzato');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Crea l'object store se non esiste
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const objectStore = db.createObjectStore(this.storeName, { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });

                    // Crea indici per ricerca veloce
                    objectStore.createIndex('nome', 'nome', { unique: false });
                    objectStore.createIndex('tel', 'tel', { unique: false });
                    objectStore.createIndex('modello', 'modello', { unique: false });
                    objectStore.createIndex('data', 'data', { unique: false });
                    objectStore.createIndex('dataCreazione', 'dataCreazione', { unique: false });

                    console.log('📦 Object store creato con indici');
                }
            };
        });
    }

    /**
     * Aggiungi un record
     */
    async add(data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            
            // Aggiungi timestamp di creazione
            data.dataCreazione = data.dataCreazione || new Date().toISOString();
            
            const request = objectStore.add(data);

            request.onsuccess = () => {
                console.log('✅ Record aggiunto con ID:', request.result);
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('❌ Errore aggiunta record:', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Ottieni tutti i record
     */
    async getAll() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * Ottieni un record per ID
     */
    async getById(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.get(id);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * Aggiorna un record
     */
    async update(data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.put(data);

            request.onsuccess = () => {
                console.log('✅ Record aggiornato');
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('❌ Errore aggiornamento:', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Elimina un record
     */
    async delete(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.delete(id);

            request.onsuccess = () => {
                console.log('✅ Record eliminato');
                resolve();
            };

            request.onerror = () => {
                console.error('❌ Errore eliminazione:', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Cancella tutti i record
     */
    async clear() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.clear();

            request.onsuccess = () => {
                console.log('✅ Database svuotato');
                resolve();
            };

            request.onerror = () => {
                console.error('❌ Errore svuotamento:', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Conta i record
     */
    async count() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.count();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * Cerca per nome
     */
    async searchByName(query) {
        const all = await this.getAll();
        return all.filter(record => 
            record.nome.toLowerCase().includes(query.toLowerCase())
        );
    }

    /**
     * Cerca per telefono
     */
    async searchByPhone(query) {
        const all = await this.getAll();
        return all.filter(record => 
            record.tel.includes(query)
        );
    }

    /**
     * Ricerca globale
     */
    async search(query) {
        const all = await this.getAll();
        const lowerQuery = query.toLowerCase();
        return all.filter(record => 
            record.nome.toLowerCase().includes(lowerQuery) ||
            record.tel.includes(query) ||
            (record.modello && record.modello.toLowerCase().includes(lowerQuery))
        );
    }

    /**
     * Ottieni record per mese
     */
    async getByMonth(year, month) {
        const all = await this.getAll();
        return all.filter(record => {
            const date = new Date(record.dataCreazione);
            return date.getFullYear() === year && date.getMonth() === month;
        });
    }

    /**
     * Ottieni statistiche
     */
    async getStats() {
        const all = await this.getAll();
        const now = new Date();
        
        // Manutenzioni questo mese
        const thisMonth = all.filter(r => {
            const date = new Date(r.dataCreazione);
            return date.getMonth() === now.getMonth() && 
                   date.getFullYear() === now.getFullYear();
        });

        // Clienti unici (per telefono)
        const uniquePhones = new Set(all.map(r => r.tel));

        // Modelli più comuni
        const modelli = {};
        all.forEach(r => {
            if (r.modello) {
                modelli[r.modello] = (modelli[r.modello] || 0) + 1;
            }
        });

        return {
            total: all.length,
            thisMonth: thisMonth.length,
            uniqueClients: uniquePhones.size,
            topModels: Object.entries(modelli)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
        };
    }

    /**
     * Esporta tutti i dati
     */
    async exportData() {
        const all = await this.getAll();
        return all;
    }

    /**
     * Importa dati (aggiunge ai dati esistenti)
     */
    async importData(data) {
        const promises = data.map(record => {
            // Rimuovi l'ID se presente per evitare conflitti
            const newRecord = { ...record };
            delete newRecord.id;
            return this.add(newRecord);
        });
        return Promise.all(promises);
    }

    /**
     * Migra dati da LocalStorage
     */
    async migrateFromLocalStorage() {
        const oldData = localStorage.getItem('qrRecords');
        if (!oldData) {
            console.log('Nessun dato da migrare');
            return 0;
        }

        try {
            const records = JSON.parse(oldData);
            console.log(`📦 Trovati ${records.length} record in LocalStorage`);
            
            // Importa i dati
            await this.importData(records);
            
            // Rimuovi i vecchi dati (opzionale, commentare se si vuole mantenere backup)
            // localStorage.removeItem('qrRecords');
            
            console.log(`✅ Migrazione completata: ${records.length} record importati`);
            return records.length;
        } catch (error) {
            console.error('❌ Errore migrazione:', error);
            throw error;
        }
    }
}

// Istanza globale del database
const qrDB = new QRDatabase();
