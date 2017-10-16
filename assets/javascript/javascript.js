
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
var yourClickCount = 0;
var yourMatchCount = 0;
var player1;
var player2;
var displayDiv; // display target div


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

/*
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
*/


// Align Cards in prepared divs
/*
function alignCards(array) {
  console.log(array);
    var k = 0
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        $("#" + i + "_" + j).append("<div class='card' id='" + k 
         + "' data-name='" + array[k].name 
         + "' flag-img='" + array[k].flag 
         + "' flg='0'></div>");
        k++;
      }
    }
    return array;
}
*/

// Clear all data in firebase
var firebaseReset = function () {

  dataRef.ref().set({});

}

// Add player into firebase
var addPlayer = function() {
  //*** Set players into firebase ***//
  //*** and Display message("You are player 1/2") and div(name, wins and loses) ***//

  var wins = 0;
  var loses = 0;
  var clickCount = 0;
  var matchCount = 0;

  // Read firebase only once to set Players
  dataRef.ref().once("value", function(snapshot) {

    if (!snapshot.child("/players/1").exists()) {
      console.log("player1 doesnt  exists");
      dataRef.ref('/players/1').set({
        name: name,
        wins: wins,
        loses: loses,
        matchCount: matchCount,
        clickCount: clickCount
      });

      player1 = name;
      yourPlayerId = 1;

    }
    else if (!snapshot.child("/players/2").exists()) {
      console.log("player2 doesnt exist");
      dataRef.ref('/players/2').set({
        name: name,
        wins: wins,
        loses: loses,
        matchCount: matchCount,
        clickCount: clickCount
      });

      player2 = name;
      yourPlayerId = 2;

      // Update "turn"
      //dataRef.ref().update({
      //  turn: 1
      //});

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

var countriesArray = [];

var getAPI = function() {

}

var resetMessages = function() {
  $("#message1").empty();
  $("#message2").empty();
}

/*
var waitAndFlip = function(i,j) {
  setTimeout("flip(" + i + "," + j + ")", 1000 * 3);
  //alert("hello")
}
*/

var flip = function(i, j) {

  console.log("flip");
  console.log(i);
  console.log(j);

  dataRef.ref('/countries/' + i).update({
    openFlg: 0
  });

  dataRef.ref('/countries/' + j).update({
    openFlg: 0
  });
}


//**************************************************************//

/*
window.onbeforeunload = function(event) {

  event.returnValue = 'Do you want to leave this page?';
 
}


window.onclose = function(event){

  event.returnValue = 'Do you want to leave this page?';

  if (yourPlayerId !== 0){
    // Update "turn"
    dataRef.ref().update({
      turn: 0
    });

    dataRef.ref('/players/' + yourPlayerId).set({});
  }

}
*/

window.onload = function(event) {

  resetMessages();

  //firebaseReset(); // Remove all data from firebase 

  var clickCount = 0;
  var prevObj;
  var prevId = -1;
  var isMatch = 0;
  var totMatchCount = 0;
  var isYourTurn = 0;
  var countriesArray;

  yourPlayerName = sessionStorage.getItem("name")
  yourPlayerId = sessionStorage.getItem("id")

  //**** Start Button Click ***//
  $("#add-user").on("click", function(event) {
    event.preventDefault();

    name = $("#name-input").val().trim();
    var wins = 0;
    var loses = 0;
    var clickCount = 0;
    var matchCount = 0;

    if (name === "" || name.match( /[^a-zA-Z0-9\s]/ )){
      alert("Input name(number or alphabet)");
    }
    else {
      addPlayer();// Add Player into Firebase and Display user name
      yourPlayerName = name;//displayYourId(); // You are Player ....
    }

    // Store all content into sessionStorage
    sessionStorage.clear();
    sessionStorage.setItem("name", name);
    sessionStorage.setItem("id", yourPlayerId);

  }); // End of Start button cliked

  //**** Delete Button Click ***//
  $("#delete-user").on("click", function(event) {
    event.preventDefault();

    dataRef.ref().once("value", function(snapshot) {

        dataRef.ref('/players').set({});

    });

  }); // End of Delete button cliked

  //**** Delete Button Click ***//
  $("#delete-p1").on("click", function(event) {
    event.preventDefault();

    dataRef.ref().once("value", function(snapshot) {

        dataRef.ref('/players/1').set({});

    });

  }); // End of Delete button cliked

  //**** Delete Button Click ***//
  $("#delete-p2").on("click", function(event) {
    event.preventDefault();

    dataRef.ref().once("value", function(snapshot) {

        dataRef.ref('/players/2').set({});

    });

  }); // End of Delete button cliked

  //**** Restart Button Click ***//
  $("#restart").on("click", function(event) {
    event.preventDefault();


    dataRef.ref().update({
      totMatchCount: 0
    });




        //**** Aligning Cards API *****************************//
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
          countriesArray = shuffleArray(doubleArray(countriesPicked)) 
          //alignCards(countriesArray); // Aligning Cards on the table
          addCountries(countriesArray); // Insert countries to Firebase

        });// End of ajax

        //**** End of Aligning Cards ******************************//


  }); // End of Restart button cliked



  // Watching Firebase. This only takes added child...
  dataRef.ref("/players").on("child_added", function(snapshot) {

    console.log("child_added");
    console.log(snapshot.val());
    console.log(snapshot.child("/1").exists());

    // Watching Firebase ONLY once to Check if both players exist.
    dataRef.ref().once("value", function(snapshot) {
      console.log(snapshot.child("/players/1").exists());
      console.log(snapshot.child("/players/2").exists());

      // When both of player 1 and 2
      if (snapshot.child("/players/1").exists() && snapshot.child("/players/2").exists()) {
        console.log("yourPlayerId:" + yourPlayerId)

        // Update "turn"
        dataRef.ref().update({
          turn: 1
        });


        //**** Aligning Cards API *****************************//
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
          countriesArray = shuffleArray(doubleArray(countriesPicked)) 
          //alignCards(countriesArray); // Aligning Cards on the table
          addCountries(countriesArray); // Insert countries to Firebase

        });// End of ajax

        //**** End of Aligning Cards ******************************//

        console.log(countriesArray);
      }

    }); // End of dataRef.ref().once("value", function(snapshot)

  }); // End of child_added on players

  // Watching Firebase.  This only takes removed child...
  dataRef.ref("/players").on("child_removed", function(snapshot) {

    console.log("child_removed");
    console.log(snapshot.val());
    console.log(snapshot.child("/1").exists());

    // Update "turn"
    dataRef.ref().update({
      turn: 0
    });

    dataRef.ref().update({
      totMatchCount: 0
    });


  });

  // Watching Firebase
  dataRef.ref().on("value", function(snapshot) {

    // Display Player2 information
    if (snapshot.child("/players/1").exists()) {

      $("#player1").html(snapshot.child("/players/1").val().name);
      $("#player1").append("<br>");
      $("#player1").append("wins:" + snapshot.child("/players/1").val().wins);
      $("#player1").append("<br>");
      $("#player1").append("loses:" + snapshot.child("/players/1").val().loses);
      $("#player1").append("<br>");
      $("#player1").append("click count:" + snapshot.child("/players/1").val().clickCount);
      $("#player1").append("<br>");
      $("#player1").append("match count:" + snapshot.child("/players/1").val().matchCount);

    }
    else {
      $("#player1").html("Waiting for Player 1");
    }
    
    // Display Player2 information
    if (snapshot.child("/players/2").exists()) {

      $("#player2").html(snapshot.child("/players/2").val().name);
      $("#player2").append("<br>");
      $("#player2").append("wins:" + snapshot.child("/players/2").val().wins);
      $("#player2").append("<br>");
      $("#player2").append("loses:" + snapshot.child("/players/2").val().loses);
      $("#player2").append("<br>");
      $("#player2").append("click count:" + snapshot.child("/players/2").val().clickCount);
      $("#player2").append("<br>");
      $("#player2").append("match count:" + snapshot.child("/players/2").val().matchCount);

    }
    else {
      $("#player2").html("Waiting for Player 2");
    }

    // Check turn
    if (snapshot.child("/turn").exists()) {

      var currentTurn = snapshot.val().turn;
      console.log("turn:" + currentTurn);
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

    // Check countries
    console.log(countriesArray);
    //if (snapshot.child("/countries").exists()) {
      var k = 0
      for (var i = 1; i < 5; i++) {
        for (var j = 1; j < 5; j++) {
          //$("#" + i + "_" + j).html("<div class='card' id='" + k + "' data-name='" + countriesArray[k].name + "' flag-img='" + countriesArray[k].flag + "' flg='0'></div>");
          $("#" + i + "_" + j).html("<div class='card' id='" + k + "' data-name='" + snapshot.child("/countries/" + k).val().name + "' flag-img='" + snapshot.child("/countries/" + k).val().flag + "' flg='0'></div>");
          k++;
        }
      }
    //}

  }); // End of dataRef....


  // Main logic. When the button is clicked...
  $("#panel").on("click", ".card", function(event) {
    console.log("clicked");
    
    // ONLY when your turn, you can click
    if (isYourTurn === 1) {

      console.log($(this).attr("id"));
      
      // Do not count up with either of the following condition...
      // - Same card
      // - Already matched(opened)
      console.log(prevId);
      console.log($(this).attr("flg"));

      var thisId = $(this).attr("id");

      var isOpen;

      dataRef.ref().once("value", function(snapshot) {
        //isClicked = snapshot.child('/countries/' + $(this).attr("id")).val().openFlg;
        //sMatch = snapshot.child('/countries/' + $(this).attr("id")).val().matchFlg;
        isOpen = snapshot.child('/countries/' + thisId).val().openFlg;
        isMatch = snapshot.child('/countries/' + thisId).val().matchFlg;
        totMatchCount = snapshot.val().totMatchCount;

        console.log($(this).attr("id")); // this became "unidentified" here

      });

      console.log($(this).attr("id")); // here is ok
      console.log(isOpen);
      console.log(isMatch);

      if (isOpen === 0 && isMatch === 0) {

        dataRef.ref('/countries/' + thisId).update({
          openFlg: 1
        });

      }

      if (thisId !== prevId && isOpen === 0) { // not same card and not clicked

        clickCount++;
        yourClickCount++; // do not initialize

        // Update click counter
        //clickCount = yourClickCount;
        dataRef.ref('/players/' + yourPlayerId).update({
          clickCount: yourClickCount
        });

        console.log("yourClickCount:" + yourClickCount);

        // Show country name
        $(this).html($(this).attr("data-name"));
        $(this).attr("flg","1") // needed?
        //$(this).html("<img src='" + $(this).attr("flag-img") + "'>");

        if (clickCount === 1) {
          prevObj = $(this);
          prevId = $(this).attr("id");
        } 

      }

      if (clickCount === 2) {

        console.log($(prevObj).attr("id"));
        console.log($(this).attr("id"));

        if ($(prevObj).attr("data-name") == $(this).attr("data-name")) { // Match

          console.log("match");

          totMatchCount++;
          console.log(totMatchCount)
          dataRef.ref().update({
            totMatchCount: totMatchCount
          });

          $(prevObj).attr("flg","1");
          $(this).attr("flg","1");

          //isMatch = 1; // Keep playing
          yourMatchCount++;
          console.log("yourMatchCount:" + yourMatchCount);

          dataRef.ref('/countries/' + $(prevObj).attr("id")).update({
            openFlg: 1,
            matchFlg: 1
          });

          dataRef.ref('/countries/' + $(this).attr("id")).update({
            openFlg: 1,
            matchFlg: 1
          });

          //matchCount = yourMatchCount;
          dataRef.ref('/players/' + yourPlayerId).update({
            matchCount: yourMatchCount
          });

        }
        else { // Mismatch
          // Close cards when they didn't match IN 2 seconds
          console.log("Mismatch");
          //setTimeout(flip($(prevObj).attr("id"),$(this).attr("id")), 1000 * 3);
          setTimeout("flip(" + thisId + "," + prevId +")", 1000 * 2);

          // Move operaiton to another player 
          console.log(yourPlayerId);
          if (yourPlayerId == 1) { // "===" doesn't work...
            console.log("1");
            dataRef.ref().update({
              turn: 2
            });
          }
          else { // yourPlayerId == 2
            dataRef.ref().update({
              turn: 1
            });
          }

        }

        console.log(totMatchCount);

        if (totMatchCount === 8){
          console.log("Game over");

          dataRef.ref().update({
            turn: 3
          });

          dataRef.ref().update({
            totMatchCount: 0
          });
        }

        prevId = -1; // Initialize
        clickCount = 0; // initialize
      }
      
    }// End of (isYourTurn === 1)

  }); // End of Main logic (click cards)


  // Watching Firebase and Display coutry name if its openFlg = 1.
  dataRef.ref().on("value", function(snapshot) {
    //  Showing Cards. If flg = 1, display country name.
    for (var i = 0; i < 16; i++) {
      //console.log(this);
      //console.log(i);
      if (snapshot.child('/countries/' + i).val().openFlg == "1") {
        //console.log($(this));
        $("#" + i).html(snapshot.child('/countries/' + i).val().name);
      }
      else {
        $("#" + i).html("");
      }

    } // End of for loop

  }); // End of dataRef.ref().......


} // End of window.onload

