const express = require('express');
const pokeController = require("../controller/pokeController");
const pokeRouter = express.Router(); 

pokeRouter.get('/', async(req, res, next) => {
    poke = await pokeController.get(req.headers);
    res.status(200).send(poke);
})

pokeRouter.get('/data/:pokename', async(req, res, next) => {
    poke = await pokeController.get(req.params.pokename);
    res.status(200).send(poke);
})

pokeRouter.get('/data/:pokename/:stat', async(req, res, next) => {
    poke = await pokeController.get([req.params.pokename, req.params.stat]);
    res.status(200).send(poke);
})

pokeRouter.get("/givepoke", async (req, res, next) => {
    if (req.headers["x-access-control"]){
        if (req.headers["x-access-control"] === process.env.TOKEN_API){
            poke = await pokeController.givePoke(req.headers["x-access-user"], req.query.id_poke);
            res.status(200).send(poke);
        }
    }
})
    
module.exports = pokeRouter;
