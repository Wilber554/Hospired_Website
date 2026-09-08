/**
 * ==========================================================
 * Hospired Login Controller
 * Patient / Institution authentication interface
 * ==========================================================
 */

class LoginController {

    static MODES = {

        SIGNIN: "signin",

        REGISTER: "register"
    };


    static FORMS = {

        PATIENT: "patient",

        INSTITUTION: "institution"
    };


    static NOTIFICATION = {

        SUCCESS: "success",

        ERROR: "error",

        WARNING: "warning",

        INFO: "info"
    };


    // ------------------------------------------------------
    // Constructor
    // ------------------------------------------------------

    constructor() {

        this.currentForm =
            LoginController.FORMS.PATIENT;


        this.mode =
            LoginController.MODES.SIGNIN;


        this.initialized =
            false;


        this.initialize();
    }


    // ------------------------------------------------------
    // Initialization
    // ------------------------------------------------------

    initialize() {

        this.initializeElements();


        if (
            !this.patientForm &&
            !this.institutionForm
        ) {

            console.warn(
                "Hospired Login: authentication forms were not found."
            );

            return;
        }


        this.initializeEvents();


        this.registerForms();


        this.loadLanguage();


        this.loadAccessibility();


        this.setActiveForm(
            LoginController.FORMS.PATIENT
        );


        this.activateSignIn();


        this.hideNotification();


        this.checkSession();


        this.initialized =
            true;
    }


    // ------------------------------------------------------
    // DOM elements
    // ------------------------------------------------------

    initializeElements() {

        this.signInButton =
            document.getElementById(
                "signInMode"
            );


        this.registerButton =
            document.getElementById(
                "registerMode"
            );


        this.patientTab =
            document.getElementById(
                "patientTab"
            );


        this.institutionTab =
            document.getElementById(
                "institutionTab"
            );


        this.patientForm =
            document.getElementById(
                "patientForm"
            );


        this.institutionForm =
            document.getElementById(
                "institutionForm"
            );


        this.patientSubmit =
            document.getElementById(
                "patientSubmit"
            );


        this.institutionSubmit =
            document.getElementById(
                "institutionSubmit"
            );


        this.settingsButton =
            document.getElementById(
                "accessibilityButton"
            );


        this.settingsPanel =
            document.getElementById(
                "settingsPanel"
            );


        this.languageSelector =
            document.getElementById(
                "languageSelector"
            );


        this.fontSizeSelector =
            document.getElementById(
                "fontSize"
            );


        this.highContrast =
            document.getElementById(
                "highContrast"
            );


        this.largeIcons =
            document.getElementById(
                "largeIcons"
            );


        this.motorMode =
            document.getElementById(
                "motorMode"
            );


        this.screenReader =
            document.getElementById(
                "screenReader"
            );


        this.colorBlindSelector =
            document.getElementById(
                "colorBlindMode"
            );


        this.forgotPassword =
            document.getElementById(
                "forgotPassword"
            );


        this.supportButton =
            document.getElementById(
                "supportButton"
            );
    }


    // ------------------------------------------------------
    // Events
    // ------------------------------------------------------

    initializeEvents() {

        if (
            this.signInButton
        ) {

            this.signInButton.addEventListener(
                "click",
                () => this.activateSignIn()
            );
        }


        if (
            this.registerButton
        ) {

            this.registerButton.addEventListener(
                "click",
                () => this.activateRegister()
            );
        }


        if (
            this.patientTab
        ) {

            this.patientTab.addEventListener(
                "click",
                () => this.showPatient()
            );
        }


        if (
            this.institutionTab
        ) {

            this.institutionTab.addEventListener(
                "click",
                () => this.showInstitution()
            );
        }


        if (
            this.settingsButton &&
            this.settingsPanel
        ) {

            this.settingsButton.addEventListener(
                "click",
                () => {

                    this.settingsPanel.classList.toggle(
                        "active"
                    );
                }
            );
        }


        if (
            this.languageSelector
        ) {

            this.languageSelector.addEventListener(
                "change",
                () => this.changeLanguage()
            );
        }


        if (
            this.fontSizeSelector
        ) {

            this.fontSizeSelector.addEventListener(
                "change",
                () => this.updateAccessibility()
            );
        }


        if (
            this.highContrast
        ) {

            this.highContrast.addEventListener(
                "change",
                () => this.updateAccessibility()
            );
        }


        if (
            this.largeIcons
        ) {

            this.largeIcons.addEventListener(
                "change",
                () => this.updateAccessibility()
            );
        }


        if (
            this.motorMode
        ) {

            this.motorMode.addEventListener(
                "change",
                () => this.updateAccessibility()
            );
        }


        if (
            this.screenReader
        ) {

            this.screenReader.addEventListener(
                "change",
                () => this.updateAccessibility()
            );
        }


        if (
            this.colorBlindSelector
        ) {

            this.colorBlindSelector.addEventListener(
                "change",
                () => this.updateAccessibility()
            );
        }


        if (
            this.forgotPassword
        ) {

            this.forgotPassword.addEventListener(
                "click",
                () => this.showForgotPassword()
            );
        }


        if (
            this.supportButton
        ) {

            this.supportButton.addEventListener(
                "click",
                () => this.showSupport()
            );
        }
    }


    // ------------------------------------------------------
    // Form events
    // ------------------------------------------------------

    registerForms() {

        if (
            this.patientForm
        ) {

            this.patientForm.addEventListener(
                "submit",
                event => {

                    event.preventDefault();

                    this.submitPatient();
                }
            );
        }


        if (
            this.institutionForm
        ) {

            this.institutionForm.addEventListener(
                "submit",
                event => {

                    event.preventDefault();

                    this.submitInstitution();
                }
            );
        }
    }


    // ------------------------------------------------------
    // Sign in / register mode
    // ------------------------------------------------------

    activateSignIn() {

        this.mode =
            LoginController.MODES.SIGNIN;


        this.setButtonState(
            this.signInButton,
            true
        );


        this.setButtonState(
            this.registerButton,
            false
        );


        this.updateForms();
    }


    activateRegister() {

        this.mode =
            LoginController.MODES.REGISTER;


        this.setButtonState(
            this.signInButton,
            false
        );


        this.setButtonState(
            this.registerButton,
            true
        );


        this.updateForms();
    }


    setButtonState(
        element,
        active
    ) {

        if (!element) {
            return;
        }


        element.classList.toggle(
            "active",
            active
        );
    }


    // ------------------------------------------------------
    // Patient / institution selector
    // ------------------------------------------------------

    showPatient() {

        this.setActiveForm(
            LoginController.FORMS.PATIENT
        );
    }


    showInstitution() {

        this.setActiveForm(
            LoginController.FORMS.INSTITUTION
        );
    }


    setActiveForm(type) {

        const isPatient =
            type ===
            LoginController.FORMS.PATIENT;


        this.currentForm =
            isPatient
                ? LoginController.FORMS.PATIENT
                : LoginController.FORMS.INSTITUTION;


        this.setButtonState(
            this.patientTab,
            isPatient
        );


        this.setButtonState(
            this.institutionTab,
            !isPatient
        );


        this.setHidden(
            this.patientForm,
            !isPatient
        );


        this.setHidden(
            this.institutionForm,
            isPatient
        );


        this.updateForms();


        this.hideNotification();
    }


    setHidden(
        element,
        hidden
    ) {

        if (!element) {
            return;
        }


        element.classList.toggle(
            "hidden",
            hidden
        );
    }


    // ------------------------------------------------------
    // Register-only fields
    // ------------------------------------------------------

    updateForms() {

        this.updateRegisterFields(
            this.patientForm
        );


        this.updateRegisterFields(
            this.institutionForm
        );


        this.updateSubmitButtons();
    }


    updateRegisterFields(
        form
    ) {

        if (!form) {
            return;
        }


        const fields =
            form.querySelectorAll(
                ".register-only"
            );


        fields.forEach(
            group => {

                group.classList.toggle(
                    "hidden",
                    this.mode ===
                    LoginController.MODES.SIGNIN
                );
            }
        );
    }


    updateSubmitButtons() {

        const text =
            this.mode ===
            LoginController.MODES.SIGNIN
                ? "Sign In"
                : "Create Account";


        if (
            this.patientSubmit
        ) {

            this.patientSubmit.textContent =
                this.getTranslation(
                    this.mode ===
                    LoginController.MODES.SIGNIN
                        ? "signIn"
                        : "createAccount",
                    text
                );
        }


        if (
            this.institutionSubmit
        ) {

            this.institutionSubmit.textContent =
                this.getTranslation(
                    this.mode ===
                    LoginController.MODES.SIGNIN
                        ? "signIn"
                        : "createAccount",
                    text
                );
        }
    }


    // ------------------------------------------------------
    // Patient data
    // ------------------------------------------------------

    getPatientData() {

        return {

            fullName:
                this.getValue(
                    "patientName"
                ),

            email:
                this.getValue(
                    "patientEmail"
                ),

            phone:
                this.getValue(
                    "patientPhone"
                ),

            age:
                this.getValue(
                    "patientAge"
                ),

            edad:
                this.getValue(
                    "patientAge"
                ),

            password:
                this.getRawValue(
                    "patientPassword"
                ),

            insurance:
                this.getValue(
                    "insurance"
                ),

            previousHospital:
                this.getValue(
                    "previousHospital"
                ),

            medicalRecord:
                this.getFile(
                    "medicalRecord"
                )
        };
    }


    // ------------------------------------------------------
    // Institution data
    // ------------------------------------------------------

    getInstitutionData() {

        return {

            name:
                this.getValue(
                    "institutionName"
                ),

            email:
                this.getValue(
                    "institutionEmail"
                ),

            password:
                this.getRawValue(
                    "institutionPassword"
                ),

            code:
                this.getValue(
                    "institutionCode"
                ),

            type:
                this.getValue(
                    "institutionType"
                ),

            license:
                this.getFile(
                    "institutionLicense"
                )
        };
    }


    getValue(id) {

        const element =
            document.getElementById(
                id
            );


        return (
            element?.value
                ?.trim() || ""
        );
    }


    getRawValue(id) {

        const element =
            document.getElementById(
                id
            );


        return element?.value || "";
    }


    getFile(id) {

        const element =
            document.getElementById(
                id
            );


        return (
            element?.files?.[0] ||
            null
        );
    }


    // ------------------------------------------------------
    // Patient submit
    // ------------------------------------------------------

    async submitPatient() {

        this.hideNotification();


        const patient =
            this.getPatientData();


        if (
            !this.validatePatient(
                patient
            )
        ) {

            return;
        }


        this.setLoading(
            this.patientSubmit,
            true
        );


        try {

            const result =
                await AuthService.patient(
                    this.mode,
                    patient
                );


            await this.handleAuthenticationResult(
                result
            );

        } catch (error) {

            this.showNotification(
                "Error",
                error?.message ||
                "Unable to complete the request.",
                LoginController.NOTIFICATION.ERROR
            );

        } finally {

            this.setLoading(
                this.patientSubmit,
                false
            );
        }
    }


    // ------------------------------------------------------
    // Institution submit
    // ------------------------------------------------------

    async submitInstitution() {

        this.hideNotification();


        const institution =
            this.getInstitutionData();


        if (
            !this.validateInstitution(
                institution
            )
        ) {

            return;
        }


        this.setLoading(
            this.institutionSubmit,
            true
        );


        try {

            const result =
                await AuthService.institution(
                    this.mode,
                    institution
                );


            await this.handleAuthenticationResult(
                result
            );

        } catch (error) {

            this.showNotification(
                "Error",
                error?.message ||
                "Unable to complete the request.",
                LoginController.NOTIFICATION.ERROR
            );

        } finally {

            this.setLoading(
                this.institutionSubmit,
                false
            );
        }
    }


    // ------------------------------------------------------
    // Authentication result
    // ------------------------------------------------------

    persistProfile(user) {

        if (!user || typeof user !== "object") {
            return null;
        }

        const isInst = user.role === "institution" || user.type === "institution" || Boolean(user.institutionName);
        const profile = {
            role: isInst ? "institution" : "patient",
            fullName: user.fullName || user.institutionName || user.name || user.email || "Usuario",
            name: user.fullName || user.institutionName || user.name || user.email || "Usuario",
            email: user.email || "",
            phone: user.phone || user.telefono || "2222-1111"
        };

        if (isInst) {
            profile.institutionName = user.institutionName || user.name || user.fullName || "Hospital General Hospired";
            profile.institutionCode = user.institutionCode || user.code || "INST-000";
            profile.institutionType = user.institutionType || user.type || "Hospital";
        } else {
            profile.age = user.age || user.edad || "";
            profile.edad = user.age || user.edad || "";
            profile.previousHospital = user.previousHospital || user.hospital || "";
        }

        try {
            // Claves segregadas por rol: evita que un perfil de paciente sobreescriba
            // el de una institucion (o viceversa) cuando comparten el mismo navegador.
            const storageKey = isInst ? "hospired_institution_profile" : "hospired_patient_profile";
            localStorage.setItem(storageKey, JSON.stringify(profile));
            localStorage.setItem("hospired_logged_user", JSON.stringify({
                nombre: profile.fullName,
                email: profile.email,
                telefono: profile.phone,
                role: profile.role
            }));
            if (isInst) {
                localStorage.setItem("hospired_institution_affiliation", JSON.stringify({
                    name: profile.institutionName,
                    type: profile.institutionType,
                    location: "San Salvador, El Salvador",
                    contact: profile.fullName,
                    email: profile.email,
                    phone: profile.phone || "2222-1111",
                    message: "Acceso como Institución Médica"
                }));
            }
            return profile;
        } catch (error) {
            console.warn("Could not save profile data.", error);
            return profile;
        }
    }

    async handleAuthenticationResult(
        result
    ) {

        if (
            !result ||
            !result.success
        ) {

            this.showNotification(
                "Error",
                result?.message ||
                "Authentication failed.",
                LoginController.NOTIFICATION.ERROR
            );


            return false;
        }


        if (
            result.user
        ) {

            this.saveSession(
                result.user
            );

            this.persistProfile(
                result.user
            );


            if (
                typeof updateProfileWidget ===
                "function"
            ) {

                updateProfileWidget();
            }
        }


        this.showNotification(
            "Success",
            result.message ||
            "Authentication successful.",
            LoginController.NOTIFICATION.SUCCESS
        );


        this.clearForms();


        this.redirectHome();


        return true;
    }


    // ------------------------------------------------------
    // Loading state
    // ------------------------------------------------------

    setLoading(
        button,
        loading
    ) {

        if (!button) {
            return;
        }


        if (loading) {

            if (
                !button.dataset.originalText
            ) {

                button.dataset.originalText =
                    button.textContent;
            }


            button.disabled =
                true;


            button.textContent =
                "...";

        } else {

            button.disabled =
                false;


            const original =
                button.dataset.originalText;


            if (original) {

                button.textContent =
                    original;
            }
        }
    }


    // ------------------------------------------------------
    // Patient validation
    // ------------------------------------------------------

    validatePatient(
        patient
    ) {

        if (
            !patient.email
        ) {

            this.showNotification(
                "Missing Email",
                "Please enter your email address.",
                LoginController.NOTIFICATION.WARNING
            );


            return false;
        }


        if (
            !/^\S+@\S+\.\S+$/.test(
                patient.email
            )
        ) {

            this.showNotification(
                "Invalid Email",
                "Please enter a valid email address.",
                LoginController.NOTIFICATION.WARNING
            );


            return false;
        }


        if (
            !patient.password
        ) {

            this.showNotification(
                "Missing Password",
                "Please enter your password.",
                LoginController.NOTIFICATION.WARNING
            );


            return false;
        }


        if (
            this.mode ===
            LoginController.MODES.REGISTER
        ) {

            if (
                !patient.fullName
            ) {

                this.showNotification(
                    "Missing Name",
                    "Please enter your full name.",
                    LoginController.NOTIFICATION.WARNING
                );


                return false;
            }


            if (
                patient.fullName.length < 5
            ) {

                this.showNotification(
                    "Invalid Name",
                    "Your full name must contain at least 5 characters.",
                    LoginController.NOTIFICATION.WARNING
                );


                return false;
            }


            if (
                !patient.phone
            ) {

                this.showNotification(
                    "Missing Phone",
                    "Please enter your phone number.",
                    LoginController.NOTIFICATION.WARNING
                );


                return false;
            }


            if (
                !patient.insurance
            ) {

                this.showNotification(
                    "Insurance Required",
                    "Please select your medical insurance.",
                    LoginController.NOTIFICATION.WARNING
                );


                return false;
            }
        }


        return true;
    }


    // ------------------------------------------------------
    // Institution validation
    // ------------------------------------------------------

    validateInstitution(
        institution
    ) {

        if (
            !institution.email
        ) {

            this.showNotification(
                "Missing Email",
                "Please enter the institution email.",
                LoginController.NOTIFICATION.WARNING
            );


            return false;
        }


        if (
            !/^\S+@\S+\.\S+$/.test(
                institution.email
            )
        ) {

            this.showNotification(
                "Invalid Email",
                "Please enter a valid institution email.",
                LoginController.NOTIFICATION.WARNING
            );


            return false;
        }


        if (
            !institution.password
        ) {

            this.showNotification(
                "Missing Password",
                "Please enter the password.",
                LoginController.NOTIFICATION.WARNING
            );


            return false;
        }


        if (
            this.mode ===
            LoginController.MODES.REGISTER
        ) {

            if (
                !institution.name
            ) {

                this.showNotification(
                    "Institution Required",
                    "Please enter the institution name.",
                    LoginController.NOTIFICATION.WARNING
                );


                return false;
            }


            if (
                !institution.code
            ) {

                this.showNotification(
                    "Institution Code",
                    "Please enter the institution code.",
                    LoginController.NOTIFICATION.WARNING
                );


                return false;
            }


            if (
                !institution.type
            ) {

                this.showNotification(
                    "Institution Type",
                    "Please select the institution type.",
                    LoginController.NOTIFICATION.WARNING
                );


                return false;
            }
        }


        return true;
    }


    // ------------------------------------------------------
    // Session
    // ------------------------------------------------------

    saveSession(
        user
    ) {

        if (
            !user ||
            typeof HospiredSession ===
            "undefined"
        ) {

            return;
        }


        HospiredSession.save(
            user
        );
    }


    currentUser() {

        if (
            typeof HospiredSession ===
            "undefined"
        ) {

            return null;
        }


        return HospiredSession.get();
    }


    isLogged() {

        return !!this.currentUser();
    }


    checkSession() {

        if (
            !this.isLogged()
        ) {

            return;
        }


        const user =
            this.currentUser();


        if (
            !user?.type &&
            user?.role
        ) {

            user.type =
                user.role;


            this.saveSession(
                user
            );
        }


        this.redirectHome();
    }


    // ------------------------------------------------------
    // Redirect
    // ------------------------------------------------------

    redirectHome() {

        const user = this.currentUser();
        let isInst = user?.role === "institution" || user?.type === "institution";
        let userName = user?.fullName || user?.institutionName || user?.name || "Usuario";
        try {
            const profile = JSON.parse(localStorage.getItem("hospired_institution_profile") || localStorage.getItem("hospired_patient_profile") || "{}");
            if (profile.role === "institution" || profile.institutionName) {
                isInst = true;
            }
            if (profile.fullName || profile.institutionName || profile.name) {
                userName = profile.fullName || profile.institutionName || profile.name;
            }
        } catch (e) {}

        const homeUrl = isInst
            ? "../Panel.De.Instituciones/panel-hospital (2).html"
            : "../index.html?profile=1";

        const welcomeScreen = document.getElementById('welcomeScreen');
        const welcomeUser = document.getElementById('welcomeUserName');
        if (welcomeUser) welcomeUser.textContent = userName;
        if (welcomeScreen) welcomeScreen.classList.remove('hidden');

        setTimeout(
            () => {
                window.location.href = homeUrl;
            },
            1800
        );
    }


    // ------------------------------------------------------
    // Clear forms
    // ------------------------------------------------------

    clearForms() {

        if (
            this.patientForm
        ) {

            this.patientForm.reset();
        }


        if (
            this.institutionForm
        ) {

            this.institutionForm.reset();
        }


        this.setActiveForm(
            this.currentForm
        );


        this.updateForms();
    }


    // ------------------------------------------------------
    // Language
    // ------------------------------------------------------

    loadLanguage() {

        if (
            typeof HospiredLanguage ===
            "undefined"
        ) {

            return;
        }


        const language =
            HospiredLanguage.currentLanguage();


        if (
            this.languageSelector
        ) {

            this.languageSelector.value =
                language;
        }


        HospiredLanguage.translate();


        this.updateSubmitButtons();
    }


    changeLanguage() {

        if (
            !this.languageSelector ||
            typeof HospiredLanguage ===
            "undefined"
        ) {

            return;
        }


        const language =
            this.languageSelector.value;


        HospiredLanguage.setLanguage(
            language
        );


        HospiredLanguage.translate();


        this.updateSubmitButtons();
    }


    getTranslation(
        key,
        fallback
    ) {

        if (
            typeof HospiredLanguage ===
            "undefined"
        ) {

            return fallback;
        }


        if (
            typeof HospiredLanguage.get ===
            "function"
        ) {

            return HospiredLanguage.get(
                key,
                fallback
            );
        }


        return fallback;
    }


    // ------------------------------------------------------
    // Accessibility
    // ------------------------------------------------------

    loadAccessibility() {

        let settings = null;


        try {

            const saved =
                localStorage.getItem(
                    "HospiredAccessibility"
                );


            if (saved) {

                settings =
                    JSON.parse(
                        saved
                    );
            }

        } catch (error) {

            console.warn(
                "Could not load accessibility settings.",
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


        if (
            this.languageSelector
        ) {

            this.languageSelector.value =
                settings.language;
        }


        if (
            this.fontSizeSelector
        ) {

            this.fontSizeSelector.value =
                settings.fontSize;
        }


        if (
            this.highContrast
        ) {

            this.highContrast.checked =
                !!settings.highContrast;
        }


        if (
            this.largeIcons
        ) {

            this.largeIcons.checked =
                !!settings.largeIcons;
        }


        if (
            this.motorMode
        ) {

            this.motorMode.checked =
                !!settings.motorMode;
        }


        if (
            this.screenReader
        ) {

            this.screenReader.checked =
                !!settings.screenReader;
        }


        if (
            this.colorBlindSelector
        ) {

            this.colorBlindSelector.value =
                settings.colorBlind;
        }


        this.applyAccessibility(
            settings
        );
    }


    updateAccessibility() {

        const settings = {

            language:
                this.languageSelector
                    ?.value ||
                "en",

            fontSize:
                this.fontSizeSelector
                    ?.value ||
                "normal",

            highContrast:
                !!this.highContrast?.checked,

            largeIcons:
                !!this.largeIcons?.checked,

            motorMode:
                !!this.motorMode?.checked,

            screenReader:
                !!this.screenReader?.checked,

            colorBlind:
                this.colorBlindSelector
                    ?.value ||
                "normal"
        };


        localStorage.setItem(
            "HospiredAccessibility",
            JSON.stringify(
                settings
            )
        );


        this.applyAccessibility(
            settings
        );
    }


    applyAccessibility(
        settings
    ) {

        if (
            !document.body
        ) {

            return;
        }


        document.body.classList.remove(

            "large-text",

            "large-icons",

            "high-contrast",

            "motor-mode",

            "protanopia",

            "deuteranopia",

            "tritanopia"
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


        if (
            settings.screenReader
        ) {

            this.startScreenReader();

        } else {

            this.stopScreenReader();
        }
    }


    // ------------------------------------------------------
    // Screen reader
    // ------------------------------------------------------

    startScreenReader() {

        if (
            !("speechSynthesis" in window)
        ) {

            return;
        }


        const language =
            this.languageSelector
                ?.value ||
            "en";


        const text =
            language === "es"
                ? "Bienvenido a Hospired."
                : "Welcome to Hospired.";


        const speech =
            new SpeechSynthesisUtterance(
                text
            );


        speech.lang =
            language === "es"
                ? "es-ES"
                : "en-US";


        speech.rate =
            1;


        window.speechSynthesis.cancel();


        window.speechSynthesis.speak(
            speech
        );
    }


    stopScreenReader() {

        if (
            "speechSynthesis" in window
        ) {

            window.speechSynthesis.cancel();
        }
    }


    // ------------------------------------------------------
    // Notifications
    // ------------------------------------------------------

    showNotification(
        title,
        message,
        type = "info"
    ) {

        if (
            typeof HospiredNotifications !==
            "undefined"
        ) {

            HospiredNotifications.show(
                title,
                message,
                type
            );


            return;
        }


        console.warn(
            title,
            message
        );
    }


    hideNotification() {

        if (
            typeof HospiredNotifications !==
            "undefined"
        ) {

            HospiredNotifications.hide();
        }
    }


    // ------------------------------------------------------
    // Support
    // ------------------------------------------------------

    showForgotPassword() {

        this.showNotification(
            "Forgot Password",
            "Password recovery will be available soon.",
            LoginController.NOTIFICATION.INFO
        );
    }


    showSupport() {

        this.showNotification(
            "Support Center",
            "Support services will be available soon.",
            LoginController.NOTIFICATION.INFO
        );
    }


    // ------------------------------------------------------
    // Logout
    // ------------------------------------------------------

    logout() {

        if (
            typeof HospiredSession !==
            "undefined"
        ) {

            HospiredSession.clear();
        }


        this.clearForms();


        this.showPatient();


        this.activateSignIn();


        this.hideNotification();
    }


    // ------------------------------------------------------
    // Refresh
    // ------------------------------------------------------

    refresh() {

        this.loadLanguage();

        this.loadAccessibility();

        this.setActiveForm(
            this.currentForm
        );

        this.updateForms();
    }
}


/**
 * ==========================================================
 * Global controller
 * ==========================================================
 */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        window.Login =
            new LoginController();

    }
);