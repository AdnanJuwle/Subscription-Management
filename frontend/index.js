document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('.containerFront form');
    const registerForm = document.querySelector('.containerBack form');

    // Handle login
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // Prevent form submission

        const username = document.querySelector('.containerFront .input').value;
        const password = document.querySelector('.containerFront .input1').value;

        if (username && password) {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Login successful:', data);
                    window.location.href = 'dashboard.html'; // Redirect to dashboard
                } else {
                    alert('Login failed. Please check your credentials.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while logging in.');
            }
        } else {
            alert('Please enter both username and password.');
        }
    });

    // Handle registration
    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // Prevent form submission

        const username = document.querySelector('.containerBack input[type="text"]').value;
        const password = document.querySelector('.containerBack input[type="password"]').value;

        if (username && password) {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Registration successful:', data);
                    window.location.href = 'dashboard.html'; // Redirect to dashboard
                } else {
                    alert('Registration failed. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while registering.');
            }
        } else {
            alert('Please fill in all fields.');
        }
    });
});
