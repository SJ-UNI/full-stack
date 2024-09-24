document.getElementById('add-task').addEventListener('click', function() {
    const taskInput = document.getElementById('task-input');
    const taskText = taskInput.value.trim();

    if (taskText) {
        // Create a new list item
        const li = document.createElement('li');
        li.textContent = taskText;

        // Create a delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
            li.remove(); // Remove the task from the list
        });

        li.appendChild(deleteButton); // Append delete button to the list item
        document.getElementById('task-list').appendChild(li); // Append the list item to the task list
        taskInput.value = ''; // Clear the input field
    } else {
        alert('Please enter a task!'); // Alert if input is empty
    }
});
