const express = require('express');
const pokeController = require("../controller/pokeController");
const pokeRouter = express.Router(); 

pokeRouter.get('/', async(req, res, next) => {
    poke = await pokeController.get(req.headers);
    res.status(200).send(poke);
})

pokeRouter.get('/:pokename', async(req, res, next) => {
    poke = await pokeController.get(req.params.pokename);
    res.status(200).send(poke);
})

pokeRouter.get('/:pokename/:stat', async(req, res, next) => {
    poke = await pokeController.get([req.params.pokename, req.params.stat]);
    res.status(200).send(poke);
})
    
module.exports = pokeRouter;
