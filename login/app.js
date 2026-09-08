/**
 * ==========================================================
 * Hospired Application
 * Main application controller
 * ==========================================================
 */

class HospiredApp {

    constructor() {

        this.initialized =
            false;

        this.initializing =
            false;

        this.promise =
            null;
    }


    // ------------------------------------------------------
    // Initialize application
    // ------------------------------------------------------

    async initialize() {

        if (this.initialized) {

            return true;
        }


        if (this.initializing) {

            return this.promise;
        }


        this.initializing =
            true;


        console.log(
            "================================"
        );

        console.log(
            "Initializing Hospired..."
        );

        console.log(
            "================================"
        );


        this.promise =
            this.start();


        try {

            await this.promise;


            this.initialized =
                true;


            console.log(
                "Hospired started successfully."
            );


            return true;

        } catch (error) {

            console.error(
                "Initialization Error:",
                error
            );


            this.initialized =
                false;


            return false;

        } finally {

            this.initializing =
                false;

            this.promise =
                null;
        }
    }


    // ------------------------------------------------------
    // Application startup
    // ------------------------------------------------------

    async start() {

        if (
            typeof HospiredBootstrap ===
            "undefined"
        ) {

            throw new Error(
                "HospiredBootstrap is not available."
            );
        }


        await HospiredBootstrap.initialize();


        this.showWelcomeMessage();


        return true;
    }


    // ------------------------------------------------------
    // Language
    // ------------------------------------------------------

    initializeLanguage() {

        if (
            typeof HospiredLanguage ===
            "undefined"
        ) {

            return;
        }


        if (
            typeof HospiredLanguage.currentLanguage ===
            "function"
        ) {

            const language =
                HospiredLanguage.currentLanguage();


            if (
                document.documentElement
            ) {

                document.documentElement.lang =
                    language;
            }
        }


        if (
            typeof HospiredLanguage.translate ===
            "function"
        ) {

            HospiredLanguage.translate();
        }
    }


    // ------------------------------------------------------
    // Accessibility
    // ------------------------------------------------------

    initializeAccessibility() {

        if (
            typeof HospiredBootstrap ===
            "undefined"
        ) {

            return;
        }


        if (
            typeof HospiredBootstrap.initializeAccessibility ===
            "function"
        ) {

            HospiredBootstrap.initializeAccessibility();
        }
    }


    // ------------------------------------------------------
    // Welcome message
    // ------------------------------------------------------

    showWelcomeMessage() {

        if (
            typeof HOSPIRED_CONFIG ===
            "undefined"
        ) {

            console.log(
                "Hospired started."
            );

            return;
        }


        const app =
            HOSPIRED_CONFIG.APP;


        if (!app) {

            console.log(
                "Hospired started."
            );

            return;
        }


        console.log(
            `${app.name} v${app.version}`
        );
    }


    // ------------------------------------------------------
    // Application status
    // ------------------------------------------------------

    isInitialized() {

        return this.initialized;
    }


    // ------------------------------------------------------
    // Restart application
    // ------------------------------------------------------

    async restart() {

        this.initialized =
            false;


        this.initializing =
            false;


        this.promise =
            null;


        return await this.initialize();
    }
}


/**
 * ==========================================================
 * Global application instance
 * ==========================================================
 */

window.HospiredApp =
    new HospiredApp();


/**
 * ==========================================================
 * Automatic startup
 * ==========================================================
 */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await HospiredApp.initialize();

    }
);