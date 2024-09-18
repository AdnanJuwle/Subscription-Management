document.addEventListener('DOMContentLoaded', function() {
    const username = "testuser"; // Replace with actual username from login or session

    async function fetchSubscription() {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/subscription?username=${username}`);
            if (response.ok) {
                const subscription = await response.json();
                document.getElementById('plan').innerText = subscription.plan;
                document.getElementById('start-date').innerText = subscription.start_date;
                document.getElementById('billing-date').innerText = subscription.next_billing_date; // Fixed to next_billing_date
                document.getElementById('price').innerText = subscription.price;
                document.getElementById('status').innerText = subscription.status;
                document.getElementById('current-plan').value = subscription.plan;
            } else {
                alert('No active subscription found.');
            }
        } catch (error) {
            console.error('Error fetching subscription:', error);
        }
    }

    fetchSubscription();
});
