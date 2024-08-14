const mysql = require("./mysqlConnect");
const movesModel = require("./movesModel");
const { default: axios } = require("axios");

async function formatPokeData(data_){

    let movesData = await movesModel.formatPokeMoves(data_.moves);

    let images = {
        back_default: data_.sprites.back_default, 
        back_shiny: data_.sprites.back_shiny, 
        back_female: data_.sprites.back_female, 
        front_default: data_.sprites.front_default, 
        front_shiny: data_.sprites.front_shiny, 
        front_female: data_.sprites.front_female
    }

    let stats = [];

    let promises = data_.stats.map(stat => {
        
        stats.push({
            name: stat.stat.name,
            base_stat: stat.base_stat,
            effort: stat.effort
        })

    });;

    await Promise.all(promises);

    let formatedPokeData = {
        name: data_.name,
        level: 0,
        weight: data_.weight,
        is_default: data_.is_default,
        images: images,
        base_exp: data_.base_experience,
        height: data_.height,
        stats: stats,
        cry: data_.cries.legacy,
        moves: movesData
    }

    return formatedPokeData;

}

async function givePokeTo(id_poke,id_account){
    if ((id_poke && parseInt(id_poke)) && (id_account && parseInt(id_account))){
        
        let poke_data = await axios.get(`https://pokeapi.co/api/v2/pokemon/${parseInt(id_poke)}`);

        if (poke_data != "Not Found"){
            
            let poke_data_format = await formatPokeData(poke_data.data);

            let res = await mysql.query(`SELECT * FROM pokemons_list WHERE account_id_account=${parseInt(id_account)}`);

            if (res){
               
                let list = JSON.parse(res[0].list);
                
                let newLastList = await list;

                await list.push(poke_data_format);

                let newList = await JSON.stringify(list);

                let suc = await mysql.query(
                    `
                        UPDATE pokemons_list SET 
                            list='${newList}', 
                            last_list='${JSON.stringify(newLastList)}'
                        WHERE 
                            account_id_account = ${parseInt(id_account)}
                    `
                )

                if (suc.changedRows > 0)
                    resp = { auth: true, message: "Pokemon adicionado", data: poke_data_format }
                else
                    resp = { auth: false, message: "Erro, contate o desenvolvedor" }
                
            }else{
                resp = { auth: false, message: "Erro, contate o desenvolvedor" }
            }

        }else
            resp = { auth: false, message: "Pokemon não encontrado" }

    }else
        resp = { auth: false, message: "Erro, dados informados incorretamente" }

    return resp;
}

async function getPokeEvolution(chainId){
    if (chainId && typeof(chainId) == "number"){

        let chain = await axios({
            method: "get",
            url: ""
        })

    }
}

module.exports = { formatPokeData, givePokeTo }
