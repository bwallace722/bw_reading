(function() {

var chart;

$(function() {
        $(".dial").knob({
            'min': 0,
            'max': 100,
            'angleOffset': -120,
            'angleArc': 240,
            'startAngle': 0,
            'inputColor': 'white',
            'change' : function (v) {
                draw_lines(v);
            }
        });
    });



var SCROLL_BAR = 17;
var DISTANCE_FROM_TOP = 0;
var LINE_WIDTH = 1;
var MAX_SIDE_DISTANCE = 100;

function draw_lines(v) {

    var sideDistance = MAX_SIDE_DISTANCE * (v / 100);
    var canvas = document.getElementById("lines-canvas");
    var ctx = canvas.getContext("2d");
    var x = canvas.width;
    var y = canvas.height;

    ctx.clearRect(0, 0, x, y);

    ctx.beginPath();
    ctx.moveTo(sideDistance,DISTANCE_FROM_TOP);
    ctx.lineTo(sideDistance, y - DISTANCE_FROM_TOP);
    ctx.moveTo(x - sideDistance - SCROLL_BAR, DISTANCE_FROM_TOP);
    ctx.lineTo(x - sideDistance - SCROLL_BAR, y - DISTANCE_FROM_TOP);
    ctx.lineWidth = LINE_WIDTH;
    ctx.stroke();

};












// Submit post on submit
$('#post-form').on('submit', function(event){
    event.preventDefault();
    console.log("form submitted!")  // sanity check
    postPassageAttempt();
});

/* 
This function is called by the form to tell the back end that the student
just attempted the passage (i.e. read the passage) and posts the time
the student spent reading and the id. of the passage.
If it's successful, it then adds the latest attempt to the wpm chart.
*/
function postPassageAttempt() {
    console.log("create post is working!"); // sanity check
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
            logTime(duration, passage_id);

        },

         // handle a non-successful response
        error : function(xhr,errmsg,err) {
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
};

$("#attempt-history").click(requestAttemptHistory);

function requestAttemptHistory() {
    console.log("requesting attempt history");
    var passage_id = $('#passage_id').val();
    $.ajax({
        url : "/speed_reading/attempt_history/",
        type : "POST",
        data : {passage_id : passage_id},
        dataType: 'json',
        success : function(json) {
            console.log("received the following attempt history:")
            console.log(json);
            setupChart(json);
            //do something with it
        },
        error : function(xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
            console.log(errmsg);
            setupChart([[], []]);
        }
    })
}

function setupChart(history) {

var previousAttempts = history;
var times = previousAttempts[0];
var labels = previousAttempts[1];
// This is for the chart displaying progress:
var data = {
    labels: labels,
    datasets: [
        {
            label: "My Attempts",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: times
        }
    ]
};

var ctx = document.getElementById("chart").getContext("2d");
chart = new Chart(ctx).Line(data, {

    scaleLabel: "<%=value%> wpm",
    scaleBeginAtZero: true,
    bezierCurve: false,});
}


function logTime(score, label) {
    chart.addData([score], label);
}





$(document).ready(function(){requestAttemptHistory()}) 


})();