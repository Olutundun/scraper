$(document).ready(function () {
    //redirects to the saved page
    $(".btn-outline-info").on("click", function () {
        location.href = "http://localhost:3000/saved"
    });
    //redirects to home page
    $(".btn-outline-success").on("click", function () {
        location.href = "http://localhost:3000"
    });
    //deletes ALL articles
    $(".btn-outline-danger").on("click", deleteArticles);

    function deleteArticles(event) {
        event.stopPropagation();
        $.ajax({
            method: "Delete",
            url: "/delete"
        }).then
        location.reload();
    };
    //scrape new articles 
    $(".btn-outline-warning").on("click", scrapeArticle);

    function scrapeArticle(event) {
        event.stopPropagation();
        $.ajax({
            method: "GET",
            url: "/scrape"
        }).then(function (response) {
            location.reload();
        })
    }

    //save an article
    $(".btn-info").on("click", function () {
        let id = $(this).data("id");
        let saved = $(this).data("saved");

        let savedArticle = {
            saved: saved
        };
        console.log(id)
        console.log(savedArticle);
        $.ajax("/saved" + id, {
            method: "PUT",
            saved: savedArticle
        }).then(function () {
            console.log("successfully saved this article!")
        })
    });


})