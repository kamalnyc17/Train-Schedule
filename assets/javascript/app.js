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
var nextTrainTime;
var timeCounter;

/*
// user authentication
var provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('profile');
provider.addScope('email');
firebase.auth().signInWithRedirect(provider);

// Using a redirect.
firebase.auth().getRedirectResult().then(function(result) {
    if (result.credential) {
      // This gives you a Google Access Token.
      var token = result.credential.accessToken;
    }
    var user = result.user;
  }); */  

// clear out error messages once the user clicks on an input field
$(".form-control").on("click", function () {
    $("#train-input-error").text("");
    $("#destination-input-error").text("");
    $("#start-input-error").text("");
    $("#frequency-input-error").text("");
});

// loading the table with existing schedule from the database
function tableUpdate() {
    dataRef.ref().on("value", function (snapshot) {
        $("#time-table > tbody").empty();
        snapshot.forEach(function (childSnapshot) {
            if (moment(childSnapshot.val().firstTrainTime, "HH:mm").isBefore(moment(), 'HH:mm')) {
                var nextTrain = (moment().diff(moment(childSnapshot.val().firstTrainTime.toString(), "HH:mm"))) / 1000 / 60;
                var multiply1 = parseInt((nextTrain / parseInt(childSnapshot.val().trainFrequency)) + 1) * parseInt(childSnapshot.val().trainFrequency);
                nextTrainTime = moment(childSnapshot.val().firstTrainTime, "HH:mm").add(multiply1, "minute").format('HH:mm');

            } else {
                nextTrainTime = childSnapshot.val().firstTrainTime;
            }
            minutesAway = parseInt(((moment(nextTrainTime, "HH:mm").diff(moment())) / 1000 / 60) + 1); // how many minutes the next train is away

            var newRow = $("<tr>").append(
                $("<td>").text(childSnapshot.val().trainName),
                $("<td>").text(childSnapshot.val().destination),
                $("<td class='time-col'>").text(childSnapshot.val().trainFrequency),
                $("<td class='time-col'>").text(nextTrainTime),
                $("<td class='time-col'>").text(minutesAway)
            );

            // Append the new row to the table
            $("#time-table > tbody").append(newRow);
        });
    });
    // recalculating schedule every minute
    clearInterval(timeCounter);
    timeCounter = setInterval(tableUpdate, 1000 * 60);
}
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
    var isRight = true;
    var errMsg = ["Enter the name of the train", "Enter the destination of the train", "Enter the First Train Time (HH:mm - military time)", "The train frequency must be greater than 1 minutes"];
    if (!isValid) {
        trainTime = "";
    }

    if (trainName === "") {
        $("#train-input-error").text(errMsg[0]);
        $("#train-input-error").show();
        isRight = false;
    }
    if (destination === "") {
        $("#destination-input-error").text(errMsg[1]);
        $("#destination-input-error").show();
        isRight = false;
    }
    if ((trainTime === "") || (parseInt(trainTime) === 0)) {
        $("#start-input-error").text(errMsg[2]);
        $("#start-input-error").show();
        isRight = false;
    }
    if (trainFrequency < 1) {
        $("#frequency-input-error").text(errMsg[3]);
        $("#frequency-input-error").show();
        isRight = false;
    }

    // if all fields pass validation then do next step
    if (isRight) {
        //calculate next train time & minutes away
        var nextTrain = (moment().diff(moment(trainTime, "HH:mm"))) / 1000 / 60; //difference in time in minutes
        var multiply1 = parseInt((nextTrain / trainFrequency) + 1) * trainFrequency;
        var nextTrainTime = moment(trainTime, "HH:mm").add(multiply1, "minute").format('HH:mm');
        minutesAway = parseInt(((moment(nextTrainTime, "HH:mm").diff(moment())) / 1000 / 60) + 1); // how many minutes the next train is away

        if (moment(trainTime, "HH:mm").isBefore(moment(), 'HH:mm')) {
            var nextTrain = (moment().diff(moment(trainTime, "HH:mm"))) / 1000 / 60;
            var multiply1 = parseInt((nextTrain / trainFrequency) + 1) * trainFrequency;
            nextTrainTime = moment(trainTime, "HH:mm").add(multiply1, "minute").format('HH:mm');
        } else {
            nextTrainTime = trainTime;
        }
        minutesAway = parseInt(((moment(nextTrainTime, "HH:mm").diff(moment())) / 1000 / 60) + 1); // how many minutes the next train is away

        // writing in the database
        dataRef.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrainTime: trainTime,
            trainFrequency: trainFrequency,
            //nextTrainTime: nextTrainTime,
            //minutesAway: minutesAway,
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
    // recalculating schedule every minute
    clearInterval(timeCounter);
    timeCounter = setInterval(tableUpdate, 1000 * 60);
});

// prepare the screen on load
tableUpdate();

// recalculate time every minute
timeCounter = setInterval(tableUpdate, 1000 * 60);
