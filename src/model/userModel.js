const bcrypt = require("bcrypt");
const mysql = require("./mysqlConnect");
const jwt = require("jsonwebtoken");

const {
    KEY_TOKEN
} = process.env;

login = async (data) => {

    let res = await mysql.query(`
        SELECT id_account,email,password,account_type,premium_day,premium_start_at,register_at,
            (
                SELECT list FROM pokemons_list
                WHERE account_id_account = a.id_account
            ) AS pokemons_list
        FROM accounts a JOIN pokemons_list pl WHERE email='${data.email}';
    `)
    
    if (Array.isArray(res)){
        if (res.length > 0){
            
            res = res[0];          
            
            if (data.email === res.email){

                let token_login = await jwt.sign(
                    {  
                        "id_account": res.id_account,
                        "email": res.email,
                        "pokemons_list": res.pokemons_list,
                        "premium_days": res.premium_day,
                        "register_at": res.register_at,
                        "premium_start_at": res.premium_start_at,
                        "account_type": res.account_type
                    }, 
                    KEY_TOKEN, {
                        expiresIn: 1
                    }
                );

                let token = await jwt.sign(
                    {  
                        "id_account": res.id_account,
                        "email": res.email
                    }, 
                    KEY_TOKEN
                );

                return {
                    "auth": true, 
                    "message": "Login realizado com sucesso.",
                    "user": {
                        "token": token,
                        "token_login": token_login,
                        "password": res.password
                    }                    
                }

            }else{

                return {
                    "auth": false, 
                    "message": "Credenciais incorretas", 
                    "token": ""
                }

            }

        }else{

            return {
                "auth": false, 
                "message": "Credenciais incorretas", 
                "token": ""
            }

        }
    }
}

verifyJWT = async (token,token_login) => { 
    
    if (token_login)
        login = await jwt.verify(token_login, KEY_TOKEN, (err, decoded) => data = decoded );

    if (!token)
        resp = { "auth": false, "message": 'Token não informado.' }; 
    
    if (!login)
        resp = { "auth": false, "message": 'Credenciais incorretas' }; 
    
    jwt.verify(token, KEY_TOKEN, function(err, decoded) { 
        
        if (err)
            resp = { "auth": false, "message": 'Token inválido!' };
        
        if (decoded){
            if (!token_login)
                resp = { 
                    "auth": true,
                    "id_account": decoded.id_account,
                    "email": decoded.email
                };
            else
                resp = { "auth": true, "data": data, "email": decoded.email};
        }
        
    });
    
    return resp;
}

register = async (body) => {
    console.log(body);
    
    
    if (body){
        if (body.email && typeof(body.email) == "string")
            if (body.password && typeof(body.password) == "string"){

                let register_at = new Date().toLocaleDateString("pt-br");

                let res = await mysql.query(`
                    SELECT * FROM accounts WHERE email = '${body.email}'    
                `);

                if (res && res.length > 0)
                    return { auth: false, message: "Email já cadastrado", data: {} };

                let acc = await mysql.query(`
                    INSERT INTO accounts (
                        email,
                        password,
                        register_at,
                        account_type,
                        premium_start_at,
                        premium_day
                    ) VALUES (
                        "${body.email}",
                        "${body.password}",
                        "${register_at}",
                        "Premium",
                        "${register_at}",
                        "3"
                    ); 
                    SELECT LAST_INSERT_ID() AS id_account;
                    INSERT INTO pokemons_list (
                        list,
                        account_id_account,
                        last_list,
                        last_update_at
                    ) VALUES(
                        '${JSON.stringify({})}',
                        LAST_INSERT_ID(),
                        '${JSON.stringify({})}',
                        '${new Date().toLocaleDateString("pt-br")}'
                    );
                `);              

                let token = await jwt.sign(
                    { 
                        "email": body.cargo, 
                        "id_account": acc[1][0].id_account,
                    }, 
                    KEY_TOKEN
                );

                return { 
                    auth: true,
                    message: "Cadastro realizado", 
                    data: {
                        "email": body.email,
                        "id_account": acc[1][0].id_account,
                        "premium": 3,
                        "register_at": register_at,
                        "premium_start_at": register_at,
                        "token": token
                    }
                }; 

            }
    }

    return { auth: false, message: "Erro inesperado, contate o desenvolvedor.", data: {} };
}

myPokes = async (id_account) => {
    if (id_account && parseInt(id_account)){

        let pokemons = await mysql.query(`SELECT list from pokemons_list WHERE account_id_account = ${parseInt(id_account)}`);
        
        return pokemons[0].list;

    }
}

module.exports = { login, verifyJWT, register, myPokes }
