const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function (app) {
    //get all the articles from the db
    app.get("/", function (req, res) {
        db.Article.find({}).sort({
            "_id": -1
        }).then(function (dbArticle) {
            res.render("home", {
                data: dbArticle
            });
        }).catch(function (err) {
            res.json(err)
        });
    });
    //get route for scraping the site
    app.get("/scrape", function (req, res) {
        axios.get("https://www.echojs.com/").then(function (response) {
            //load the body into cheerio 
            const $ = cheerio.load(response.data);

            $("article h2").each(function (i, element) {
                const result = {};
                //add the text and href of every link and save them as properties of the result object
                result.title = $(this).children("a").text();
                result.link = $(this).children("a").attr("href");
                //prevent duplicate entries
                db.Article.findOne({
                    title: result.title,
                    link: result.link
                }).then(function (dbArticle) {
                   // console.log(dbArticle.title + " already in db!")
                }).catch(function (err) {
                    //create a new article using the result object
                    db.Article.create(result).then(function (dbArticle) {
                        console.log(dbArticle);
                            res.render("home")
                        })
                        .catch(function (err) {
                            console.log(err) //add user validation here 
                        })
                })
            })
            res.send("scrape complete")
        });
    });

    // Route for getting all saved articles
    app.get("/saved", function (req, res) {
        //grab every doc in the article collection
        db.Article.find({
                saved: true
            }).then(function (dbArticle) {
                //send back to the client
                res.render("saved", {
                    data: dbArticle
                })
            })
            .catch(function (err) {
                return res.status(500).end();
            });
    })

    //route for saving an article 
    app.put("/saved:id", function (req, res) {
        db.Article.findByIdAndUpdate({
                _id: req.params.id
            }, {
                $set: {
                    saved: true
                }
            })
            .then(function (dbArticle) {
                res.render("saved", {
                    data: dbArticle
                })
                console.log(dbArticle)
            }).catch(function (err) {
                res.json(err)
            })
    })
    // delete ALL route
    app.delete("/delete", function (req, res) {
        //grab all documents in the article collection
        db.Article.deleteMany({}).then(function (dbArticle) {
            console.log(dbArticle)
        }).catch(function (err) {
            res.json(err);
        })
    });

    // Route for removing/updating saved article
    app.put("/delete/:id", function (req, res) {
            db.Article.findByIdAndUpdate({
                    _id: req.params.id
                }, {
                    saved: false
                }
                .then(function (dbArticle) {
                })
                .catch(function (err) {
                    res.json(err);

                })
            )
        }

    )
};