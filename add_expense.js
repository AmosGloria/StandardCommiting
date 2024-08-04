document.addEventListener("DOMContentLoaded", () => {
    const transactionForm = document.getElementById("transactionForm");
    const transactionList = document.getElementById("transactionList");
    const balanceSpan = document.getElementById("balance");
    const incomeSpan = document.getElementById("income");
    const expenseSpan = document.getElementById("expense");
    const statusDiv = document.getElementById("status");

    let transactions = [];

    const token = localStorage.getItem("token");

    transactionForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        const formData = new FormData(transactionForm);
        // const type = formData.get("type");
        const category = formData.get("category");
        const amount = parseFloat(formData.get("amount"));
        const date = formData.get("date");

        if (category && amount && date) {
            const transaction = { category, amount, date };
            transactions.push(transaction);
            // displayTransaction(transaction);
            try {
                const response = await fetch(`http://localhost:3000/api/expenses`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json", 
                        Authorization: `Bearer ${token}` 
                    }, //The authorization should be added to the headers
                    body: JSON.stringify(transaction),
                });

                const data = await response.json();
            } catch (error) {
                console.log(error);
            }
            // updateBalance();
            statusDiv.textContent = "Transaction added successfully!";
            // console.log(transaction)
        } else {
            statusDiv.textContent = "Please fill in all fields.";
        }
    });

    // function updateBalance() {
    //     let balance = 0;
    //     let income = 0;
    //     let expense = 0;

    //     // transactions.forEach((transaction) => {
    //     //     if (transaction.type === "income") {
    //     //         income += transaction.amount;
    //     //         balance += transaction.amount;
    //     //     } else {
    //     //         expense += transaction.amount;
    //     //         balance -= transaction.amount;
    //     //     }
    //     // });

    //     balanceSpan.textContent = `$${balance.toFixed(2)}`;
    //     incomeSpan.textContent = `$${income.toFixed(2)}`;
    //     expenseSpan.textContent = `$${expense.toFixed(2)}`;
    // }
});
