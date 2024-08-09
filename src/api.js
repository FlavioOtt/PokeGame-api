const express = require("express");
const cors = require("cors");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

app.use(cors({origin: "http://localhost:3000", credentials: true}));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

//====================== Rotas  =======================
const route = require("./routers/route");
const user = require("./routers/user")
const poke = require("./routers/poke")

app.use("/", route);
app.use("/user", user);
app.use("/pokemon", poke);

module.exports = app;

