# Subscription Manager

A full-stack web application to track and manage your app subscriptions with user authentication and database storage. Keep track of your monthly and yearly expenses across different categories like productivity, entertainment, development tools, and more.

## Features

### Current Features
- **User Authentication**: Secure registration and login system
- **Database Storage**: SQLite database for persistent data storage
- **Add Subscriptions**: Track apps with pricing, billing cycles, and categories
- **Edit & Delete**: Modify or remove subscriptions as needed
- **Expense Tracking**: View total monthly and yearly costs
- **Categories**: Organize subscriptions by type (Productivity, Entertainment, Development, etc.)
- **User-Specific Data**: Each user has their own subscription data
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/adnan/subscription-manager.git
cd subscription-manager
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

## Usage

1. **Register/Login**: Create a new account or login with existing credentials
2. **Add a Subscription**: Click the "Add Subscription" button and fill in the details:
   - App name
   - Category (Productivity, Entertainment, Development, etc.)
   - Price
   - Billing cycle (Monthly/Yearly)
   - Next billing date
   - Optional notes
3. **View Statistics**: The dashboard shows your total monthly and yearly expenses
4. **Edit Subscriptions**: Click the "Edit" button on any subscription card
5. **Delete Subscriptions**: Click the "Delete" button to remove a subscription
6. **Logout**: Click the logout button to securely log out

## File Structure

```
subscription-manager/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # Frontend JavaScript
├── server.js           # Backend Express server
├── package.json        # Project dependencies
├── .gitignore          # Git ignore rules
├── .env.example        # Environment variables example
└── README.md           # This file
```

## Technologies Used

### Frontend
- HTML5
- CSS3 (with modern features like Grid and Flexbox)
- Vanilla JavaScript (ES6+)

### Backend
- Node.js
- Express.js
- SQLite (better-sqlite3)
- JWT (jsonwebtoken) for authentication
- bcryptjs for password hashing

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user

### Subscriptions (Requires Authentication)
- `GET /api/subscriptions` - Get all user subscriptions
- `POST /api/subscriptions` - Create a new subscription
- `PUT /api/subscriptions/:id` - Update a subscription
- `DELETE /api/subscriptions/:id` - Delete a subscription

## Security

- Passwords are hashed using bcrypt
- JWT tokens for secure authentication
- User data is isolated (users can only access their own subscriptions)
- SQL injection protection via parameterized queries

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License.
