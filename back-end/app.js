// Setup server, session and middleware here.
const express = require("express");
const app = express();
const session = require("express-session");
const configRoutes = require("./routes");

let count = {};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        name: "AuthCookie",
        secret: "This is a secret.. shhh don't tell anyone",
        saveUninitialized: true,
        resave: false,
        cookie: { maxAge: 86400000 },
    })
);

configRoutes(app);

app.listen(3001, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3001");
});
