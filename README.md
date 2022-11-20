# toy-tasklist

A single-page front-end app that acts as a Task List / To-Do application. 

Tasks have two values:
 - description. (“Get milk.”, “Pay bills.”, etc.)
 - completed status. (true, false)

A user should be able to create tasks, mark tasks as complete, and delete tasks.

## API

Tasks are stored using the API backend, provided by POSTMAN at https://documenter.getpostman.com/view/8858534/SW7dX7JG#4d4e14a4-3f2d-4115-91fd-27f2db6227a0

## Dependencies and Gotchas

The front-end uses React.js (https://reactjs.org/), and pulls in a live reference to the library as a dependency. If we think users are likely to run into connectivity issues, we might store a local copy of the library or something like that.

The application does a lot on the client side, and as such it's possible for the client and server to get out of sync if e.g. you open a second tab and log in again, and then start working in both tabs at the same time. There is a "refresh" button to help mitigate this kind of issue.

## Installation

It should just be:
 - git clone https://github.com/jerryshub/toy-tasklist
 - navigate to index.html in your browser
 - javascript will have to be enabled 
 - you will need to log in or register a user before you can do anything

## Other Notes

As I'm sure you can tell, I haven't done one of these before (my experience has been more with "back end" applications). So I learned a lot doing this. But I expect that it would take me a little longer to get to a point where I could put together a "production quality" application like this from scratch. With that said, I did get it done and it's not too bad -- it does work. If I found myself in a job working on things like this, I would have a lot more time to dedicate to learning it, and I'd also have some existing applications that I can learn from while maintaining them. I do see some potential to this kind of approach (e.g. if you're working on a google spreadsheets type of application with rich client-side functionality, or if there is a lot of local computation to be done, or something like that -- this approach is much more flexible and scalable than having all of the code running on the server).

## TODOs / Areas for Improvement

 - Since so much happens on the client side, it's important to test this more thoroughly in a variety of web browsers. I've looked at it in Firefox and Chrome, but that's all I have available at home.

 - I don't like that the user has to log in again every time the come to the page. should we put the bearer token into a cookie or the local storage or something like that? I'm a little nervous about that because I don't know how long the tokens last before they expire. I'd have to check for session expiration periodically if we do that. I'll leave it this way for now, but I think in production I would try to do something like that if the session duration turns out to be more than a few hours.

 - If this were a production application, I'd like to go through and tighten up the error handling. In particular, I'd like to give the user better error messages when something goes wrong. I saw some error messages coming back from the API that looked suitable for display to the user, but some others that did not. And sometimes the important information is in a JSON response, sometimes it is plain text in the response, sometimes it is in the http herror code... so this would be a little complicated -- perhaps a function that takes the http response code and the response body and tries to guess a good message to give the user based on that. I didn't put much effort into that for this version. 

 - I think it would be nice if the application showed some additional information about the tasks, like the due date. I also find that I personally often want to split my work into two queues -- a "slow lane" for long term project work and a "fast lane" for operational tasks and quick fixes. 
A general way to solve both of those problems (plus many others) might be to add a key/value pair tagging system, and an API call to search for tasks by tag. Then the front-end developer could tag tasks with "DUE_DATE=2022-12-01" to track due dates, or "QUEUE=FASTLANE"/"QUEUE=SLOWLANE" to implement the multiple queues thing, then display the tasks sorted by due date or display the different queues in different lists, etc. Plus many other things I haven't thought of. Perhaps this is overly complicated? But it would mean that we don't have to change the API every time someone has a new idea.

 - There are a few FIXMEs in the javascript code that call out various subtleties that I am still looking into.

 - A bug? While I was working on this, I registered gmail.com address as a user, then deleted it, then registered it again, in pretty rapid succession. It worked for a few hours, but then I noticed that I could no longer log in as it. The break seemed to coincide with me receiving welcome emails from the application at that address. I wonder if there is some kind of batch process (at ~5pm?) that finalizes the accounts and sends out the welcome emails, that somehow corrupted my account due to there being two registrartions in the same batch? Or, maybe I just forgot the password. I guess password reset is another possible enhancement. Though it might be better to use an existing account (gmail or whatever) via OAuth or something, instead of having the user remember another credential.


