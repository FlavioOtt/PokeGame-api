const mysql = require("mysql2/promise");
const env = require("dotenv");

const {
    DB_HOST,
    DB_USER,
    DB_PORT,
    DB_USER_PASS,
    DB_DATABASE
} = process.env;

async function connect(){
    if (global.connection && global.connection.state !== "disconnected")
        return global.connection;
    
    const connection = await mysql.createConnection({
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_USER_PASS,
        database: DB_DATABASE,
        multipleStatements: true
    });

    console.log(`Conectou no MySQL!`);
    
    global.connection = connection;
    return connection;
}

async function query(sql){

    const conn = await connect();

    const [rows] = await conn.query(sql);
    return rows;
    
}

module.exports={query,connect}