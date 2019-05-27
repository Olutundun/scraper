const mongoose = require("mongoose");

//mongoose Schema constructor
const Schema = mongoose.Schema;

//create a new schema object

const CommentSchema = new Schema ({
    title: String,
    body: String
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;