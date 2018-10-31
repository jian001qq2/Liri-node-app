//code to read and set any environment variables with the dotenv package
require("dotenv").config();
//declare avariables to require the keys
var keys=require('./keys.js')
//variables for require the packages and imports
var Spotify = require('node-spotify-api');
var request=require('request');
var moment = require("moment");
var request=require('request');
var fs = require("fs");

//genral set up
var action=process.argv[2];
var nameInput=process.argv[3];
//create a function to handle different conmands
function goLiri() {
switch(action){
  case('concert-this'):
  cooncertThis();
  ;
  break;
  case('spotify-this-song'):
  spotifyThisSong()
  ;break;
  case('movie-this'):
  movie();
  ;break;
  case('do-what-it-says'):
  justDoIt()
  break;
  default:
  console.log("\n Error, Please enter a valid command as required in this app")
}
}
//area for the spotify-this-song
/*//first declare variable to capture the name of the songs if unable then just use the name in the general
it will output the following:
//artists, song's name, preview link of the song from spotify, album of the song, 
//the default song is The sign by Ace of Base when user doesn't input a song
 */

var spotify = new Spotify(keys.spotify);

function spotifyThisSong(){
  //To declare a variable to take the input
  var song=nameInput;
  //make a if statement to handle when no input
  if (!song) {
    song= "The sign";
  }
  spotify.search({ 
    type: 'track', query: song
}, function (err, data){
  if (err) {
    return console.log("Error Code: " + err);

  };
  
    var songs = data.tracks.items;
    for (let i = 0; i < songs.length; i++) {
      console.log("\nResult "+(i+1));
      console.log("Artist: " + songs[i].artists[0].name);
      console.log("Song: " + songs[i].name);
      console.log("Song Preview: " + songs[i].preview_url);
      console.log("Album: " + songs[i].album.name);
      console.log("\n+++++++++++++++++++++++end of search result " +(i+1)+"+++++++++++++++++++++++++++++++++++++++++++");
  }
  })
}
//end of the function spotify

//area for Bands in Town
/**coniditon for concert-this
 * to check if the user enter the name for search, if he/she forgot to enter, then log a message to remind.
 * declare variable to capture the name of artists/band
 * //search the Bands in town API to printInfo the following info
 * //output: name of hte venue, venue location, date of the event(use moment to format this as mm/dd/yyyy)
 */
function cooncertThis(){
  //first check if the user enter the name for search
    if (nameInput=== undefined) {
        console.log("Error: You have to enter the name for a band or artist!");
        return;
    } else {
      //perform the search
      var artist=nameInput;
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=e321c5df3b581205409373ce3eb9c448";

    request(queryUrl, function (error, response, body) {
       //check to see there have any error(s)
        if (!error && response.statusCode === 200) {
        //declare a variable to make it hold the search result
            var data = JSON.parse(body);
            //break line for the top of the data
            console.log("\n ++++++++++++++Start Data++++++++++++++++++++++++++++")
            console.log("\nThese are upcoming concerts by: " + artist);
            for (var i = 0; i < data.length; i++) {
                var date = data[i].datetime;
                date = moment(date).format("MM/DD/YYYY");
                console.log("\nDate: " + date)
                console.log("Venue: " + data[i].venue.name);
                if (data[i].venue.region == "") {
                    console.log("Location: " + data[i].venue.city + ", " + data[i].venue.country);
                } else {
                    console.log("Location: " + data[i].venue.city + ", " + data[i].venue.region + ", " + data[i].venue.country);
                };
            }
            //break line for the end of data
            console.log("\n++++++++++++++++++End data++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n");
        }
    })
};

}

//area for the movie
//declare the url and a variable to caputure the user input for the movie name
//request the site if is ok without error
//output: Title, release year, IMDB rating, Rotten Tommatoes rating
//Country of prodced , language, plot, actors
// if no moive name input, then output data for the Mr.Nobody
function movie(){
var movieName=nameInput || "Mr.Nobody";
var rottenTomatoRating, imdbRating;
var movieQueryUrl="http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";;
request(movieQueryUrl,function(error, response, body) {
  // If the request is successful
  if (!error && response.statusCode === 200) {
    //declare a variable to store the result result
    var data=JSON.parse(body);
    //Make a if statement to obtain values of  matching rating sources as required
for (var i = 0; i < data.Ratings.length; i++) {
  if (data.Ratings[i].Source === "Rotten Tomatoes") {
    rottenTomatoRating = data.Ratings[i].Value;
  }
  if (data.Ratings[i].Source === "Internet Movie Database") {
      imdbRating = data.Ratings[i].Value;
  }
}
console.log("\n ++++++++++++++++++++Moive Ouput Start+++++++++++++++++++++++++++++++++++++++++++")
console.log("\nMovie Title: "+ data.Title);
console.log("Movie Released in: "+ data.Year);
console.log("IMDB Rating is: "+ imdbRating);
console.log("Rotten Tomatoes Rating is: "+ rottenTomatoRating);
console.log("Country: "+ data.Country);
console.log("Available Languages: "+ data.Language);
console.log("Plot: "+ data.Plot);
console.log("Actors: "+ data.Actors);
console.log("\n+++++++++++++++++++Moive Output End++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n");
} else{
  console.log("Sorry, we have an issue.")
}
  });//end of irequest
};//end of moive

//area of the do what it says
/** using fs pakages to take text inside the random.txt, it will 
 * call one of the commands. right now as default, it runs on spotify-this-song
 * try to edit the text in the random.txt to try out other commaonds, or to find a way to make a random varible to choose 
 */
var justDoIt = function () {
  fs.readFile("random.txt", "utf8", function (err, data) {
      if (err) {
          return console.log(err);
      }
      var fileData = data.split(",")
      action=fileData[0];
      nameInput = fileData[1];
      goLiri();
  });
};
goLiri();