require("dotenv").config();
const request = require("request");
const fs = require("fs");
const keys = require("./keys.js");
const spotify = require("node-spotify-api");
const newSpot = new spotify(keys.spotify);
const userChoice = process.argv[2];
const userInput = process.argv[3];

userInputs(userChoice, userInput);

// Functions
function userInputs(userChoice, userInput) {
  switch (userChoice) {
    case "concert-this":
      showConcertInfo(userInput);
      break;
    case "spotify-this-song":
      showSongInfo(userInput);
      break;
    case "movie-this":
      showMovieInfo(userInput);
      break;
    case "do-what-it-says":
      showSomething(userInput);
      break;
    default:
      console.log("Invalid Option. Try again!");
  }
}

//BIT Function

function showConcertInfo(userInput) {
  var queryUrl =
    "https://rest.bandsintown.com/artists/" +
    userInput +
    "/events?app_id=codingbootcamp";
  request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var concerts = JSON.parse(body);
      for (var i = 0; i < concerts.length; i++) {
        console.log("~~~~~~~~EVENT INFO~~~~~~~~");
        console.log(i);
        console.log("Venue: " + concerts[i].venue.name);
        console.log("Place: " + concerts[i].venue.city);
        console.log("Date: " + concerts[i].datetime);
        console.log("~~~~~~~~~~~~~~~~~~~~~~");
      }
    } else {
      console.log("Error!");
    }
  });
}

//Spotify Function

function showSongInfo(userInput) {
  if (userInput === undefined) {
    userInput = "Going Bad";
  }
  newSpot.search(
    {
      type: "track",
      query: userInput
    },
    function(err, data) {
      if (err) {
        console.log("Error: " + err + "Try again!");
        return;
      }
      var songs = data.tracks.items;

      for (var i = 0; i < 5; i++) {
        console.log("~~~~~~~~SONG INFO~~~~~~~");
        console.log(i);
        console.log("Song: " + songs[i].name);
        console.log("Preview: " + songs[i].preview_url);
        console.log("Album: " + songs[i].album.name);
        console.log("Artist(s): " + songs[i].artists[0].name);
        console.log("~~~~~~~~~~~~~~~~~~~~~~");
      }
    }
  );
}

//OMDB Function

function showMovieInfo(userInput) {
  if (userInput === undefined) {
    userInput = "";
  }

  var queryUrl =
    "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=f4c7ad87";

  request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var movies = JSON.parse(body);
      console.log("~~~~~~~~MOVIE INFO~~~~~~~~");
      console.log("Title: " + movies.Title);
      console.log("IMDB Rating: " + movies.imdbRating);
      console.log("Rotten Tomatoes Rating: " + theRottenToms(movies));
      console.log("Country: " + movies.Country);
      console.log("Language: " + movies.Language);
      console.log("Plot: " + movies.Plot);
      console.log("Actors: " + movies.Actors);
      console.log("~~~~~~~~~~~~~~~~~~~~~~");
    } else {
      console.log("Error!");
    }
  });
}

// the Rommy Toms

function theRottenTomsObject(data) {
  return data.Ratings.find(function(item) {
    return item.Source === "Rotten Tomatoes";
  });
}

function theRottenToms(data) {
  return theRottenTomsObject(data).Value;
}

// Do what it says
function showSomething() {
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }
    var dataArr = data.split(",");
    userInputs(dataArr[0], dataArr[1]);
  });
}
