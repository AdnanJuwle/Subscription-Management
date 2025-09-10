class SubscriptionManager {
    constructor() {
        this.subscriptions = this.loadSubscriptions();
        this.editingId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderSubscriptions();
        this.updateStats();
    }

    bindEvents() {
        document.getElementById('addBtn').addEventListener('click', () => this.openModal());
        document.getElementById('subscriptionForm').addEventListener('submit', (e) => this.handleSubmit(e));
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });
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
        document.getElementById('appName').value = subscription.appName;
        document.getElementById('category').value = subscription.category;
        document.getElementById('price').value = subscription.price;
        document.getElementById('billingCycle').value = subscription.billingCycle;
        document.getElementById('nextBilling').value = subscription.nextBilling;
        document.getElementById('notes').value = subscription.notes || '';
    }

    handleSubmit(e) {
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

        if (this.editingId) {
            subscription.id = this.editingId;
            this.updateSubscription(subscription);
        } else {
            subscription.id = Date.now().toString();
            subscription.createdAt = new Date().toISOString();
            this.addSubscription(subscription);
        }

        this.closeModal();
    }

    addSubscription(subscription) {
        this.subscriptions.push(subscription);
        this.saveSubscriptions();
        this.renderSubscriptions();
        this.updateStats();
    }

    updateSubscription(subscription) {
        const index = this.subscriptions.findIndex(sub => sub.id === subscription.id);
        if (index !== -1) {
            this.subscriptions[index] = subscription;
            this.saveSubscriptions();
            this.renderSubscriptions();
            this.updateStats();
        }
    }

    deleteSubscription(id) {
        if (confirm('Are you sure you want to delete this subscription?')) {
            this.subscriptions = this.subscriptions.filter(sub => sub.id !== id);
            this.saveSubscriptions();
            this.renderSubscriptions();
            this.updateStats();
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
        const nextBillingDate = new Date(subscription.nextBilling);
        const daysUntilBilling = Math.ceil((nextBillingDate - new Date()) / (1000 * 60 * 60 * 24));
        
        return `
            <div class="subscription-card" data-id="${subscription.id}">
                <div class="subscription-header">
                    <div class="subscription-info">
                        <h3>${subscription.appName}</h3>
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
                        <span class="billing-cycle">${subscription.billingCycle}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Next Billing</span>
                        <span class="detail-value">${this.formatDate(subscription.nextBilling)}</span>
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
                const subscription = this.subscriptions.find(sub => sub.id === id);
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
        if (subscription.billingCycle === 'yearly') {
            return subscription.price;
        } else {
            return subscription.price * 12;
        }
    }

    updateStats() {
        const totalMonthly = this.subscriptions.reduce((sum, sub) => {
            return sum + (sub.billingCycle === 'monthly' ? sub.price : sub.price / 12);
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

    saveSubscriptions() {
        localStorage.setItem('subscriptions', JSON.stringify(this.subscriptions));
    }

    loadSubscriptions() {
        const saved = localStorage.getItem('subscriptions');
        return saved ? JSON.parse(saved) : [];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SubscriptionManager();
});
