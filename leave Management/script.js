// Initialize local storage for user data (if not already present)
if (!localStorage.getItem('users')) {
    localStorage.setItem(
        'users',
        JSON.stringify([
            { empId: "EMP001", email: "user1@example.com", password: "password123", casualLeave: 10, medicalLeave: 5, leaveHistory: [] },
            { empId: "EMP002", email: "user2@example.com", password: "pass456", casualLeave: 8, medicalLeave: 7, leaveHistory: [] },
        ])
    );
}

let currentUser = null;

// Login functionality
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const empId = document.getElementById('empId').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Fetch users from localStorage
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.empId === empId && u.email === email && u.password === password);

    const loginMessage = document.getElementById('login-message');

    if (user) {
        currentUser = user;
        loginMessage.innerText = "Login successful!";
        loginMessage.style.color = "green";

        // Show leave management section
        document.getElementById('login-section').style.display = "none";
        document.getElementById('leave-section').style.display = "block";

        // Display employee details
        document.getElementById('displayEmpId').innerText = currentUser.empId;
        document.getElementById('displayEmail').innerText = currentUser.email;

        // Display leave balance
        document.getElementById('casual-leave').innerText = currentUser.casualLeave;
        document.getElementById('medical-leave').innerText = currentUser.medicalLeave;

        // Display leave history
        displayLeaveHistory(currentUser.leaveHistory);
    } else {
        loginMessage.innerText = "Invalid credentials!";
        loginMessage.style.color = "red";
    }
});

// Leave application functionality
document.getElementById('leaveForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const leaveType = document.getElementById('leaveType').value;
    const leaveDays = parseInt(document.getElementById('leaveDays').value);
    const messageDiv = document.getElementById('message');

    if (leaveType === "casual" && leaveDays <= currentUser.casualLeave) {
        currentUser.casualLeave -= leaveDays;
        messageDiv.innerText = `Applied for ${leaveDays} day(s) of casual leave.`;
        messageDiv.style.color = "green";
    } else if (leaveType === "medical" && leaveDays <= currentUser.medicalLeave) {
        currentUser.medicalLeave -= leaveDays;
        messageDiv.innerText = `Applied for ${leaveDays} day(s) of medical leave.`;
        messageDiv.style.color = "green";
    } else {
        messageDiv.innerText = `Insufficient leave balance!`;
        messageDiv.style.color = "red";
    }

    // Update leave balance display
    document.getElementById('casual-leave').innerText = currentUser.casualLeave;
    document.getElementById('medical-leave').innerText = currentUser.medicalLeave;

    // Save leave application in history
    currentUser.leaveHistory.push({
        leaveType,
        leaveDays,
        date: new Date().toLocaleString()
    });

    // Save updated user data back to localStorage
    const users = JSON.parse(localStorage.getItem('users'));
    const updatedUsers = users.map(user =>
        user.empId === currentUser.empId ? currentUser : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Refresh leave history display
    displayLeaveHistory(currentUser.leaveHistory);

    // Reset form
    document.getElementById('leaveForm').reset();
});

// Function to display leave history
function displayLeaveHistory(leaveHistory) {
    const leaveHistoryDiv = document.getElementById('message');
    leaveHistoryDiv.innerHTML = "<h2>Leave History</h2>";
    if (leaveHistory.length === 0) {
        leaveHistoryDiv.innerHTML += "<p>No leaves applied yet.</p>";
    } else {
        leaveHistory.forEach(entry => {
            leaveHistoryDiv.innerHTML += `<p>${entry.leaveType} Leave - ${entry.leaveDays} day(s) on ${entry.date}</p>`;
        });
    }
}
