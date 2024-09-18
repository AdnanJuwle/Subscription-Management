document.addEventListener('DOMContentLoaded', function() {
    function openSubscriptionForm() {
        document.getElementById('subscription-form').style.display = 'block';
    }

    function closeSubscriptionForm() {
        document.getElementById('subscription-form').style.display = 'none';
    }

    window.openSubscriptionForm = openSubscriptionForm;
    window.closeSubscriptionForm = closeSubscriptionForm;

    // Handle form submission for subscribing to a plan
    const subscriptionForm = document.querySelector('#subscription-form form');
    subscriptionForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const planType = document.getElementById('type').value;
        const plan = document.getElementById('plan').value;

        // Create subscription data
        const subscriptionData = {
            username: name, // assuming username = name for this case
            plan: plan,
            start_date: new Date().toLocaleDateString(),
            next_billing_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString(),
            price: plan === 'Basic' ? 19.99 : plan === 'Standard' ? 29.99 : 49.99,
            status: 'Active'
        };

        try {
            const response = await fetch('http://127.0.0.1:5000/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(subscriptionData),
            });

            if (response.ok) {
                alert('Subscription successful!');
                window.location.href = 'mysubscription.html';  // Redirect to subscription page
            } else {
                alert('Subscription failed.');
            }
        } catch (error) {
            console.error('Error subscribing:', error);
        }
    });
});
