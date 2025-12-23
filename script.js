const API_BASE_URL = 'http://localhost:3000/api';

class AuthManager {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
        this.isGuest = localStorage.getItem('guestMode') === 'true';
    }

    setAuth(token, user) {
        this.token = token;
        this.user = user;
        this.isGuest = false;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.removeItem('guestMode');
    }

    setGuestMode() {
        this.token = null;
        this.user = { name: 'Guest', email: 'guest@local', isGuest: true };
        this.isGuest = true;
        localStorage.setItem('guestMode', 'true');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    clearAuth() {
        this.token = null;
        this.user = null;
        this.isGuest = false;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('guestMode');
    }

    isAuthenticated() {
        return !!this.token || this.isGuest;
    }

    getAuthHeaders() {
        if (this.isGuest) {
            return { 'Content-Type': 'application/json' };
        }
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }
}

class SubscriptionManager {
    constructor(authManager) {
        this.authManager = authManager;
        this.subscriptions = [];
        this.editingId = null;
        this.init();
    }

    init() {
        if (!this.authManager.isAuthenticated()) {
            this.showAuthScreen();
            return;
        }
        this.showAppScreen();
        this.bindEvents();
        this.loadSubscriptions();
    }

    showAuthScreen() {
        document.getElementById('authScreen').style.display = 'flex';
        document.getElementById('appScreen').style.display = 'none';
        this.bindAuthEvents();
    }

    showAppScreen() {
        document.getElementById('authScreen').style.display = 'none';
        document.getElementById('appScreen').style.display = 'block';
        const userBadge = document.getElementById('userBadge');
        const userName = document.getElementById('userName');
        
        if (this.authManager.isGuest) {
            userName.textContent = 'Guest User';
            userBadge.classList.add('guest-badge');
        } else if (this.authManager.user) {
            userName.textContent = this.authManager.user.name || this.authManager.user.email;
            userBadge.classList.remove('guest-badge');
        }
    }

    bindAuthEvents() {
        // Tab switching
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
                e.target.classList.add('active');
                document.getElementById(`${tabName}Form`).classList.add('active');
                document.getElementById(`${tabName}Error`).textContent = '';
            });
        });

        // Login form
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin(e.target);
        });

        // Register form
        document.getElementById('registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleRegister(e.target);
        });

        // Guest login button
        const guestBtn = document.getElementById('guestLoginBtn');
        if (guestBtn) {
            guestBtn.addEventListener('click', () => {
                this.authManager.setGuestMode();
                this.showAppScreen();
                this.bindEvents();
                this.loadSubscriptions();
            });
        }
    }

    async handleLogin(form) {
        const errorDiv = document.getElementById('loginError');
        errorDiv.textContent = '';
        
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                errorDiv.textContent = data.error || 'Login failed';
                return;
            }

            this.authManager.setAuth(data.token, data.user);
            this.showAppScreen();
            this.bindEvents();
            this.loadSubscriptions();
        } catch (error) {
            errorDiv.textContent = 'Network error. Try guest mode or check if server is running.';
            console.error('Login error:', error);
        }
    }

    async handleRegister(form) {
        const errorDiv = document.getElementById('registerError');
        errorDiv.textContent = '';
        
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        if (password !== confirmPassword) {
            errorDiv.textContent = 'Passwords do not match';
            return;
        }

        if (password.length < 6) {
            errorDiv.textContent = 'Password must be at least 6 characters';
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name })
            });

            const data = await response.json();

            if (!response.ok) {
                errorDiv.textContent = data.error || 'Registration failed';
                return;
            }

            this.authManager.setAuth(data.token, data.user);
            this.showAppScreen();
            this.bindEvents();
            this.loadSubscriptions();
        } catch (error) {
            errorDiv.textContent = 'Network error. Try guest mode or check if server is running.';
            console.error('Registration error:', error);
        }
    }

    logout() {
        this.authManager.clearAuth();
        this.showAuthScreen();
        this.subscriptions = [];
    }

    bindEvents() {
        document.getElementById('addBtn').addEventListener('click', () => this.openModal());
        document.getElementById('subscriptionForm').addEventListener('submit', (e) => this.handleSubmit(e));
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });
    }

    async loadSubscriptions() {
        if (this.authManager.isGuest) {
            // Load from localStorage for guest mode
            this.subscriptions = this.loadSubscriptionsFromLocal();
            this.renderSubscriptions();
            this.updateStats();
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/subscriptions`, {
                headers: this.authManager.getAuthHeaders()
            });

            if (response.status === 401) {
                this.logout();
                return;
            }

            const data = await response.json();
            this.subscriptions = data;
            this.renderSubscriptions();
            this.updateStats();
        } catch (error) {
            console.error('Error loading subscriptions:', error);
            // Fallback to guest mode if server is unavailable
            if (!this.authManager.isGuest) {
                if (confirm('Server unavailable. Switch to guest mode (local storage)?')) {
                    this.authManager.setGuestMode();
                    this.showAppScreen();
                    this.loadSubscriptions();
                }
            } else {
                alert('Failed to load subscriptions. Please refresh the page.');
            }
        }
    }

    loadSubscriptionsFromLocal() {
        const saved = localStorage.getItem('guest_subscriptions');
        return saved ? JSON.parse(saved) : [];
    }

    saveSubscriptionsToLocal() {
        localStorage.setItem('guest_subscriptions', JSON.stringify(this.subscriptions));
    }

    openModal(subscription = null) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('subscriptionForm');
        
        if (subscription) {
            modalTitle.textContent = 'Edit Subscription';
            this.editingId = subscription.id;
            this.populateForm(subscription);
        } else {
            modalTitle.textContent = 'Add Subscription';
            this.editingId = null;
            form.reset();
        }
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        document.getElementById('modal').style.display = 'none';
        document.body.style.overflow = 'auto';
        this.editingId = null;
        document.getElementById('subscriptionForm').reset();
    }

    populateForm(subscription) {
        // Handle both API format (app_name) and local format (appName)
        const appName = subscription.app_name || subscription.appName;
        const billingCycle = subscription.billing_cycle || subscription.billingCycle;
        const nextBilling = subscription.next_billing || subscription.nextBilling;
        
        document.getElementById('appName').value = appName;
        document.getElementById('category').value = subscription.category;
        document.getElementById('price').value = subscription.price;
        document.getElementById('billingCycle').value = billingCycle;
        document.getElementById('nextBilling').value = nextBilling;
        document.getElementById('notes').value = subscription.notes || '';
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const subscription = {
            appName: formData.get('appName'),
            category: formData.get('category'),
            price: parseFloat(formData.get('price')),
            billingCycle: formData.get('billingCycle'),
            nextBilling: formData.get('nextBilling'),
            notes: formData.get('notes')
        };

        try {
            if (this.editingId) {
                await this.updateSubscription(this.editingId, subscription);
            } else {
                await this.addSubscription(subscription);
            }
            this.closeModal();
        } catch (error) {
            console.error('Error saving subscription:', error);
            alert('Failed to save subscription. Please try again.');
        }
    }

    async addSubscription(subscription) {
        if (this.authManager.isGuest) {
            // Add to local storage for guest mode
            subscription.id = Date.now().toString();
            subscription.createdAt = new Date().toISOString();
            this.subscriptions.push(subscription);
            this.saveSubscriptionsToLocal();
            this.renderSubscriptions();
            this.updateStats();
            return;
        }

        const response = await fetch(`${API_BASE_URL}/subscriptions`, {
            method: 'POST',
            headers: this.authManager.getAuthHeaders(),
            body: JSON.stringify(subscription)
        });

        if (response.status === 401) {
            this.logout();
            return;
        }

        if (!response.ok) {
            throw new Error('Failed to add subscription');
        }

        await this.loadSubscriptions();
    }

    async updateSubscription(id, subscription) {
        if (this.authManager.isGuest) {
            // Update in local storage for guest mode
            const index = this.subscriptions.findIndex(sub => sub.id.toString() === id.toString());
            if (index !== -1) {
                this.subscriptions[index] = { ...this.subscriptions[index], ...subscription };
                this.saveSubscriptionsToLocal();
                this.renderSubscriptions();
                this.updateStats();
            }
            return;
        }

        const response = await fetch(`${API_BASE_URL}/subscriptions/${id}`, {
            method: 'PUT',
            headers: this.authManager.getAuthHeaders(),
            body: JSON.stringify(subscription)
        });

        if (response.status === 401) {
            this.logout();
            return;
        }

        if (!response.ok) {
            throw new Error('Failed to update subscription');
        }

        await this.loadSubscriptions();
    }

    async deleteSubscription(id) {
        if (!confirm('Are you sure you want to delete this subscription?')) {
            return;
        }

        if (this.authManager.isGuest) {
            // Delete from local storage for guest mode
            this.subscriptions = this.subscriptions.filter(sub => sub.id.toString() !== id.toString());
            this.saveSubscriptionsToLocal();
            this.renderSubscriptions();
            this.updateStats();
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/subscriptions/${id}`, {
                method: 'DELETE',
                headers: this.authManager.getAuthHeaders()
            });

            if (response.status === 401) {
                this.logout();
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to delete subscription');
            }

            await this.loadSubscriptions();
        } catch (error) {
            console.error('Error deleting subscription:', error);
            alert('Failed to delete subscription. Please try again.');
        }
    }

    renderSubscriptions() {
        const container = document.getElementById('subscriptionsList');
        
        if (this.subscriptions.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No subscriptions yet. Add your first subscription!</p></div>';
            return;
        }

        container.innerHTML = this.subscriptions.map(subscription => this.createSubscriptionCard(subscription)).join('');
        
        this.bindCardEvents();
    }

    createSubscriptionCard(subscription) {
        // Handle both API format and local format
        const appName = subscription.app_name || subscription.appName;
        const billingCycle = subscription.billing_cycle || subscription.billingCycle;
        const nextBilling = subscription.next_billing || subscription.nextBilling;
        
        const nextBillingDate = new Date(nextBilling);
        const daysUntilBilling = Math.ceil((nextBillingDate - new Date()) / (1000 * 60 * 60 * 24));
        
        return `
            <div class="subscription-card" data-id="${subscription.id}">
                <div class="subscription-header">
                    <div class="subscription-info">
                        <h3>${appName}</h3>
                        <span class="category-badge category-${subscription.category}">${subscription.category}</span>
                    </div>
                    <div class="subscription-actions">
                        <button class="btn btn-secondary btn-small edit-btn">Edit</button>
                        <button class="btn btn-danger btn-small delete-btn">Delete</button>
                    </div>
                </div>
                <div class="subscription-details">
                    <div class="detail-item">
                        <span class="detail-label">Price</span>
                        <span class="detail-value price">$${subscription.price.toFixed(2)}</span>
                        <span class="billing-cycle">${billingCycle}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Next Billing</span>
                        <span class="detail-value">${this.formatDate(nextBilling)}</span>
                        <span class="billing-cycle">${daysUntilBilling} days</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Yearly Cost</span>
                        <span class="detail-value price">$${this.calculateYearlyCost(subscription).toFixed(2)}</span>
                    </div>
                </div>
                ${subscription.notes ? `<div class="notes"><strong>Notes:</strong> ${subscription.notes}</div>` : ''}
            </div>
        `;
    }

    bindCardEvents() {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.subscription-card');
                const id = card.dataset.id;
                const subscription = this.subscriptions.find(sub => sub.id.toString() === id.toString());
                this.openModal(subscription);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.subscription-card');
                const id = card.dataset.id;
                this.deleteSubscription(id);
            });
        });
    }

    calculateYearlyCost(subscription) {
        const billingCycle = subscription.billing_cycle || subscription.billingCycle;
        if (billingCycle === 'yearly') {
            return subscription.price;
        } else {
            return subscription.price * 12;
        }
    }

    updateStats() {
        const totalMonthly = this.subscriptions.reduce((sum, sub) => {
            const billingCycle = sub.billing_cycle || sub.billingCycle;
            return sum + (billingCycle === 'monthly' ? sub.price : sub.price / 12);
        }, 0);

        const totalYearly = this.subscriptions.reduce((sum, sub) => {
            return sum + this.calculateYearlyCost(sub);
        }, 0);

        document.getElementById('totalMonthly').textContent = `$${totalMonthly.toFixed(2)}`;
        document.getElementById('totalYearly').textContent = `$${totalYearly.toFixed(2)}`;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    const authManager = new AuthManager();
    new SubscriptionManager(authManager);
});
