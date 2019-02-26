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
  