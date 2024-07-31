const mysql = require("./mysqlConnect");
const axios = require("axios");

async function formatPokeMoves(moves_){
    let moves = [];
    
    if (moves_ && moves_.length > 0){
        moves_.map(move => {
            console.log(move);
            moves.push(move)
        })

    }

    return moves;
}

formatedPokeMoves = {
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


module.exports = { formatPokeMoves }
