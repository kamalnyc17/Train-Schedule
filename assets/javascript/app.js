// Initialize Firebase
var config = {
    apiKey: "AIzaSyDu7uX8Xt8WGzug2rfu84872BE0z5dPA_Y",
    authDomain: "train-time-table-34db9.firebaseapp.com",
    databaseURL: "https://train-time-table-34db9.firebaseio.com",
    projectId: "train-time-table-34db9",
    storageBucket: "train-time-table-34db9.appspot.com",
    messagingSenderId: "600414114017"
};
firebase.initializeApp(config);

var dataRef = firebase.database();

// variables for the schedule table
var trainName = "";
var destination = "";
var trainTime = "00:00";
var minutesAway = "";
var trainFrequency = "1";
var nextArrival = "00:00";

// actions after clicking on submit button
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // grabing field values from browser

    trainName = $("#train-name-input").val().trim();
    destination = $("#destination-input").val().trim();
    trainTime = $("#start-input").val().trim();
    trainFrequency = $("#frequency-input").val().trim();
    minutesAway = "1";
    nextArrival = "00:00";
});