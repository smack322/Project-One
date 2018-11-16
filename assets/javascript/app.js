$(document).ready(function () {

    var movieArray = [];

    var scoreArray = [];

    var postersArray = []

    var counter = 0;

    var totalScore = 0;

    var numberVariable = 10;

    var randomPageNumber;

    var userName;

    var timer;

    var leaderboardCounter = 0;

    var flag = 0;

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBrDl0l3QBCTOX4UqXGD5owyLhZWyyzsvw",
        authDomain: "project-one-526c7.firebaseapp.com",
        databaseURL: "https://project-one-526c7.firebaseio.com",
        projectId: "project-one-526c7",
        storageBucket: "project-one-526c7.appspot.com",
        messagingSenderId: "775181427990"
    };
    firebase.initializeApp(config);

    const database = firebase.database();

    getMoviesArrays();

    // console.log(scoreArray + "Score Array")

    $("#userInput").children().hide();

    function endScreen() {

        clearInterval(timer);

        $("#title").text("Finished!");
        $("#poster").hide();
        $("#userInput").html("");
        $("#submitButton").hide();

        let nameField = $("<input>").attr("type", "text").attr("class", "form-control").attr("id", "userName").attr("placeholder", "Type Your Name Here!");
        let nameSubmitBtn = $("<button>").attr("class", "btn btn-primary").attr("id", "nameBtn").attr("data-toggle", "modal").attr("data-target", "#exampleModal").text("Submit!");

        $("#userInput").append([nameField, nameSubmitBtn]);


    }

    // Sets game board
    function gameStart() {
    
        clearInterval(timer);

        $(".fluff").hide();
        $("#startButton").hide();
        $("#userInput").children().show();
        $("#title").html(movieArray[counter].original_title + "  " + "<span class='badge badge-secondary' id='score'></span>");
        $("#poster").attr("src", "http://image.tmdb.org/t/p/w185/" + postersArray[counter]).attr("class", "animated bounce");
        $("#score").text(totalScore);
        $("#userInput").val("");

        counter++;


        timer = setInterval(function () {

        userSubmit();
        }, 15000);


    }

    // Takes usersubmitted guess, filters it and calculates score
    function userSubmit() {

        if ($("#userTriviaGuess").val() === "") {
            $("#userTriviaGuess").val(0);
        }

        let tomatoScoreUnfiletered = scoreArray[counter];
        let tomatoScoreFiltered = tomatoScoreUnfiletered.replace("%", "");
        let tomatoScore = parseInt(tomatoScoreFiltered);
        let userGuessFiltered = $("#userTriviaGuess").val().trim();
        let userGuess = parseInt(userGuessFiltered);
        let questionScore = Math.abs(tomatoScore - userGuess);
        // console.log(questionScore + "Question Score");
        totalScore = totalScore + questionScore;

        gameStart();
    }

    // Creates initial framework for leaderboard
    function createLeaderboard() {

        let leaderboardContainer = $("#leaderboardContainer");
        let leaderboardTable = $("<table>").attr("id", "leaderboardTable").attr("class", "table");
        let leaderboardHead = $("<thead>");
        let leaderboardBody = $("<tbody>").attr("id", "leaderboardBody");
        let leaderboardFirstRow = $("<tr>");
        let leaderboardPositionHeading = $("<th>").text("Position").attr("id", "leaderboardPositionHeading").attr("scope", "col");
        let leaderboardUserNameHeading = $("<th>").text("User Name").attr("id", "leaderboardUserNameHeading").attr("scope", "col");
        let leaderboardScoreHeading = $("<th>").text("Score").attr("id", "leaderboardScoreHeading").attr("scope", "col");

        leaderboardFirstRow.append([leaderboardPositionHeading, leaderboardUserNameHeading, leaderboardScoreHeading]);
        leaderboardHead.append(leaderboardFirstRow);
        leaderboardTable.append([leaderboardHead, leaderboardBody]);
        leaderboardContainer.append(leaderboardTable);


        database.ref().orderByChild("Score").on("child_added", function (snapshot) {

            if (flag === 0){
                leaderboardCounter = "You"
            }

            let data = snapshot.val();
            let newRow = $("<tr>");
            let leaderboardPostion = $("<td>").text(leaderboardCounter);
            let leaderboardName = $("<td>").text(data.Name);
            let leaderboardScore = $("<td>").text(data.Score);

            newRow.append([leaderboardPostion, leaderboardName, leaderboardScore]);
            leaderboardBody.append(newRow);

            if (flag === 0){
                flag = flag + 1;
                leaderboardCounter = 1;
            }

            else{
            leaderboardCounter++;
            }
        })
    };




    function nextQuestion() {


    }

    $(document).on("click", "#startButton", function (event) {

        console.log("click");

        gameStart()

    });

    $("#submitButton").on("click", function () {

        if (counter < movieArray.length) {

            // console.log(movieArray.length + "Movie Array Length");

            userSubmit();

        }

        else {
            endScreen()
        }

    });

    function getMoviesArrays() {

        randomPageNumber = Math.floor(Math.random() * (25 - 1) + 1);

        // console.log(randomPageNumber + "Page Number");

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://api.themoviedb.org/3/discover/movie?release_date.lte=2018-07-01&page=" + randomPageNumber + "&include_video=false&include_adult=false&sort_by=popularity.desc&region=US&language=en-US&api_key=48c01894d7887ea8ffef8f22cfac1d98",
            "method": "GET",
            "headers": {},
            "data": "{}"
        }

        $.ajax(settings).done(function (response) {
            // console.log(response + "Response");

            for (i = 0; i < numberVariable; i++) {


                let movieObject = response.results[i];
                let poster = response.results[i].poster_path;
                let year = movieObject.release_date.slice(0, 4);
                // console.log(year);
                let queryUrl = "http://www.omdbapi.com/?i=tt3896198&apikey=a3f03ecf&t=" + movieObject.original_title + "&y=" + year;

                $.ajax({
                    url: queryUrl,
                    method: "GET",
                }).done(function (scoreResponse) {

                    // console.log(scoreResponse + "Score Response");

                    let movieScore = scoreResponse.Ratings[1].Value;

                    if (movieScore == null) {

                        numberVariable = numberVariable + 1;
                    }

                    else {
                        if (movieArray.length === 10) {
                            return;
                        }

                        else {


                            // console.log(poster + "Poster");
                            // console.log(movieObject + "Movie Object")

                            movieArray.push(movieObject);
                            postersArray.push(poster);
                            // console.log(postersArray + "Poseters Array");
                            scoreArray.push(movieScore);
                        }
                    }
                })

            }
            if (movieArray.length < 10) {
                console.log("ALERT!")
                getMoviesArrays()

            }

        })
    }

    $(document).on("click", "#nameBtn", function () {

        userName = $("#userName").val();

        if (userName === "") {
            return
        }

        database.ref().push({
            Name: userName,
            Score: totalScore,
        });

        $("#userName").hide();
        $("#nameBtn").hide();

        createLeaderboard();
    });
});