(function() {


/*

This directive provides a timer element that counts up in
milliseconds.  When the timer stops, the provided function is called
with the number of elapsed milliseconds, and the timer is reset to
zero.
If the element is placed inside an environment with bootstrap.css,
then the timer is rendered using wells.

TODO:
-[ ] This polutes the scope -- it would be better to isolate the scope and
somehow have just the element be able to see the milliseconds variable
-[ ] It would be cool if this directive were more stand-alone, and you
could pass in a function to it.

*/
var app = angular.module('time', []);
app.directive('timer', ['$interval', '$filter', function($interval, $filter){
    return {
        restrict: 'E',
        //this template should be in the same directory
        template:
        '<div id="outer" class="well well-sm" style="width: 200">'
            +'<div id="inner" class="well well-sm">'
                +'{{ milliseconds | date : "mm:ss"}}'
            +'</div>'
            +'<div class="well well-sm">'
                +'<div class="btn-group-justified">'
                    +'<button class="btn-primary" ng-click="start()"> start </button>'
                    +'<button class="btn-primary" ng-click="stop()"> stop </button>'
                +'</div>'
            +'</div>'
        +'</div>',

        link: function(scope, element, attrs){

            //7 is chosen so that the last millisecond's place 
            //cycles through all the possible values
            UPDATE_INTERVAL = 7;

            scope.milliseconds = 0;
            scope.counting = false;

            scope.start = function() {
                scope.milliseconds = 0;
                scope.counting = true;
            }

            scope.stop = function() {
                scope.counting = false;
                prettyTime = $filter('date')(scope.milliseconds , 'mm:ss:sss')

                if (attrs.onStop) {
                    console.log(attrs.onStop);
                }

                console.log("time: " + prettyTime);
                postPassageAttempt(scope.milliseconds);
            }

            function updateTime() {
                if (scope.counting) {
                    scope.milliseconds += UPDATE_INTERVAL;
                }
            }
            //Updating every 7 milliseconds may be problematic
            //on a slow computer with a heavy processer load. This
            //could introduce a bug in some circumstances.
            timeMillis = $interval(updateTime, UPDATE_INTERVAL);

            element.on('$destroy', function() {
                $interval.cancel(timeMillis);
            });

        }
    };
}]);




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
function postPassageAttempt(duration) {
    console.log("create post is working!"); // sanity check
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