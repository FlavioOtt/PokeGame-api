const pokeModel = require("../model/pokeModel");
const userModel = require("../model/userModel");
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

exports.givePoke = async (token, id_poke) => {
    let res = [];

    let tokenData = await userModel.verifyJWT(token, null);

    if (tokenData.auth && parseInt(id_poke))
        res = await pokeModel.givePokeTo(parseInt(id_poke), tokenData.id_account)

    return res;
}
