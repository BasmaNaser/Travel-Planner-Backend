const jwt = require('jsonwebtoken')
require('dotenv').config()

let accessTokenFun=  function(user){
    return  jwt.sign(
        {
            id:user._id,
            email:user.email,
            role:user.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:'40m'
        }
    )
}
let refreshTokenFun =  function(user){
    return  jwt.sign(
        {
            id:user._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:'20d'
        }
    )
}

let resetTokenFun = function(user){
    return  jwt.sign(
        {
            id:user._id,
            email:user.email,
        },
        process.env.RESET_TOKEN_SECRET,
        {
            expiresIn:'15m'
        }
    )
}

module.exports={accessTokenFun,refreshTokenFun,resetTokenFun}