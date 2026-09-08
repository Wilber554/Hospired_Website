/**
 * ==========================================================
 * Hospired Configuration
 * Central configuration file
 * ==========================================================
 */

const HOSPIRED_CONFIG = {

    APP: {
        name: "Hospired",
        version: "1.0.0",
        author: "Hospired Team"
    },

    ROUTES: {

        LOGIN: "login.html",

        PATIENT_DASHBOARD: "patient/dashboard.html",

        INSTITUTION_DASHBOARD: "institution/dashboard.html",

        PROFILE: "profile.html",

        SETTINGS: "settings.html",

        SUPPORT: "help.html",

        TERMS: "terms.html",

        PRIVACY: "privacy.html"

    },

    DATABASE: {

    NAME: "HospiredDB",

    VERSION: 1,

    STORES: {

        PATIENTS: "patients",

        INSTITUTIONS: "institutions",

        APPOINTMENTS: "appointments",

        MEDICAL_RECORDS: "medical_records",

        NOTIFICATIONS: "notifications",

        SETTINGS: "settings",

        LOGS: "logs",

        AUDIT: "audit"

    }

    },

    STORAGE: {

        SESSION: "HospiredSession",

        LANGUAGE: "HospiredLanguage",

        ACCESSIBILITY: "HospiredAccessibility"

    },

    USER_TYPES: {

        PATIENT: "patient",

        INSTITUTION: "institution"

    },

    LANGUAGES: {

        DEFAULT: "en",

        AVAILABLE: [

            "en",

            "es"

        ]

    },

    ACCESSIBILITY: {

        highContrast: false,

        motorMode: false,

        largeText: false,

        largeIcons: false,

        dyslexiaFont: false,

        screenReader: false,

        animations: true,

        colorBlindMode: "none"

    },

    VALIDATION: {

        PASSWORD_MIN_LENGTH: 8,

        PHONE_LENGTH: 8,

        NAME_MIN_LENGTH: 3

    },

    NOTIFICATIONS: {

        DURATION: 4000

    }

};

Object.freeze(HOSPIRED_CONFIG);

window.HOSPIRED_CONFIG = HOSPIRED_CONFIG;