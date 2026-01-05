/**
 * API Client per comunicare con il server locale
 */

const API_BASE_URL = 'http://localhost:3000/api';

class APIClient {
    /**
     * Effettua una richiesta HTTP
     */
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Errore sconosciuto');
            }

            return data.data;
        } catch (error) {
            console.error('Errore API:', error);
            throw error;
        }
    }

    /**
     * Ottieni tutte le manutenzioni
     */
    async getAll() {
        return this.request('/manutenzioni');
    }

    /**
     * Ottieni una manutenzione per ID
     */
    async getById(id) {
        return this.request(`/manutenzioni/${id}`);
    }

    /**
     * Aggiungi una nuova manutenzione
     */
    async add(data) {
        return this.request('/manutenzioni', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    /**
     * Aggiorna una manutenzione
     */
    async update(id, data) {
        return this.request(`/manutenzioni/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    /**
     * Elimina una manutenzione
     */
    async delete(id) {
        return this.request(`/manutenzioni/${id}`, {
            method: 'DELETE'
        });
    }

    /**
     * Cancella tutte le manutenzioni
     */
    async clear() {
        return this.request('/manutenzioni', {
            method: 'DELETE'
        });
    }

    /**
     * Ricerca manutenzioni
     */
    async search(query) {
        return this.request(`/search/${encodeURIComponent(query)}`);
    }

    /**
     * Ottieni statistiche
     */
    async getStats() {
        return this.request('/stats');
    }

    /**
     * Conta i record
     */
    async count() {
        return this.request('/count');
    }

    /**
     * Esporta dati
     */
    async exportData() {
        return this.request('/export');
    }

    /**
     * Importa dati
     */
    async importData(records) {
        return this.request('/import', {
            method: 'POST',
            body: JSON.stringify({ records })
        });
    }
}

// Istanza globale del client API
const api = new APIClient();
