/**
 * ==========================================================
 * Hospired Site Header
 * Búsqueda, menú hamburguesa, accesibilidad y perfil
 * ==========================================================
 */

document.addEventListener("DOMContentLoaded", () => {

    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const hamburgerMenu = document.getElementById("hamburgerMenu");
    const accessibilityBtn = document.getElementById("accessibilityBtn");
    const accessibilityMenu = document.getElementById("accessibilityMenu");
    const searchInput = document.getElementById("searchInput");
    const searchResultsDropdown = document.getElementById("searchResultsDropdown");
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    const accessibilityLiveRegion = document.getElementById("accessibilityLiveRegion");

    if (!hamburgerBtn && !accessibilityBtn && !searchInput) {
        // El header no está presente en esta página.
        return;
    }

    // ------------------------------------------------------
    // Datos de búsqueda
    // ------------------------------------------------------

    const dataSources = [
        "Hospital Internacional San Jude",
        "Hospital Metropolitano del Norte",
        "Centro Médico Infantil Vita",
        "Hospital de Especialidades San Rafael",
        "Clínica Médica Alborada",
        "Hospital General Sagrado Corazón",
        "Centro Traumatológico del Deporte",
        "Hospital Materno Familiar Nueva Vida",
        "Instituto Cardiovascular CardioCare",
        "Hospital de Ojos Visión Perfecta",
        "Laboratorios Clínicos Biolab",
        "Laboratorios Diagnóstica Express",
        "Laboratorio Molecular Genex",
        "MaxiLab Análisis Especializados",
        "Laboratorio SaludVital",
        "MicroLab Investigaciones Clínicas",
        "Centro Hematológico e InmunoLab",
        "Laboratorio de Patología Central",
        "Laboratorio Clínico Prevenir",
        "EcoLab Análisis Ambientales y Clínicos"
    ];

    const announceAccessibility = (message) => {

        if (accessibilityLiveRegion) {

            accessibilityLiveRegion.textContent = message;
        }
    };

    const closeDropdowns = () => {

        hamburgerMenu?.classList.remove("show");

        accessibilityMenu?.classList.remove("show");

        hamburgerBtn?.setAttribute("aria-expanded", "false");

        accessibilityBtn?.setAttribute("aria-expanded", "false");

        searchResultsDropdown?.classList.remove("show");
    };

    hamburgerBtn?.addEventListener("click", (event) => {

        event.stopPropagation();

        const isOpen = hamburgerMenu?.classList.contains("show");

        closeDropdowns();

        if (!isOpen) {

            hamburgerMenu?.classList.add("show");

            hamburgerBtn?.setAttribute("aria-expanded", "true");
        }
    });

    accessibilityBtn?.addEventListener("click", (event) => {

        event.stopPropagation();

        const isOpen = accessibilityMenu?.classList.contains("show");

        closeDropdowns();

        if (!isOpen) {

            accessibilityMenu?.classList.add("show");

            accessibilityBtn?.setAttribute("aria-expanded", "true");
        }
    });

    // ------------------------------------------------------
    // Búsqueda
    // ------------------------------------------------------

    searchInput?.addEventListener("input", () => {

        const query = searchInput.value.toLowerCase().trim();

        searchResultsDropdown.innerHTML = "";

        if (query.length > 1) {

            const filteredResults = dataSources.filter(item =>
                item.toLowerCase().includes(query)
            );

            if (filteredResults.length > 0) {

                filteredResults.forEach(result => {

                    const resultItem = document.createElement("a");

                    resultItem.href = "#";

                    resultItem.classList.add("search-result-item");

                    resultItem.textContent = result;

                    resultItem.addEventListener("click", (e) => {

                        e.preventDefault();

                        searchInput.value = result;

                        closeDropdowns();
                    });

                    searchResultsDropdown.appendChild(resultItem);
                });

                searchResultsDropdown.classList.add("show");

            } else {

                const noResultItem = document.createElement("div");

                noResultItem.classList.add("search-result-item");

                noResultItem.textContent = "No se encontraron resultados.";

                searchResultsDropdown.appendChild(noResultItem);

                searchResultsDropdown.classList.add("show");
            }

        } else {

            searchResultsDropdown.classList.remove("show");
        }
    });

    document.addEventListener("click", (event) => {

        const clickedInsideMenu = event.target.closest(".hamburger");

        const clickedInsideAccessibility = event.target.closest(".accessibility-wrapper");

        if (!clickedInsideMenu && !clickedInsideAccessibility) {

            closeDropdowns();
        }
    });

    // ------------------------------------------------------
    // Accesibilidad
    // ------------------------------------------------------

    let textAdjustLevel = 0;

    let currentLanguage =
        (typeof HospiredLanguage !== "undefined" &&
            typeof HospiredLanguage.currentLanguage === "function")
            ? HospiredLanguage.currentLanguage()
            : "es";

    const accessibilityButtonIds = {
        "high-contrast": "opt-contrast",
        "spacing-active": "opt-spacing",
        "dyslexia-font": "opt-dyslexia",
        "cursor-plus": "opt-cursor",
        "onehand-active": "opt-onehand",
        "dark-mode": "opt-darkmode",
        "monochrome-active": "opt-monochrome",
        "colorblind-mode": "opt-colorblind",
        "screenreader-active": "opt-screenreader"
    };

    const translations = {
        accessibilityTitle: { es: "Ajustes de accesibilidad", en: "Accessibility settings" },
        accessibilitySubtitle: { es: "Activa las opciones que mejoran la lectura y el uso del sitio.", en: "Enable the options that improve reading and site use." },
        contrast: { es: "Contraste alto", en: "High contrast" },
        increaseText: { es: "Aumentar texto", en: "Increase text" },
        decreaseText: { es: "Disminuir texto", en: "Decrease text" },
        spacing: { es: "Espaciado", en: "Spacing" },
        dyslexia: { es: "Fuente dislexia", en: "Dyslexia font" },
        colorblind: { es: "Daltonismo", en: "Color blindness" },
        cursor: { es: "Cursor grande", en: "Large cursor" },
        oneHand: { es: "Modo a una mano", en: "One-hand mode" },
        screenReader: { es: "Lector de pantalla", en: "Screen reader" },
        darkMode: { es: "Modo oscuro", en: "Dark mode" },
        monochrome: { es: "Monocromático", en: "Monochrome" },
        language: { es: "Cambiar idioma", en: "Change language" },
        reset: { es: "Restablecer ajustes", en: "Reset settings" },
        labs: { es: "Laboratorios", en: "Laboratories" },
        hospitals: { es: "Hospitales", en: "Hospitals" },
        notifications: { es: "Notificaciones", en: "Notifications" },
        support: { es: "Soporte y ayuda", en: "Support and help" },
        about: { es: "Quiénes somos", en: "About us" }
    };

    function updateLanguageUI() {

        document.documentElement.lang = currentLanguage;

        document.querySelectorAll("[data-i18n]").forEach((element) => {

            const key = element.getAttribute("data-i18n");

            const translation = translations[key]?.[currentLanguage];

            if (translation) {

                element.textContent = translation;
            }
        });

        document.getElementById("accessibilityBtn")?.setAttribute(
            "aria-label",
            currentLanguage === "es" ? "Abrir opciones de accesibilidad" : "Open accessibility options"
        );

        document.getElementById("searchInput")?.setAttribute(
            "placeholder",
            currentLanguage === "es" ? "Buscar servicios..." : "Search services..."
        );
    }

    /*
     * Aplica la clase tanto en <html> como en <body>: login.css ya
     * define .high-contrast / .large-text / .motor-mode / .protanopia
     * / .deuteranopia / .tritanopia esperando la clase en <body>,
     * mientras que las reglas propias de este header (dark-mode,
     * monochrome-active, etc.) están escritas como ".clase body".
     * Aplicándola en ambos elementos, las dos hojas de estilo
     * funcionan sin tener que tocar login.css.
     */
    function toggleBoth(className) {

        const active = htmlElement.classList.toggle(className);

        bodyElement.classList.toggle(className, active);

        return active;
    }

    function toggleAccessibility(className) {

        const activeClass = toggleBoth(className);

        const buttonId = accessibilityButtonIds[className];

        const button = buttonId ? document.getElementById(buttonId) : null;

        if (button) {

            button.classList.toggle("active", activeClass);

            button.setAttribute("aria-pressed", String(activeClass));
        }

        announceAccessibility(activeClass ? "Opción activada" : "Opción desactivada");
    }

    function adjustText(direction) {

        htmlElement.classList.remove("text-plus-1", "text-plus-2", "text-minus-1", "text-minus-2");

        bodyElement.classList.remove("text-plus-1", "text-plus-2", "text-minus-1", "text-minus-2");

        textAdjustLevel = Math.max(-2, Math.min(2, textAdjustLevel + direction));

        if (textAdjustLevel > 0) {

            htmlElement.classList.add(`text-plus-${textAdjustLevel}`);

            bodyElement.classList.add(`text-plus-${textAdjustLevel}`);

        } else if (textAdjustLevel < 0) {

            htmlElement.classList.add(`text-minus-${Math.abs(textAdjustLevel)}`);

            bodyElement.classList.add(`text-minus-${Math.abs(textAdjustLevel)}`);
        }

        const increaseBtn = document.getElementById("opt-text-plus");

        const decreaseBtn = document.getElementById("opt-text-minus");

        increaseBtn?.setAttribute("aria-pressed", String(textAdjustLevel > 0));

        decreaseBtn?.setAttribute("aria-pressed", String(textAdjustLevel < 0));

        announceAccessibility(
            textAdjustLevel === 0
                ? "Tamaño de texto restaurado"
                : `Tamaño de texto ajustado a nivel ${textAdjustLevel}`
        );
    }

    function activateColorblind() {

        const button = document.getElementById("opt-colorblind");

        const isActive = toggleBoth("colorblind-mode");

        button?.classList.toggle("active", isActive);

        button?.setAttribute("aria-pressed", String(isActive));

        announceAccessibility(isActive ? "Modo para daltonismo activado" : "Modo para daltonismo desactivado");
    }

    function activateScreenreader() {

        const button = document.getElementById("opt-screenreader");

        const isActive = toggleBoth("screenreader-active");

        button?.classList.toggle("active", isActive);

        button?.setAttribute("aria-pressed", String(isActive));

        if (!isActive) {

            window.speechSynthesis?.cancel();

            return;
        }

        if (!("speechSynthesis" in window)) {

            alert(currentLanguage === "es" ? "Tu navegador no admite lectura por voz." : "Your browser does not support voice reading.");

            return;
        }

        const message = currentLanguage === "es"
            ? "Hospired está listo para ayudarte a encontrar servicios de salud de forma accesible."
            : "Hospired is ready to help you find health services accessibly.";

        const utterance = new SpeechSynthesisUtterance(message);

        utterance.lang = currentLanguage === "es" ? "es-ES" : "en-US";

        window.speechSynthesis.cancel();

        window.speechSynthesis.speak(utterance);

        announceAccessibility(currentLanguage === "es" ? "Lector de pantalla activado" : "Screen reader activated");
    }

    function changeLanguage() {

        currentLanguage = currentLanguage === "es" ? "en" : "es";

        if (typeof HospiredLanguage !== "undefined" &&
            typeof HospiredLanguage.setLanguage === "function") {

            HospiredLanguage.setLanguage(currentLanguage);

            if (typeof HospiredLanguage.translate === "function") {

                HospiredLanguage.translate();
            }
        }

        updateLanguageUI();

        announceAccessibility(currentLanguage === "es" ? "Idioma cambiado a español" : "Language changed to English");
    }

    function resetAccessibility() {

        const classes = [
            "high-contrast", "spacing-active", "dyslexia-font", "cursor-plus",
            "onehand-active", "dark-mode", "monochrome-active", "colorblind-mode",
            "screenreader-active", "text-plus-1", "text-plus-2", "text-minus-1", "text-minus-2"
        ];

        htmlElement.classList.remove(...classes);

        bodyElement.classList.remove(...classes);

        textAdjustLevel = 0;

        Object.values(accessibilityButtonIds).forEach((buttonId) => {

            const button = document.getElementById(buttonId);

            button?.classList.remove("active");

            button?.setAttribute("aria-pressed", "false");
        });

        const increaseBtn = document.getElementById("opt-text-plus");

        const decreaseBtn = document.getElementById("opt-text-minus");

        increaseBtn?.setAttribute("aria-pressed", "false");

        decreaseBtn?.setAttribute("aria-pressed", "false");

        announceAccessibility("Ajustes de accesibilidad restablecidos");
    }

    // Los botones del panel usan onclick="..." en el HTML,
    // así que estas funciones deben quedar accesibles globalmente.
    window.toggleAccessibility = toggleAccessibility;
    window.adjustText = adjustText;
    window.activateColorblind = activateColorblind;
    window.activateScreenreader = activateScreenreader;
    window.changeLanguage = changeLanguage;
    window.resetAccessibility = resetAccessibility;

    updateLanguageUI();
});


/**
 * ==========================================================
 * Perfil — muestra el usuario real de la sesión
 * ==========================================================
 */

function updateProfileWidget() {

    const profile = document.querySelector(".profile");

    if (!profile) {

        return;
    }

    const avatar = profile.querySelector(".avatar");

    const name = profile.querySelector(".account .name");

    const hint = profile.querySelector(".account .hint");

    const user =
        (typeof HospiredSession !== "undefined")
            ? HospiredSession.get()
            : null;

    if (!user) {

        if (avatar) avatar.textContent = "?";

        if (name) name.textContent = "Invitado";

        if (hint) hint.textContent = "Iniciar sesión";

        profile.setAttribute("href", "login.html");

        return;
    }

    const isInstitution =
        user.type === "institution" ||
        user.role === "institution";

    const displayName =
        isInstitution
            ? (user.name || "Institución")
            : (user.fullName || "Paciente");

    const roleLabel =
        isInstitution ? "Institución médica" : "Paciente";

    if (name) {

        name.textContent = displayName;
    }

    if (hint) {

        hint.textContent = roleLabel;
    }

    if (avatar) {

        const initials =
            displayName
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map(part => part.charAt(0).toUpperCase())
                .join("") || "H";

        avatar.textContent = initials;
    }

    profile.setAttribute(
        "href",
        isInstitution ? "institution/dashboard.html" : "patient/dashboard.html"
    );
}

document.addEventListener("DOMContentLoaded", updateProfileWidget);

window.updateProfileWidget = updateProfileWidget;