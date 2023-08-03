// index.js

// JavaScript code for handling form submissions and interactions
document.addEventListener('DOMContentLoaded', () => {
  const url = 'http://localhost:3010';

  // User Registration
  const registerBtn = document.getElementById('registerBtn');
  const registrationMessage = document.getElementById('registrationMessage');
  registerBtn.addEventListener('click', async () => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch(`${url}/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      registrationMessage.textContent = data.message;
    } catch (error) {
      console.error('Error during registration:', error);
      registrationMessage.textContent = 'Error during registration. Please try again later.';
    }
  });

  // User Login
  const loginBtn = document.getElementById('loginBtn');
  const loginMessage = document.getElementById('loginMessage');
  loginBtn.addEventListener('click', async () => {
    const loginEmail = document.getElementById('loginEmail').value;
    const loginPassword = document.getElementById('loginPassword').value;

    try {
      const response = await fetch(`${url}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();
      if (data.token) {
        // Save the token in local storage for future API requests
        localStorage.setItem('jwtToken', data.token);
        loginMessage.textContent = 'Login successful. You are now logged in.';
      } else {
        loginMessage.textContent = 'Invalid credentials. Please try again.';
      }
    } catch (error) {
      console.error('Error during login:', error);
      loginMessage.textContent = 'Error during login. Please try again later.';
    }
  });

  // Create Post
  const createPostBtn = document.getElementById('createPostBtn');
  const postCreationMessage = document.getElementById('postCreationMessage');
  createPostBtn.addEventListener('click', async () => {
    console.log('Create Post button clicked');

    const postTitle = document.getElementById('postTitle').value;
    const postDescription = document.getElementById('postDescription').value;
    const postPhoto = document.getElementById('postPhoto').files[0]; // Get the selected file

    const jwtToken = localStorage.getItem('jwtToken');
    if (!jwtToken) {
      postCreationMessage.textContent = 'Please log in first to create a post.';
      postCreationMessage.classList.remove('success');
      postCreationMessage.classList.add('error');
      return;
    }
    try {
      // Use FileReader to read the selected file and get its content as a data URL
      const reader = new FileReader();
      reader.onload = async () => {
        const fileDataUrl = reader.result;

        // Send the file data along with other post details in the request body
        const response = await fetch(`${url}/post/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': jwtToken,
          },
          body: JSON.stringify({
            title: postTitle,
            description: postDescription,
            photo: fileDataUrl, // Send the file data URL as a string
          }),
        });
        const data = await response.json();
        postCreationMessage.textContent = data.message;
        if (response.ok) {
          postCreationMessage.classList.remove('error');
          postCreationMessage.classList.add('success');
        } else {
          postCreationMessage.classList.remove('success');
          postCreationMessage.classList.add('error');
        }
      };

      // Read the selected file as a data URL
      reader.readAsDataURL(postPhoto);
    } catch (error) {
      console.error('Error during post creation:', error);
      postCreationMessage.textContent = 'Error during post creation. Please try again later.';
      postCreationMessage.classList.remove('success');
      postCreationMessage.classList.add('error');
    }
  });

  // User Logout
  const logoutBtn = document.getElementById('logoutBtn');
  const logoutMessage = document.getElementById('logoutMessage');
  logoutBtn.addEventListener('click', async () => {
    const jwtToken = localStorage.getItem('jwtToken');
    if (!jwtToken) {
      logoutMessage.textContent = 'Please log in first.';
      return;
    }

    try {
      const response = await fetch(`${url}/user/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': jwtToken,
        },
      });

      // Clear the JWT token from local storage on successful logout
      localStorage.removeItem('jwtToken');

      const data = await response.json();
      logoutMessage.textContent = data.message;
    } catch (error) {
      console.error('Error during logout:', error);
      logoutMessage.textContent = 'Error during logout. Please try again later.';
    }
  });
});


