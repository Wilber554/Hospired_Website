/**
 * ==========================================================
 * Hospired Utilities
 * Shared utility methods for the entire application
 * ==========================================================
 */

class HospiredUtils {

    /* ======================================================
       VALIDATIONS
    ====================================================== */

    isEmpty(value) {

        return value === undefined ||
               value === null ||
               String(value).trim() === "";

    }

    isEmail(email) {

        if (this.isEmpty(email)) return false;

        const regex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return regex.test(email);

    }

    isPassword(password) {

        if (this.isEmpty(password))
            return false;

        return password.length >=
            HOSPIRED_CONFIG.VALIDATION.PASSWORD_MIN_LENGTH;

    }

    isPhone(phone) {

        if (this.isEmpty(phone))
            return false;

        return /^[0-9]+$/.test(phone);

    }

    /* ======================================================
       TEXT
    ====================================================== */

    capitalize(text) {

        if (this.isEmpty(text))
            return "";

        return text
            .toLowerCase()
            .replace(/\b\w/g, letter =>
                letter.toUpperCase());

    }

    normalize(text) {

        if (this.isEmpty(text))
            return "";

        return text
            .trim()
            .toLowerCase();

    }

    /* ======================================================
       UUID
    ====================================================== */

    generateUUID() {

        if (window.crypto &&
            crypto.randomUUID) {

            return crypto.randomUUID();

        }

        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
            .replace(/[xy]/g, function (c) {

                const r =
                    Math.random() * 16 | 0;

                const v =
                    c === "x"
                        ? r
                        : (r & 0x3 | 0x8);

                return v.toString(16);

            });

    }

    /* ======================================================
       DATES
    ====================================================== */

    generateDate() {

        return new Date().toISOString();

    }

    formatDate(date) {

        return new Date(date)
            .toLocaleDateString();

    }

    /* ======================================================
       FILES
    ====================================================== */

    getFileExtension(fileName) {

        if (this.isEmpty(fileName))
            return "";

        return fileName
            .split(".")
            .pop()
            .toLowerCase();

    }

    /* ======================================================
       STORAGE
    ====================================================== */

    save(key, value) {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    }

    load(key) {

        const value =
            localStorage.getItem(key);

        if (!value)
            return null;

        return JSON.parse(value);

    }

    remove(key) {

        localStorage.removeItem(key);

    }

    /* ======================================================
       CLONE
    ====================================================== */

    clone(object) {

        return structuredClone(object);

    }

    /* ======================================================
       DELAY
    ====================================================== */

    delay(milliseconds) {

        return new Promise(resolve => {

            setTimeout(resolve, milliseconds);

        });

    }

    /* ======================================================
       RANDOM
    ====================================================== */

    random(min, max) {

        return Math.floor(

            Math.random() *
            (max - min + 1)

        ) + min;

    }

    /* ======================================================
       OBJECT
    ====================================================== */

    merge(...objects) {

        return Object.assign({}, ...objects);

    }

}

window.HospiredUtils =
    new HospiredUtils();