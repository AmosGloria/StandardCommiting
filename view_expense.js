

document.addEventListener("DOMContentLoaded", () => {
  const expenseTableBody = document.getElementById("expenseTableBody");

  // Function to fetch expenses from the server
  async function fetchExpenses() {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/api/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const expenses = await response.json();
      populateTable(expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  }

  // Function to populate the table with expenses
  function populateTable(expenses) {
    expenseTableBody.innerHTML = "";

    expenses.forEach((expense) => {
      const row = document.createElement("tr");

      const dateCell = document.createElement("td");
      dateCell.textContent = expense.date.split('T')[0];
      row.appendChild(dateCell);

      const categoryCell = document.createElement("td");
      categoryCell.textContent = expense.category;
      row.appendChild(categoryCell);

      const amountCell = document.createElement("td");
      amountCell.textContent = `$${expense.amount}`;
      row.appendChild(amountCell);

      const actionCell = document.createElement("td");

      const editButton = document.createElement("a");
      editButton.href = `edit_expense.html?id=${expense.id}`;
      editButton.textContent = "Edit";
      editButton.className = "edit-button"; 
      actionCell.appendChild(editButton);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "delete-button"; 
      deleteButton.addEventListener("click", () => deleteExpense(expense.id));
      actionCell.appendChild(deleteButton);

      row.appendChild(actionCell);

      expenseTableBody.appendChild(row);
    });
  }

  // Function to delete an expense
  async function deleteExpense(id) {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:3000/api/expenses/${id}`, {
        method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
      });

      if (response.ok) {
        fetchExpenses();
      } else {
        console.error("Error deleting expense:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  }

  

  // Fetch expenses when the page loads
  fetchExpenses();
});
