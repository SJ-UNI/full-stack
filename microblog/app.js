let currentUser = null;
const posts = [];
const following = new Set();

// Login Functionality
document.getElementById('login-btn').addEventListener('click', function() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username && password) {
        currentUser = username;
        document.getElementById('user-username').textContent = username;
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('user-dashboard').classList.remove('hidden');
        document.getElementById('post-error').classList.add('hidden');
        document.getElementById('login-error').classList.add('hidden');
        usernameInput.value = ''; // Clear input
        passwordInput.value = ''; // Clear input
    } else {
        document.getElementById('login-error').classList.remove('hidden');
    }
});

// Post Functionality
document.getElementById('post-btn').addEventListener('click', function() {
    const postContent = document.getElementById('post-content').value.trim();
    const mediaInput = document.getElementById('media-input');
    const mediaFile = mediaInput.files[0];

    if (postContent || mediaFile) {
        const post = {
            content: postContent,
            user: currentUser,
            media: mediaFile ? URL.createObjectURL(mediaFile) : null,
            mediaType: mediaFile ? mediaFile.type : null,
            reactions: {
                likes: new Set(),
                dislikes: new Set(),
                laughs: new Set(),
                cries: new Set(),
            },
            comments: []
        };
        posts.push(post); // Save the post
        displayPosts(); // Call function to display posts

        document.getElementById('post-content').value = ''; // Clear textarea
        mediaInput.value = ''; // Clear file input
        document.getElementById('post-error').classList.add('hidden');
    } else {
        document.getElementById('post-error').classList.remove('hidden');
    }
});

// Display Posts Functionality
function displayPosts() {
    const postList = document.getElementById('post-list');
    postList.innerHTML = ''; // Clear existing posts

    posts.forEach(post => {
        const li = document.createElement('li');
        let mediaHTML = '';

        if (post.media) {
            if (post.mediaType.startsWith('image/')) {
                mediaHTML = `<img src="${post.media}" style="max-width: 100%; height: auto;" />`;
            } else if (post.mediaType.startsWith('video/')) {
                mediaHTML = `<video controls style="max-width: 100%; height: auto;">
                                <source src="${post.media}" type="${post.mediaType}">
                                Your browser does not support the video tag.
                              </video>`;
            }
        }

        li.innerHTML = `
            <p>${post.content}</p>
            ${mediaHTML}
            <p>Posted by: ${post.user}</p>
            <div class="reaction-buttons">
                <button class="like-btn">❤️</button>
                <button class="dislike-btn">💔</button>
                <button class="laugh-btn">😂</button>
                <button class="cry-btn">😢</button>
                <span class="like-count">${post.reactions.likes.size}</span> Likes
                <span class="dislike-count">${post.reactions.dislikes.size}</span> Dislikes
                <span class="laugh-count">${post.reactions.laughs.size}</span> Laughs
                <span class="cry-count">${post.reactions.cries.size}</span> Cries
            </div>
            <div class="comment-section">
                <h4>Comments</h4>
                <input type="text" placeholder="Add a comment...">
                <button>Add Comment</button>
                <ul class="comment-list"></ul>
            </div>
        `;

        // Add event listeners for reactions
        li.querySelector('.like-btn').addEventListener('click', function() {
            handleReaction(post, 'likes');
            displayPosts();
        });

        li.querySelector('.dislike-btn').addEventListener('click', function() {
            handleReaction(post, 'dislikes');
            displayPosts();
        });

        li.querySelector('.laugh-btn').addEventListener('click', function() {
            handleReaction(post, 'laughs');
            displayPosts();
        });

        li.querySelector('.cry-btn').addEventListener('click', function() {
            handleReaction(post, 'cries');
            displayPosts();
        });

        // Comment functionality
        li.querySelector('.comment-section button').addEventListener('click', function() {
            const commentInput = li.querySelector('.comment-section input');
            const commentText = commentInput.value.trim();

            if (commentText) {
                post.comments.push(commentText);
                commentInput.value = ''; // Clear input
                displayPosts(); // Refresh posts to show new comment
            }
        });

        // Display comments
        const commentList = li.querySelector('.comment-list');
        post.comments.forEach(comment => {
            const commentLi = document.createElement('li');
            commentLi.textContent = comment;
            commentList.appendChild(commentLi);
        });

        postList.appendChild(li); // Add the new post to the list
    });
}

// Reaction Handling Function
function handleReaction(post, reactionType) {
    if (currentUser) {
        post.reactions[reactionType].add(currentUser);
    }
}

// Logout Functionality
document.getElementById('logout-btn').addEventListener('click', function() {
    currentUser = null;
    document.getElementById('user-dashboard').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
});

// Follow User Functionality
document.getElementById('follow-btn').addEventListener('click', function() {
    const followUsername = document.getElementById('follow-username').value.trim();

    if (followUsername && followUsername !== currentUser && !following.has(followUsername)) {
        following.add(followUsername);
        document.getElementById('following-list').innerHTML += `<li>${followUsername}</li>`;
        document.getElementById('follow-username').value = ''; // Clear input
        document.getElementById('follow-error').classList.add('hidden');
    } else {
        document.getElementById('follow-error').classList.remove('hidden');
    }
});

// Toggle Password Visibility
document.getElementById('toggle-password').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        this.textContent = 'Hide';
    } else {
        passwordInput.type = 'password';
        this.textContent = 'Show';
    }
});
