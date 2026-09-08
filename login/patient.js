document.addEventListener("DOMContentLoaded", () => {

    const user = HospiredSession.get();

    if (!user) {

        location.href = "login.html";

        return;

    }

    document.getElementById("welcomeUser").textContent =
        `Welcome, ${user.fullName}`;

});