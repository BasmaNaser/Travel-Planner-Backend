const bcryptjs = require('bcryptjs')
require('dotenv').config()

async function hashedPass(pass){
    let salt = await bcryptjs.genSalt(Number(process.env.SALT))
    let hashedPassword = await bcryptjs.hash(pass,salt)
    return hashedPassword
}

async function comparedPasswords(password,hashedpassword){
    return await bcryptjs.compare(password,hashedpassword)
}
module.exports = {hashedPass,comparedPasswords}