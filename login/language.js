/**
 * ==========================================================
 * Hospired Language Manager
 * Multilingual interface controller
 * ==========================================================
 */

class HospiredLanguage {

    constructor() {

        this.defaultLanguage =
            "en";

        this.supportedLanguages = [
            "en",
            "es"
        ];

        this.storageKey =
            "HospiredLanguage";

        this.current =
            this.loadLanguage();
    }


    // ------------------------------------------------------
    // Load saved language
    // ------------------------------------------------------

    loadLanguage() {

        const savedLanguage =
            localStorage.getItem(
                this.storageKey
            );


        if (
            this.isSupported(
                savedLanguage
            )
        ) {

            return savedLanguage;
        }


        return this.defaultLanguage;
    }


    // ------------------------------------------------------
    // Language validation
    // ------------------------------------------------------

    isSupported(language) {

        return this.supportedLanguages.includes(
            language
        );
    }


    // ------------------------------------------------------
    // Get current language
    // ------------------------------------------------------

    currentLanguage() {

        return this.current;
    }


    // ------------------------------------------------------
    // Get dictionary
    // ------------------------------------------------------

    getDictionary() {

        if (
            this.current === "es"
        ) {

            return (
                typeof ES !== "undefined"
                    ? ES
                    : {}
            );
        }


        return (
            typeof EN !== "undefined"
                ? EN
                : {}
        );
    }


    // ------------------------------------------------------
    // Set language
    // ------------------------------------------------------

    setLanguage(language) {

        if (
            !this.isSupported(
                language
            )
        ) {

            console.warn(
                `HospiredLanguage: unsupported language "${language}".`
            );

            return false;
        }


        this.current =
            language;


        localStorage.setItem(
            this.storageKey,
            language
        );


        this.updateDocumentLanguage();


        return true;
    }


    // ------------------------------------------------------
    // Change language
    // ------------------------------------------------------

    change(language) {

        const changed =
            this.setLanguage(
                language
            );


        if (!changed) {

            return false;
        }


        this.translate();


        return true;
    }


    // ------------------------------------------------------
    // Update HTML language
    // ------------------------------------------------------

    updateDocumentLanguage() {

        if (
            document.documentElement
        ) {

            document.documentElement.lang =
                this.current;
        }
    }


    // ------------------------------------------------------
    // Translate page
    // ------------------------------------------------------

    translate() {

        const dictionary =
            this.getDictionary();


        if (
            !dictionary ||
            typeof dictionary !== "object"
        ) {

            console.warn(
                "HospiredLanguage: dictionary is not available."
            );

            return false;
        }


        const elements =
            document.querySelectorAll(
                "[data-lang]"
            );


        elements.forEach(
            element => {

                const key =
                    element.dataset.lang;


                if (
                    !key
                ) {

                    return;
                }


                if (
                    Object.prototype.hasOwnProperty.call(
                        dictionary,
                        key
                    )
                ) {

                    element.textContent =
                        dictionary[key];
                }

            }
        );


        this.updateDocumentLanguage();


        return true;
    }


    // ------------------------------------------------------
    // Translate a single element
    // ------------------------------------------------------

    translateElement(
        element
    ) {

        if (
            !element
        ) {

            return false;
        }


        const key =
            element.dataset.lang;


        if (
            !key
        ) {

            return false;
        }


        const dictionary =
            this.getDictionary();


        if (
            !Object.prototype.hasOwnProperty.call(
                dictionary,
                key
            )
        ) {

            return false;
        }


        element.textContent =
            dictionary[key];


        return true;
    }


    // ------------------------------------------------------
    // Get translated text
    // ------------------------------------------------------

    get(
        key,
        fallback = ""
    ) {

        const dictionary =
            this.getDictionary();


        if (
            Object.prototype.hasOwnProperty.call(
                dictionary,
                key
            )
        ) {

            return dictionary[key];
        }


        return fallback;
    }
}


/**
 * ==========================================================
 * Global instance
 * ==========================================================
 */

window.HospiredLanguage =
    new HospiredLanguage();