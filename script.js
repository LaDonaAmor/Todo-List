// Get the input box element from the DOM and store it in a variable
const inputBox = document.getElementById("input-box");

// Get the list container element from the DOM and store it in a variable
const listContainer = document.getElementById("list-container");

// Define a function to add a new task to the list
function addTask() {
    // Get the trimmed value from the input box
    const task = inputBox.value.trim();

    // Check if the task input is empty
    if (!task) {
        // Alert the user to write down a task if input is empty
        alert("Please write down a task");
        // Exit the function early
        return;
    }

    // Create a new list item element
    const li = document.createElement("li");

    // Set the inner HTML of the list item with the task and action buttons
    li.innerHTML = `
        <label>
        <input type="checkbox">
        <span>${task}</span>
        </label>
        <span class="edit-btn">Edit</span>
        <span class="delete-btn">Delete</span>
    `;

    // Append the new list item to the list container
    listContainer.appendChild(li);

    // Clear the input box
    inputBox.value = "";

    // Get the checkbox element within the list item
    const checkbox = li.querySelector("input");

    // Get the edit button element within the list item
    const editBtn = li.querySelector(".edit-btn");

    // Get the span element that contains the task text
    const taskSpan = li.querySelector("span");

    // Get the delete button element within the list item
    const deleteBtn = li.querySelector(".delete-btn");

    // Add an event listener to the checkbox for marking the task as completed
    checkbox.addEventListener("click", function () {
        // Toggle the 'completed' class based on checkbox state
        li.classList.toggle("completed", checkbox.checked);
        // Update the task counters
        updateCounters();
    });

    // Add an event listener to the edit button for editing the task
    editBtn.addEventListener("click", function () {
        // Prompt the user to update the task text
        const update = prompt("Edit task:", taskSpan.textContent);
        // If the user provides a new task text
        if (update !== null) {
            // Update the task text
            taskSpan.textContent = update;
            // Remove the 'completed' class
            li.classList.remove("completed");
            // Uncheck the checkbox
            checkbox.checked = false;
            // Update the task counters
            updateCounters();
        }
    });

    // Add an event listener to the delete button for deleting the task
    deleteBtn.addEventListener("click", function () {
        // Confirm the delete action with the user
        if (confirm("Are you sure you want to delete this task?")) {
            // Remove the list item from the DOM
            li.remove();
            // Update the task counters
            updateCounters();
        }
    });

    // Update the task counters initially after adding a new task
    updateCounters();
}

// Get the completed counter element from the DOM
const completedCounter = document.getElementById("completed-counter");

// Get the uncompleted counter element from the DOM
const uncompletedCounter = document.getElementById("uncompleted-counter");

// Define a function to update the task counters
function updateCounters() {
    // Count the number of completed tasks
    const completedTasks = document.querySelectorAll(".completed").length;

    // Count the number of uncompleted tasks
    const uncompletedTasks = document.querySelectorAll("li:not(.completed)").length;

    // Update the completed counter text
    completedCounter.textContent = completedTasks;

    // Update the uncompleted counter text
    uncompletedCounter.textContent = uncompletedTasks;
}
