// index.js

// JavaScript code for handling form submissions and interactions
document.addEventListener('DOMContentLoaded', () => {
  const url = 'http://localhost:3010';

  // User Registration
  const registerBtn = document.getElementById('registerBtn');
  const registrationMessage = document.getElementById('registrationMessage');
  registerBtn.addEventListener('click', async () => {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
      const response = await fetch(`${url}/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      registrationMessage.textContent = data.message;
      if (response.ok) {
        registrationMessage.classList.remove('error');
        registrationMessage.classList.add('success');
      } else {
        registrationMessage.classList.remove('success');
        registrationMessage.classList.add('error');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      registrationMessage.textContent = 'Error during registration. Please try again later.';
      registrationMessage.classList.remove('success');
      registrationMessage.classList.add('error');
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
         loginMessage.classList.remove('error');
         loginMessage.classList.add('success');
       } else {
         loginMessage.textContent = 'Invalid credentials. Please try again.';
         loginMessage.classList.remove('success');
         loginMessage.classList.add('error');
       }
     } catch (error) {
       console.error('Error during login:', error);
       loginMessage.textContent = 'Error during login. Please try again later.';
       loginMessage.classList.remove('success');
       loginMessage.classList.add('error');
     }
   });
 

// Create Post
const createPostBtn = document.getElementById('createPostBtn');
const postCreationMessage = document.getElementById('postCreationMessage');
createPostBtn.addEventListener('click', async () => {
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
    // Create a new FormData object and append the necessary fields
    const formData = new FormData();
    formData.append('title', postTitle);
    formData.append('description', postDescription);
    formData.append('photo', postPhoto);

    const response = await fetch(`${url}/post/create`, {
      method: 'POST',
      headers: {
        // No need to set 'Content-Type' since FormData handles it
        'Authorization': jwtToken,
      },
      body: formData, // Use the FormData object as the body
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
  } catch (error) {
    console.error('Error during post creation:', error);
    postCreationMessage.textContent = 'Error during post creation. Please try again later.';
    postCreationMessage.classList.remove('success');
    postCreationMessage.classList.add('error');
  }
});

// Populate the dropdown menu with available post titles
async function populateEditPostDropdown() {
  const editPostTitle = document.getElementById('editPostTitle');
  try {
    const response = await fetch(`${url}/post/all`, {
      method: 'GET',
      headers: {
        'Authorization': jwtToken,
      },
    });
    const data = await response.json();
    if (response.ok) {
      data.posts.forEach(post => {
        const option = document.createElement('option');
        option.value = post._id; // Use the post's unique identifier as the value
        option.textContent = post.title;
        editPostTitle.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Error while populating edit post dropdown:', error);
  }
}

// Event listener for dropdown selection
const editPostTitle = document.getElementById('editPostTitle');
editPostTitle.addEventListener('change', async () => {
  const selectedPostId = editPostTitle.value;
  try {
    const response = await fetch(`${url}/post/${selectedPostId}`, {
      method: 'GET',
      headers: {
        'Authorization': jwtToken,
      },
    });
    const data = await response.json();
    if (response.ok) {
      // Populate form fields with selected post details
      document.getElementById('postTitle').value = data.post.title;
      document.getElementById('postDescription').value = data.post.description;
    }
  } catch (error) {
    console.error('Error while fetching post details:', error);
  }
});

// Event listener for Edit Post button
const editPostBtn = document.getElementById('editPostBtn');
const editPostMessage = document.getElementById('editPostMessage');
editPostBtn.addEventListener('click', async () => {
  const selectedPostId = editPostTitle.value;
  const updatedTitle = document.getElementById('postTitle').value;
  const updatedDescription = document.getElementById('postDescription').value;
  const updatedPhoto = document.getElementById('postPhoto').files[0];

  const formData = new FormData();
  formData.append('title', updatedTitle);
  formData.append('description', updatedDescription);
  formData.append('photo', updatedPhoto);

  try {
    const response = await fetch(`${url}/post/${selectedPostId}`, {
      method: 'PUT',
      headers: {
        'Authorization': jwtToken,
      },
      body: formData,
    });

    const data = await response.json();
    editPostMessage.textContent = data.message;
    if (response.ok) {
      editPostMessage.classList.remove('error');
      editPostMessage.classList.add('success');
    } else {
      editPostMessage.classList.remove('success');
      editPostMessage.classList.add('error');
    }
  } catch (error) {
    console.error('Error during post editing:', error);
    editPostMessage.textContent = 'Error during post editing. Please try again later.';
    editPostMessage.classList.remove('success');
    editPostMessage.classList.add('error');
  }
});

// Call the function to populate the edit post dropdown when the page loads
populateEditPostDropdown();

// Display post comments
async function displayPostComments(postId) {
  const postComments = document.getElementById('postComments');
  try {
    const response = await fetch(`${url}/post/${postId}/comments`, {
      method: 'GET',
      headers: {
        'Authorization': jwtToken,
      },
    });
    const data = await response.json();
    if (response.ok) {
      postComments.innerHTML = ''; // Clear existing comments
      data.comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        commentDiv.innerHTML = `<strong>${comment.user.name}:</strong> ${comment.content}`;
        postComments.appendChild(commentDiv);
      });
    }
  } catch (error) {
    console.error('Error while fetching post comments:', error);
  }
}

// Load more comments button functionality
let currentPage = 1;
const loadMoreCommentsBtn = document.getElementById('loadMoreCommentsBtn');
loadMoreCommentsBtn.addEventListener('click', async () => {
  const selectedPostId = editPostTitle.value;
  try {
    currentPage++;
    const response = await fetch(`${url}/post/${selectedPostId}/comments?page=${currentPage}`, {
      method: 'GET',
      headers: {
        'Authorization': jwtToken,
      },
    });
    const data = await response.json();
    if (response.ok) {
      const postComments = document.getElementById('postComments');
      data.comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        commentDiv.innerHTML = `<strong>${comment.user.name}:</strong> ${comment.content}`;
        postComments.appendChild(commentDiv);
      });
    }
  } catch (error) {
    console.error('Error while fetching more post comments:', error);
  }
});

// Event listener for dropdown selection (to display comments for selected post)
editPostTitle.addEventListener('change', async () => {
  const selectedPostId = editPostTitle.value;
  await displayPostComments(selectedPostId);
  currentPage = 1; // Reset current page when a new post is selected
});

// Call the function to populate the edit post dropdown when the page loads
populateEditPostDropdown();

// Update User Profile
const updateProfileBtn = document.getElementById('updateProfileBtn');
const updateProfileMessage = document.getElementById('updateProfileMessage');
updateProfileBtn.addEventListener('click', async () => {
  const newName = document.getElementById('updateName').value;
  const newEmail = document.getElementById('updateEmail').value;
  const newPassword = document.getElementById('updatePassword').value;

  try {
    const response = await fetch(`${url}/user/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': jwtToken,
      },
      body: JSON.stringify({
        name: newName,
        email: newEmail,
        password: newPassword,
      }),
    });

    const data = await response.json();
    updateProfileMessage.textContent = data.message;
  } catch (error) {
    console.error('Error during profile update:', error);
    updateProfileMessage.textContent = 'Error during profile update. Please try again later.';
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

    // Clear any logged-in state and update the UI
    loginMessage.textContent = ''; // Clear the login message
    postCreationMessage.textContent = ''; // Clear the post creation message
    updateProfileMessage.textContent = ''; // Clear the update profile message
    // You can similarly clear other message elements as needed

    // Hide the user-specific sections (Create Post, User Profile)
    document.querySelectorAll('.user-specific-section').forEach(section => {
      section.style.display = 'none';
    });

    // Show the login and registration sections
    document.querySelectorAll('.login-registration-section').forEach(section => {
      section.style.display = 'block';
    });
  } catch (error) {
    console.error('Error during logout:', error);
    logoutMessage.textContent = 'Error during logout. Please try again later.';
  }
});
});









/*
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
        'Authorization': `Bearer ${jwtToken}`, // Include the JWT token in the request headers
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


    // Function to fetch posts from the backend API
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts', {
          headers: {
            'Authorization': `Bearer ${getJwtToken()}`,
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
      }
    }
  
    // Function to fetch comments for a specific post from the backend API
    async function fetchComments(postId) {
      try {
        const response = await fetch(`/api/posts/${postId}/comments`, {
          headers: {
            'Authorization': `Bearer ${getJwtToken()}`,
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching comments:', error);
        return [];
      }
    }
  
// Function to render posts and their associated comments
async function renderPosts() {
  const postsContainer = document.getElementById('posts-container');

  try {
    // Fetch posts from the backend API
    const posts = await fetchPosts();

    // Clear previous content
    postsContainer.innerHTML = '';

    // Loop through each post
    posts.forEach(async (post) => {
      const postDiv = document.createElement('div');
      postDiv.classList.add('post');

      // Add post content
      const postTitle = document.createElement('h2');
      postTitle.textContent = post.title;

      const postDescription = document.createElement('p');
      postDescription.textContent = post.description;

      const postPhoto = document.createElement('img');
      postPhoto.src = post.photo;

      postDiv.appendChild(postTitle);
      postDiv.appendChild(postDescription);
      postDiv.appendChild(postPhoto);

      // Fetch comments for the current post
      const comments = await fetchComments(post.id);

      // Create a list for comments
      const commentsList = document.createElement('ul');
      commentsList.classList.add('comments-list');

      // Loop through each comment and add to the comments list
      comments.forEach((comment) => {
        const commentItem = document.createElement('li');
        commentItem.textContent = comment.content;
        commentsList.appendChild(commentItem);
      });

      // Add the comments list to the post
      postDiv.appendChild(commentsList);

      // Add the comment form under the post
      const commentForm = document.createElement('form');
      commentForm.classList.add('comment-form');
      commentForm.setAttribute('data-post-id', post.id);
      commentForm.innerHTML = `
      <div class="form-group">
        <label for="commentContent-${post.id}">Add your comment:</label>
        <textarea id="commentContent-${post.id}" name="commentContent" rows="4" required></textarea>
      </div>
      <div class="form-group">
        <button type="submit">Submit Comment</button>
      </div>
    `;

      postDiv.appendChild(commentForm);

      // Add the post to the posts container
      postsContainer.appendChild(postDiv);
    });
  } catch (error) {
    console.error('Error fetching and rendering posts:', error);
  }
}

// Function to handle comment submission
async function handleCommentSubmit(event, postId) {
  event.preventDefault();
  const content = event.target.elements.commentContent.value;

  try {
    const jwtToken = getJwtToken();
    if (!jwtToken) {
      console.error('JWT token missing. Please log in first.');
      return;
    }

    // Fetch the backend API to create a new comment
    const response = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`, // Include the JWT token in the request headers
      },
      body: JSON.stringify({ content }),
    });

    if (response.ok) {
      // If comment creation is successful, re-render the posts to update the comments
      renderPosts();
    } else {
      console.error('Error creating comment:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error creating comment:', error);
  }
}

// Add event listener for comment form submission
document.addEventListener('submit', async (event) => {
  const commentForm = event.target;
  if (commentForm.classList.contains('comment-form')) {
    const postId = commentForm.getAttribute('data-post-id');
    handleCommentSubmit(event, postId);
  }
});
// Render initial posts
renderPosts();
});
*/