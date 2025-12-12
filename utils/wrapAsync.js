module.exports = (fn) => {
    return function (req, res, next) {
        fn(req, res, next).catch((err)=>next(err));
    }
}
//when error occurs in the async routes means in database we use the async wrap.
//this heps to write the repetitive try catch block of code. 