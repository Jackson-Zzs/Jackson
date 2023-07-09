
### 1.1. Background & Motivation

In March 2022 you and your friends pitched a startup idea to produce *An innovative lightweight quiz platform for millenials* that will *revolutionise the secondary and tertiary education market for years*. You pitched this solution in the form of a web-based application, and called this quiz application **BigBrain**.

A week later you received a tentative $50,000 investment from an [Angel Investor](https://en.wikipedia.org/wiki/Angel_investor) pending you producing a working MVP of the application.

Shortly after you discussed the functionality and feature set with your friends, and wrote out a RESTful specification / interface together so that you can split up the front-end and back-end work between the group.

You decided to work on building the front-end. You wrote a list of requirements and functionalities your frontend should adhere to (described in `section 2`). You also decided to complete this application in `ReactJS`, a declarative framework for building single page applications. This front-end will interact with a Restful API that your team members are producing, based on the pre-defined interface.

Because your MVP is only going to be demonstrated once, your team considers it imperative that your front-end is thoroughly tested.

To satisfy modern tastes and expectations you have also decided to ensure that the UI/UX and Accessibility standards are very high.

For reference :
[kahoot](https://kahoot.com/).


## 2. The Front-end (Work to do)

Navigate to the `frontend` folder and run `npm install` to install all of the dependencies necessary to run the ReactJS app. Then run `npm start` to start the ReactJS app.

A series of features below need to be implemented in your ReactJS app to operate in conjunction with the backend (section 3).

### 2.1. Feature 1. Admin Auth 

#### 2.1.1. Login Screen
 * A unique route must exist for this screen
 * User must be able to enter their `email` and `password`.
 * If the form submission fails, a reasonable error message is shown
 * A button must exist to allow submission of form

#### 2.1.2. Register Screen
 * A unique route must exist for this screen
 * User must be able to enter their `email` and `password` and `name`
 * A button must exist to allow submission of form

#### 2.1.3. Logout Button
 * On all screens that require an authorised user, a logout button exists.
 * This logout button, when clicked, returns you to the login screen.

### 2.2. Feature 2. Admin Creating & Editing a Game 

#### 2.2.1. Dashboard
 * A unique route must exist for this screen
 * A dashboard of all games is displayed, where each game shows the title, number of questions, a thumbnail, and a total time to complete (sum of all individual question times)
 * Each game listed should have a clickable element relating to it that takes you to the screen to edit that particular game
 * A button exists on this screen that allows you to create a new game, provided a name for the game. Clicking it creates a new game on the server and adds another visible game to the dashboard.
 ** A button exists on this screen that allows you to delete a particular game.

#### 2.2.2. Edit BigBrain Game
 * A unique route must exist for this screen that is parameterised on the game ID
 * This screen allows users to select the question they want to edit
 * This screen allows users to delete a particular question, or add a new question
 * This screen should also allow the editing of game meta data such as name and thumbnail

#### 2.2.3. Edit BigBrain Game Question
 * A unique route must exist for this screen that is parameterised both on the Game ID and the question ID
 * Editable items on this page include:
   * The question type (multiple choice, single choice)
     * Single choice questions have multiple answers the player can guess, but only one is correct
     * Multiple choice questions have multiple answers the player can guess, but multiple are correct and they must select all correct ones
   * The question itself (as a string)
   * Time limit that users have to answer the question
   * Points for how much the question is worth
   * The ability to optionally attach a URL to a youtube video, or upload a photo, to enhance the question being asked).
   * Anywhere between 2 and 6 answers, that each contain the answer as a string

### 2.3. Feature 3. Admin Start, Stop, Results of game

#### 2.3.1. Starting a game
 * On the dashboard page, add the ability to start a new session.
 * When the game is started, a popup is displayed that shows the session ID of the game as a string
 * This session ID should be able to be copied by some kind of "Copy Link" button/element. When this item is clicked, a direct URL is copied to the clipboard. When going to this URL, the users should be given play screen (described in `2.4`) with the session code already pre-populated.

#### 2.3.2. Stopping a game
 * On the dashboard page, the ability to stop a started game. Stopping a game sends all active players to the results screen. A stopped session cannot be restarted.
 * When the game is stopped, a popup appears that prompts the admin "Would you like to view the results?" If they click yes, they are taken to the screen described in `2.3.3`

#### 2.3.3. Advancing & getting the results of a game
 * A unique route must exist for this screen that is parameterised on the session ID
 * Once the screen loads, and the game hasn't finished, it should allow the admin to advance to the next question or stop the session. You can advance either in the middle of a question or once the question has finished.
 * Once the screen loads, and the game has finished, it should display the following:
   * Table of up to top 5 users and their score
   * Bar/Line chart showing a breakdown of what percentage of people (Y axis) got certain questions (X axis) correct
   * Some chart showing the average response/answer time for each question
   * Any other interesting information you see fit

### 2.4. Feature 4. Player able to join and play game

#### 2.4.1. Play Join
 * A unique route must exist for this screen
 * A user is able to enter a session by either:
   * Navigating to a pre-determined URL they know about, then entering a session ID that an admin provides; or
   * Just following a URL that the admin provides that includes the session ID in it
 * After they're there, they enter their own name to attempt to join the session. If succesful, they're taken to `2.4.2`.

#### 2.4.2. Play Game
 * If the game has not yet started (i.e. have not advanced to the first question) a screen can exist that just says "Please wait".
 * Once advanced onto at least the first question, the user is now on a screen that gives the current question being asked. This consists of:
   * The question text
   * A video or image depending on whether it exists.
   * A countdown with how many seconds remain until you can't answer anymore.
   * A selection of either single or multiple answers, that are clickable.
 * The answer shall be sent to the server the moment the user starts making selections. If further selections are modified, more requests are sent
 * When the timer hits 0, the answer/results of that particular question are displayed
 * The answer screen remains visible until the admin advances the quiz question onto the next question.
 * Note: Once the game begins (onto the first question or more) no other players can join.
 
#### 2.4.3. Game Results
 * After the final question is answered, a page is displayed showing the key results:
   * The player's performance in each question

### 2.5. Advanced Features 

#### 2.5.1. Game Upload
 * For `2.2.1`, when a new game is created, the user can optionally upload a .csv or .json (you choose) file containing the full data for a game. The data structure is validated on the frontend before being passed to the backend normally. You should provide a copy of an example data file in your project repo ()
 * If you implement this feature, you must attach an example .csv or .json into your repo in the project folder. This file must have name `2.5.json`  or `2.5.csv`. This is so we can actually test that it works while marking.

#### 2.5.2. Lobby
 * If a quiz is active, but has yet to move into position 0 (i.e. is still in position -1), then a player lives in a state of limbo. Construct a "lobby" screen that is pleasant and entertaining for users while they await for the quiz to begin.

#### 2.5.3. Past quiz results
 * Allow admins to access a page whereby they can see a list of previous sessions for a quiz, and then view results for those previous sessions as well.
 
#### 2.5.4. Points system
 * Devise a more advanced points system whereby a player's score is the product of the time taken to complete a question (i.e. speed) and the number of points a question is worth.
 * This points system should be explained (in writing) on the results screen for both admins and players.

### 2.6. Linting

* Linting must be run from inside the `frontend` folder by running `npm run lint`.

If you would like to disable linting checks during hot reload (and just use the check on command line), then in `frontend/package.json` replace `react-scripts start` with `ESLINT_NO_DEV_ERRORS='true'; react-scripts start`. Note: This does not work on windows machines.

### 2.7. Testing

Write some tests for your components (component testing), and for your application as a whole (ui testing).

For **component testing**, you must:
 * Write tests for different components
 * For each of the components, they mustn't have more than 50% similarity (e.g. you can't test a "Card" component and a "BigCard" component, that are virtually the same)
 * Ensure your tests have excellent **coverage** (look at all different use cases and edge cases)
 * Ensure your tests have excellent **clarity** (well commented and code isn't overly complex)
 * Ensure your tests are **designed** well (logical ordering of tests, avoid any tests that aren't necessary or don't add any meaningful value)
 * (We encourage you to only use shallow component rendering)

For **ui testing**, you must:
 * Write a test for the "happy path" of an admin that is described as:
   1. Registers successfully
   2. Creates a new game successfully
   3. (Not required) Updates the thumbnail and name of the game successfully (yes, it will have no questions)
   4. Starts a game successfully
   5. Ends a game successfully (yes, no one will have played it)
   6. Loads the results page successfully
   7. Logs out of the application successfully
   8. Logs back into the application successfully
 * (If working in a pair) also required to write a test for another path through the program, describing the steps and the rationale behind this choice in `TESTING.md`

Tests must be run from inside the `frontend` folder by running `npm run test`.

You can welcome to use `enzyme` for testing if you prefer - as long as everything works by running `npm run test`.

If you're having issues using Cypress on WSL2, try following [this guide](https://shouv.medium.com/how-to-run-cypress-on-wsl2-989b83795fb6).

A common question we get about component testing is 'what components do I test? I just only used a framework set of components'. The most common way students test components is by often creating a small abstract component where you put your own custom styles or properties. E.G. Creating a `MyButton` that wraps a MUI `Button`.

### 3.1. The Frontend

Navigate to the `frontend` folder and run `npm install` to install all of the dependencies necessary to run the ReactJS app. Then run `npm start` to start the ReactJS app.

Please note that some properties that the backend takes in are defined as blank objects. These are objects that can be defined by you, as the backend will simply store your object on some routes and then return it to you on other routes (i.e. the backend doesn't need to understand the schema of some objects you pass it).


### 3.2. The Backend (provided)

After you clone this repo, you must run `npm install` in `backend` directory once.

To run the backend server, simply run `npm start` in the `backend` directory. This will start the backend.

To view the API interface for the backend you can navigate to the base URL of the backend (e.g. `http://localhost:5005`). This will list all of the HTTP routes that you can interact with.

Your backend is persistent in terms of data storage. That means the data will remain even after your express server process stops running. If you want to reset the data in the backend to the original starting state, you can run `npm run reset` in the backend directory. If you want to make a copy of the backend data (e.g. for a backup) then simply copy `database.json`. If you want to start with an empty database, you can run `npm run clear` in the backend directory.

Once the backend has started, you can view the API documentation by navigating to `http://localhost:[port]` in a web browser.

