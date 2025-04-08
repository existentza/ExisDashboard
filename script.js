const tasks = document.getElementsByClassName("task");
const tasks_status = document.getElementsByClassName("task-status");
const tooltip = document.getElementById("tooltip");
const ordersManager = document.querySelector('.orders-manager'); 

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

for (const task of tasks) {
    const taskDescription = task.getAttribute("description");
    const taskStatus = task.querySelector(".task-status");
    const taskCompletionBar = taskStatus.querySelector(".completion-bar");
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

fetch("https://api.lanyard.rest/v1/users/1170828730013323314")
    .then(res => res.json())
    .then(data => {
        if (data.data.discord_status != "offline") {
            statusDot.style.backgroundColor = "green";
            statusType.textContent = "Currently Online";
        } else {
            statusDot.style.backgroundColor = "red";
            statusType.textContent = "Currently Offline";
        }
    });

setInterval(() => {
    fetch("https://api.lanyard.rest/v1/users/1170828730013323314")
        .then(res => res.json())
        .then(data => {
            if (data.data.discord_status != "offline") {
                statusDot.style.backgroundColor = "green";
                statusType.textContent = "Currently Online";
            } else {
                statusDot.style.backgroundColor = "red";
                statusType.textContent = "Currently Offline";
            }
        });
}, 60000);
