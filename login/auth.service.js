/**
 * ==========================================================
 * Hospired Authentication Service
 * Patient and institution authentication
 * ==========================================================
 */

class AuthService {

    // ------------------------------------------------------
    // Patient registration
    // ------------------------------------------------------

    async registerPatient(patientData) {

        try {

            if (
                !patientData ||
                typeof patientData !== "object"
            ) {
                throw new Error(
                    "Patient information is required."
                );
            }


            if (
                HospiredUtils.isEmpty(
                    patientData.fullName
                )
            ) {
                throw new Error(
                    "Full name is required."
                );
            }


            if (
                !HospiredUtils.isEmail(
                    patientData.email
                )
            ) {
                throw new Error(
                    "Invalid email."
                );
            }


            if (
                !HospiredUtils.isPassword(
                    patientData.password
                )
            ) {
                throw new Error(
                    "Password must contain at least 8 characters."
                );
            }


            const patients =
                await HospiredAPI.getPatients();


            const email =
                patientData.email
                    .trim()
                    .toLowerCase();


            const exists =
                patients.some(
                    patient =>
                        String(
                            patient.email || ""
                        )
                            .trim()
                            .toLowerCase() ===
                        email
                );


            if (exists) {

                throw new Error(
                    "Email already registered."
                );
            }


            const data = {
                ...patientData,

                email,

                role: "patient",

                type: "patient",

                createdAt:
                    HospiredUtils.generateDate()
            };


            const patient =
                await HospiredAPI.registerPatient(
                    data
                );


            return {

                success: true,

                user: patient,

                message:
                    "Patient account created successfully."
            };

        } catch (error) {

            console.error(
                "Patient registration error:",
                error
            );


            return {

                success: false,

                user: null,

                message:
                    error?.message ||
                    "Unable to create the patient account."
            };
        }
    }


    // ------------------------------------------------------
    // Institution registration
    // ------------------------------------------------------

    async registerInstitution(
        institutionData
    ) {

        try {

            if (
                !institutionData ||
                typeof institutionData !== "object"
            ) {
                throw new Error(
                    "Institution information is required."
                );
            }


            if (
                HospiredUtils.isEmpty(
                    institutionData.name
                )
            ) {
                throw new Error(
                    "Institution name is required."
                );
            }


            if (
                !HospiredUtils.isEmail(
                    institutionData.email
                )
            ) {
                throw new Error(
                    "Invalid email."
                );
            }


            if (
                !HospiredUtils.isPassword(
                    institutionData.password
                )
            ) {
                throw new Error(
                    "Password must contain at least 8 characters."
                );
            }


            const institutions =
                await HospiredAPI.getInstitutions();


            const email =
                institutionData.email
                    .trim()
                    .toLowerCase();


            const exists =
                institutions.some(
                    institution =>
                        String(
                            institution.email || ""
                        )
                            .trim()
                            .toLowerCase() ===
                        email
                );


            if (exists) {

                throw new Error(
                    "Institution already registered."
                );
            }


            const data = {

                ...institutionData,

                email,

                role: "institution",

                type: "institution",

                createdAt:
                    HospiredUtils.generateDate()
            };


            const institution =
                await HospiredAPI.registerInstitution(
                    data
                );


            return {

                success: true,

                user: institution,

                message:
                    "Institution account created successfully."
            };

        } catch (error) {

            console.error(
                "Institution registration error:",
                error
            );


            return {

                success: false,

                user: null,

                message:
                    error?.message ||
                    "Unable to create the institution account."
            };
        }
    }


    // ------------------------------------------------------
    // Patient / institution compatibility API
    // ------------------------------------------------------

    async patient(
        action,
        data
    ) {

        if (
            action === "register"
        ) {

            return await this.registerPatient(
                data
            );
        }


        if (
            action === "signin"
        ) {

            return await this.login(
                data.email,
                data.password,
                "patient"
            );
        }


        return {

            success: false,

            user: null,

            message:
                "Invalid patient authentication action."
        };
    }


    async institution(
        action,
        data
    ) {

        if (
            action === "register"
        ) {

            return await this.registerInstitution(
                data
            );
        }


        if (
            action === "signin"
        ) {

            return await this.login(
                data.email,
                data.password,
                "institution"
            );
        }


        return {

            success: false,

            user: null,

            message:
                "Invalid institution authentication action."
        };
    }


    // ------------------------------------------------------
    // Login
    // ------------------------------------------------------

    async login(
        email,
        password,
        userType = null
    ) {

        try {

            if (
                !email ||
                !password
            ) {

                return {

                    success: false,

                    user: null,

                    message:
                        "Email and password are required."
                };
            }


            const normalizedEmail =
                email
                    .trim()
                    .toLowerCase();


            let users = [];


            if (
                userType === "patient"
            ) {

                users =
                    await HospiredAPI.getPatients();

            } else if (
                userType === "institution"
            ) {

                users =
                    await HospiredAPI.getInstitutions();

            } else {

                const patients =
                    await HospiredAPI.getPatients();

                const institutions =
                    await HospiredAPI.getInstitutions();


                users = [

                    ...patients,

                    ...institutions

                ];
            }


            const user =
                users.find(
                    item => {

                        const itemEmail =
                            String(
                                item.email || ""
                            )
                                .trim()
                                .toLowerCase();


                        if (
                            itemEmail !==
                            normalizedEmail
                        ) {

                            return false;
                        }


                        if (
                            item.password !==
                            password
                        ) {

                            return false;
                        }


                        if (
                            userType &&
                            item.type !== userType &&
                            item.role !== userType
                        ) {

                            return false;
                        }


                        return true;
                    }
                );


            if (!user) {

                return {

                    success: false,

                    user: null,

                    message:
                        "Incorrect credentials."
                };
            }


            const sessionUser = {

                ...user,

                type:
                    user.type ||
                    user.role,

                role:
                    user.role ||
                    user.type
            };


            await HospiredSession.login(
                sessionUser
            );


            return {

                success: true,

                user: sessionUser,

                message:
                    "Login successful."
            };

        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            return {

                success: false,

                user: null,

                message:
                    error?.message ||
                    "Unable to complete login."
            };
        }
    }


    // ------------------------------------------------------
    // Logout
    // ------------------------------------------------------

    logout() {

        HospiredSession.clear();

        return true;
    }
}


/**
 * ==========================================================
 * Global instance
 * ==========================================================
 */

window.AuthService =
    new AuthService();