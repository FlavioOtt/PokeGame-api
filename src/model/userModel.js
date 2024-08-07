const mysql = require("./mysqlConnect");
const jwt = require("jsonwebtoken");

const {
    TOKEN_EMAIL_CHECKER,
    KEY_TOKEN
} = process.env;

login = async (data) => {
    let res = await mysql.query(`
        SELECT id_peaple,cargo,funcao,
            (
                SELECT senha FROM user
                WHERE peaple_id_peaple = p.id_peaple AND senha = '${data.senha}'
            ) AS senha
        FROM peaple p JOIN user u WHERE cargo = '${data.cargo}';
    `)
    if (Array.isArray(res)){
        if (res.length > 0){

            res = res[0];
            console.log(res);
            if (data.cargo === res.cargo && data.senha === res.senha){

                let token = await jwt.sign({"cargo": res.cargo, "id_peaple": res.id_peaple}, "Q0lNT0w=", {
                    expiresIn: 600
                });

                return {
                    "auth": true, 
                    "message": "Login realizado com sucesso.",
                    "user": {
                        "cargo": res.cargo,
                        "funcao": res.funcao,
                        "id_peaple": res.id_peaple,
                        "token": token
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
    
    jwt.verify(token, 'Q0lNT0w=', function(err, decoded) { 
        if (err){
            resp = { "auth": false, "message": 'Token inválido!' };
        }
        if (decoded){
            resp = { "auth": true, "id_peaple": decoded.id_peaple, "login": decoded.login};
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
                    ); SELECT LAST_INSERT_ID() AS id_account;
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
