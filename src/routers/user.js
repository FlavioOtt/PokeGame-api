const express = require('express');
const userController = require("../controller/userController");
const userRouter = express.Router(); 

userRouter.get('/', async(req, res, next) => {
    user = await userController.get(req.headers);
    res.status(200).send(user);
})
    
userRouter.post('/register', async(req, res, next) => {
    console.log(req.body);
    
    user = await userController.register(req.body);
    res.status(200).send(user);
})

userRouter.get('/login', async(req, res, next) => {
    user = await userController.login(req.headers);
    res.status(200).send(user);
})

userRouter.get('/verifytoken', async(req, res, next) => {
    user = await userController.verifyToken(req.headers.token,req.headers.token_login);
    res.status(200).send(user);
})

userRouter.get("/mypokes", async (req, res, next) => {
    if (req.headers["x-access-control"]){
        if (req.headers["x-access-control"] === process.env.TOKEN_API)
        user = await userController.myPokes(req.headers["x-access-user"]);
        res.status(200).send(user);
    }
})

module.exports = userRouter;
