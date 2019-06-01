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
        axios.get("https://www.nytimes.com/section/sports/basketball").then(function (response) {
            //load the body into cheerio 
            const $ = cheerio.load(response.data);

            $("div.story-meta").each(function (i, element) {

                const result = {};

                //add the text and href of every link and save them as properties of the result object
                result.title = $(this).children(".headline").text();
                result.summary = $(this).children(".summary").text();

                //prevent duplicate entries
                db.Article.findOne({
                    title: result.title,
                    summary: result.summary,
                }).then(function (dbArticle) {
                    //found one
                    //found none
                    if (dbArticle) {
                        console.log(dbArticle.title + " already in db!")
                    } else {
                        //create new one
                    }
                }).catch(function (err) {
                    //create a new article using the result object
                    db.Article.create(result).then(function (dbArticle) {
                            console.log(dbArticle);
                            //res.render("home")
                        })
                        .catch(function (err) {
                            console.log(err)
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
    //delete ALL route
    app.delete("/delete", function (req, res) {
        //grab all documents in the article collection
        db.Article.deleteMany({}).then(function (dbArticle) {
            console.log(dbArticle)
        }).catch(function (err) {
            res.json(err);
        })
    });

    //delete saved articles
    app.delete("/delete", function (req, res) {
        //grab every doc in the article collection
        db.Article.deleteOne({
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

    app.delete("/delete/:id", function (req, res) {
        db.Article.deleteOne({
                _id: req.params.id
            })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for grabbing a specific Article by id, populate it with it's comment
    app.get("/:id", function (req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({
                _id: req.params.id
            })
            // ..and populate all of the comments associated with it
            .populate("comment")
            .then(function (dbArticle) {

                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    //comment
    app.post("/:id", function (req, res) {
        // create a new comment and pass the req.body to the entry
        db.Comment.create(req.body)
            .then(function (dbComment) {
                return db.Article.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    comment: dbComment._id
                }, {
                    new: true
                });
            })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

};