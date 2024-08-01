const mysql = require("./mysqlConnect");
const axios = require("axios");

async function formatPokeMoves(moves_){
    let moves = [];

    let promises

    if (moves_ && moves_.length > 0){

        promises = moves_.map(async move => {

            let version_group_details = await move.version_group_details.find(i => i.version_group.name == "red-blue");

            if (version_group_details){

                let res = await axios({
                    method: "get",
                    url: move.move.url
                });

                let type_data = await axios({
                        method: "get",
                        url: res.data.type.url
                    })
           
                for (infos in res){

                    let attack = res[infos];
            
                    if (res[infos].name){
                        
                        await moves.push(
                            {
                                id: attack.id,
                                name: attack.name, 
                                base_damage: attack.power,
                                type: res.data.type.name,
                                accuracy: attack.accuracy,
                                level_learned_at: version_group_details.level_learned_at,
                                move_learn_method: version_group_details.move_learn_method.name,
                                damage_relations: type_data.data.damage_relations,
                                contest_combos: res.data.contest_combos
                            }
                        );

                    }
            
                }
    
            }
        })

    }
    
    await Promise.all(promises)

    return await moves;
}

module.exports = { formatPokeMoves }
