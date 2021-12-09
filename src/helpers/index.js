const CryptoJS = require('crypto-js');

const encryptPassword = (password) => {
    return CryptoJS.AES.encrypt(password, process.env.PASSWORD_SECRET).toString()
}

const decryptPassword = (password) => {
    return CryptoJS.AES.decrypt(password, process.env.PASSWORD_SECRET).toString(CryptoJS.enc.Utf8)
}

module.exports = { encryptPassword, decryptPassword }