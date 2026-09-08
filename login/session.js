/**
 * ==========================================================
 * Hospired Session
 * Client-side session manager
 * ==========================================================
 */

class HospiredSession {

    constructor() {

        this.storageKey =
            "HospiredSession";

        this.currentUser =
            null;
    }


    // ------------------------------------------------------
    // Initialization
    // ------------------------------------------------------

    async initialize() {

        const savedSession =
            localStorage.getItem(
                this.storageKey
            );

        if (!savedSession) {

            this.currentUser =
                null;

            return null;
        }

        try {

            this.currentUser =
                JSON.parse(savedSession);

            console.log(
                "Previous session restored."
            );

            return this.currentUser;

        } catch (error) {

            console.warn(
                "Invalid saved session. Clearing session."
            );

            this.clear();

            return null;
        }
    }


    // ------------------------------------------------------
    // Login
    // ------------------------------------------------------

    async login(user) {

        if (
            !user ||
            typeof user !== "object"
        ) {

            throw new Error(
                "A valid user is required."
            );
        }

        this.save(user);

        return true;
    }


    // ------------------------------------------------------
    // Logout
    // ------------------------------------------------------

    logout() {

        this.clear();

        if (
            typeof HOSPIRED_CONFIG !== "undefined" &&
            HOSPIRED_CONFIG.ROUTES &&
            HOSPIRED_CONFIG.ROUTES.LOGIN
        ) {

            window.location.href =
                HOSPIRED_CONFIG.ROUTES.LOGIN;
        }
    }


    // ------------------------------------------------------
    // Save session
    // ------------------------------------------------------

    save(user) {

        if (
            !user ||
            typeof user !== "object"
        ) {

            throw new Error(
                "Cannot save an invalid user."
            );
        }

        this.currentUser =
            user;

        localStorage.setItem(
            this.storageKey,
            JSON.stringify(user)
        );

        return user;
    }


    // ------------------------------------------------------
    // Get session
    // ------------------------------------------------------

    get() {

        const session =
            localStorage.getItem(
                this.storageKey
            );

        if (!session) {

            this.currentUser =
                null;

            return null;
        }

        try {

            this.currentUser =
                JSON.parse(session);

            return this.currentUser;

        } catch (error) {

            console.warn(
                "Invalid session data."
            );

            this.clear();

            return null;
        }
    }


    // ------------------------------------------------------
    // Get user
    // ------------------------------------------------------

    getUser() {

        return this.get();
    }


    // ------------------------------------------------------
    // Session state
    // ------------------------------------------------------

    exists() {

        return this.get() !== null;
    }


    isLoggedIn() {

        return this.exists();
    }


    // ------------------------------------------------------
    // Clear session
    // ------------------------------------------------------

    clear() {

        this.currentUser =
            null;

        localStorage.removeItem(
            this.storageKey
        );
    }


    // ------------------------------------------------------
    // User information
    // ------------------------------------------------------

    getUserId() {

        const user =
            this.get();

        return user
            ? user.id
            : null;
    }


    getUserUUID() {

        const user =
            this.get();

        return user
            ? user.uuid
            : null;
    }


    getUserType() {

        const user =
            this.get();

        return user
            ? user.type
            : null;
    }


    // ------------------------------------------------------
    // User type
    // ------------------------------------------------------

    isPatient() {

        if (
            typeof HOSPIRED_CONFIG === "undefined" ||
            !HOSPIRED_CONFIG.USER_TYPES
        ) {

            return false;
        }

        return (
            this.getUserType() ===
            HOSPIRED_CONFIG.USER_TYPES.PATIENT
        );
    }


    isInstitution() {

        if (
            typeof HOSPIRED_CONFIG === "undefined" ||
            !HOSPIRED_CONFIG.USER_TYPES
        ) {

            return false;
        }

        return (
            this.getUserType() ===
            HOSPIRED_CONFIG.USER_TYPES.INSTITUTION
        );
    }


    // ------------------------------------------------------
    // Update current user
    // ------------------------------------------------------

    updateUser(data) {

        if (
            !data ||
            typeof data !== "object"
        ) {

            return null;
        }

        const user =
            this.get();

        if (!user) {

            return null;
        }

        return this.save({
            ...user,
            ...data
        });
    }


    // ------------------------------------------------------
    // Require login
    // ------------------------------------------------------

    requireLogin() {

        if (
            this.isLoggedIn()
        ) {

            return true;
        }

        if (
            typeof HospiredRouter !== "undefined" &&
            typeof HospiredRouter.goLogin === "function"
        ) {

            HospiredRouter.goLogin();
        }

        return false;
    }
}


/**
 * ==========================================================
 * Global instance
 * ==========================================================
 */

window.HospiredSession =
    new HospiredSession();