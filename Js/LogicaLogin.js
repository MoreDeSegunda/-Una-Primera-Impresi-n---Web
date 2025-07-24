
const loginForm = document.getElementById('LoginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const messageElement = document.getElementById('message');
const welcomeMessageElement = document.getElementById('welcome-message');


const validUsername = 'user'; 
const validPassword = '123'; 


loginForm.addEventListener('submit', function(event) {

    
    event.preventDefault();

    
    const enteredUsername = usernameInput.value; 
    const enteredPassword = passwordInput.value;

   
    if (enteredUsername === validUsername && enteredPassword === validPassword) {
        messageElement.textContent = 'Inicio de sesión exitoso.';
        messageElement.style.color = 'green';

        loginForm.style.display = 'none';
        welcomeMessageElement.style.display = 'block';
        window.location.href = "../html/index.html";

    } else {
       
        messageElement.textContent = 'Usuario o contraseña incorrectos. Intenta de nuevo.';
        messageElement.style.color = 'red';
        welcomeMessageElement.style.display = 'none';
        passwordInput.value = '';
    }
});