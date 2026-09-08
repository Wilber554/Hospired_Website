/**
 * ==========================================================
 * Hospired API
 * Application data access layer
 * ==========================================================
 */

class HospiredAPI {

    constructor() {

        this.initialized = false;
    }


    // ------------------------------------------------------
    // Initialization
    // ------------------------------------------------------

    async initialize() {

        if (this.initialized) {
            return true;
        }


        if (
            typeof HospiredDatabase ===
            "undefined"
        ) {

            throw new Error(
                "HospiredDatabase is not available."
            );
        }


        await HospiredDatabase.initialize();


        this.initialized =
            true;


        return true;
    }


    // ------------------------------------------------------
    // Database
    // ------------------------------------------------------

    async database() {

        await this.initialize();


        return HospiredDatabase;
    }


    // ------------------------------------------------------
    // Patients
    // ------------------------------------------------------

    async getPatients() {

        const database =
            await this.database();


        const patients =
            await database.getAll(
                "patients"
            );


        return Array.isArray(patients)
            ? patients
            : [];
    }


    async getPatient(
        id
    ) {

        const database =
            await this.database();


        if (
            id === undefined ||
            id === null
        ) {

            return null;
        }


        return await database.get(
            "patients",
            id
        );
    }


    async registerPatient(
        patientData
    ) {

        if (
            !patientData ||
            typeof patientData !==
            "object"
        ) {

            throw new TypeError(
                "Patient data is required."
            );
        }


        const database =
            await this.database();


        const patient = {

            ...patientData,

            type:
                patientData.type ||
                "patient",

            role:
                patientData.role ||
                "patient"
        };


        return await database.add(
            "patients",
            patient
        );
    }


    async updatePatient(
        patientData
    ) {

        if (
            !patientData ||
            typeof patientData !==
            "object"
        ) {

            throw new TypeError(
                "Patient data is required."
            );
        }


        const database =
            await this.database();


        return await database.update(
            "patients",
            patientData
        );
    }


    async deletePatient(
        id
    ) {

        const database =
            await this.database();


        return await database.delete(
            "patients",
            id
        );
    }


    // ------------------------------------------------------
    // Institutions
    // ------------------------------------------------------

    async getInstitutions() {

        const database =
            await this.database();


        const institutions =
            await database.getAll(
                "institutions"
            );


        return Array.isArray(
            institutions
        )
            ? institutions
            : [];
    }


    async getInstitution(
        id
    ) {

        const database =
            await this.database();


        if (
            id === undefined ||
            id === null
        ) {

            return null;
        }


        return await database.get(
            "institutions",
            id
        );
    }


    async registerInstitution(
        institutionData
    ) {

        if (
            !institutionData ||
            typeof institutionData !==
            "object"
        ) {

            throw new TypeError(
                "Institution data is required."
            );
        }


        const database =
            await this.database();


        const institution = {

            ...institutionData,

            type:
                institutionData.type ||
                "institution",

            role:
                institutionData.role ||
                "institution"
        };


        return await database.add(
            "institutions",
            institution
        );
    }


    async updateInstitution(
        institutionData
    ) {

        if (
            !institutionData ||
            typeof institutionData !==
            "object"
        ) {

            throw new TypeError(
                "Institution data is required."
            );
        }


        const database =
            await this.database();


        return await database.update(
            "institutions",
            institutionData
        );
    }


    async deleteInstitution(
        id
    ) {

        const database =
            await this.database();


        return await database.delete(
            "institutions",
            id
        );
    }


    // ------------------------------------------------------
    // Search
    // ------------------------------------------------------

    async findPatientByEmail(
        email
    ) {

        const patients =
            await this.getPatients();


        const normalized =
            String(
                email || ""
            )
                .trim()
                .toLowerCase();


        return (
            patients.find(
                patient =>
                    String(
                        patient.email || ""
                    )
                        .trim()
                        .toLowerCase() ===
                    normalized
            ) ||
            null
        );
    }


    async findInstitutionByEmail(
        email
    ) {

        const institutions =
            await this.getInstitutions();


        const normalized =
            String(
                email || ""
            )
                .trim()
                .toLowerCase();


        return (
            institutions.find(
                institution =>
                    String(
                        institution.email || ""
                    )
                        .trim()
                        .toLowerCase() ===
                    normalized
            ) ||
            null
        );
    }


    // ------------------------------------------------------
    // Health check
    // ------------------------------------------------------

    async isReady() {

        try {

            await this.initialize();

            return true;

        } catch (error) {

            console.error(
                "Hospired API is not ready:",
                error
            );


            return false;
        }
    }
}


/**
 * ==========================================================
 * Global instance
 * ==========================================================
 */

window.HospiredAPI =
    new HospiredAPI();