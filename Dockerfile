FROM node:18-alpine

WORKDIR /app

# Copia package.json
COPY package*.json ./

# Installa dipendenze
RUN npm ci --only=production

# Copia il resto del codice
COPY . .

# Copia e rendi eseguibile lo script di entrypoint
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Esponi la porta 5126
EXPOSE 5126

# Crea directory per i dati persistenti
RUN mkdir -p /app/data /app/uploads

# Usa l'entrypoint script
ENTRYPOINT ["docker-entrypoint.sh"]

# Avvia l'applicazione
CMD ["node", "server.js"]
