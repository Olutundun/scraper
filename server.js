const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");

//initialize express
const app = express();

//require all models
const db = require("./models");

//port
const PORT = process.env.PORT || 3000;

//app.use(logger("dev"));
//handlebars
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

//Parse request body as JSON
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

//make public a static folder
app.use(express.static("public"));

//connect to the Mongo DB
mongoose.connect("mongodb://localhost/nbadb", {
    useNewUrlParser: true
});

//route
require("./routes/htmlRoutes")(app);

//server
app.listen(PORT, function () {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
    PORT,
    PORT)
});

module.exports = app;