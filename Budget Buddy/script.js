let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let budget = Number(localStorage.getItem("budget")) || 0;
let currentMonth = new Date().getMonth();
let savedMonth = localStorage.getItem("month");

if (savedMonth === null) {
    localStorage.setItem("month", currentMonth);
} else if (Number(savedMonth) !== currentMonth) {
    localStorage.clear();
    localStorage.setItem("month", currentMonth);
}

function addExpense() {
    let amountInput = document.getElementById("amount");
    let categoryInput = document.getElementById("category");

    let amount = amountInput.value;
    let category = categoryInput.value;

    if (amount === "" || category === "") {
        alert("Please fill all fields");
        return;
    }

    let expense = {
        amount: Number(amount),
        category: category
    };

    expenses.push(expense);

    localStorage.setItem("expenses", JSON.stringify(expenses));

    amountInput.value = "";
    categoryInput.value = "";

    updateDashboard();
}

function updateDashboard() {
    budget = Number(localStorage.getItem("budget")) || 0;
    let total = expenses.reduce((sum, e) => sum + e.amount, 0);
    document.getElementById("total").innerText = "₹" + total;
    let remaining = budget - total;
    let goal = Number(localStorage.getItem("goal")) || 0;

    if (goal > 0) {
        document.getElementById("goalAmount").innerText = "₹" + goal;
        document.getElementById("savedAmount").innerText = "₹" + remaining;

        let goalPercent = remaining > 0 ? ((remaining / goal) * 100).toFixed(1) : 0;
        document.getElementById("goalProgress").innerText = goalPercent + "%";
    }
    let percentage = budget > 0 ? ((total / budget) * 100).toFixed(1) : 0;

    let remainingElement = document.getElementById("remaining");

    if (remaining < 0) {
        remainingElement.innerText = `Overused by ₹${Math.abs(remaining)}`;
        remainingElement.style.color = "red";
    } else {
         remainingElement.innerText = "₹" + remaining;
         remainingElement.style.color = "# 3e2f25"; // normal brown color
    }

    document.getElementById("percentage").innerText = percentage + "%";


    if (percentage >= 80) {
    alert("Warning: You have used more than 80% of your budget!");
    }

    let categories = {};

    expenses.forEach(e => {
        if (categories[e.category]) {
            categories[e.category] += e.amount;
        } else {
            categories[e.category] = e.amount;
        }
    });

    // AI Insight Logic
let insightText = "Spending is balanced.";

if (expenses.length > 0) {
    let highestCategory = "";
    let highestAmount = 0;

    for (let key in categories) {
        if (categories[key] > highestAmount) {
            highestAmount = categories[key];
            highestCategory = key;
        }
    }

    let categoryPercent = ((highestAmount / total) * 100).toFixed(1);

    if (remaining < 0) {
    insightText = "You have exceeded your budget. Immediate adjustment recommended.";
}
else if (budget > 0 && percentage >= 80) {
    insightText = "You are close to exceeding your budget. Consider reducing expenses.";
}
else {
    insightText = `Highest spending is on ${highestCategory} (${categoryPercent}%). Consider optimizing this category.`;
}
}

document.getElementById("insight").innerText = insightText;

   

let ctx = document.getElementById("expenseChart").getContext("2d");

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: [
                    "#8b6f57",
                    "#b08968",
                    "#ddb892",
                    "#7f5539",
                    "#a98467"
                ]
            }]
        }
    });
    let historyList = document.getElementById("historyList");
    historyList.innerHTML = "";

    expenses.forEach((e, index) => {
        let li = document.createElement("li");
        li.innerHTML = `₹${e.amount} - ${e.category} 
        <button onclick="deleteExpense(${index})">❌</button>`;
        historyList.appendChild(li);
    });
}
function deleteExpense(index) {
    expenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    updateDashboard();
}

updateDashboard();

function resetExpenses() {
    localStorage.removeItem("expenses");
    localStorage.removeItem("budget");
    localStorage.removeItem("goal");

    expenses = [];
    budget = 0;

    document.getElementById("total").innerText = "₹0";
    document.getElementById("remaining").innerText = "₹0";
    document.getElementById("percentage").innerText = "0%";
    document.getElementById("goalAmount").innerText = "Not Set";
    document.getElementById("savedAmount").innerText = "₹0";
    document.getElementById("goalProgress").innerText = "0%";
    document.getElementById("insight").innerText = "No insights yet.";

    if (window.myChart) {
        window.myChart.destroy();
    }

    updateDashboard();
}

function setBudget() {
    let input = document.getElementById("budgetInput").value;

    if (input === "") {
        alert("Enter budget amount");
        return;
    }

    budget = Number(input);
    localStorage.setItem("budget", budget);
    updateDashboard();
}
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}
function toggleMenu() {
    document.getElementById("sideMenu").classList.toggle("active");
}
function setGoal() {
    let goal = prompt("Enter your savings goal:");

    if (!goal || isNaN(goal)) {
        alert("Enter valid number");
        return;
    }

    localStorage.setItem("goal", goal);
    updateDashboard();
}