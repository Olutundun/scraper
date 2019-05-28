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
    $(".btn-outline-danger").on("click", deleteTask);

    function deleteTask(event) {
        event.stopPropagation();
        $.ajax({
            method: "Delete",
            url: "/delete"
        }).then
        location.reload();
    };
    //scrape new articles
    $(".btn-outline-warning").on("click", function () {
        location.href = "http://localhost:3000/scrape"
    });
})