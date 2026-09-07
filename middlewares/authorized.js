const Apierror = require("../utils/apiError")

function authorization(...roles) {
    return function(req,res,next){
        try {
        const user = req.user
        if(!user){
            return next(new Apierror('User not authenticated', 401))
        }
        if(!roles.includes(user.role)){
            return next(new Apierror('You are not authorized to access this resource', 403))
        }
        next()
    } catch (error) {
        next(error)
    }

    }
}

module.exports = authorization