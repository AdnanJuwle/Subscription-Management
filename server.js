const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const DB_FILE = 'database.json';

// Simple JSON Database
class JSONDatabase {
    constructor() {
        this.data = { users: [], subscriptions: [] };
        this.load();
    }

    async load() {
        try {
            const fileData = await fs.readFile(DB_FILE, 'utf8');
            this.data = JSON.parse(fileData);
        } catch (error) {
            // File doesn't exist, start with empty data
            await this.save();
        }
    }

    async save() {
        await fs.writeFile(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    }

    // User methods
    async createUser(email, password, name) {
        const id = this.data.users.length > 0 
            ? Math.max(...this.data.users.map(u => u.id)) + 1 
            : 1;
        
        const user = {
            id,
            email,
            password,
            name: name || null,
            created_at: new Date().toISOString()
        };
        
        this.data.users.push(user);
        await this.save();
        return user;
    }

    async findUserByEmail(email) {
        return this.data.users.find(u => u.email === email);
    }

    async findUserById(id) {
        return this.data.users.find(u => u.id === id);
    }

    // Subscription methods
    async createSubscription(userId, appName, category, price, billingCycle, nextBilling, notes) {
        const id = this.data.subscriptions.length > 0
            ? Math.max(...this.data.subscriptions.map(s => s.id)) + 1
            : 1;
        
        const subscription = {
            id,
            user_id: userId,
            app_name: appName,
            category,
            price,
            billing_cycle: billingCycle,
            next_billing: nextBilling,
            notes: notes || null,
            created_at: new Date().toISOString()
        };
        
        this.data.subscriptions.push(subscription);
        await this.save();
        return subscription;
    }

    async getSubscriptionsByUserId(userId) {
        return this.data.subscriptions
            .filter(s => s.user_id === userId)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    async findSubscriptionById(id, userId) {
        return this.data.subscriptions.find(s => s.id === parseInt(id) && s.user_id === userId);
    }

    async updateSubscription(id, userId, updates) {
        const subscription = await this.findSubscriptionById(id, userId);
        if (!subscription) return null;
        
        Object.assign(subscription, updates);
        await this.save();
        return subscription;
    }

    async deleteSubscription(id, userId) {
        const index = this.data.subscriptions.findIndex(
            s => s.id === parseInt(id) && s.user_id === userId
        );
        if (index === -1) return false;
        
        this.data.subscriptions.splice(index, 1);
        await this.save();
        return true;
    }
}

// Initialize Database
const db = new JSONDatabase();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Auth Routes
app.post('/api/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Check if user exists
        const existingUser = await db.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await db.createUser(email, hashedPassword, name);

        // Generate token
        const token = jwt.sign(
            { id: user.id, email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user.id,
                email,
                name: name || null
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = await db.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Subscription Routes
app.get('/api/subscriptions', authenticateToken, async (req, res) => {
    try {
        const subscriptions = await db.getSubscriptionsByUserId(req.user.id);
        res.json(subscriptions);
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/subscriptions', authenticateToken, async (req, res) => {
    try {
        const { appName, category, price, billingCycle, nextBilling, notes } = req.body;

        if (!appName || !category || !price || !billingCycle || !nextBilling) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const subscription = await db.createSubscription(
            req.user.id,
            appName,
            category,
            price,
            billingCycle,
            nextBilling,
            notes
        );

        res.status(201).json(subscription);
    } catch (error) {
        console.error('Error creating subscription:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/subscriptions/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { appName, category, price, billingCycle, nextBilling, notes } = req.body;

        // Verify ownership and update
        const subscription = await db.updateSubscription(id, req.user.id, {
            app_name: appName,
            category,
            price,
            billing_cycle: billingCycle,
            next_billing: nextBilling,
            notes: notes || null
        });

        if (!subscription) {
            return res.status(404).json({ error: 'Subscription not found' });
        }

        res.json(subscription);
    } catch (error) {
        console.error('Error updating subscription:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/subscriptions/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await db.deleteSubscription(id, req.user.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Subscription not found' });
        }

        res.json({ message: 'Subscription deleted successfully' });
    } catch (error) {
        console.error('Error deleting subscription:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Database file: ${DB_FILE}`);
});
