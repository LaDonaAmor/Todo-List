// Get the input box element from the DOM and store it in a variable
const inputBox = document.getElementById("input-box");

// Get the list container element from the DOM and store it in a variable
const listContainer = document.getElementById("list-container");

// Get the date and time elements from the DOM and store them in variables
const dateElement = document.getElementById("date");
const timeElement = document.getElementById("time");

// Update the date and time initially after the page loads
updateDateTime();

// Define a function to update the date and time
function updateDateTime() {
    // Get the current date and time
    const currentDateTime = new Date();
    
    // Format the date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = currentDateTime.toLocaleDateString(undefined, options);
    
    // Format the time
    const formattedTime = currentDateTime.toLocaleTimeString();

    // Update the content of the date and time elements
    dateElement.textContent = `Date: ${formattedDate}`;
    timeElement.textContent = `Time: ${formattedTime}`;
}

// Update the date and time every second
setInterval(updateDateTime, 1000);

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
    
    // Assign a unique ID to the task item
    li.id = 'task-' + Date.now(); 
    // Make the task item draggable
    li.draggable = true; 

    // Set the inner HTML of the list item with the task and action buttons
    li.innerHTML = `
        <label>
        <input type="checkbox">
        <span>${task}</span>
        </label>
        <span class="delete-btn">Delete</span>
        <span class="edit-btn">Edit</span>
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
       
        // Reorder the tasks in the list
        if (checkbox.checked) {
            // Move the completed task to the bottom of the list
            listContainer.appendChild(li);
        } else {
            // Move the uncompleted task to the top of the uncompleted tasks
            const completedTasks = document.querySelectorAll(".completed");
            if (completedTasks.length > 0) {
                listContainer.insertBefore(li, completedTasks[0]);
            } else {
                listContainer.appendChild(li);
            }
        }

        // Update the task counters
        updateCounters();
    });
    
    // Add an event listener to the edit button for editing the task
    editBtn.addEventListener("click", function () {
        // Create an input element for inline editing
        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.value = taskSpan.textContent;
        // Add a class for styling
        editInput.className = "edit-input";  

        // Create a save button for inline editing
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        saveBtn.className = "save-btn";

        // Replace the task span with the edit input
        taskSpan.replaceWith(editInput);
        // Replace the edit button with the save button
        editBtn.replaceWith(saveBtn);

        // Focus the input and select its content
        editInput.focus();

        // Function to save the updated task
        function saveTask() {
            const updatedTask = editInput.value.trim();
            if (updatedTask) {
                taskSpan.textContent = updatedTask;
                editInput.replaceWith(taskSpan);
                saveBtn.replaceWith(editBtn);
                // Remove the 'completed' class
                li.classList.remove("completed");
                // Uncheck the checkbox
                checkbox.checked = false;
                // Update the task counters
                updateCounters();
            } else {
                // If the input is empty, remove the task
                li.remove();
                updateCounters();
            }
        }

        // Save the task on save button click
        saveBtn.addEventListener("click", saveTask);

        // Save the task when the input loses focus
        editInput.addEventListener("blur", function () {
            // Delay to prevent immediate blur when clicking Save
            setTimeout(saveTask, 100); 
        });
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

    // Add drag and drop functionality
    li.addEventListener('dragstart', dragStart);
    li.addEventListener('dragover', dragOver);
    li.addEventListener('drop', drop);
    li.addEventListener('dragenter', dragEnter);
    li.addEventListener('dragleave', dragLeave);
    li.addEventListener('dragend', function() {
        // Remove highlight after drag ends
        this.style.backgroundColor = ''; 
    });

    // Update the task counters initially after adding a new task
    updateCounters();
}

// Define drag start event
function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
    // Optional: highlight the item being dragged
    event.currentTarget.style.backgroundColor = 'gray'; 
}

// Define drag over event
function dragOver(event) {
    // Prevent default to allow drop
    event.preventDefault(); 
}

// Define drag enter event
function dragEnter(event) {
    event.preventDefault();
    // Highlight potential drop target
    event.target.closest('li').style.backgroundColor = 'lightgrey'; 
}

// Define drag leave event
function dragLeave(event) {
    event.preventDefault();
    // Remove highlight from potential drop target
    event.target.closest('li').style.backgroundColor = ''; 
}

// Define the drop event handler function
function drop(event) {
    // Prevent the default behavior to allow for dropping
    event.preventDefault();

    // Get the ID of the element being dragged from the data transfer object
    const id = event.dataTransfer.getData('text');

    // Get the actual draggable element using the retrieved ID
    const draggableElement = document.getElementById(id);

    // Find the closest list item (li) element to where the drop event occurred
    const dropzone = event.target.closest('li');

    // Check if a dropzone exists and that it's not the same as the draggable element
    if (dropzone && draggableElement !== dropzone) {
        // Get the bounding rectangle of the dropzone to determine its position
        const rect = dropzone.getBoundingClientRect();

        // Calculate the offset of the drop event from the top of the dropzone
        const offsetY = event.clientY - rect.top;
        
        // If there's only one item in the list
        if (listContainer.children.length === 1) {
            // Append the dragged item to the list container
            listContainer.appendChild(draggableElement);
        } else if (offsetY < dropzone.clientHeight / 2) {
            // If the drop position is in the upper half of the dropzone
            // Insert the draggable element before the dropzone
            listContainer.insertBefore(draggableElement, dropzone);
        } else {
            // If the drop position is in the lower half of the dropzone
            // Insert the draggable element after the dropzone
            listContainer.insertBefore(draggableElement, dropzone.nextSibling);
        }
    }

    // Clear the data transfer object
    event.dataTransfer.clearData();

    // Remove the background color highlight from the dropzone
    event.target.closest('li').style.backgroundColor = '';

    // Update the task counters after rearranging tasks
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
