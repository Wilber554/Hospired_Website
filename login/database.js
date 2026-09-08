/**
 * ==========================================================
 * Hospired Database
 * IndexedDB data access layer
 * ==========================================================
 */

class HospiredDatabase {

    constructor() {
        this.db = null;
    }


    // ------------------------------------------------------
    // Initialization
    // ------------------------------------------------------

    async initialize() {
        return await this.connect();
    }


    async connect() {

        if (this.db) {
            return this.db;
        }

        if (
            typeof HospiredStorage === "undefined"
        ) {
            throw new Error(
                "HospiredStorage is not available."
            );
        }

        if (
            typeof HospiredStorage.initialize !== "function"
        ) {
            throw new Error(
                "HospiredStorage.initialize() is not available."
            );
        }

        /*
         * Initialize Storage first.
         */
        await HospiredStorage.initialize();

        /*
         * Storage may expose the database through
         * HospiredStorage.database.
         */
        if (HospiredStorage.database) {

            this.db =
                HospiredStorage.database;

        } else {

            /*
             * Some implementations may return the
             * database directly from initialize().
             */
            const initializedDatabase =
                await HospiredStorage.initialize();

            if (
                initializedDatabase &&
                typeof initializedDatabase.transaction === "function"
            ) {

                this.db =
                    initializedDatabase;

            }

        }

        if (
            !this.db ||
            typeof this.db.transaction !== "function"
        ) {
            throw new Error(
                "HospiredDatabase could not establish a valid database connection."
            );
        }

        return this.db;
    }


    // ------------------------------------------------------
    // Connection state
    // ------------------------------------------------------

    get isConnected() {

        return !!(
            this.db &&
            typeof this.db.transaction === "function"
        );
    }


    close() {

        this.db = null;
    }


    // ------------------------------------------------------
    // Store validation
    // ------------------------------------------------------

    async ensureStore(storeName) {

        const db =
            await this.connect();

        if (
            !db.objectStoreNames ||
            !db.objectStoreNames.contains(storeName)
        ) {

            throw new Error(
                `Object store "${storeName}" does not exist.`
            );
        }

        return db;
    }


    // ------------------------------------------------------
    // Transaction
    // ------------------------------------------------------

    async transaction(
        storeName,
        mode = "readonly"
    ) {

        const db =
            await this.ensureStore(storeName);

        try {

            const transaction =
                db.transaction(
                    storeName,
                    mode
                );

            return transaction.objectStore(
                storeName
            );

        } catch (error) {

            this.db = null;

            throw error;
        }
    }


    // ------------------------------------------------------
    // Helpers
    // ------------------------------------------------------

    async exists(
        storeName,
        id
    ) {

        const item =
            await this.get(
                storeName,
                id
            );

        return item !== undefined &&
               item !== null;
    }


    generateUUID() {

        if (
            typeof HospiredUtils === "undefined" ||
            typeof HospiredUtils.generateUUID !== "function"
        ) {

            throw new Error(
                "HospiredUtils.generateUUID() is not available."
            );
        }

        return HospiredUtils.generateUUID();
    }


    generateDate() {

        if (
            typeof HospiredUtils === "undefined" ||
            typeof HospiredUtils.generateDate !== "function"
        ) {

            throw new Error(
                "HospiredUtils.generateDate() is not available."
            );
        }

        return HospiredUtils.generateDate();
    }


    // ------------------------------------------------------
    // Create
    // ------------------------------------------------------

    async add(
        storeName,
        data
    ) {

        if (
            !data ||
            typeof data !== "object"
        ) {

            throw new TypeError(
                "Database.add() requires a data object."
            );
        }

        const objectStore =
            await this.transaction(
                storeName,
                "readwrite"
            );

        /*
         * Preserve an existing UUID.
         */
        if (!data.uuid) {

            data.uuid =
                this.generateUUID();
        }

        const now =
            this.generateDate();

        if (!data.createdAt) {

            data.createdAt =
                now;
        }

        data.updatedAt =
            now;

        return new Promise(
            (resolve, reject) => {

                const request =
                    objectStore.add(data);

                request.onsuccess = () => {

                    resolve(data);
                };

                request.onerror = () => {

                    reject(
                        request.error
                    );
                };
            }
        );
    }


    // ------------------------------------------------------
    // Update
    // ------------------------------------------------------

    async update(
        storeName,
        data
    ) {

        if (
            !data ||
            typeof data !== "object"
        ) {

            throw new TypeError(
                "Database.update() requires a data object."
            );
        }

        const objectStore =
            await this.transaction(
                storeName,
                "readwrite"
            );

        data.updatedAt =
            this.generateDate();

        return new Promise(
            (resolve, reject) => {

                const request =
                    objectStore.put(data);

                request.onsuccess = () => {

                    resolve(data);
                };

                request.onerror = () => {

                    reject(
                        request.error
                    );
                };
            }
        );
    }


    // ------------------------------------------------------
    // Delete
    // ------------------------------------------------------

    async delete(
        storeName,
        id
    ) {

        const objectStore =
            await this.transaction(
                storeName,
                "readwrite"
            );

        return new Promise(
            (resolve, reject) => {

                const request =
                    objectStore.delete(id);

                request.onsuccess = () => {

                    resolve(true);
                };

                request.onerror = () => {

                    reject(
                        request.error
                    );
                };
            }
        );
    }


    // ------------------------------------------------------
    // Get one
    // ------------------------------------------------------

    async get(
        storeName,
        id
    ) {

        const objectStore =
            await this.transaction(
                storeName,
                "readonly"
            );

        return new Promise(
            (resolve, reject) => {

                const request =
                    objectStore.get(id);

                request.onsuccess = () => {

                    resolve(
                        request.result
                    );
                };

                request.onerror = () => {

                    reject(
                        request.error
                    );
                };
            }
        );
    }


    // ------------------------------------------------------
    // Get all
    // ------------------------------------------------------

    async getAll(
        storeName
    ) {

        const objectStore =
            await this.transaction(
                storeName,
                "readonly"
            );

        return new Promise(
            (resolve, reject) => {

                const request =
                    objectStore.getAll();

                request.onsuccess = () => {

                    resolve(
                        request.result || []
                    );
                };

                request.onerror = () => {

                    reject(
                        request.error
                    );
                };
            }
        );
    }


    // ------------------------------------------------------
    // Clear store
    // ------------------------------------------------------

    async clear(
        storeName
    ) {

        const objectStore =
            await this.transaction(
                storeName,
                "readwrite"
            );

        return new Promise(
            (resolve, reject) => {

                const request =
                    objectStore.clear();

                request.onsuccess = () => {

                    resolve(true);
                };

                request.onerror = () => {

                    reject(
                        request.error
                    );
                };
            }
        );
    }


    // ------------------------------------------------------
    // Count records
    // ------------------------------------------------------

    async count(
        storeName
    ) {

        const objectStore =
            await this.transaction(
                storeName,
                "readonly"
            );

        return new Promise(
            (resolve, reject) => {

                const request =
                    objectStore.count();

                request.onsuccess = () => {

                    resolve(
                        request.result || 0
                    );
                };

                request.onerror = () => {

                    reject(
                        request.error
                    );
                };
            }
        );
    }


    // ------------------------------------------------------
    // Find by index
    // ------------------------------------------------------

    async findBy(
        storeName,
        index,
        value
    ) {

        const objectStore =
            await this.transaction(
                storeName,
                "readonly"
            );

        /*
         * Use the IndexedDB index when available.
         */
        if (
            objectStore.indexNames &&
            objectStore.indexNames.contains(index)
        ) {

            return new Promise(
                (resolve, reject) => {

                    const request =
                        objectStore
                            .index(index)
                            .get(value);

                    request.onsuccess = () => {

                        resolve(
                            request.result
                        );
                    };

                    request.onerror = () => {

                        reject(
                            request.error
                        );
                    };
                }
            );
        }

        /*
         * Fallback for stores without the index.
         */
        const records =
            await this.getAll(
                storeName
            );

        return records.find(
            record =>
                record &&
                record[index] === value
        );
    }


    // ------------------------------------------------------
    // Find all by field
    // ------------------------------------------------------

    async findAllBy(
        storeName,
        field,
        value
    ) {

        const objectStore =
            await this.transaction(
                storeName,
                "readonly"
            );

        /*
         * Use the IndexedDB index when available.
         */
        if (
            objectStore.indexNames &&
            objectStore.indexNames.contains(field)
        ) {

            return new Promise(
                (resolve, reject) => {

                    const request =
                        objectStore
                            .index(field)
                            .getAll(value);

                    request.onsuccess = () => {

                        resolve(
                            request.result || []
                        );
                    };

                    request.onerror = () => {

                        reject(
                            request.error
                        );
                    };
                }
            );
        }

        /*
         * Fallback for fields without indexes.
         */
        const records =
            await this.getAll(
                storeName
            );

        return records.filter(
            record =>
                record &&
                record[field] === value
        );
    }


    // ------------------------------------------------------
    // Find first by field
    // ------------------------------------------------------

    async findFirstBy(
        storeName,
        field,
        value
    ) {

        const objectStore =
            await this.transaction(
                storeName,
                "readonly"
            );

        /*
         * Use the IndexedDB index when available.
         */
        if (
            objectStore.indexNames &&
            objectStore.indexNames.contains(field)
        ) {

            return new Promise(
                (resolve, reject) => {

                    const request =
                        objectStore
                            .index(field)
                            .get(value);

                    request.onsuccess = () => {

                        resolve(
                            request.result
                        );
                    };

                    request.onerror = () => {

                        reject(
                            request.error
                        );
                    };
                }
            );
        }

        /*
         * Fallback for fields without indexes.
         */
        const records =
            await this.getAll(
                storeName
            );

        return records.find(
            record =>
                record &&
                record[field] === value
        );
    }
}


/**
 * ==========================================================
 * Global instance
 * ==========================================================
 */

window.HospiredDatabase =
    new HospiredDatabase();