FROM node:18-alpine

WORKDIR /app

# Copia package.json
COPY package*.json ./

# Installa dipendenze
RUN npm ci --only=production

# Copia il resto del codice
COPY . .

# Esponi la porta 5126
EXPOSE 5126

# Crea directory per i dati persistenti
RUN mkdir -p /app/data

# Avvia l'applicazione
CMD ["node", "server.js"]
