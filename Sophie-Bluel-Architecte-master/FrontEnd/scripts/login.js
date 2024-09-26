const loginForm = document.querySelector('#login');
const loginEmail = document.querySelector('#email');
const loginPassword = document.querySelector('#password');
const errorElement = document.querySelector('.error');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const user = {
        email: loginEmail.value,
        password: loginPassword.value
    }

    const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    const data = await response.json();

    console.log(response)
    
    if (response.status === 401 || response.status === 404) {
        errorElement.textContent = 'Invalid email or password';
        errorElement.style.display = 'flex';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 3000)
        return
    }

    if (response.status === 200) {
       sessionStorage.setItem('token', data.token);
       location.href = '/';
    }
})