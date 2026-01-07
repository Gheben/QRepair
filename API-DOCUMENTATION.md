# 📡 QRepair API Documentation

Base URL: `http://localhost:5126/api` o `https://your-domain.com/api`

## 🔓 Public APIs (No Authentication Required)

### 1. Login
**POST** `/api/auth/login`

Autenticazione utente e creazione sessione.

**Request Body:**
```json
{
  "username": "admin",
  "password": "yourpassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "nome": "Amministratore"
  }
}
```

**Example (cURL):**
```bash
curl -X POST http://localhost:5126/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}' \
  -c cookies.txt
```

**Example (JavaScript):**
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin' })
});
const data = await response.json();
```

---

### 2. Logout
**POST** `/api/auth/logout`

Termina la sessione corrente.

**Response:**
```json
{
  "success": true,
  "message": "Logout effettuato"
}
```

**Example (cURL):**
```bash
curl -X POST http://localhost:5126/api/auth/logout \
  -b cookies.txt
```

---

### 3. Check Session
**GET** `/api/auth/check`

Verifica se la sessione è valida.

**Response:**
```json
{
  "authenticated": true,
  "user": {
    "id": 1,
    "username": "admin",
    "nome": "Amministratore"
  }
}
```

**Example (cURL):**
```bash
curl http://localhost:5126/api/auth/check -b cookies.txt
```

---

### 4. Get Maintenance by ID
**GET** `/api/manutenzioni/:id`

Recupera i dettagli di una singola manutenzione (usato dai QR code pubblici).

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "abc123xyz",
    "nome": "Mario Rossi",
    "tel": "+39 123 456 7890",
    "modello": "Caldaia XYZ",
    "serialNumber": "SN123456",
    "data": "07/01/2026",
    "scadenza": "07/01/2027",
    "lingua": "it"
  }
}
```

**Example (cURL):**
```bash
curl http://localhost:5126/api/manutenzioni/abc123xyz
```

---

### 5. Get Public Settings
**GET** `/api/settings`

Recupera le impostazioni pubbliche (logo e nome azienda).

**Response:**
```json
{
  "success": true,
  "data": {
    "nomeAzienda": "Acme Corp",
    "telefono": "+39 123 456 7890",
    "logo": "data:image/png;base64,...",
    "baseUrl": "https://example.com"
  }
}
```

**Example (cURL):**
```bash
curl http://localhost:5126/api/settings
```

---

## 🔒 Protected APIs (Authentication Required)

> **Note:** Tutte le API protette richiedono una sessione valida (cookie). Effettua prima il login.

### 6. Get All Maintenances
**GET** `/api/manutenzioni`

Recupera tutte le manutenzioni.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "abc123xyz",
      "nome": "Mario Rossi",
      "tel": "+39 123 456 7890",
      "modello": "Caldaia XYZ",
      "serialNumber": "SN123456",
      "data": "07/01/2026",
      "scadenza": "07/01/2027",
      "dataCreazione": "2026-01-07T10:00:00.000Z",
      "lingua": "it",
      "client_id": null
    }
  ]
}
```

**Example (cURL):**
```bash
curl http://localhost:5126/api/manutenzioni -b cookies.txt
```

---

### 7. Create Maintenance
**POST** `/api/manutenzioni`

Crea una nuova manutenzione.

**Request Body:**
```json
{
  "nome": "Mario Rossi",
  "tel": "+39 123 456 7890",
  "modello": "Caldaia XYZ",
  "serialNumber": "SN123456",
  "data": "07/01/2026",
  "scadenza": "07/01/2027",
  "lingua": "it"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "newId123",
    "nome": "Mario Rossi",
    "tel": "+39 123 456 7890",
    "modello": "Caldaia XYZ",
    "serialNumber": "SN123456",
    "data": "07/01/2026",
    "scadenza": "07/01/2027",
    "dataCreazione": "2026-01-07T10:00:00.000Z",
    "lingua": "it"
  }
}
```

**Example (cURL):**
```bash
curl -X POST http://localhost:5126/api/manutenzioni \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "nome": "Mario Rossi",
    "tel": "+39 123 456 7890",
    "modello": "Caldaia XYZ",
    "serialNumber": "SN123456",
    "data": "07/01/2026",
    "scadenza": "07/01/2027",
    "lingua": "it"
  }'
```

---

### 8. Update Maintenance
**PUT** `/api/manutenzioni/:id`

Aggiorna una manutenzione esistente.

**Request Body:**
```json
{
  "nome": "Mario Rossi Updated",
  "tel": "+39 987 654 3210",
  "modello": "Caldaia XYZ Pro",
  "serialNumber": "SN999999"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated record */ }
}
```

**Example (cURL):**
```bash
curl -X PUT http://localhost:5126/api/manutenzioni/abc123xyz \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"nome": "Mario Rossi Updated"}'
```

---

### 9. Update Maintenance Dates
**PUT** `/api/manutenzioni/:id/data`

Aggiorna solo data manutenzione e scadenza.

**Request Body:**
```json
{
  "data": "15/02/2026",
  "scadenza": "15/02/2027"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated record */ }
}
```

**Example (cURL):**
```bash
curl -X PUT http://localhost:5126/api/manutenzioni/abc123xyz/data \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"data": "15/02/2026", "scadenza": "15/02/2027"}'
```

---

### 10. Delete Maintenance
**DELETE** `/api/manutenzioni/:id`

Elimina una manutenzione.

**Response:**
```json
{
  "success": true,
  "message": "Record eliminato"
}
```

**Example (cURL):**
```bash
curl -X DELETE http://localhost:5126/api/manutenzioni/abc123xyz \
  -b cookies.txt
```

---

### 11. Delete All Maintenances
**DELETE** `/api/manutenzioni`

Elimina tutte le manutenzioni (⚠️ Attenzione!).

**Response:**
```json
{
  "success": true,
  "message": "Tutti i record sono stati eliminati"
}
```

**Example (cURL):**
```bash
curl -X DELETE http://localhost:5126/api/manutenzioni -b cookies.txt
```

---

### 12. Search Maintenances
**GET** `/api/search/:query`

Cerca manutenzioni per nome, telefono, modello o serial number.

**Response:**
```json
{
  "success": true,
  "data": [ /* array of matching records */ ]
}
```

**Example (cURL):**
```bash
curl http://localhost:5126/api/search/mario -b cookies.txt
```

---

### 13. Get Statistics
**GET** `/api/stats`

Recupera statistiche sulle manutenzioni.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "thisMonth": 12,
    "uniqueClients": 85
  }
}
```

**Example (cURL):**
```bash
curl http://localhost:5126/api/stats -b cookies.txt
```

---

### 14. Get Count
**GET** `/api/count`

Conta il numero totale di manutenzioni.

**Response:**
```json
{
  "success": true,
  "data": { "count": 150 }
}
```

**Example (cURL):**
```bash
curl http://localhost:5126/api/count -b cookies.txt
```

---

### 15. Export Data
**GET** `/api/export`

Esporta tutte le manutenzioni in formato JSON.

**Response:**
```json
{
  "success": true,
  "data": [ /* array of all records */ ]
}
```

**Example (cURL):**
```bash
curl http://localhost:5126/api/export -b cookies.txt > backup.json
```

---

### 16. Import Data
**POST** `/api/import`

Importa manutenzioni da un array JSON.

**Request Body:**
```json
{
  "data": [
    {
      "nome": "Mario Rossi",
      "tel": "+39 123 456 7890",
      "modello": "Caldaia XYZ",
      "serialNumber": "SN123456",
      "data": "07/01/2026",
      "scadenza": "07/01/2027",
      "lingua": "it"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "imported": 1,
  "skipped": 0
}
```

**Example (cURL):**
```bash
curl -X POST http://localhost:5126/api/import \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d @backup.json
```

---

### 17. Update Settings
**POST** `/api/settings`

Aggiorna le impostazioni azienda.

**Request Body:**
```json
{
  "nomeAzienda": "Acme Corp",
  "telefono": "+39 123 456 7890",
  "logo": "data:image/png;base64,...",
  "baseUrl": "https://example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated settings */ }
}
```

**Example (cURL):**
```bash
curl -X POST http://localhost:5126/api/settings \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"nomeAzienda": "New Company", "telefono": "+39 111 222 3333"}'
```

---

## 👥 User Management APIs

### 18. Get All Users
**GET** `/api/users`

Recupera tutti gli utenti.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "admin",
      "nome": "Amministratore",
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

**Example (cURL):**
```bash
curl http://localhost:5126/api/users -b cookies.txt
```

---

### 19. Create User
**POST** `/api/users`

Crea un nuovo utente.

**Request Body:**
```json
{
  "username": "newuser",
  "password": "SecureP@ss123!",
  "nome": "Nuovo Utente"
}
```

**Password Requirements:**
- Almeno 6 caratteri
- Almeno una lettera maiuscola
- Almeno un carattere speciale

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "username": "newuser",
    "nome": "Nuovo Utente",
    "createdAt": "2026-01-07T10:00:00.000Z"
  }
}
```

**Example (cURL):**
```bash
curl -X POST http://localhost:5126/api/users \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "username": "newuser",
    "password": "SecureP@ss123!",
    "nome": "Nuovo Utente"
  }'
```

---

### 20. Update User
**PUT** `/api/users/:id`

Aggiorna un utente esistente.

**Request Body:**
```json
{
  "username": "updateduser",
  "password": "NewP@ss456!",
  "nome": "Nome Aggiornato"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Utente aggiornato"
}
```

**Example (cURL):**
```bash
curl -X PUT http://localhost:5126/api/users/2 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"nome": "Nome Aggiornato"}'
```

---

### 21. Delete User
**DELETE** `/api/users/:id`

Elimina un utente (⚠️ Non può eliminare l'ultimo utente).

**Response:**
```json
{
  "success": true,
  "message": "Utente eliminato"
}
```

**Example (cURL):**
```bash
curl -X DELETE http://localhost:5126/api/users/2 -b cookies.txt
```

---

## 🧑‍🤝‍🧑 Client Management APIs

### 22. Get All Clients
**GET** `/api/clienti`

Recupera tutti i clienti.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "Mario",
      "cognome": "Rossi",
      "tel": "+39 123 456 7890",
      "indirizzo": "Via Roma 1",
      "citta": "Milano",
      "cap": "20100",
      "email": "mario@example.com",
      "note": "Cliente VIP"
    }
  ]
}
```

**Example (cURL):**
```bash
curl http://localhost:5126/api/clienti -b cookies.txt
```

---

### 23. Create Client
**POST** `/api/clienti`

Crea un nuovo cliente.

**Request Body:**
```json
{
  "nome": "Mario",
  "cognome": "Rossi",
  "tel": "+39 123 456 7890",
  "indirizzo": "Via Roma 1",
  "citta": "Milano",
  "cap": "20100",
  "email": "mario@example.com",
  "note": "Cliente VIP"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* new client record */ }
}
```

**Example (cURL):**
```bash
curl -X POST http://localhost:5126/api/clienti \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "nome": "Mario",
    "cognome": "Rossi",
    "tel": "+39 123 456 7890"
  }'
```

---

### 24. Update Client
**PUT** `/api/clienti/:id`

Aggiorna un cliente esistente.

**Request Body:**
```json
{
  "tel": "+39 987 654 3210",
  "email": "newemail@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cliente aggiornato"
}
```

**Example (cURL):**
```bash
curl -X PUT http://localhost:5126/api/clienti/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"tel": "+39 987 654 3210"}'
```

---

### 25. Delete Client
**DELETE** `/api/clienti/:id`

Elimina un cliente.

**Response:**
```json
{
  "success": true,
  "message": "Cliente eliminato"
}
```

**Example (cURL):**
```bash
curl -X DELETE http://localhost:5126/api/clienti/1 -b cookies.txt
```

---

## 🔐 Security Notes

1. **Session-based Authentication**: Le API protette usano cookie di sessione. Assicurati di includere i cookie nelle richieste.

2. **HTTPS Recommended**: In produzione, usa sempre HTTPS per proteggere le credenziali.

3. **CORS**: Attualmente le API non supportano CORS. Funzionano solo same-origin.

4. **Rate Limiting**: Non implementato. Considera di aggiungerlo in produzione.

5. **Demo Mode**: Se `DEMO_MODE=true`, alcune operazioni (creazione/modifica/eliminazione utenti) sono disabilitate.

---

## 📝 Error Responses

Tutte le API possono restituire errori nel seguente formato:

```json
{
  "success": false,
  "error": "Messaggio di errore descrittivo"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (parametri mancanti/invalidi)
- `401` - Unauthorized (sessione mancante/scaduta)
- `403` - Forbidden (operazione non permessa, es. demo mode)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🚀 Quick Start

1. **Start the server:**
```bash
npm start
```

2. **Login to get session cookie:**
```bash
curl -X POST http://localhost:5126/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}' \
  -c cookies.txt
```

3. **Make authenticated requests:**
```bash
curl http://localhost:5126/api/manutenzioni -b cookies.txt
```

---

## 📦 Postman Collection

Puoi importare questa collezione in Postman/Insomnia creando requests con gli esempi sopra.

---

**Last Updated:** January 7, 2026
**Version:** 1.0.0
