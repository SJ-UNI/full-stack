// Question banks for different users
const questionBanks = {
    user1: ["What is your favorite color?", "What is your favorite sport?", "What is your dream job?", "How do you usually spend weekends?", "What motivates you?"],
    user2: ["What is your favorite food?", "Where do you want to travel?", "What is your favorite hobby?", "What is your favorite book?", "What is your favorite movie genre?"],
    user3: ["What type of music do you like?", "Do you exercise regularly?", "What is your goal for this year?", "What inspires you?", "What is your favorite app?"],
};

// LocalStorage keys
const REGISTERED_USERS_KEY = "registeredUsers";
const USER_ANSWERS_KEY = "userAnswers";
const USER_QUESTIONS_KEY = "userQuestions";

// Elements
const registerPage = document.getElementById("registerPage");
const surveyPage = document.getElementById("surveyPage");
const registerForm = document.getElementById("registerForm");
const surveyForm = document.getElementById("surveyForm");
const userList = document.getElementById("userList");
const questionsContainer = document.getElementById("questionsContainer");
const currentUserDisplay = document.getElementById("currentUser");

let currentUser = null;

// Load registered users from localStorage
function loadRegisteredUsers() {
    const users = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY)) || [];
    userList.innerHTML = "";
    users.forEach((user) => {
        const li = document.createElement("li");
        li.textContent = user.username;
        userList.appendChild(li);
    });
    return users;
}

// Save registered users to localStorage
function saveRegisteredUsers(users) {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
}

// Load answers for the current user
function loadUserAnswers(username) {
    const userAnswers = JSON.parse(localStorage.getItem(USER_ANSWERS_KEY)) || {};
    return userAnswers[username] || {};
}

// Save answers for the current user
function saveUserAnswers(username, answers) {
    const userAnswers = JSON.parse(localStorage.getItem(USER_ANSWERS_KEY)) || {};
    userAnswers[username] = answers;
    localStorage.setItem(USER_ANSWERS_KEY, JSON.stringify(userAnswers));
}

// Load questions for the current user
function loadUserQuestions(username) {
    const userQuestions = JSON.parse(localStorage.getItem(USER_QUESTIONS_KEY)) || {};
    return userQuestions[username];
}

// Save questions for the current user
function saveUserQuestions(username, questions) {
    const userQuestions = JSON.parse(localStorage.getItem(USER_QUESTIONS_KEY)) || {};
    userQuestions[username] = questions;
    localStorage.setItem(USER_QUESTIONS_KEY, JSON.stringify(userQuestions));
}

// Function to generate random questions for a user
function getRandomQuestions(username) {
    const questions = questionBanks[username] || questionBanks["user1"];
    return questions.sort(() => 0.5 - Math.random()).slice(0, 5);
}

// Load survey questions for a user
function loadSurveyQuestions(username) {
    let questions = loadUserQuestions(username);

    // If no previous questions exist, generate new ones
    if (!questions) {
        questions = getRandomQuestions(username);
        saveUserQuestions(username, questions);
    }

    const previousAnswers = loadUserAnswers(username);
    questionsContainer.innerHTML = "";

    questions.forEach((question, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question");

        const label = document.createElement("label");
        label.textContent = `Q${index + 1}: ${question}`;
        questionDiv.appendChild(label);

        const input = document.createElement("input");
        input.type = "text";
        input.name = `answer${index + 1}`;
        input.value = previousAnswers[`answer${index + 1}`] || ""; // Load previous answer if available
        input.required = true;
        questionDiv.appendChild(input);

        questionsContainer.appendChild(questionDiv);
    });
}

// Handle registration form submission
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username && password) {
        const users = loadRegisteredUsers();
        if (users.find((user) => user.username === username)) {
            alert("Username already exists!");
            return;
        }

        users.push({ username, password });
        saveRegisteredUsers(users);
        loadRegisteredUsers();
        alert("Registration successful!");
        registerForm.reset();
    }
});

// Handle survey form submission
surveyForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Collect answers
    const formData = new FormData(surveyForm);
    const answers = {};
    formData.forEach((value, key) => {
        answers[key] = value;
    });

    // Save answers
    saveUserAnswers(currentUser, answers);

    alert("Thank you for completing the survey! Your answers have been saved.");
    surveyForm.reset();
});

// Switch to survey page after registration
userList.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
        currentUser = e.target.textContent;
        currentUserDisplay.textContent = currentUser;
        loadSurveyQuestions(currentUser);
        registerPage.style.display = "none";
        surveyPage.style.display = "block";
    }
});

// Initialize app
loadRegisteredUsers();
