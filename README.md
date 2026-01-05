# QRepair - Maintenance Management System with QR Code

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

## 📋 Description

**QRepair** is a complete system for managing device maintenance through QR Codes. Ideal for technical assistance companies, maintenance providers, and service providers who want to digitize and simplify maintenance intervention tracking.

### ✨ Key Features

- 🔐 **Authentication System** - Secure login with user and session management
- 📱 **QR Code Generation** - Create unique QR codes for each device
- 📊 **Complete Dashboard** - View, search, and manage all maintenances
- 🌍 **Multilingual** - Support for Italian, English, and German
- 📅 **Due Date Management** - Automatic expiration date monitoring
- 💬 **WhatsApp Integration** - Direct messaging to customers
- 📥 **Export/Import** - Export to CSV and JSON
- 👥 **User Management** - Complete access administration
- 🔄 **Persistent Database** - Automatic saving on SQLite

---

## 🚀 Installation

### Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (included with Node.js)
- Modern browser (Chrome, Firefox, Edge, Safari)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gheben/QRepair.git
   cd QRepair
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open your browser**
   ```
   http://localhost:3000/login
   ```

---

## 🔑 First Access

On first startup, the system automatically creates an administrator user:

- **Username**: `admin`
- **Password**: `admin`

> ⚠️ **IMPORTANT**: Change the password immediately after first login!

---

## 📖 User Guide

### 📸 Interface Overview

#### Main Dashboard
![Main Dashboard](screenshot/Dashboard%20Principale.png)
*Main view with statistics, search, and maintenance management*

#### QR Code Generation
![QR Generation](screenshot/Generazione%20QR.png)
*Form for creating new QR codes for devices*

#### Customer Dashboard
![Customer Dashboard](screenshot/Dashboard%20Clienti.png)
*Complete customer management with address book and maintenance history*

#### Customer QR View
![Customer QR](screenshot/QR%20Cliente.png)
*Public page displayed to customers when scanning the QR code*

#### User Management
![User Management](screenshot/Gestione%20Utenti.png)
*System user administration*

#### Provider Settings
![Provider Settings](screenshot/Impostazioni%20Fornitore.png)
*Configuration of company data, logo, and contacts*

---

### 1. Login

1. Open `http://localhost:3000/login`
2. Enter your credentials
3. Click "Login"

### 2. Initial Setup (Settings)

Before creating QR codes, configure your company data:

1. Go to `http://localhost:3000/settings`
2. Enter:
   - **Company Name** (e.g., "GB Service")
   - **Phone Number** (e.g., "+39 333 1234567")
   - **Company Logo** (optional, max 5MB, PNG format recommended for transparency)
3. Click "💾 Save Settings"

### 3. QR Code Creation

1. Go to `http://localhost:3000` (creation page)
2. Fill in the form:
   - **Customer Name** *(required)*
   - **Customer Phone** *(required)*
   - **Device Model** (e.g., "iPhone 13")
   - **Serial Number (S/N)** (e.g., "ABC123456")
   - **Maintenance Date** *(required)*
   - **Due Date** (for warranty/next service)
   - **Language** (IT/EN/DE)
3. Click "🎨 Generate QR Code"
4. The QR code is generated and automatically saved
5. Download the QR code as PNG

### 4. Dashboard - Maintenance Management

Access the dashboard at `http://localhost:3000/dashboard`:

#### Features:
- **📊 Statistics**: Total records, monthly maintenances, unique customers
- **🔍 Search**: Search by name, phone, model, or serial number
- **👁️ View QR**: Display and print the QR code for each record
- **✏️ Edit**: Update maintenance data
- **🔄 Update Maintenance**: Record new maintenances for the same device
- **🗑️ Delete**: Remove individual records
- **📥 Export CSV/JSON**: Export all data
- **📤 Import**: Import data from JSON file
- **🗑️ Delete All**: Remove all records (requires confirmation)

### 5. Info Page (Public)

When a customer scans the QR code, they automatically access `http://localhost:3000/info?id=XXX`:

**Information Displayed:**
- 🏢 Company Name and Logo
- 📞 Company Phone
- 👤 Customer Name
- 📱 Customer Phone (with direct call button)
- 🔧 Device Model
- 🔢 Serial Number
- 📅 Last Maintenance Date
- ⏰ Due Date (with color indicator)
- 💬 "Send WhatsApp Message" button

**Due Date Indicators:**
- 🟢 Green: Future due date
- 🔴 Red: Past due date
- ⚪ Gray: No due date set

### 6. User Management

Access `http://localhost:3000/users` from the Dashboard:

#### Available Operations:
- **➕ Create New User**: Username, Password, Full name
- **✏️ Edit User**: Update data (leave password blank to keep it unchanged)
- **🗑️ Delete User**: Remove user (minimum 1 user required)

> 💡 **Note**: You cannot delete the last user in the system

### 7. Logout

Click "🚪 Logout" in the Dashboard to safely exit.

---

## 🗂️ Project Structure

```
QRepair/
├── server.js              # Main Express server
├── database.js            # SQLite database management
├── db.js                  # Database wrapper (legacy)
├── api-client.js          # API client for frontend
├── package.json           # Node.js dependencies
├── settings.json          # Company settings (auto-generated)
├── manutenzioni.db        # SQLite database (auto-generated)
│
├── login.html             # Login page
├── index.html             # QR Code generation
├── dashboard.html         # Management dashboard
├── info.html              # Public QR Code page
├── settings.html          # Company configuration
├── users.html             # User management
│
└── style.css              # Global styles
```

---

## 🔧 Tecnologie Utilizzate

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **sql.js** - In-memory SQLite database
- **bcrypt** - Password hashing
- **express-session** - Session management
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **HTML5** - Structure
- **CSS3** - Styles and animations
- **Vanilla JavaScript** - Application logic
- **QRCode.js** - QR Code generation
- **Flag Icons** - Flags for language selection

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - Verify authentication

### Maintenances (Protected)
- `GET /api/manutenzioni` - List all maintenances
- `GET /api/manutenzioni/:id` - Maintenance details (public)
- `POST /api/manutenzioni` - Create new maintenance
- `PUT /api/manutenzioni/:id` - Update maintenance
- `PUT /api/manutenzioni/:id/data` - Update only date/due date
- `DELETE /api/manutenzioni/:id` - Delete maintenance
- `DELETE /api/manutenzioni` - Delete all maintenances

### Search and Statistics (Protected)
- `GET /api/search/:query` - Search maintenances
- `GET /api/stats` - Dashboard statistics
- `GET /api/count` - Count records

### Export/Import (Protected)
- `GET /api/export` - Export all data
- `POST /api/import` - Import data from JSON

### Settings
- `GET /api/settings` - Get settings (public)
- `POST /api/settings` - Save settings (protected)

### User Management (Protected)
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

---

## 🔒 Security

- ✅ **Password Hash**: Bcrypt with salt rounds = 10
- ✅ **HTTP-Only Sessions**: XSS-protected cookies
- ✅ **Input Validation**: Server-side data validation
- ✅ **SQL Injection Protection**: Prepared statements
- ✅ **CORS**: Configured for secure requests
- ✅ **Required Authentication**: All critical operations protected
- ✅ **Last User Protection**: Cannot be deleted

---

## 🌐 Production Deployment

### Server Configuration

1. **Change port** (optional) in `server.js`:
   ```javascript
   const PORT = process.env.PORT || 3000;
   ```

2. **Change session secret** in `server.js`:
   ```javascript
   secret: process.env.SESSION_SECRET || 'YOUR_SECURE_SECRET_KEY'
   ```

3. **Configure HTTPS** (recommended for production)

4. **Use reverse proxy** (NGINX, Apache) to expose the server

### NGINX Example
```nginx
server {
    listen 80;
    server_name yourdomain.com;

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

### Auto-Start (systemd)

Create `/etc/systemd/system/qrepair.service`:

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

Enable and start:
```bash
sudo systemctl enable qrepair
sudo systemctl start qrepair
```

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port 3000 is free
netstat -ano | findstr :3000

# Terminate process on port 3000 (Windows)
taskkill /F /PID <PID>

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Corrupted database
```bash
# Delete the database (WARNING: you'll lose all data!)
rm manutenzioni.db

# Restart the server (recreates empty database)
npm start
```

### Login errors
- Verify credentials are correct
- Check browser cookies (delete localhost:3000 cookies)
- Verify express-session is installed: `npm list express-session`

### QR Code won't generate
- Check JavaScript console in browser (F12)
- Verify QRCode.js loads correctly
- Check server connection

---

## 🔄 Backup and Restore

### Manual Backup
```bash
# Export all data from Dashboard (📥 Export JSON)
# Or copy files:
cp manutenzioni.db manutenzioni.db.backup
cp settings.json settings.json.backup
```

### Restore
```bash
# Restore backup files
cp manutenzioni.db.backup manutenzioni.db
cp settings.json.backup settings.json
```

### Automatic Backup (Linux/Mac - cron)
```bash
# Add to crontab (crontab -e)
0 2 * * * cp /path/to/QRepair/manutenzioni.db /backup/manutenzioni_$(date +\%Y\%m\%d).db
```

---

## 📝 Changelog

### v1.0.0 (January 2026)
- ✅ Complete authentication system
- ✅ User management
- ✅ QR Code generation
- ✅ Dashboard with statistics
- ✅ Multilingual support (IT/EN/DE)
- ✅ WhatsApp integration
- ✅ CSV and JSON export/import
- ✅ Serial Number (S/N) field
- ✅ Clean URLs without .html extension
- ✅ Persistent SQLite database
- ✅ Due date management with color indicators
- ✅ Responsive design

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is released under the **MIT License**.

---

## 👨‍💻 Author

**Guido Ballarini**

- 💼 LinkedIn: <a href="https://www.linkedin.com/in/guido-ballarini/" target="_blank">Guido Ballarini</a>
- ☕ Buy Me a Coffee: [guidoballau](https://buymeacoffee.com/guidoballau)

---

## 💖 Support the Project

If you find this project useful, consider buying me a coffee! ☕

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support%20-yellow.svg?logo=buy-me-a-coffee&logoColor=white)](https://buymeacoffee.com/guidoballau)
[![PayPal](https://img.shields.io/badge/PayPal-Donate-blue.svg?logo=paypal)](https://www.paypal.com/donate/?hosted_button_id=8RF28JBPLYASN)

---

<div align="center">

**⭐ If you like the project, leave a star on GitHub! ⭐**

Made with ❤️ by Guido Ballarini - © 2026

</div>
