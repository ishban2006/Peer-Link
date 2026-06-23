class expressError extends Error {
    constructor(statusCode, message) {
        super();        // Inheritance Thing
        this.statusCode = statusCode;
        this.message = message;
    }
}
module.exports = expressError;