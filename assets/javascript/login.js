
// Initialize Firebase
var config = {
  apiKey: "AIzaSyBUaie81HYFUugbl4WT-aSbfnrM_53t8HU",
  authDomain: "memorygame-64d52.firebaseapp.com",
  databaseURL: "https://memorygame-64d52.firebaseio.com",
  projectId: "memorygame-64d52",
  storageBucket: "memorygame-64d52.appspot.com",
  messagingSenderId: "465534832195"
};
firebase.initializeApp(config);


var dataRef = firebase.database(); 

// Initial Values
var name = "";
var comment = "";
var nPlayer = 0;
var yourPlayerId= 0;
var yourPlayerName = "";
var player1;
var player2;
var wins = 0;
var loses = 0;
var displayDiv; // display target div
var intervalId


var countries = [{
  name: "india"
}, {
  name: "japan"
}, {
  name: "USA"
}, {
  name: "canada"
}, {
  name: "brazil"
}, {
  name: "china"
}, {
  name: "mexico"
}, {
  name: "panama"
}];

function doubleArray(array) {

  array = array.concat(array);

  console.log(array);
  return array;
}

function shuffleArray(array) {
  var n = array.length, t, i;

  while (n) {
    i = Math.floor(Math.random() * n--);
    t = array[n];
    array[n] = array[i];
    array[i] = t;
  }

  console.log(array);
  return array;
}


function alignCards(array) {

    $("#panel").html("<table>")
    var k = 0
    for (var i = 0; i < 4; i++) {
      $("#panel").append("<tr>")
      for (var j = 0; j < 4; j++) {
      $("#panel").append("<td class='card' id='" + k 
       + "' data-name='" + array[k].name 
       + "' flag-img='" + array[k].flag 
       + "' flg='0'></td>");
      $("#panel").append("</target>")
      k++;
      }
    }
    $("#panel").append("</table>")
}



// Clear all data in firebase
var firebaseReset = function () {

  dataRef.ref().set({});

}


// Add player into firebase
var addPlayer = function() {
  //*** Set players into firebase ***//
  //*** and Display message("You are player 1/2") and div(name, wins and loses) ***//

  // Read firebase only once to set Players
  dataRef.ref().once("value", function(snapshot) {

    if (!snapshot.child("/players/1").exists()) {
      console.log("player1 doesnt  exists");
      dataRef.ref('/players/1').set({
        name: name,
        wins: wins,
        loses: loses
      });

      player1 = name;
      yourPlayerId = 1;

      displayYourId(); // You are Player ....
    }
    else if (!snapshot.child("/players/2").exists()) {
      console.log("player2 doesnt exist");
      dataRef.ref('/players/2').set({
        name: name,
        wins: wins,
        loses: loses
      });

      player2 = name;
      yourPlayerId = 2;

      // Update "turn"
      dataRef.ref().update({
        turn: 1
      });

    }
    else {
      alert("Someone is gaming...");
    }

    console.log(yourPlayerId);

  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
  
}


// Add countires into firebase
var addCountries = function(array) {
  //*** Set players into firebase ***//
  //*** and Display message("You are player 1/2") and div(name, wins and loses) ***//

  // Read firebase only once to set Players
  dataRef.ref().once("value", function(snapshot) {

    for (var i = 0; i < array.length; i++) {
      var flag = array[i].flag;
      var code = array[i].alpha2Code;
      var name = array[i].name;
      dataRef.ref('/countries/' + i).set({
        name: name,
        flag: flag,
        code: code,
        openFlg: 0,
        matchFlg: 0
      });

    }


  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
  
}


// Displaying which you are player 1 or 2
var displayYourId = function() {
  $("#start").empty(); // Remove Start button
  $("#message1").html("<h2>Hi " + name + "! You are Player " + yourPlayerId + "</h2>");
}


var numPlayerCheck = function() {

  dataRef.ref().once("value", function(snapshot) {

    if (snapshot.child("/player/2").exists()) {

    console.log("num");
      addCountries();

    }

  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

}

window.onload = function(event) {

  firebaseReset(); // Remove all data from firebase 

  //doubleArray(countries);
  //shuffleArray(countries);
  //alignCards(countries);
  //alignCards(shuffleArray(doubleArray(countries)));

  //var countriesArray = shuffleArray(doubleArray(countries))
  //alignCards(countriesArray);
  //addCountries(countriesArray);

  var clickCount = 0;
  var prevObj;
  var prev2Obj;
  var prevId = -1;
  var isMatch = 0;
  var matchCount = 0;
  var isYourTurn = 0;
  var countriesArray;

  //**** Start Button Click ***//
  $("#add-user").on("click", function(event) {
    event.preventDefault();

    name = $("#name-input").val().trim();
    var wins = 0;
    var loses = 0;

    if (name === "" || name.match( /[^a-zA-Z0-9\s]/ )){
      alert("Input name(number or alphabet)");
    }
    else {
      // Add Player into Firebase and Display user name
      addPlayer();
      displayYourId(); // You are Player ....
      yourPlayerName = name;
    }

    //numPlayerCheck();

  }); // End of Start button cliked


  //*** API ***//
  var queryURL = "https://restcountries.eu/rest/v2/all?fields=name;alpha2Code;flag";

  //total number of random picks
  var totPick = 8;
  //Contains fields flag, name, alpha2Code
  var countriesPicked = [];

  // Gathering data from API
  $.ajax({
    url:queryURL,
    method: "GET"
    }).done(function(response) {
    console.log(response.length)

    for (var j=0;countriesPicked.length<totPick;j++) {
        //pick random no. b/w 1 and 250
        var tempValue = Math.floor(Math.random() * response.length);
        //make sure they are not already picked
        if (countriesPicked.includes(tempValue) === false)
          countriesPicked.push(response[tempValue]);

          console.log(countriesPicked[j]);
          console.log(countriesPicked);
    }

    //Double and Shuffle array
    var countriesArray = shuffleArray(doubleArray(countriesPicked)) 
    alignCards(countriesArray); // Aligning Cards on the table
    addCountries(countriesArray); // Insert countries to Firebase


    // Watching Firebase and display coutry name if its openFlg = 1.
    // Unless this is in Ajax, it become error... I don't know why...
    dataRef.ref().on("value", function(snapshot) {
      //  Showing Cards. If flg = 1, display country name.
      for (var i = 0; i < 16; i++) {
        console.log(this);
        if (snapshot.child('/countries/' + i).val().openFlg == "1") {
          console.log($(this));
          $("#" + i).html(snapshot.child('/countries/' + i).val().name);
        }
        else {
          $("#" + i).html("");
        }

      } // End of for loop

    }); // End of dataRef.ref().......

  });// End of Ajax


  // Watching Firebase and Displaying if it's your turn
  dataRef.ref().on("value", function(snapshot) {

    if (snapshot.child("turn").exists()) {

      var currentTurn = snapshot.val().turn;
      console.log(currentTurn);
      if (yourPlayerId == currentTurn ) {
        console.log("your turn");
        $("#message2").html("You're turn");
        isYourTurn = 1;
      }
      else {
        $("#message2").html("It's not your turn. Please wait.");
        isYourTurn = 0;

      }

    }

  }); // End of dataRef....


  // Main logic. When the button is clicked...
  $("#panel").on("click", ".card", function(event) {
    

    if (isYourTurn === 1) {

      console.log($(this).attr("id"));
      /*
      if (snapshot.child('/countries/' + $(this).attr("id")).val().flg == "0") {
        console.log("aa");
        $(this).html(snapshot.child('/countries/' + $(this).attr("id")).val().name);
      }
      else {
        $(this).html("");
      }
      */
      
      dataRef.ref('/countries/' + $(this).attr("id")).update({
        openFlg: 1
      });

      // Do not count up with the following condition...
      // - Same card
      // - Already matched
      console.log($(this).attr("id"));

      if ($(this).attr("id") !== prevId && $(this).attr("flg") == "0") {

        clickCount++;
        console.log("clickCount:" + clickCount);
        $("#message2").append(" Count: " + clickCount);

        // Show country name
        $(this).html($(this).attr("data-name"));
        //$(this).html("<img src='" + $(this).attr("flag-img") + "'>");


        if (clickCount === 2) {

          console.log($(prevObj).attr("id"));
          console.log($(this).attr("id"));

          if ($(prevObj).attr("data-name") == $(this).attr("data-name")) {
            $(prevObj).attr("flg","1");
            $(this).attr("flg","1");
            isMatch = 1;
            matchCount++;
          }
          else {
            // Close cards when they didn't match

          }

          console.log("isMatch:" + isMatch);


          clickCount = 0; // initialize
        }

        prevId = $(this).attr("id");
        prev2Obj = prevObj;
        prevObj = $(this);
      
      }




    }// End of (isYourTurn === 1)

  }); // End of Main logic (click cards)




} // End of window.onload


