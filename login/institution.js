document.addEventListener("DOMContentLoaded", () => {

    const institution = HospiredSession.get();

    if (!institution) {

        location.href = "login.html";

        return;

    }

    document.getElementById("welcomeInstitution").textContent =
        `Welcome, ${institution.name}`;

});