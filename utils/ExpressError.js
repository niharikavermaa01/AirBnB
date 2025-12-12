class ExpressError extends Error {
    constructor (status,message){
        super();
        this.statusCode = status;
        this.message = message;
    }
}
module.exports = ExpressError;

//By default our express can handle the error but to display our custom error, we create this middleware.