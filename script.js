document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const characterContainer = document.getElementById('characterContainer');
    const errorMsg = document.getElementById('error-msg');
    const logoutButton = document.getElementById('logout');
    const showMoreButton = document.getElementById('showMore');

    let loginAttempts = 0;
    let characterId = 1; // Initialize with the first character's ID

    // Check if the user is already logged in
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (storedUser && isLoggedIn === 'true') {
        logoutButton.style.display = 'block';
        fetchCharacter();
    }

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const firstname = document.getElementById('firstname').value;
        const lastname = document.getElementById('lastname').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const user = {
            firstname,
            lastname,
            username,
            email,
            password
        };

        localStorage.setItem('user', JSON.stringify(user));

        document.getElementById('register').style.display = 'none';
        welcomeMessage.innerHTML = `Dear ${firstname} ${lastname}, your registration is successfully done!`;
        document.getElementById('welcome').style.display = 'block';
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const loginUsername = document.getElementById('loginUsername').value;
        const loginPassword = document.getElementById('loginPassword').value;

        const storedUser = JSON.parse(localStorage.getItem('user'));

        if (storedUser && storedUser.username === loginUsername && storedUser.password === loginPassword) {
            loginAttempts = 0;
            localStorage.setItem('isLoggedIn', 'true'); // Store login state
            logoutButton.style.display = 'block';
            fetchCharacter();
        } else {
            loginAttempts++;
            if (loginAttempts >= 3) {
                errorMsg.style.display = 'block';
            } else {
                document.getElementById('loginPassword').classList.add('is-invalid');
            }
        }
    });

    function fetchCharacter() {
        document.getElementById('login').style.display = 'none';
        document.getElementById('characterContainer').style.display = 'grid';
        document.getElementById('showMore').style.display = 'block';

        fetch(`https://rickandmortyapi.com/api/character/${characterId}`)
            .then(response => response.json())
            .then(data => {
                const characterCard = document.createElement('div');
                characterCard.classList.add('character-card');
                characterCard.innerHTML = `
                    <img src="${data.image}" alt="${data.name}">
                    <h5>${data.name}</h5>
                    <p>Species: ${data.species}</p>
                    <p>Status: ${data.status}</p>
                `;
                characterContainer.appendChild(characterCard);
                characterId++; // Increment character ID for the next fetch
            })
            .catch(error => console.error('Error:', error));
    }

    showMoreButton.addEventListener('click', function() {
        fetchCharacter(); // Fetch the next character
    });

    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('isLoggedIn'); // Remove login state
        logoutButton.style.display = 'none';
        characterContainer.style.display = 'none';
        document.getElementById('showMore').style.display = 'none';
        document.getElementById('login').style.display = 'block';
        characterContainer.innerHTML = ''; // Clear the characters on logout
        characterId = 1; // Reset character ID counter
    });

    window.showLoginForm = function() {
        document.getElementById('welcome').style.display = 'none';
        document.getElementById('login').style.display = 'block';
    };
});
