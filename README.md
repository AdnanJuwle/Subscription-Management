# Subscription Manager

A full-stack web application to track and manage your app subscriptions with user authentication and database storage. Features a unique dark-themed UI with glassmorphism effects and supports both authenticated users and guest mode. Keep track of your monthly and yearly expenses across different categories like productivity, entertainment, development tools, and more.

## ✨ Features

### Current Features
- **User Authentication**: Secure registration and login system with JWT tokens
- **Guest Mode**: Use the app without registration - data stored locally in browser
- **Database Storage**: JSON file-based database for persistent data storage (no compilation needed)
- **Add Subscriptions**: Track apps with pricing, billing cycles, and categories
- **Edit & Delete**: Modify or remove subscriptions as needed
- **Expense Tracking**: View total monthly and yearly costs with real-time calculations
- **Categories**: Organize subscriptions by type (Productivity, Entertainment, Development, Design, Cloud Services, Security, Other)
- **User-Specific Data**: Each user has their own subscription data
- **Modern UI**: Unique dark theme with cyan/coral/amber accents, glassmorphism effects, and smooth animations
- **Responsive Design**: Works beautifully on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher) - [Download here](https://nodejs.org/)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AdnanJuwle/Subscription-Management.git
cd Subscription-Management
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env` file for custom configuration:
```bash
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

4. Start the server:
```bash
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## 📖 Usage

### Guest Mode (No Account Required)
1. Click **"Continue as Guest"** on the login screen
2. Start adding subscriptions immediately
3. All data is stored in your browser's local storage
4. Works completely offline - no server connection needed

### Registered User Mode
1. **Register**: Click "Register" tab and create a new account
2. **Login**: Use your email and password to login
3. **Add a Subscription**: Click the "Add Subscription" button and fill in the details:
   - App name
   - Category (Productivity, Entertainment, Development, etc.)
   - Price
   - Billing cycle (Monthly/Yearly)
   - Next billing date
   - Optional notes
4. **View Statistics**: The dashboard shows your total monthly and yearly expenses
5. **Edit Subscriptions**: Click the "Edit" button on any subscription card
6. **Delete Subscriptions**: Click the "Delete" button to remove a subscription
7. **Logout**: Click the logout button to securely log out

## 📁 File Structure

```
subscription-manager/
├── index.html              # Main HTML file
├── styles.css              # CSS styling with modern dark theme
├── script.js               # Frontend JavaScript
├── server.js               # Backend Express server
├── package.json            # Project dependencies
├── .gitignore              # Git ignore rules
├── database.json           # JSON database file (auto-created)
├── README.md               # This file
├── SETUP.md                # Detailed setup guide
├── FEATURE_SUGGESTIONS.md  # Ideas for future enhancements
└── INSTALL_NODEJS.md       # Node.js installation guide
```

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3 (with modern features like Grid, Flexbox, Glassmorphism)
- Vanilla JavaScript (ES6+)
- Local Storage API (for guest mode)

### Backend
- Node.js
- Express.js
- JSON file-based database (no native compilation needed)
- JWT (jsonwebtoken) for authentication
- bcryptjs for password hashing

## 🔌 API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user

### Subscriptions (Requires Authentication)
- `GET /api/subscriptions` - Get all user subscriptions
- `POST /api/subscriptions` - Create a new subscription
- `PUT /api/subscriptions/:id` - Update a subscription
- `DELETE /api/subscriptions/:id` - Delete a subscription

## 🔒 Security

- Passwords are hashed using bcrypt (10 rounds)
- JWT tokens for secure authentication (7-day expiration)
- User data is isolated (users can only access their own subscriptions)
- Guest mode data stays in browser (localStorage)
- CORS enabled for cross-origin requests

## 🎨 UI/UX Features

- **Dark Theme**: Unique color scheme with cyan (#00d4ff), coral (#ff6b6b), and amber (#ffd93d) accents
- **Glassmorphism**: Frosted glass effects with backdrop blur
- **Smooth Animations**: Cubic-bezier transitions and hover effects
- **Gradient Text**: Modern gradient text effects on headings
- **Responsive Cards**: Animated subscription cards with hover states
- **Modal Dialogs**: Smooth modal animations with backdrop blur

## 📚 Additional Documentation

- **[SETUP.md](SETUP.md)** - Detailed setup and troubleshooting guide
- **[FEATURE_SUGGESTIONS.md](FEATURE_SUGGESTIONS.md)** - 44+ ideas for future enhancements
- **[INSTALL_NODEJS.md](INSTALL_NODEJS.md)** - Node.js installation guide

## 🐛 Troubleshooting

### Server won't start
- Make sure Node.js is installed: `node --version`
- Check if port 3000 is available
- Try changing the port in `.env` file

### Guest mode not working
- Guest mode works completely offline - no server needed
- Check browser console for errors
- Make sure JavaScript is enabled

### Database issues
- The `database.json` file is created automatically
- If corrupted, delete `database.json` and restart the server
- All data will be reset

## 🤝 Contributing

Feel free to submit issues and enhancement requests! Check out [FEATURE_SUGGESTIONS.md](FEATURE_SUGGESTIONS.md) for ideas.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

Built with modern web technologies and a focus on user experience. Special thanks to the open-source community for the amazing tools and libraries.
