document.addEventListener('DOMContentLoaded', function () {
    const expenseId = 'expenseTableBody'; 
    const token = localStorage.getItem("token");

    displayChart(expenseId);

    const form = document.getElementById('expenseTableBody');
    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        const data = {
            amount: formData.get('amount'),
            date: formData.get('date'),
            category: formData.get('category')
        };

        try {
            await fetch('/api/expenses/:id', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(data)
            });

            displayChart(expenseId);
        } catch (error) {
            console.error('Error submitting expense:', error);
        }
    });
});

let chart; // Global variable to hold the chart instance

async function fetchExpenseData() {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch('http://localhost:3000/api/expenses', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        // console.log('Fetched data:', data); // Log the data 
        return data;
    } 
    catch (error) {
        console.error('Error fetching expense data:', error);
        return []; // Return an empty array
    }
}

function processExpenseData(data) {
    const categoryTotals = data.reduce((acc, expense) => {
        if (!acc[expense.category]) {
            acc[expense.category] = 0;
        }
        acc[expense.category] += parseFloat(expense.amount);
        return acc;
    }, {});
    
    const labels = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);
    
    return { labels, amounts };
}

function generateColors(numColors) {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
        colors.push(`hsl(${Math.random() * 360}, 70%, 70%)`);
    }
    return colors;
}

async function displayChart(expenseId) {
    const data = await fetchExpenseData(expenseId);
    const { labels, amounts } = processExpenseData(data);
    
    // Generate unique colors for each category
    const backgroundColors = generateColors(labels.length);

    const ctx = document.getElementById('myChart').getContext('2d');

    if (chart) {
        chart.data.labels = labels;
        chart.data.datasets[0].data = amounts;
        chart.data.datasets[0].backgroundColor = backgroundColors;
        chart.update();
    } else {
        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Expense Amount',
                    data: amounts,
                    backgroundColor: backgroundColors,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}