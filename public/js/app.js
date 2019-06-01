$(document).ready(function () {
    //redirects to the saved page
    $(".btn-outline-info").on("click", function () {
        location.href = "http://localhost:3000/saved"
    });
    //redirects to home page
    $(".btn-outline-success").on("click", function () {
        location.href = "http://localhost:3000"
    });

    /*deletes ALL articles
    $(".btn-outline-danger").on("click", deleteArticles);

    function deleteArticles(event) {
        event.stopPropagation();
        $.ajax({
            method: "Delete",
            url: "/delete"
        }).then
        location.reload();
    };*/

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
        //console.log(id)
        //console.log(savedArticle);
        $.ajax("/saved" + id, {
            method: "PUT",
            saved: savedArticle
        }).then(function () {
            //console.log("successfully saved this article!")
            location.reload();
        })
    });

    //remove ONE article 
    $(".btn-warning").on("click", removeArticle);

    function removeArticle(event) {
        event.stopPropagation();

        let id = $(this).data("id");
        console.log(id)
        $.ajax({
            method: "DELETE",
            url: "/delete/" + id

        }).then(function () {
            // console.log("successfully deleted this article!")
            location.reload()
        });
    }

    //add a comment to each article
    $(document).on("click", ".btn-success", function () {

        $(".modal-body").empty();
        $("#myModal").modal("show")
        var thisId = $(this).attr("data-id");
        $.ajax({
                method: "GET",
                url: "/" + thisId
            })
            .then(function (data) {
                console.log(data);
                $(".modal-title").html("<h6>" + data.title + "</h6>");
                $(".modal-body").append("<input id='titleInput' name='title' placeholder='title...'>");
                $(".modal-body").append("<textarea id='bodyInput' name='body' placeholder='comment...'></textarea>");
                $(".modal-body").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
                // If there's a comment in the article
                if (data.comment) {
                    // Place the title of the comment in the title input
                    $("#titleInput").val(data.comment.title);
                    // Place the body of the comment in the body textarea
                    $("#bodyInput").val(data.comment.body);
                }
            });
    });

    //When you click the savenote button
    $(document).on("click", "#savenote", function () {
        var thisId = $(this).attr("data-id");
        $.ajax({
                method: "POST",
                url: "/" + thisId,
                data: {
                    title: $("#titleInput").val(),
                    body: $("#bodyInput").val()
                }
            })
            .then(function (data) {
                console.log(data);
            });
        $("#titleInput").val("");
        $("#bodyInput").val("");
    });

})