# toy-tasklist

A single-page front-end app that acts as a Task List / To-Do application. 

Tasks have two values:
 - description. (“Get milk.”, “Pay bills.”, etc.)
 - completed status. (true, false)

A user should be able to create tasks, mark tasks as complete, and delete tasks.

# API
Tasks are stored using the API backend, provided by POSTMAN at https://documenter.getpostman.com/view/8858534/SW7dX7JG#4d4e14a4-3f2d-4115-91fd-27f2db6227a0

# Dependencies and Gotchas
The front-end uses React.js (https://reactjs.org/), and pulls in a live reference to the library as a dependency. If we think users are likely to run into connectivity issues, we might store a local copy of the library or something like that.
The application does a lot on the client side, and as such it's possible for the client and server to get out of sync if e.g. you open a second tab and log in again. There is a "refresh" button to help mitigate this kind of issue.

# Installation
It should just be:
 - git clone https://github.com/jerryshub/toy-tasklist
 - navigate to index.html in your browser
 - javascript will have to be enabled 
 - you will need to log in or register a user before you can do anything

# Notes
As I'm sure you can tell, I haven't done one of these before (my experience has been more with "back end" applications). So I learned a lot doing this. But I expect that it would take me a little longer to get to a point where I could put together a "production quality" application like this from scratch. With that said, I did get it done and it's not too bad -- it does work. If I found myself in a job working on things like this, I would have a lot more time to dedicate to learning it, and I'd also have some existing applications that I can learn from while maintaining them. I do see some potential to this kind of approach (e.g. if there is a lot of local computation to be done, or something like that -- this approach is much more scalable than having all of the code running on the server).




