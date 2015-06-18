

// Submit post on submit
$('#post-form').on('submit', function(event){
    event.preventDefault();
    console.log("form submitted!")  // sanity check
    post_passage_attempt();
});

/* 
This function is called by the form to tell the back end that the student
just attempted the passage (i.e. read the passage) and posts the time
the student spent reading and the id. of the passage.
If it's successful, it then adds the latest attempt to the wpm chart.
*/
function post_passage_attempt() {
    console.log("create post is working!") // sanity check
    var duration = $('#duration').val();
    var passage_id = $('#passage_id').val();
    $.ajax({
        url : "/speed_reading/save_attempt/", // the endpoint
        type : "POST", // http method
        data : { duration : duration,
                 passage_id : passage_id,}, // data sent with the post request

        // handle a successful response
        success : function(json) {
            $('#duration').val(''); // remove the value from the input
            console.log(json); // log the returned json to the console
            console.log("success"); // another sanity check

            //here we add the value to the graph directly to avoid 
            //a whole other ajax call to get the new values:
            log_time(duration, passage_id);

        },

         // handle a non-successful response
        error : function(xhr,errmsg,err) {
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
};


// This is for the chart displaying progress:
var data = {
    labels: [1, 2, 3],
    datasets: [
        {
            label: "My Attempts",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [25, 24, 30]
        }
    ]
};

var ctx = document.getElementById("chart").getContext("2d");
var chart = new Chart(ctx).Line(data, {

    scaleLabel: "<%=value%> wpm",
    scaleBeginAtZero: true,
    bezierCurve: false,});
var tries = 4;


function get_times() {
    console.log("saving time");
    var score = Math.floor(Math.random() * 10) + 10 + (tries * 3);
    console.log("scored: ", score)
    label = tries;
    log_time(score, label);
    tries++;
}

function log_time(score, label) {

    chart.addData([score], label);
}

function draw_canvas_lines() {

    var canvas = document.getElementById("lines-canvas");
    var ctx = canvas.getContext("2d");
    var x = canvas.width;
    var y = canvas.height;
    console.log("x: ", x, " y: ", y);

    ctx.beginPath();
    ctx.moveTo(20,0);
    ctx.lineTo(20, y);
    ctx.stroke();

};