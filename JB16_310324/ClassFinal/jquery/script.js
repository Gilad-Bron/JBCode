$("#bring").on("click", function() {
    $.ajax({
        url: "https://jsonplaceholder.typicode.com/todos",
        success: function(data) {
            console.log(data);
        }
    });
});
