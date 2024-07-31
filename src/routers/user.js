const express = require('express');
const userController = require("../controller/userController");
const userRouter = express.Router(); 

userRouter.get('/', async(req, res, next) => {
    user = await userController.get(req.headers);
    res.status(200).send(user);
})
    
userRouter.get('/login', async(req, res, next) => {
    user = await userController.login(req.headers);
    res.status(200).send(user);
})

userRouter.get('/verifytoken', async(req, res, next) => {
    if (Array.isArray(req.body)){
        body = req.body[0]
    }
    user = await userController.verifyToken(req.headers.token);
    res.status(200).send(user);
})

module.exports = userRouter;
