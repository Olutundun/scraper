const db = require("../models");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function (app) {
    app.get("/", function (req, res) {
        res.render("app");
    })
    //get route for scraping the nba site
    app.get("/scrape", function (req, res) {
        axios.get("https://www.nba.com/").then(function (response) {
            //load the body into cheerio 
            const $ = cheerio.load(response.data)
            const result = {};

            result.title = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");

            //create a new article using the result object
            db.Article.create(result).then(function (dbArticle) {
                    console.log(dbArticle)
                })
                .catch(function (err) {
                    console.log(err) //add user validation here 
                })
            res.render("scrape")
        })
    })
    // Route for getting all Articles from the db
    app.get("/articles", function (req, res) {
        //grab every dooc in the article collection
        db.Article.find({}).then(function (dbArticle) {
                //send back to the client
                res.json(dbArticle)
            })
            .catch(function (err) {
                return res.status(500).end(); //generic server failure
            })
    })
}
// Route for viewing saved articles