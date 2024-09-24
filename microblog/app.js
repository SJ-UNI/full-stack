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
                mediaHTML = <img src="${post.media}" style="max-width: 100%; height: auto;" />;
            } else if (post.mediaType.startsWith('video/')) {
                mediaHTML = <video controls style="max-width: 100%; height: auto;"><source src="${post.media}" type="${post.mediaType}">Your browser does not support the video tag.</video>;
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
                <input type="text" class="comment-input" placeholder="Add a comment..." />
                <button class="comment-btn">Comment</button>
                <ul class="comments-list"></ul>
            </div>
        `;
        postList.appendChild(li);

        // Add event listeners for reactions and comments
        addPostEventListeners(li, post);
    });
}

// Add Event Listeners for Post Reactions and Comments
function addPostEventListeners(postElement, post) {
    const likeBtn = postElement.querySelector('.like-btn');
    const dislikeBtn = postElement.querySelector('.dislike-btn');
    const laughBtn = postElement.querySelector('.laugh-btn');
    const cryBtn = postElement.querySelector('.cry-btn');
    const likeCount = postElement.querySelector('.like-count');
    const dislikeCount = postElement.querySelector('.dislike-count');
    const laughCount = postElement.querySelector('.laugh-count');
    const cryCount = postElement.querySelector('.cry-count');
    const commentInput = postElement.querySelector('.comment-input');
    const commentBtn = postElement.querySelector('.comment-btn');
    const commentsList = postElement.querySelector('.comments-list');

    likeBtn.addEventListener('click', () => toggleReaction(post, 'likes', likeCount));
    dislikeBtn.addEventListener('click', () => toggleReaction(post, 'dislikes', dislikeCount));
    laughBtn.addEventListener('click', () => toggleReaction(post, 'laughs', laughCount));
    cryBtn.addEventListener('click', () => toggleReaction(post, 'cries', cryCount));

    commentBtn.addEventListener('click', () => {
        const commentText = commentInput.value.trim();
        if (commentText) {
            post.comments.push(commentText);
            displayComments(commentsList, post.comments);
            commentInput.value = ''; // Clear input
        }
    });
}

// Toggle Reaction Functionality
function toggleReaction(post, reactionType, countElement) {
    const userReactionSet = post.reactions[reactionType];
    if (userReactionSet.has(currentUser)) {
        userReactionSet.delete(currentUser); // Remove reaction
    } else {
        // Ensure the user can only react once
        Object.keys(post.reactions).forEach(key => {
            if (key !== reactionType) {
                post.reactions[key].delete(currentUser);
            }
        });
        userReactionSet.add(currentUser); // Add reaction
    }
    countElement.textContent = userReactionSet.size; // Update count
}

// Display Comments Functionality
function displayComments(commentsList, comments) {
    commentsList.innerHTML = '';
    comments.forEach(comment => {
        const commentLi = document.createElement('li');
        commentLi.textContent = comment;
        commentsList.appendChild(commentLi);
    });
}

// Follow Functionality
document.getElementById('follow-btn').addEventListener('click', function() {
    const followUsername = document.getElementById('follow-username').value.trim();
    if (followUsername && followUsername !== currentUser && !following.has(followUsername)) {
        following.add(followUsername);
        document.getElementById('follow-username').value = ''; // Clear input
        displayFollowing();
        document.getElementById('follow-error').classList.add('hidden');
    } else {
        document.getElementById('follow-error').classList.remove('hidden');
    }
});

// Display Following List
function displayFollowing() {
    const followingList = document.getElementById('following-list');
    followingList.innerHTML = ''; // Clear existing following list

    following.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user;
        followingList.appendChild(li);
    });
}

// Logout Functionality
document.getElementById('logout-btn').addEventListener('click', function() {
    currentUser = null;
    document.getElementById('user-dashboard').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
    posts.length = 0; // Clear posts
    displayPosts(); // Refresh post display
    following.clear(); // Clear following
    displayFollowing(); // Refresh following display
});

// Show/Hide Password
document.getElementById('toggle-password').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    this.textContent = type === 'password' ? 'Show' : 'Hide';
});
