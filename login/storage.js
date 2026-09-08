/**
 * ==========================================================
 * Hospired Storage
 * IndexedDB Manager
 * ==========================================================
 */

class HospiredStorage {

    constructor() {

        this.database = null;

        this.initializing = null;

    }

    /*
    ==========================================================
    INITIALIZE DATABASE
    ==========================================================
    */

    async initialize() {

        if (this.database) {

            return this.database;

        }

        if (this.initializing) {

            return this.initializing;

        }

        this.initializing = new Promise((resolve, reject) => {

            const request = indexedDB.open(

                HOSPIRED_CONFIG.DATABASE.NAME,

                HOSPIRED_CONFIG.DATABASE.VERSION

            );

            request.onerror = () => {

                console.error("IndexedDB Error");

                reject(request.error);

            };

            request.onupgradeneeded = event => {

                const db = event.target.result;

                this.createStores(db);

            };

            request.onsuccess = () => {

                this.database = request.result;

                console.log("Database Connected");

                resolve(this.database);

            };

        });

        return this.initializing;

    }

    /*
    ==========================================================
    CREATE STORES
    ==========================================================
    */

    createStores(db) {

        const stores =

            HOSPIRED_CONFIG.DATABASE.STORES;

        this.createStore(db, stores.PATIENTS);

        this.createStore(db, stores.INSTITUTIONS);

        this.createStore(db, stores.APPOINTMENTS);

        this.createStore(db, stores.MEDICAL_RECORDS);

        this.createStore(db, stores.NOTIFICATIONS);

        this.createStore(db, stores.SETTINGS);

    }

    /*
    ==========================================================
    CREATE STORE
    ==========================================================
    */

    createStore(db, name) {

        if (db.objectStoreNames.contains(name)) {

            return;

        }

        const store = db.createObjectStore(

            name,

            {

                keyPath: "id",

                autoIncrement: true

            }

        );

        store.createIndex(

            "uuid",

            "uuid",

            {

                unique: true

            }

        );

        store.createIndex(

            "email",

            "email",

            {

                unique: false

            }

        );

        store.createIndex(

            "createdAt",

            "createdAt",

            {

                unique: false

            }

        );

    }

    /*
    ==========================================================
    CONNECTION
    ==========================================================
    */

    get databaseConnection() {

        return this.database;

    }

    get connected() {

        return this.database !== null;

    }

    /*
    ==========================================================
    CLOSE
    ==========================================================
    */

    close() {

        if (!this.database) {

            return;

        }

        this.database.close();

        this.database = null;

        this.initializing = null;

    }

    /*
    ==========================================================
    DELETE DATABASE
    ==========================================================
    */

    async destroy() {

        this.close();

        return new Promise((resolve, reject) => {

            const request = indexedDB.deleteDatabase(

                HOSPIRED_CONFIG.DATABASE.NAME

            );

            request.onsuccess = () => {

                console.log("Database Deleted");

                resolve(true);

            };

            request.onerror = () => {

                reject(request.error);

            };

        });

    }

}

window.HospiredStorage = new HospiredStorage();