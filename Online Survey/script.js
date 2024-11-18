// Question banks for different users
const questionBanks = {
    user1: ["What is your favorite color?", "What is your favorite sport?", "What is your dream job?", "How do you usually spend weekends?", "What motivates you?"],
    user2: ["What is your favorite food?", "Where do you want to travel?", "What is your favorite hobby?", "What is your favorite book?", "What is your favorite movie genre?"],
    user3: ["What type of music do you like?", "Do you exercise regularly?", "What is your goal for this year?", "What inspires you?", "What is your favorite app?"],
};

// LocalStorage keys
const REGISTERED_USERS_KEY = "registeredUsers";

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

// Function to generate random questions for a user
function getRandomQuestions(username) {
    const questions = questionBanks[username] || questionBanks["user1"];
    return questions.sort(() => 0.5 - Math.random()).slice(0, 5);
}

// Load survey questions for a user
function loadSurveyQuestions(username) {
    const questions = getRandomQuestions(username);
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
        input.required = true;
        questionDiv.appendChild(input);

        questionsContainer.appendChild(questionDiv);
    });
}

// Handle survey form submission
surveyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(surveyForm);
    const answers = {};
    formData.forEach((value, key) => {
        answers[key] = value;
    });

    console.log("Survey Answers for", currentUser, ":", answers);
    alert("Thank you for completing the survey!");
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
