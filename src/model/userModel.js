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
            
            if (data.email === res.email && data.password === res.password){

                let token = await jwt.sign(
                    { 
                        "email": res.email, 
                        "id_account": res.id_account,
                    }, 
                    KEY_TOKEN
                );

                return {
                    "auth": true, 
                    "message": "Login realizado com sucesso.",
                    "user": {
                        "token": token,
                        "id_account": res.id_account,
                        "email": res.email,
                        "pokemons_list": res.pokemons_list,
                        "premium_days": res.premium_day,
                        "register_at": res.register_at,
                        "premium_start_at": res.premium_start_at,
                        "account_type": res.account_type
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

verifyJWT = async (token) => { 
    if (!token){
        resp = { "auth": false, "message": 'Token não informado.' }; 
    }
    
    jwt.verify(token, KEY_TOKEN, function(err, decoded) { 
        if (err){
            resp = { "auth": false, "message": 'Token inválido!' };
        }
        if (decoded){
            resp = { "auth": true, "id_account": decoded.id_account, "email": decoded.email};
        }
    });
    return resp;
}

register = async (body) => {
    
    if (body){
        if (body.email && typeof(body.email) == "string")
            if (body.password && typeof(body.password) == "string"){

                let register_at = new Date().toLocaleDateString("pt-br");

                let res = await mysql.query(`
                    SELECT * FROM accounts WHERE email = '${body.email}'    
                `);

                if (res && res.length > 0)
                    return { message: "Email já cadastrado", data: {}, status: 400, error: true };

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
                    message: "Cadastro realizado", 
                    data: {
                        "email": body.email,
                        "id_account": acc[1][0].id_account,
                        "premium": 3,
                        "register_at": register_at,
                        "premium_start_at": register_at,
                        "token": token
                    }, 
                    status: 200, 
                    error: false 
                }; 

            }
    }
}

module.exports = { login, verifyJWT, register }

/*
let check_email = await axios({
    method: "get",
    url: `https://emailvalidation.abstractapi.com/v1/?api_key=${TOKEN_EMAIL_CHECKER}&email=${body.email}`
})
*/
