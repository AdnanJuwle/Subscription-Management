# Installing Node.js - Quick Guide

## Step 1: Download and Install Node.js

1. **Visit the official Node.js website:**
   - Go to: https://nodejs.org/
   - Download the **LTS (Long Term Support)** version for Windows
   - This will download an `.msi` installer file

2. **Run the Installer:**
   - Double-click the downloaded `.msi` file
   - Follow the installation wizard
   - **Important:** Make sure to check "Add to PATH" during installation
   - Click "Install" and wait for installation to complete

3. **Verify Installation:**
   - Close and reopen your terminal/command prompt
   - Run: `node --version`
   - Run: `npm --version`
   - Both commands should show version numbers

## Step 2: Install Project Dependencies

After Node.js is installed, navigate to this project folder and run:

```bash
npm install
```

This will install all required packages (Express, SQLite, JWT, etc.)

## Step 3: Start the Server

```bash
npm start
```

Or:

```bash
node server.js
```

The server will start on `http://localhost:3000`

## Alternative: Using nvm (Node Version Manager)

If you prefer managing multiple Node.js versions:

1. Install nvm-windows from: https://github.com/coreybutler/nvm-windows/releases
2. Install Node.js: `nvm install lts`
3. Use it: `nvm use lts`

## Troubleshooting

### "node is not recognized"
- Restart your terminal/command prompt after installation
- Restart your computer if the issue persists
- Verify Node.js is in PATH: Check `C:\Program Files\nodejs\` exists

### Port Already in Use
- Change the port in `.env` file: `PORT=3001`
- Or stop the application using port 3000

### Permission Errors
- Run terminal as Administrator
- Check firewall settings

