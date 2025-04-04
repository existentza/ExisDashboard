const tasks = document.getElementsByClassName("task");
const tasks_status = document.getElementsByClassName("task-status");
const tooltip = document.getElementById("tooltip");
const ordersManager = document.querySelector('.orders-manager'); 


if (ordersManager.children.length === 0) {
    const noOrdersMessage = document.createElement('p');
    noOrdersMessage.textContent = "There is no Commissions at the moment.";
    noOrdersMessage.classList.add('no-orders');
    ordersManager.appendChild(noOrdersMessage);
}

for (const task of tasks) {
    task.addEventListener("mousemove", function(e) {
        const x = e.clientX;
        const y = e.clientY;
       
        if (!task.hasAttribute("description")) {
            tooltip.style.display = 'none';
            return;
        }
        
        const taskDescription = task.getAttribute("description");
        
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
    });
}

for (const task of tasks_status) {
    const status = task.getAttribute("value");
    let statusText = task.querySelector("h3");
    
    if (status == "0") {
        statusText.textContent = "Not Started";
    } else if (status == "1") {
        statusText.textContent = "In Progress";
    } else if (status == "2") {
        statusText.textContent = "Done";
    } else if (status == "3") {
        statusText.textContent = "Standby";
    }
}

/*
<div class="order">
    <div class="order-id">
        <h3 style="margin-left: 20px;">
            Commission ID
        </h3>
    </div>
    <div class="tasks">
        <div description="" class="task" id="task">
            <h3 class="task-name">
                Task Name
            </h3>
            <div class="task-status" value="0">
                <h3></h3>
            </div>
            <h3 class="task-date">
                <span class="date">
                    YYYY/MM/DD
                </span>
            </h3>
        </div>
    </div>
</div>
*/