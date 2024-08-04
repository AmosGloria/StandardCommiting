document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  const dateInput = document.getElementById("date");
  const categoryInput = document.getElementById("category");
  const amountInput = document.getElementById("amount");

  // Function to get query parameters from URL
  function getQueryParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const queryArray = queryString.split("&");
    queryArray.forEach((param) => {
      const [key, value] = param.split("=");
      params[key] = decodeURIComponent(value);
    });
    return params;
  }

  // Get expense ID from URL
  const { id } = getQueryParams();
  const token = localStorage.getItem("token");

  // Function to fetch expense details
  async function fetchExpenseDetails() {
    try {
      const response = await fetch(`http://localhost:3000/api/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const expense = await response.json();
        populateForm(expense);
      } else {
        console.error("Error fetching expense details:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching expense details:", error);
    }
  }

  // Function to populate form with expense details
  function populateForm(expense) {

    const date = new Date(expense.date).toISOString().split('T')[0];

    dateInput.value = date;
    categoryInput.value = expense.category;
    amountInput.value = expense.amount;
  }

  // Function to update expense details
  async function updateExpense(event) {
    event.preventDefault();
    const updatedExpense = {
      date: dateInput.value,
      category: categoryInput.value,
      amount: parseFloat(amountInput.value),
    };

    try {
      const response = await fetch(`http://localhost:3000/api/expenses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedExpense),
      });

      if (response.ok) {
        window.location.href = "view_expense.html";
      } else {
        console.error("Error updating expense:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  }

  // Fetch expense details when the page loads
  fetchExpenseDetails();

  // Add event listener to form for updating expense
  form.addEventListener("submit", updateExpense);
});
