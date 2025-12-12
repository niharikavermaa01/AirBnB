const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    newListing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("",null),
    }).required()
});

//We use Joi to validate our form submisssion request to check 
//if user did not entered a detail in any column that was required so this kind of errors our joi will handle 

module.exports.reviewSchema= Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment:Joi.string().required()
    }).required()
});