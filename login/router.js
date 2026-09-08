/**
 * ==========================================================
 * Hospired Router
 * Simple application navigation manager
 * ==========================================================
 */

class HospiredRouter {

    constructor() {

        this.routes =
            HOSPIRED_CONFIG.ROUTES;
    }


    // ------------------------------------------------------
    // Basic navigation
    // ------------------------------------------------------

    go(route) {

        if (!route) {

            console.warn(
                "Router: empty route."
            );

            return false;
        }

        window.location.href =
            route;

        return true;
    }


    // ------------------------------------------------------
    // Login
    // ------------------------------------------------------

    goLogin() {

        return this.go(
            this.routes.LOGIN
        );
    }


    // ------------------------------------------------------
    // Home
    // ------------------------------------------------------

    goHome() {

        if (
            typeof HospiredSession === "undefined"
        ) {

            console.error(
                "HospiredSession is not available."
            );

            return this.goLogin();
        }

        const user =
            HospiredSession.get();

        if (!user) {

            return this.goLogin();
        }


        if (
            user.type ===
            HOSPIRED_CONFIG.USER_TYPES.PATIENT
        ) {

            return this.go(
                this.routes.PATIENT_DASHBOARD
            );
        }


        if (
            user.type ===
            HOSPIRED_CONFIG.USER_TYPES.INSTITUTION
        ) {

            return this.go(
                this.routes.INSTITUTION_DASHBOARD
            );
        }


        console.warn(
            "Router: unknown user type."
        );

        HospiredSession.clear();

        return this.goLogin();
    }


    // ------------------------------------------------------
    // Profile
    // ------------------------------------------------------

    goProfile() {

        return this.go(
            this.routes.PROFILE
        );
    }


    // ------------------------------------------------------
    // Support
    // ------------------------------------------------------

    goSupport() {

        return this.go(
            this.routes.SUPPORT
        );
    }


    // ------------------------------------------------------
    // Patient dashboard
    // ------------------------------------------------------

    goPatientDashboard() {

        if (
            typeof HospiredSession !== "undefined" &&
            !HospiredSession.isPatient()
        ) {

            console.warn(
                "Router: current user is not a patient."
            );

            return this.goHome();
        }

        return this.go(
            this.routes.PATIENT_DASHBOARD
        );
    }


    // ------------------------------------------------------
    // Institution dashboard
    // ------------------------------------------------------

    goInstitutionDashboard() {

        if (
            typeof HospiredSession !== "undefined" &&
            !HospiredSession.isInstitution()
        ) {

            console.warn(
                "Router: current user is not an institution."
            );

            return this.goHome();
        }

        return this.go(
            this.routes.INSTITUTION_DASHBOARD
        );
    }


    // ------------------------------------------------------
    // Logout
    // ------------------------------------------------------

    logout() {

        if (
            typeof HospiredSession !== "undefined"
        ) {

            HospiredSession.clear();
        }

        return this.goLogin();
    }


    // ------------------------------------------------------
    // Browser navigation
    // ------------------------------------------------------

    reload() {

        window.location.reload();

        return true;
    }


    back() {

        window.history.back();

        return true;
    }


    forward() {

        window.history.forward();

        return true;
    }
}


/**
 * ==========================================================
 * Global instance
 * ==========================================================
 */

window.HospiredRouter =
    new HospiredRouter();