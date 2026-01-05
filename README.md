# QRepair - Sistema di Gestione Manutenzioni con QR Code

<div align="center">

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support%20-yellow.svg?logo=buy-me-a-coffee&logoColor=white)](https://buymeacoffee.com/guidoballau)
[![PayPal](https://img.shields.io/badge/PayPal-Donate-blue.svg?logo=paypal)](https://www.paypal.com/donate/?hosted_button_id=8RF28JBPLYASN)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

</div>

---

## 📋 Descrizione

**QRepair** è un sistema completo per la gestione delle manutenzioni di dispositivi attraverso QR Code. Ideale per aziende di assistenza tecnica, manutentori e service provider che vogliono digitalizzare e semplificare il tracciamento degli interventi di manutenzione.

### ✨ Caratteristiche Principali

- 🔐 **Sistema di Autenticazione** - Login sicuro con gestione utenti e sessioni
- 📱 **Generazione QR Code** - Crea QR code univoci per ogni dispositivo
- 📊 **Dashboard Completa** - Visualizza, cerca e gestisci tutte le manutenzioni
- 🌍 **Multilingua** - Supporto per Italiano, Inglese e Tedesco
- 📅 **Gestione Scadenze** - Monitoraggio automatico delle date di scadenza
- 💬 **Integrazione WhatsApp** - Invio messaggi diretti ai clienti
- 📥 **Export/Import** - Esportazione in CSV e JSON
- 👥 **Gestione Utenti** - Amministrazione completa degli accessi
- 🔄 **Database Persistente** - Salvataggio automatico su SQLite

---

## 🚀 Installazione

### Prerequisiti

- **Node.js** (v14 o superiore) - [Download](https://nodejs.org/)
- **npm** (incluso con Node.js)
- Browser moderno (Chrome, Firefox, Edge, Safari)

### Passaggi di Installazione

1. **Clona il repository**
   ```bash
   git clone https://github.com/Gheben/QRepair.git
   cd QRepair
   ```

2. **Installa le dipendenze**
   ```bash
   npm install
   ```

3. **Avvia il server**
   ```bash
   npm start
   ```

4. **Apri il browser**
   ```
   http://localhost:3000/login
   ```

---

## 🔑 Primo Accesso

Al primo avvio, il sistema crea automaticamente un utente amministratore:

- **Username**: `admin`
- **Password**: `admin`

> ⚠️ **IMPORTANTE**: Cambia immediatamente la password dopo il primo accesso!

---

## 📖 Guida all'Utilizzo

### 📸 Panoramica Interfacce

#### Dashboard Principale
![Dashboard Principale](screenshot/Dashboard%20Principale.png)
*Vista principale con statistiche, ricerca e gestione manutenzioni*

#### Generazione QR Code
![Generazione QR](screenshot/Generazione%20QR.png)
*Form per la creazione di nuovi QR code per i dispositivi*

#### Dashboard Clienti
![Dashboard Clienti](screenshot/Dashboard%20Clienti.png)
*Gestione completa dei clienti con rubrica e storico manutenzioni*

#### Visualizzazione QR Cliente
![QR Cliente](screenshot/QR%20Cliente.png)
*Pagina pubblica visualizzata dai clienti scansionando il QR code*

#### Gestione Utenti
![Gestione Utenti](screenshot/Gestione%20Utenti.png)
*Amministrazione utenti del sistema*

#### Impostazioni Fornitore
![Impostazioni Fornitore](screenshot/Impostazioni%20Fornitore.png)
*Configurazione dati aziendali, logo e contatti*

---

### 1. Login

1. Apri `http://localhost:3000/login`
2. Inserisci le credenziali di accesso
3. Clicca su "Accedi"

### 2. Configurazione Iniziale (Settings)

Prima di creare QR code, configura i dati della tua azienda:

1. Vai su `http://localhost:3000/settings`
2. Inserisci:
   - **Nome Azienda** (es. "GB Service")
   - **Numero Telefono** (es. "+39 333 1234567")
   - **Logo Aziendale** (opzionale, max 200x200px)
3. Clicca su "💾 Salva Impostazioni"

### 3. Creazione QR Code

1. Vai su `http://localhost:3000` (pagina di creazione)
2. Compila il form:
   - **Nome Cliente** *(obbligatorio)*
   - **Telefono Cliente** *(obbligatorio)*
   - **Modello Dispositivo** (es. "iPhone 13")
   - **Numero Seriale (S/N)** (es. "ABC123456")
   - **Data Manutenzione** *(obbligatorio)*
   - **Data Scadenza** (per garantia/prossima revisione)
   - **Lingua** (IT/EN/DE)
3. Clicca su "🎨 Genera QR Code"
4. Il QR code viene generato e salvato automaticamente
5. Scarica il QR code come PNG

### 4. Dashboard - Gestione Manutenzioni

Accedi alla dashboard su `http://localhost:3000/dashboard`:

#### Funzionalità:
- **📊 Statistiche**: Totale record, manutenzioni del mese, clienti unici
- **🔍 Ricerca**: Cerca per nome, telefono, modello o numero seriale
- **👁️ Visualizza QR**: Visualizza e stampa il QR code di ogni record
- **✏️ Modifica**: Aggiorna i dati delle manutenzioni
- **🔄 Aggiorna Manutenzione**: Registra nuove manutenzioni per lo stesso dispositivo
- **🗑️ Elimina**: Rimuovi singoli record
- **📥 Export CSV/JSON**: Esporta tutti i dati
- **📤 Import**: Importa dati da file JSON
- **🗑️ Cancella Tutto**: Rimuovi tutti i record (richiede conferma)

### 5. Pagina Info (Pubblica)

Quando un cliente scansiona il QR code, accede automaticamente a `http://localhost:3000/info?id=XXX`:

**Informazioni Visualizzate:**
- 🏢 Nome Azienda e Logo
- 📞 Telefono Azienda
- 👤 Nome Cliente
- 📱 Telefono Cliente (con pulsante chiamata diretta)
- 🔧 Modello Dispositivo
- 🔢 Numero Seriale
- 📅 Data Ultima Manutenzione
- ⏰ Data Scadenza (con indicatore colore)
- 💬 Pulsante "Invia Messaggio WhatsApp"

**Indicatori Scadenza:**
- 🟢 Verde: Scadenza futura
- 🔴 Rosso: Scadenza passata
- ⚪ Grigio: Nessuna scadenza impostata

### 6. Gestione Utenti

Accedi a `http://localhost:3000/users` dalla Dashboard:

#### Operazioni Disponibili:
- **➕ Crea Nuovo Utente**: Username, Password, Nome completo
- **✏️ Modifica Utente**: Aggiorna dati (lascia password vuota per non modificarla)
- **🗑️ Elimina Utente**: Rimuovi utente (minimo 1 utente richiesto)

> 💡 **Nota**: Non puoi eliminare l'ultimo utente del sistema

### 7. Logout

Clicca su "🚪 Logout" nella Dashboard per uscire in sicurezza.

---

## 🗂️ Struttura del Progetto

```
QRepair/
├── server.js              # Server Express principale
├── database.js            # Gestione database SQLite
├── db.js                  # Wrapper database (legacy)
├── api-client.js          # Client API per il frontend
├── package.json           # Dipendenze Node.js
├── settings.json          # Impostazioni azienda (generato automaticamente)
├── manutenzioni.db        # Database SQLite (generato automaticamente)
│
├── login.html             # Pagina di login
├── index.html             # Generazione QR Code
├── dashboard.html         # Dashboard gestionale
├── info.html              # Pagina pubblica QR Code
├── settings.html          # Configurazione azienda
├── users.html             # Gestione utenti
│
└── style.css              # Stili globali
```

---

## 🔧 Tecnologie Utilizzate

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **sql.js** - Database SQLite in-memory
- **bcrypt** - Hash delle password
- **express-session** - Gestione sessioni
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **HTML5** - Struttura
- **CSS3** - Stili e animazioni
- **Vanilla JavaScript** - Logica applicativa
- **QRCode.js** - Generazione QR Code
- **Flag Icons** - Bandiere per selezione lingua

---

## 📊 API Endpoints

### Autenticazione
- `POST /api/auth/login` - Login utente
- `POST /api/auth/logout` - Logout utente
- `GET /api/auth/check` - Verifica autenticazione

### Manutenzioni (Protette)
- `GET /api/manutenzioni` - Lista tutte le manutenzioni
- `GET /api/manutenzioni/:id` - Dettaglio manutenzione (pubblica)
- `POST /api/manutenzioni` - Crea nuova manutenzione
- `PUT /api/manutenzioni/:id` - Aggiorna manutenzione
- `PUT /api/manutenzioni/:id/data` - Aggiorna solo data/scadenza
- `DELETE /api/manutenzioni/:id` - Elimina manutenzione
- `DELETE /api/manutenzioni` - Elimina tutte le manutenzioni

### Ricerca e Statistiche (Protette)
- `GET /api/search/:query` - Ricerca manutenzioni
- `GET /api/stats` - Statistiche dashboard
- `GET /api/count` - Conta record

### Export/Import (Protette)
- `GET /api/export` - Esporta tutti i dati
- `POST /api/import` - Importa dati da JSON

### Impostazioni
- `GET /api/settings` - Ottieni impostazioni (pubblica)
- `POST /api/settings` - Salva impostazioni (protetta)

### Gestione Utenti (Protette)
- `GET /api/users` - Lista utenti
- `POST /api/users` - Crea utente
- `PUT /api/users/:id` - Aggiorna utente
- `DELETE /api/users/:id` - Elimina utente

---

## 🔒 Sicurezza

- ✅ **Password Hash**: Bcrypt con salt rounds = 10
- ✅ **Sessioni HTTP-Only**: Cookie protetti da XSS
- ✅ **Validazione Input**: Controllo dati lato server
- ✅ **SQL Injection Protection**: Prepared statements
- ✅ **CORS**: Configurato per richieste sicure
- ✅ **Autenticazione Obbligatoria**: Tutte le operazioni critiche protette
- ✅ **Protezione Ultimo Utente**: Non eliminabile

---

## 🌐 Deployment in Produzione

### Configurazione Server

1. **Modifica porta** (opzionale) in `server.js`:
   ```javascript
   const PORT = process.env.PORT || 3000;
   ```

2. **Cambia secret sessione** in `server.js`:
   ```javascript
   secret: process.env.SESSION_SECRET || 'YOUR_SECURE_SECRET_KEY'
   ```

3. **Configura HTTPS** (consigliato per produzione)

4. **Usa reverse proxy** (NGINX, Apache) per esporre il server

### Esempio NGINX
```nginx
server {
    listen 80;
    server_name tuodominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Avvio Automatico (systemd)

Crea `/etc/systemd/system/qrepair.service`:

```ini
[Unit]
Description=QRepair Service
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/QRepair
ExecStart=/usr/bin/node server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Abilita e avvia:
```bash
sudo systemctl enable qrepair
sudo systemctl start qrepair
```

---

## 🐛 Troubleshooting

### Server non si avvia
```bash
# Verifica che la porta 3000 sia libera
netstat -ano | findstr :3000

# Termina processo su porta 3000 (Windows)
taskkill /F /PID <PID>

# Reinstalla dipendenze
rm -rf node_modules package-lock.json
npm install
```

### Database corrotto
```bash
# Elimina il database (ATTENZIONE: perdi tutti i dati!)
rm manutenzioni.db

# Riavvia il server (ricrea il database vuoto)
npm start
```

### Errori di login
- Verifica che le credenziali siano corrette
- Controlla i cookie del browser (elimina cookie localhost:3000)
- Verifica che express-session sia installato: `npm list express-session`

### QR Code non si genera
- Controlla la console JavaScript del browser (F12)
- Verifica che QRCode.js sia caricato correttamente
- Controlla la connessione al server

---

## 🔄 Backup e Restore

### Backup Manuale
```bash
# Esporta tutti i dati dalla Dashboard (📥 Esporta JSON)
# Oppure copia i file:
cp manutenzioni.db manutenzioni.db.backup
cp settings.json settings.json.backup
```

### Restore
```bash
# Ripristina file di backup
cp manutenzioni.db.backup manutenzioni.db
cp settings.json.backup settings.json
```

### Backup Automatico (Linux/Mac - cron)
```bash
# Aggiungi a crontab (crontab -e)
0 2 * * * cp /path/to/QRepair/manutenzioni.db /backup/manutenzioni_$(date +\%Y\%m\%d).db
```

---

## 📝 Changelog

### v1.0.0 (Gennaio 2026)
- ✅ Sistema di autenticazione completo
- ✅ Gestione utenti
- ✅ Generazione QR Code
- ✅ Dashboard con statistiche
- ✅ Supporto multilingua (IT/EN/DE)
- ✅ Integrazione WhatsApp
- ✅ Export/Import CSV e JSON
- ✅ Campo Serial Number (S/N)
- ✅ URL senza estensione .html
- ✅ Database SQLite persistente
- ✅ Gestione scadenze con colori
- ✅ Responsive design

---

## 🤝 Contributi

I contributi sono benvenuti! Per favore:

1. Fork del progetto
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push sul branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

---

## 📄 Licenza

Questo progetto è rilasciato sotto licenza **MIT**.

---

## 👨‍💻 Autore

**Guido Ballarini**

- 💼 LinkedIn: <a href="https://www.linkedin.com/in/guido-ballarini/" target="_blank">Guido Ballarini</a>
- ☕ Buy Me a Coffee: [guidoballau](https://buymeacoffee.com/guidoballau)

---

## 💖 Supporta il Progetto

Se trovi utile questo progetto, considera di offrirmi un caffè! ☕

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support%20-yellow.svg?logo=buy-me-a-coffee&logoColor=white)](https://buymeacoffee.com/guidoballau)
[![PayPal](https://img.shields.io/badge/PayPal-Donate-blue.svg?logo=paypal)](https://www.paypal.com/donate/?hosted_button_id=8RF28JBPLYASN)

---

<div align="center">

**⭐ Se ti piace il progetto, lascia una stella su GitHub! ⭐**

Made with ❤️ by Guido Ballarini - © 2026

</div>
