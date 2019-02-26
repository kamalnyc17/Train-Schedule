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

// loading the table with existing schedule
dataRef.ref().on("value", function (snapshot) {
    $("#time-table > tbody").empty();
    snapshot.forEach(function (childSnapshot) {
        var newRow = $("<tr>").append(
            $("<td>").text(childSnapshot.val().trainName),
            $("<td>").text(childSnapshot.val().destination),
            $("<td>").text(childSnapshot.val().trainFrequency),
            $("<td>").text(childSnapshot.val().nextTrainTime),
            $("<td>").text(childSnapshot.val().minutesAway)
        );

        // Append the new row to the table
        $("#time-table > tbody").append(newRow);
    });
});

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

    // checking time format & value for train time
    var aTime = moment(trainTime, 'HH:mm', true);
    var isValid = aTime.isValid();
    if (!isValid){
        trainTime = "";
    }

    if (trainName === "") {
        //alert("Enter the name of the train");
    } else if (destination === "") {
        alert("Enter the destination of the train");
    } else if ((trainTime === "") || (parseInt(trainTime) === 0)) {
        alert("Enter the First Train Time (HH:mm - military time)");
    } else if (trainFrequency < 1) {
        alert("The train frequency must be greater than 1 minutes");
    } else {
        //calculate next train time
        var nextTrain       = (moment().diff(moment(trainTime, "HH:mm")))/1000/60; //difference in time in minutes
        var multiply1       = parseInt((nextTrain / trainFrequency) + 1) * trainFrequency;
        var nextTrainTime   = moment(trainTime, "HH:mm").add(multiply1, "minute").format('HH:mm');
        minutesAway         = parseInt(((moment(nextTrainTime, "HH:mm").diff(moment()))/1000/60)+1); // how many minutes the next train is away

        // writing in the database
        dataRef.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrainTime: trainTime,
            trainFrequency: trainFrequency,
            nextTrainTime: nextTrainTime,
            minutesAway: minutesAway,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });

        // clearing the fields
        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#start-input").val("");
        $("#frequency-input").val("");

        // appending in the table
        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(destination),
            $("<td>").text(trainFrequency),
            $("<td>").text(nextTrainTime),
            $("<td>").text(minutesAway)
        );

        // Append the new row to the table
        $("#time-table > tbody").append(newRow);
    }
});