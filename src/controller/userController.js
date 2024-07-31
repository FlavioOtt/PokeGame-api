const userModel = require("../model/userModel");
const mysql = require("../model/mysqlConnect");

exports.get = async (header) => {
    let res = await mysql.query(`SELECT * FROM user`);
    return res;
}

exports.login = async (headers) => {
    return userModel.login(headers);
}

exports.verifyToken = async (token) => {
    return userModel.verifyJWT(token);
}
