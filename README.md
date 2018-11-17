# Project-One

Requirements

Must use at least 2 APIs
Must use AJAX to pull data
Must utilize at least one new library or technology that we haven’t discussed
Must have a polished frontend / UI
Must meet good quality coding standards
Must NOT use alerts, confirms or prompts (look into modals)
Must have some sort of repeating element (table, columns etc.)
Must use Bootstrap or Alternative CSS Framework
Must be deployed (GitHub Pages)
Must have User Input Validation

Problem - The requirements for Project One are listed above. Our team decided to create a movie trivia app that took in user input and took the difference between the rotten tomatoes score. The app makes a call out to two movie APIs to get a poster for each movie and to also get the rotten tomatoes score. The total score is calculated based on 10 movies and then the user enters in his or her name where it is added to a leaderboard based on their score. The lower the score, the better.  

Solution / Technical Approach - At a high level the app can be broken down into a few functions. One to start the game, a function based on the user input, generating the leaderboard, getting the movies from the API, next question, and end screen.


To start a user is brought to a title page. Once the user clicks the "start" button, that kicks off the game.
Start Game Function - This function hides the start button and some of the text from the starting screen. It also makes a call out to the tmdb API to get a random movie title, corresponding poster, it records the users score guess and sets a timer for 15 seconds. The timer is designed to prevent users from researching the movies rotten tomato score in another tab.

The user submit function has some logic in it to assign an empty value to 0. It also cleans up some of the data from the API. We had inconsistent data at times. Sometimes movies would have a fraction as the rotten tomatoes score instead of a percentage.

The leaderboard function is centered around taking the data from the firebase database that was stored and building out a modal for the leaderboard. We went this route because it made it a lot easier to see the leaders. Having a table on the screen was not as easy to read.

The next question function was used to keep the game moving between questions. It calls the main logic for the game from the gameStart function and it just applies this as the user hits submit (logic to account for the length of the array or 10 movies). If the total of movies exceeds 10, then this function prompts the end screen where the user can enter their name which then brings up the leaderboard so users can see how they did against their friends or other players.

Finally, there is another function that makes a call out to the omdb API. This API was used to get the year that each movie was released. We had to use two APIs so we got data from two different sources for the game.



