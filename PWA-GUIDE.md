# 📱 QRepair PWA - Guida Installazione

QRepair è ora una **Progressive Web App (PWA)** installabile su smartphone e tablet!

## ✨ Cosa è cambiato?

- ✅ Installabile come app nativa su Android
- ✅ Funziona offline (con cache intelligente)
- ✅ Icona sulla home screen
- ✅ Esperienza full-screen
- ✅ Aggiornamenti automatici

## 📲 Come Installare su Android

### Chrome/Edge Mobile:
1. Apri il sito con Chrome o Edge
2. Clicca sul menu (⋮) in alto a destra
3. Seleziona "Aggiungi a schermata Home" o "Installa app"
4. Conferma l'installazione
5. L'icona QRepair apparirà sulla home screen

### Samsung Internet:
1. Apri il sito
2. Tocca l'icona menu in basso
3. Seleziona "Aggiungi pagina a"
4. Scegli "Schermata Home"

## 🍎 Come Installare su iOS (iPhone/iPad)

1. Apri il sito con Safari
2. Tocca l'icona "Condividi" (quadrato con freccia)
3. Scorri e seleziona "Aggiungi a Home"
4. Personalizza il nome se vuoi
5. Tocca "Aggiungi"

## 🔧 File PWA Creati

- `manifest.json` - Configurazione dell'app
- `service-worker.js` - Cache offline e strategia di aggiornamento
- Meta tags aggiunti a tutti i file HTML

## 🌐 Funzionalità Offline

Il Service Worker implementa una strategia **Network First**:
- Cerca sempre di caricare dalla rete
- Se offline, usa la cache
- Aggiorna automaticamente la cache quando online

Pagine/risorse cachate:
- Login, Dashboard, Index
- Clients, Users, Settings
- Style.css, Logo, API client

## 🔄 Come Testare

1. Avvia il server: `npm start`
2. Apri Chrome DevTools (F12)
3. Vai su "Application" → "Service Workers"
4. Verifica che il SW sia registrato
5. Vai su "Application" → "Manifest"
6. Clicca "Add to homescreen" per testare

## 📊 Modalità Offline

Se la connessione cade:
- Le pagine già visitate funzioneranno dalla cache
- Verrà mostrata una pagina "Offline" personalizzata
- Al ripristino della connessione, tutto si aggiorna automaticamente

## 🚀 Prossimi Passi (Opzionali)

Per migliorare ulteriormente:
1. Aggiungere icone di varie dimensioni (192x192, 512x512)
2. Implementare notifiche push
3. Aggiungere badge per nuove manutenzioni
4. Screenshot per lo store
5. Pubblicare su Google Play (con TWA - Trusted Web Activity)

## 📝 Note

- La PWA funziona HTTPS (o localhost per test)
- Gli aggiornamenti del service worker sono automatici
- La cache viene pulita quando si aggiorna la versione
