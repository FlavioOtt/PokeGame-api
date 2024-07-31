const mysql = require("./mysqlConnect");
const jwt = require("jsonwebtoken");

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

module.exports = {login, verifyJWT }
