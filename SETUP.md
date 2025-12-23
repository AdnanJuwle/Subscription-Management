# Quick Setup Guide

## Installation Steps

1. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file (optional):**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and change the `JWT_SECRET` to a secure random string.

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## First Time Setup

1. Click on the "Register" tab
2. Enter your email and password (minimum 6 characters)
3. Optionally add your name
4. Click "Register"
5. You'll be automatically logged in and can start adding subscriptions!

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, you can change it in the `.env` file:
```
PORT=3001
```

### Database Issues
The database file (`subscriptions.db`) will be created automatically on first run. If you need to reset it, simply delete the file and restart the server.

### CORS Issues
If you're accessing from a different origin, make sure CORS is properly configured in `server.js`.

## Development

To run in development mode with auto-reload, you can use `nodemon`:
```bash
npm install -g nodemon
nodemon server.js
```

