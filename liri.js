//Add the code required to import the keys.js file and store it in a variable.
require("dotenv").config();

//keys
var keys = require("./keys.js");
//Random text NPM
var fs = require("fs");
//Twitter NPM
var Twitter = require('twitter');
//Spotify NPM
var Spotify = require('node-spotify-api');

var request = require('request');
//Keys
var client = new Twitter(keys.twitterKeys);
var spotify = new Spotify(keys.spotify);

//added
var command = process.argv[2]
var searchTerm = process.argv[3]
var enter = "\n"

//Commands
/*Make it so liri.js can take in one of the following commands:
* `my-tweets`
    node liri.js my-tweets
    This will show your last 20 tweets and when they were created at in your terminal/bash window.
*/
if (command === "my-tweets") {
    var params = {
        screen_name: "coding_practice",
        count: 20,
    }
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].text + "\n-------")
                var tweetLines = (tweets[i].text)
                fs.appendFile("log.txt", enter + tweetLines + enter, function (err) {
                    if (err) throw err;
                });
            }
        }
    })
}

/*
* `spotify-this-song`
    node liri.js spotify-this-song '<song name here>'
    This will show the following information about the song in your terminal/bash window

    Artist(s)
    The song's name
    A preview link of the song from Spotify
    The album that the song is from

    If no song is provided then your program will default to "The Sign" by Ace of Base.
*/
if (command === "spotify-this-song") {
    spotify.search({
        type: 'track',
        query: searchTerm,
        limit: 1,
    }, function (err, data) {
        if (err) {
            return console.log('An error has occured: ' + err);
        }
        var spotify1 = data.tracks.items
        for (var i = 0; i < spotify1.length; i++)
            var spotifyOutput = ("Artist: " + spotify[i].artists[i].name +
                "\nTrack Name: " + spotify1[0].name +
                "\nSpotify Link: " + spotify1[0].href +
                "\nAlbum Name: " + spotify1[0].album.name)
        console.log(spotifyOutput)

        fs.appendFile("log.txt", enter + spotifyOutput + enter, function (err) {
            if (err) throw err
        })
    });

}
/*
* `movie-this`
    node liri.js movie-this '<movie name here>'
    This will output the following information to your terminal/bash window:

    * Title of the movie.
    * Year the movie came out.
    * IMDB Rating of the movie.
    * Rotten Tomatoes Rating of the movie.
    * Country where the movie was produced.
    * Language of the movie.
    * Plot of the movie.
    * Actors in the movie.

    If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'

    You'll use the request package to retrieve data from the OMDB API. Like all of the in-class activities, 
    the OMDB API requires an API key. You may use trilogy.
*/

if (command === "movie-this") {
    if (!searchTerm) {
        searchTerm = "Mr. Nobody";
    }
    
    request('http://www.omdbapi.com/?i=' + searchTerm + '&apikey=37d3b3d4', function (error, response, body) {
        var body = JSON.parse(body);
        var movies = ("Title: " + body.Title +
            "\nYear " + body.Year +
            "\nIMDB Rating: " + body.imdbRating +
            "\nCountry: " + body.Country +
            "\nLanguage: " + body.Language +
            "\nPlot: " + body.Plot +
            "\nActors: " + body.Actors)
        console.log(movies)

        fs.appendFile("log.txt", enter + movies, function (err) {
            if (err) throw err
        })
    });
}

/*
* `do-what-it-says`
    node liri.js do-what-it-says
    Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.

    It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
    Feel free to change the text in that document to test out the feature for other commands.
*/
if (command === "do-what-it-says") {
    fs.readFile('random.txt', "utf8", function (error, data) {
        var SpotifyDo = data.split(",")
        spotify.search({
            type: 'track',
            query: SpotifyDo[1]
        },
            function (err, data) {
                if (err) {
                    console.log('Error occurred: ' + err);
                    return;
                } else {
                    spotifyOutput =
                        "Song Name: " + "'" + data.tracks.items[0].name + "\n" +
                        "Album Name: " + data.tracks.items[0].album.name + "\n" +
                        "Artist Name: " + data.tracks.items[0].album.artists[0].name + "\n" +
                        "URL: " + data.tracks.items[0].album.external_urls.spotify + "\n";
                    console.log(spotifyOutput);

                    fs.appendFile("log.txt", enter + spotifyOutput + enter, function (err) {
                        if (err) throw err
                    })
                }
            });
    });
}

