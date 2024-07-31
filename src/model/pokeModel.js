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

    return movesData;

}

formatedPokeData = {
    name: "",
    level: 0,
    evolutions: [
        ["de", "para", 0/*lvl necessario*/],
        ["de", "para", 0/*lvl necessario*/]
    ],
    attacks: [
        {
            name: "transform", 
            damage: ""
        },
    ]
}


module.exports = { formatPokeData }
