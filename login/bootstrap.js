/**
 * ==========================================================
 * Hospired Bootstrap
 * Central application initialization
 * ==========================================================
 */

class HospiredBootstrap {

    constructor() {

        this.initialized =
            false;

        this.initializing =
            false;

        this.promise =
            null;
    }


    // ------------------------------------------------------
    // Main initialization
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


        this.promise =
            this.start();


        try {

            await this.promise;

            this.initialized =
                true;

            return true;

        } catch (error) {

            this.initialized =
                false;

            console.error(
                "Hospired Bootstrap Error:",
                error
            );

            throw error;

        } finally {

            this.initializing =
                false;

            this.promise =
                null;
        }
    }


    // ------------------------------------------------------
    // Startup sequence
    // ------------------------------------------------------

    async start() {

        this.validateDependencies();


        await this.initializeStorage();


        await this.initializeDatabase();


        await this.initializeAPI();


        await this.initializeSession();


        this.initializeLanguage();


        this.initializeAccessibility();


        return true;
    }


    // ------------------------------------------------------
    // Dependency validation
    // ------------------------------------------------------

    validateDependencies() {

        const dependencies = [

            {
                name: "HOSPIRED_CONFIG",
                value:
                    typeof HOSPIRED_CONFIG !==
                    "undefined"
            },

            {
                name: "HospiredUtils",
                value:
                    typeof HospiredUtils !==
                    "undefined"
            },

            {
                name: "HospiredStorage",
                value:
                    typeof HospiredStorage !==
                    "undefined"
            },

            {
                name: "HospiredDatabase",
                value:
                    typeof HospiredDatabase !==
                    "undefined"
            },

            {
                name: "HospiredAPI",
                value:
                    typeof HospiredAPI !==
                    "undefined"
            },

            {
                name: "HospiredSession",
                value:
                    typeof HospiredSession !==
                    "undefined"
            },

            {
                name: "HospiredRouter",
                value:
                    typeof HospiredRouter !==
                    "undefined"
            }

        ];


        const missing =
            dependencies
                .filter(
                    dependency =>
                        !dependency.value
                )
                .map(
                    dependency =>
                        dependency.name
                );


        if (missing.length > 0) {

            throw new Error(
                "Hospired Bootstrap is missing dependencies: " +
                missing.join(", ")
            );
        }
    }


    // ------------------------------------------------------
    // Storage
    // ------------------------------------------------------

    async initializeStorage() {

        if (
            typeof HospiredStorage.initialize !==
            "function"
        ) {

            throw new Error(
                "HospiredStorage.initialize() is not available."
            );
        }


        await HospiredStorage.initialize();
    }


    // ------------------------------------------------------
    // Database
    // ------------------------------------------------------

    async initializeDatabase() {

        if (
            typeof HospiredDatabase.connect !==
            "function"
        ) {

            throw new Error(
                "HospiredDatabase.connect() is not available."
            );
        }


        await HospiredDatabase.connect();


        if (
            !HospiredDatabase.isConnected
        ) {

            throw new Error(
                "HospiredDatabase could not be connected."
            );
        }
    }


    // ------------------------------------------------------
    // API
    // ------------------------------------------------------

    async initializeAPI() {

        if (
            typeof HospiredAPI.initialize !==
            "function"
        ) {

            return;
        }


        await HospiredAPI.initialize();
    }


    // ------------------------------------------------------
    // Session
    // ------------------------------------------------------

    async initializeSession() {

        if (
            typeof HospiredSession.initialize !==
            "function"
        ) {

            return;
        }


        await HospiredSession.initialize();
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
            typeof HospiredLanguage.currentLanguage !==
            "function"
        ) {

            return;
        }


        const language =
            HospiredLanguage.currentLanguage();


        if (
            document.documentElement
        ) {

            document.documentElement.lang =
                language;
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

        const storageKey =
            "HospiredAccessibility";


        let settings = null;


        try {

            const saved =
                localStorage.getItem(
                    storageKey
                );


            if (saved) {

                settings =
                    JSON.parse(saved);
            }

        } catch (error) {

            console.warn(
                "Hospired Accessibility settings could not be restored.",
                error
            );
        }


        if (!settings) {

            settings = {

                language: "en",

                fontSize: "normal",

                highContrast: false,

                largeIcons: false,

                motorMode: false,

                screenReader: false,

                colorBlind: "normal"
            };
        }


        this.applyAccessibility(
            settings
        );
    }


    applyAccessibility(
        settings
    ) {

        if (
            !document.body ||
            !settings
        ) {

            return;
        }


        const classes = [

            "large-text",

            "large-icons",

            "high-contrast",

            "motor-mode",

            "protanopia",

            "deuteranopia",

            "tritanopia"

        ];


        document.body.classList.remove(
            ...classes
        );


        if (
            settings.fontSize ===
            "large"
        ) {

            document.body.classList.add(
                "large-text"
            );
        }


        if (
            settings.largeIcons
        ) {

            document.body.classList.add(
                "large-icons"
            );
        }


        if (
            settings.highContrast
        ) {

            document.body.classList.add(
                "high-contrast"
            );
        }


        if (
            settings.motorMode
        ) {

            document.body.classList.add(
                "motor-mode"
            );
        }


        if (
            settings.colorBlind ===
            "protanopia"
        ) {

            document.body.classList.add(
                "protanopia"
            );
        }


        if (
            settings.colorBlind ===
            "deuteranopia"
        ) {

            document.body.classList.add(
                "deuteranopia"
            );
        }


        if (
            settings.colorBlind ===
            "tritanopia"
        ) {

            document.body.classList.add(
                "tritanopia"
            );
        }
    }


    // ------------------------------------------------------
    // Status
    // ------------------------------------------------------

    isInitialized() {

        return this.initialized;
    }


    // ------------------------------------------------------
    // Restart
    // ------------------------------------------------------

    async restart() {

        this.initialized =
            false;

        return await this.initialize();
    }
}


/**
 * ==========================================================
 * Global instance
 * ==========================================================
 */

window.HospiredBootstrap =
    new HospiredBootstrap();