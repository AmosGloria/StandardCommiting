document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = new FormData(form);

            const email = formData.get("email");
            const password = formData.get("password");

            try {
                const response = await fetch(`http://localhost:3000/api/users/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Save the token and redirect to the dashboard or main page
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("userId", data.userId)
                    window.location.href = "./index.html"; 
                } else {
                    alert(data.message || "Login failed, please try again.");
                }
            } catch (err) {
                console.error("An error occurred:", err);
                alert("An error occurred, please try again.");
            }
        });
    } else {
        console.error("Form element not found in the DOM.");
    }
});
