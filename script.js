const tooltip = document.getElementById("tooltip");
const ordersManager = document.querySelector('.orders-manager'); 

ordersManager.innerHTML = "";

commissionsData.forEach(order => {
    const orderDiv = document.createElement("div");
    orderDiv.classList.add("order");

    const orderIdDiv = document.createElement("div");
    orderIdDiv.classList.add("order-id");
    orderIdDiv.innerHTML = `<h3 style="margin-left: 20px;">Commission ${order.id}</h3>`;

    const tasksDiv = document.createElement("div");
    tasksDiv.classList.add("tasks");

    order.tasks.forEach(task => {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");
        taskDiv.setAttribute("description", task.description || "No description available.");

        const taskName = document.createElement("h3");
        taskName.classList.add("task-name");
        taskName.textContent = task.name;

        const taskStatus = document.createElement("div");
        taskStatus.classList.add("task-status");
        taskStatus.setAttribute("value", task.status);

        const completionBar = document.createElement("div");
        completionBar.classList.add("completion-bar");
        completionBar.setAttribute("percentage", task.percentage);

        taskStatus.appendChild(completionBar);

        const taskDate = document.createElement("h3");
        taskDate.classList.add("task-date");
        taskDate.innerHTML = `<span class="date">${task.date}</span>`;

        taskDiv.appendChild(taskName);
        taskDiv.appendChild(taskStatus);
        taskDiv.appendChild(taskDate);

        tasksDiv.appendChild(taskDiv);
    });

    orderDiv.appendChild(orderIdDiv);
    orderDiv.appendChild(tasksDiv);
    ordersManager.appendChild(orderDiv);
});

const statusDot = document.getElementById("status-dot");
const statusType = document.getElementById("status-type");
const statusManager = document.getElementById("online-status");

function GetStatusText(status){
    if (status == "0") {
        return "Not Started";
    } else if (status == "1") {
        return "In Progress";
    } else if (status == "2") {
        return "Done";
    } else if (status == "3") {
        return "Standby";
    } else if (status == "4") {
        return "Waiting for Payment";
    }
}

if (ordersManager.children.length === 0) {
    const noOrdersMessage = document.createElement('p');
    noOrdersMessage.textContent = "There is no Commissions at the moment.";
    noOrdersMessage.classList.add('no-orders');
    ordersManager.appendChild(noOrdersMessage);
}

const tasks = document.getElementsByClassName("task");
const tasks_status = document.getElementsByClassName("task-status");

for (const task of tasks) {
    const taskDescription = task.getAttribute("description");
    const taskStatus = task.querySelector(".task-status");
    const taskCompletionBar = taskStatus.querySelector(".completion-bar");
    const taskDate = task.querySelector(".task-date");
    const actualDate = taskDate.querySelector(".date");
    const status = taskStatus.getAttribute("value");

    task.addEventListener("mousemove", function(e) {
        const x = e.pageX;
        const y = e.pageY;
       
        if (!task.hasAttribute("description")) {
            tooltip.style.display = 'none';
            return;
        }

        const percentage = taskCompletionBar.getAttribute("percentage");
        const barText = taskCompletionBar.querySelector(".completion-text");

        if (barText && (status !== "3" && status !== "0")) {
            barText.innerHTML = `${percentage}%`;
        }

        if (taskDescription == "") {
            tooltip.innerHTML = "No description available.";
        } else {
            tooltip.innerHTML = taskDescription;
        }

        if (window.innerWidth <= 480) {
            tooltip.innerHTML += `<br><small>Date: ${actualDate.innerHTML}</small>`;
        }
        

        tooltip.style.left = `${x + 2}px`;
        tooltip.style.top = `${y + 2}px`;
        tooltip.style.display = 'block';
    });
    
    task.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
        const barText = taskCompletionBar.querySelector(".completion-text");
        if (barText) {
            barText.innerHTML = GetStatusText(status);
        }
    });
}

for (const taskStatus of tasks_status) {
    const status = taskStatus.getAttribute("value");
    const bar = taskStatus.querySelector(".completion-bar");
    let percentage = bar.getAttribute("percentage");

    if (status === "3" || status === "0") {
        percentage = 100
    }

    bar.innerHTML = '';

    const fill = document.createElement('div');
    fill.className = 'completion-fill';
    fill.style.width = `${percentage}%`;

    const text = document.createElement('div');
    text.className = 'completion-text';
    text.textContent = GetStatusText(status);

    if (status === "0") fill.style.backgroundColor = "red";
    else if (status === "1") fill.style.backgroundColor = "rgb(230, 191, 14)";
    else if (status === "2") fill.style.backgroundColor = "rgb(16, 189, 33)";
    else if (status === "3") fill.style.backgroundColor = "rgb(29, 118, 207)";
    else if (status === "4") fill.style.backgroundColor = "rgb(183, 71, 11)";

    bar.appendChild(fill);
    bar.appendChild(text);
}

statusManager.addEventListener("mousemove", function(e) {
    const x = e.pageX;
    const y = e.pageY;
   
    tooltip.innerHTML = "This displays my current Discord Status, if I'm online I'm probably working on your commission!"

    tooltip.style.left = `${x + 2}px`;
    tooltip.style.top = `${y + 2}px`;
    tooltip.style.display = 'block';
});

statusManager.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
});

function updateDiscordStatus() {
    fetch("https://api.lanyard.rest/v1/users/1170828730013323314")
        .then(res => res.json())
        .then(data => {
            if (data.data.discord_status !== "offline") {
                statusDot.style.backgroundColor = "green";
                statusType.textContent = "Currently Online";
            } else {
                statusDot.style.backgroundColor = "red";
                statusType.textContent = "Currently Offline";
            }
        });
}

updateDiscordStatus();
setInterval(updateDiscordStatus, 60000);

