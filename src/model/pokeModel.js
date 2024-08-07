const mysql = require("./mysqlConnect");
const movesModel = require("./movesModel");

async function formatPokeData(data_){
    
    let data = [];

    let movesData = await movesModel.formatPokeMoves(data_.moves);

    for (index in data_){
        
        if (index == 'name'){
            data.push()
        }
    }

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

async function getPokeEvolution(chainId){
    if (chainId && typeof(chainId) == "number"){

        let chain = await axios({
            method: "get",
            url: ""
        })

    }
}

module.exports = { formatPokeData }
