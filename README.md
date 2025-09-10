# Subscription Manager

A simple web application to track and manage your app subscriptions. Keep track of your monthly and yearly expenses across different categories like productivity, entertainment, development tools, and more.

## Features

- **Add Subscriptions**: Track apps with pricing, billing cycles, and categories
- **Edit & Delete**: Modify or remove subscriptions as needed
- **Expense Tracking**: View total monthly and yearly costs
- **Categories**: Organize subscriptions by type (Productivity, Entertainment, Development, etc.)
- **Local Storage**: Data persists in your browser
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- A modern web browser
- Python 3 (for local server) or any web server

### Installation

1. Clone the repository:
```bash
git clone https://github.com/adnan/subscription-manager.git
cd subscription-manager
```

2. Start a local server:
```bash
# Using Python
python3 -m http.server 8000

# Or using Node.js (if you have it installed)
npx serve .

# Or simply open index.html in your browser
```

3. Open your browser and navigate to `http://localhost:8000`

## Usage

1. **Add a Subscription**: Click the "Add Subscription" button and fill in the details:
   - App name
   - Category (Productivity, Entertainment, Development, etc.)
   - Price
   - Billing cycle (Monthly/Yearly)
   - Next billing date
   - Optional notes

2. **View Statistics**: The dashboard shows your total monthly and yearly expenses

3. **Edit Subscriptions**: Click the "Edit" button on any subscription card

4. **Delete Subscriptions**: Click the "Delete" button to remove a subscription

## File Structure

```
subscription-manager/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
├── package.json        # Project metadata
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## Technologies Used

- HTML5
- CSS3 (with modern features like Grid and Flexbox)
- Vanilla JavaScript (ES6+)
- Local Storage API

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License.