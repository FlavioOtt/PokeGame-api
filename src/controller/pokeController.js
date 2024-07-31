const pokeModel = require("../model/pokeModel");
const axios = require("axios");

const url_api = require("../config").pokeApi;

let url = url_api+"/pokemon/";

exports.get = async (name) => {

    let res = await axios({
        method: 'get',
        url: url+name
    })

    return await pokeModel.formatPokeData(res.data);
}