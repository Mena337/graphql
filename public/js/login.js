document.querySelector('button').addEventListener('click', async function() {
    try {
        console.log("buttonn is presed")
        const userName = document.getElementById("userName").value;
        const pas = document.getElementById("password").value;

        const enco = btoa(`${userName}:${pas}`);
        const api = "https://learn.reboot01.com/api/auth/signin";

        const data = {
            key1: "value1",
            key2: "value2"
        };

        const response = await fetch(api, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${enco}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        console.log("jgdyjh")

        const token = await response.json(); // Get the response as a text (JWT token)
        console.log("JWT Token:", token);
        localStorage.setItem('jwtToken', token);
        window.location.href = "index.html";

    } catch (error) {
        console.error("Error:", error.message);
        alert(error.message); // Display error message to the user
    }
});
