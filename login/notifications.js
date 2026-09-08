/**
 * ==========================================================
 * Hospired Notifications
 * Accessible notification manager
 * ==========================================================
 */

class HospiredNotifications {

    constructor() {

        this.notification =
            document.getElementById(
                "notification"
            );

        this.title =
            document.getElementById(
                "notificationTitle"
            );

        this.message =
            document.getElementById(
                "notificationMessage"
            );

        this.icon =
            document.getElementById(
                "notificationIcon"
            );

        this.timeout = null;

        this.initializeAccessibility();
    }


    // ------------------------------------------------------
    // Accessibility
    // ------------------------------------------------------

    initializeAccessibility() {

        if (!this.notification) {
            return;
        }

        this.notification.setAttribute(
            "role",
            "status"
        );

        this.notification.setAttribute(
            "aria-live",
            "polite"
        );

        this.notification.setAttribute(
            "aria-atomic",
            "true"
        );
    }


    // ------------------------------------------------------
    // Show notification
    // ------------------------------------------------------

    show(
        title,
        message,
        type = "info"
    ) {

        if (!this.notification) {
            return;
        }


        if (this.timeout) {

            clearTimeout(
                this.timeout
            );

            this.timeout = null;
        }


        if (this.title) {

            this.title.textContent =
                title || "";
        }


        if (this.message) {

            this.message.textContent =
                message || "";
        }


        this.setType(
            type
        );


        this.notification.classList.remove(
            "hidden"
        );


        this.animate();


        this.timeout =
            setTimeout(
                () => {

                    this.hide();

                },
                5000
            );
    }


    // ------------------------------------------------------
    // Notification type
    // ------------------------------------------------------

    setType(type) {

        if (!this.notification) {
            return;
        }


        if (this.icon) {

            this.icon.innerHTML = "";
        }


        switch (type) {

            case "success":

                this.notification.style.borderLeftColor =
                    "#16a34a";

                if (this.icon) {

                    this.icon.style.background =
                        "#dcfce7";

                    this.icon.style.color =
                        "#16a34a";

                    this.icon.innerHTML =
                        '<i class="fa-solid fa-circle-check" aria-hidden="true"></i>';
                }

                break;


            case "error":

                this.notification.style.borderLeftColor =
                    "#dc2626";

                if (this.icon) {

                    this.icon.style.background =
                        "#fee2e2";

                    this.icon.style.color =
                        "#dc2626";

                    this.icon.innerHTML =
                        '<i class="fa-solid fa-circle-xmark" aria-hidden="true"></i>';
                }

                break;


            case "warning":

                this.notification.style.borderLeftColor =
                    "#f59e0b";

                if (this.icon) {

                    this.icon.style.background =
                        "#fef3c7";

                    this.icon.style.color =
                        "#f59e0b";

                    this.icon.innerHTML =
                        '<i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>';
                }

                break;


            case "info":

            default:

                this.notification.style.borderLeftColor =
                    "#00A79D";

                if (this.icon) {

                    this.icon.style.background =
                        "#dff8f7";

                    this.icon.style.color =
                        "#00A79D";

                    this.icon.innerHTML =
                        '<i class="fa-solid fa-circle-info" aria-hidden="true"></i>';
                }

                break;
        }
    }


    // ------------------------------------------------------
    // Animation
    // ------------------------------------------------------

    animate() {

        if (
            !this.notification ||
            typeof this.notification.animate !==
                "function"
        ) {
            return;
        }


        this.notification.animate(

            [
                {
                    opacity: 0,

                    transform:
                        "translateY(-15px)"
                },

                {
                    opacity: 1,

                    transform:
                        "translateY(0)"
                }

            ],

            {
                duration: 350,

                easing: "ease",

                fill: "forwards"
            }
        );
    }


    // ------------------------------------------------------
    // Hide notification
    // ------------------------------------------------------

    hide() {

        if (!this.notification) {
            return;
        }


        if (this.timeout) {

            clearTimeout(
                this.timeout
            );

            this.timeout = null;
        }


        this.notification.classList.add(
            "hidden"
        );
    }
}


/**
 * ==========================================================
 * Global instance
 * ==========================================================
 */

window.HospiredNotifications =
    new HospiredNotifications();