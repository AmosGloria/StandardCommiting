document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");
    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = new FormData(form);

            const username = formData.get("username");
            const email = formData.get("email");
            const password = formData.get("password");
            const authMsg = document.getElementById("auth-msg");

            try {
                const response = await fetch("http://localhost:3000/api/users/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, username, password }),
                });
                const data = await response.json();
                
                if (!response.ok) {
                    authMsg.textContent = "User already exists!";
                } else {
                    authMsg.textContent = "User created successfully";
                    setTimeout(() => {
                        window.location.href = "./login.html"; 
                    }, 500); 
                }
            } catch (err) {
                authMsg.textContent = "An error occurred";
                console.error("An error occurred:", err);  
            }
        });
    } else {
        console.error("Form element not found in the DOM.");
    }
});
