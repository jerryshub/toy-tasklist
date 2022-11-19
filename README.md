# toy-tasklist

A single-page front-end app that acts as a Task List / To-Do application. 

Tasks have two values:
 - description. (“Get milk.”, “Pay bills.”, etc.)
 - completed status. (true, false)

A user should be able to create tasks, mark tasks as complete, and delete tasks.

# API
Tasks are stored using the API backend, provided by POSTMAN at https://documenter.getpostman.com/view/8858534/SW7dX7JG#4d4e14a4-3f2d-4115-91fd-27f2db6227a0

# Dependencies
The front-end uses React.js (https://reactjs.org/), and pulls in a live reference to the library as a dependency. If we think users are likely to run into connectivity issues, we might store a local copy of the library or something like that.

# Installation
It should just be:
 - git clone https://github.com/jerryshub/toy-tasklist
 - navigate to index.html in your browser

