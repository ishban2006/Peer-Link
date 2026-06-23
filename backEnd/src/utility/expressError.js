class expressError extends Error {
    constructor(statusCode, message) {
        super(message);        // Inheritance Thing
        this.statusCode = statusCode;
        this.message = message;
    }
}
module.exports = expressError;