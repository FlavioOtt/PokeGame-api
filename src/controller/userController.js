const userModel = require("../model/userModel");
const mysql = require("../model/mysqlConnect");

exports.get = async (header) => {
    let res = await mysql.query(`SELECT * FROM user`);
    return res;
}

exports.login = async (headers) => {
    return await userModel.login(headers);
}

exports.register = async (body) => {
    return await userModel.register(body);
}

exports.verifyToken = async (token,token_login) => {
    return userModel.verifyJWT(token, token_login);
}

exports.myPokes = async (token) => {
    let res = [];

    let tokenData = await userModel.verifyJWT(token, null);

    if (tokenData.auth)
        res = await userModel.myPokes(tokenData.id_account)

    return res;
}
