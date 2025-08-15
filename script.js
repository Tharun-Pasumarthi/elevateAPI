const userContainer = document.getElementById('userContainer');
const reloadBtn = document.getElementById('reloadBtn');
const loading = document.getElementById('loading');
const addUserForm = document.getElementById('addUserForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const streetInput = document.getElementById('street');
const suiteInput = document.getElementById('suite');
const cityInput = document.getElementById('city');
const zipcodeInput = document.getElementById('zipcode');

let usersData = [];
let localUsers = [];

function displayUsers(users) {
    loading.style.display = 'none';
    userContainer.innerHTML = '';
    users.forEach(user => {
        const card = document.createElement('div');
        card.className = 'user-card';
        card.innerHTML = `
            <h2>${user.name}</h2>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Address:</strong> ${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}</p>
        `;
        userContainer.appendChild(card);
    });
}

function displayError(message) {
    loading.style.display = 'none';
    userContainer.innerHTML = `<div class="error">${message}</div>`;
}

function fetchUsers() {
    loading.style.display = 'block';
    userContainer.innerHTML = '';
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            usersData = data;
            // Load local users from localStorage
            const stored = localStorage.getItem('localUsers');
            localUsers = stored ? JSON.parse(stored) : [];
            displayUsers([...usersData, ...localUsers]);
        })
        .catch(error => {
            displayError('Failed to fetch users: ' + error.message);
        });
}

reloadBtn.addEventListener('click', fetchUsers);

addUserForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const newUser = {
        name: nameInput.value,
        email: emailInput.value,
        address: {
            street: streetInput.value,
            suite: suiteInput.value,
            city: cityInput.value,
            zipcode: zipcodeInput.value
        }
    };
    // Add to local users and persist
    localUsers.push(newUser);
    localStorage.setItem('localUsers', JSON.stringify(localUsers));
    displayUsers([...usersData, ...localUsers]);
    addUserForm.reset();
});

// Initial fetch
window.addEventListener('DOMContentLoaded', fetchUsers);
fetchUsers();
