const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: {
        type: String,
        unique: true
    },
    link: {
        type: String,

    },
    date: {
        type: Date
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },
    saved: {
        type: Boolean,
        default: false
    }
})

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;