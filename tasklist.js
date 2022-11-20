'use strict';
const e = React.createElement;

// handles login and registration form
class LoginManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.usernameFromUser = "";
        this.state.passwordFromUser = "";
        this.handleUsernameInput = this.handleUsernameInput.bind(this);
        this.handlePasswordInput = this.handlePasswordInput.bind(this);
    }

    handleLogin() {
        if( typeof this.state.usernameFromUser.target !== "undefined" && typeof this.state.passwordFromUser.target !== "undefined" ) {
            this.props.tryLogin(this.state.usernameFromUser.target.value,this.state.passwordFromUser.target.value);
        }
    }

    handleLogout() {
        this.props.tryLogout();
    }

    handleRegister() {
        if( typeof this.state.usernameFromUser.target !== "undefined" && typeof this.state.passwordFromUser.target !== "undefined" ) {
            if( this.props.tryRegister(this.state.usernameFromUser.target.value,this.state.passwordFromUser.target.value) ) {
                this.handleLogin();
            }
        }
    }

    handleUsernameInput(t){ this.setState({usernameFromUser:t}); }
    handlePasswordInput(t){ this.setState({passwordFromUser:t}); }

    render(){
        return e("div",null, this.props.isLoggedIn ? 
                e("div",null,
                    e("span",null,"logged in as: "+this.props.username) 
                    ,e("button",{type:"button",onClick:()=>this.handleLogout()},"logout") ) : 
                e("form",{id:"login-form"}
                    ,e("input",{type:"text",placeholder:"email...",onChange:this.handleUsernameInput})
                    ,e("input",{type:"password",placeholder:"password...",onChange:this.handlePasswordInput}) 
                    ,e("button",{type:"button",onClick:()=>this.handleLogin()},"login")
                    ,e("button",{type:"button",onClick:()=>this.handleRegister()},"register")
            )
        )
    }
} // LoginManager

// prints one row of the task list
class TaskFormRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.descriptionFromUser = this.props.task.description;
        this.state.completed = this.props.task.completed;
        this.state.editing = false;

        this.handleDescriptionInput = this.handleDescriptionInput.bind(this);
        this.handleMarkComplete = this.handleMarkComplete.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }
    handleDescriptionInput(t){ this.setState({descriptionFromUser:t.target.value}); }
    handleUpdate(){ 
        this.props.updateTask({_id:this.props.task._id, description: this.state.descriptionFromUser }); 
        this.setState({editing:false});
    }
    handleMarkComplete(){ this.props.updateTask({_id:this.props.task._id, completed:true}); this.setState({completed:true}); }
    handleDelete(){ this.props.deleteTask(this.props.task._id); }
    handleEdit(){ this.setState({editing:true}); }
    handleCancelEdit(){ this.setState({descriptionFromUser:this.props.task.description,editing:false}); }

    render() {

        const descCellWhenEditing = e("td",null,e("input",{type:"text",defaultValue:this.state.descriptionFromUser,onChange:this.handleDescriptionInput})           
                            , e("button",{type:"button",onClick:()=>this.handleUpdate()},"save")
                            , e("button",{type:"button",onClick:()=>this.handleCancelEdit()},"cancel") );
        const descCell = e("td", null, e("span",null,this.state.descriptionFromUser)
                            , e("button",{type:"button",onClick:()=>this.handleEdit()},"edit") );

        const markCompleteCell = e("td",null,e("span",null,"incomplete "), e("button",{type:"button",onClick:()=>this.handleMarkComplete()},"mark complete"));
        const markCompleteCellWhenComplete = e("td",null,e("span",null,"completed "));

        return e( "tr" , null , 
                     this.state.editing ? descCellWhenEditing : descCell 
                    , this.state.completed ? markCompleteCellWhenComplete : markCompleteCell
                    ,e("td",null,e("button",{type:"button",onClick:()=>this.handleDelete()},"delete"))
            );
    }
} // TaskFormRow

// prints the tast list table
class TaskTable extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        this.state.newTaskText = "";
        this.state.incompleteOnly = false;
        this.handleNewTaskTextChange = this.handleNewTaskTextChange.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.preventDefault = this.preventDefault.bind(this);
    }

    handleAdd(){ this.props.addTask(this.state.newTaskText); this.setState({newTaskText:""}); }
    handleRefresh(){ this.props.loadTasks(); }

    handleFilterChange(newIncompleteOnly) { 
        this.setState({incompleteOnly:newIncompleteOnly.target.checked}); 
    }

    handleNewTaskTextChange(e) {
        this.setState({newTaskText:e.target.value});
    }

    // to prevent it from reloading the page if you hit enter while typing in a new task.
    preventDefault(e) {
        if( typeof e.key === 'undefined' || e.key === 'Enter' ) {
            e.preventDefault();
        }
    }

    render() {
        if( ! this.props.isLoggedIn ) {
            return "";
        }
        const rows = [];
        this.props.tasks.forEach( task => {
            if( !this.state.incompleteOnly || !task.completed ) {
                rows.push( e(TaskFormRow,{ task: task, key: task._id , updateTask: this.props.updateTask , deleteTask: this.props.deleteTask}) );
            }
        });
        return e("form",{onSubmit:this.preventDefault},
                e("input",{type:"text", placeholder: "new task...",value:this.state.newTaskText,onChange:this.handleNewTaskTextChange,onKeyPress:this.preventDefault})
                ,e("button",{type:"button",onClick:()=>this.handleAdd()},"add task")
                ,e("div",null,e("input",{type:"checkbox",id:"incompleteOnly",checked:this.state.incompleteOnly,onChange:this.handleFilterChange}) , e("label",{htmlFor:"incompleteOnly"},"Show incomplete tasks only") )
                ,e("button",{type:"button",onClick:()=>this.handleRefresh()},"refresh list")
                ,e("table",null,
                  e("thead",null,e("tr",null,
                    e("th",null,"Task")
                    ,e("th",null,"completed?")
                    ,e("th",null,"delete?")
                ))
                ,e("tbody",null,rows)
            ));
    }
} // TaskTable

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.state.username = "";
        this.state.token = "";
        this.state.isLoggedIn = "";
        this.state.appfeedback = "";
        this.state.tasks = [];
            
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleTaskListChange = this.handleTaskListChange.bind(this);
        this.tryLogin = this.tryLogin.bind(this);
        this.tryRegister = this.tryRegister.bind(this);
        this.tryLogout = this.tryLogout.bind(this);
        this.updateTask = this.updateTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.addTask = this.addTask.bind(this);
        this.setError = this.setError.bind(this);
        this.loadTasks = this.loadTasks.bind(this);
    }
    handleUserChange( resp , isLogout ) { // response from the fetch() call to login
        if( typeof resp.token !== 'undefined' && resp.token != "" ) {
            this.setState({username: resp.user.email, token: resp.token, appfeedback: "", isLoggedIn:true});
            // FIXME: some async issue here, where even though i just setState(token: resp.token), it is
            // not there when this function runs. I guess I will make an optional argument to pass it in
            // but this is not a good solution.
            this.loadTasks( resp.token );
        } else if( isLogout ) {
            this.setState({username: "", token: "", tasks: [] , appfeedback: "Logged out.", isLoggedIn: false})
        } else {
            var msg = "login failed";
            if( typeof resp === "String" ) {
                msg = resp;
            }
            this.setState({username: "", token: "", tasks: [] , appfeedback: "error: "+msg+" -- please try again.", isLoggedIn: false})
        }
    }

    handleTaskListChange( resp ) {
        if( typeof resp.data !== 'undefined' ) {
            this.setState({tasks: resp.data});
        } else {
            this.setError();
        }
    }

    loadTasks( optionalToken ) {
        var token = this.state.token;
        if( typeof optionalToken !== 'undefined' ) {
            token = optionalToken
        }
        fetch( "https://api-nodejs-todolist.herokuapp.com/task" , {
                  method: 'GET'
                , headers: {'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token }
            }).then((response) => response.json()).then((response)=>this.handleTaskListChange(response)).catch(this.setError);
    }

    tryLogin( username , password ) {
        var params = {email:username, password:password};
        fetch( "https://api-nodejs-todolist.herokuapp.com/user/login" , {
                  method: 'POST'
                , headers: {'Content-Type': 'application/json'}
                , body: JSON.stringify(params)
            }).then((response) => response.json()).then((response)=>this.handleUserChange(response,false));
    }

    tryRegister( username , password ) {
        var params = {name:username, email:username, password:password};
        fetch( "https://api-nodejs-todolist.herokuapp.com/user/register" , {
                  method: 'POST'
                , headers: {'Content-Type': 'application/json'}
                , body: JSON.stringify(params)
            }).then((response) => response.json()).then((response)=>this.handleUserChange(response,false));
    }

    tryLogout() {
        fetch( "https://api-nodejs-todolist.herokuapp.com/user/logout" , {
                  method: 'POST'
                , headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer '+this.state.token }
            }).then((response) => response.json()).then((response)=>this.handleUserChange(response,true));
    }

    // handles when the task/key/update api call returns 
    handleTaskChange( index , taskid , resp , wasDeleted , wasAdded ) {
        // FIXME there is probably a better way to setState() just one index of the array (i.e. so that React knows that it has to re-render after the state change), but i didn't figure it out yet. we can work around it using forceUpdate();

        if( wasDeleted ) {
            // had an asynch issue where if you click the delete button a couple times, it would remove a few rows
            // from the local display instead of just the one row. trying to hedge against that behavior here.
            // I could just reload the whole task list, but it seems like a waste. I don't know the best practice here.
            // FIXME i think I have seen applications like this in which the button disappears after you click it once, 
            // to prevent you from clicking it a bunch of times and running into this issue? Maybe that is a more common
            // practice? but I think this is ok for now.
            if( this.state.tasks[index]._id == taskid ) {
                this.state.tasks.splice(index,1);
            }
            this.setState({appfeedback:"Task deleted."});
        } else {
            if( typeof resp.data !== 'undefined' ) {
                if( wasAdded ) {
                    this.state.tasks.push( resp.data );
                    //FIXME I should use two different fields for error messages and success messages.
                    this.setState({appfeedback:"Task added."});
                } else {
                    if( this.state.tasks[index]._id == taskid ) {
                        this.state.tasks[index] = resp.data;
                    }
                    this.setState({appfeedback:"Task updated."});
                }
            } else {
                this.setError();
            }
        }
        this.forceUpdate();
    }

    setError( err ) {
        // FIXME I would love to give a little more information here, but i haven't immediately figured out how to
        // extract useful information from whatever is being passed in here.
        var msg = "An error occurred. please try again, or log out and back in.";
        this.setState({appfeedback:msg});
    }

    updateTask( newValues ) { 
        // i can't just pass in newValues because it chokes on the _id key, i think. And I want to make sure that I'm only updating the keys I wanted to update.
        var params = {};
        if( typeof newValues.description !== 'undefined' ) {
            params.description = newValues.description;
        }
        if( typeof newValues.completed !== 'undefined' ) {
            params.completed = newValues.completed;
        }
        const index = this.findTaskIndexById( newValues._id );
        fetch( "https://api-nodejs-todolist.herokuapp.com/task/"+newValues._id , {
                  method: 'PUT'
                , headers: {'Content-Type': 'application/json' , 'Authorization': 'Bearer '+this.state.token}
                , body: JSON.stringify(params)
            }).then((response) => response.json()).then((response)=>this.handleTaskChange(index,newValues._id,response,false,false)).catch(this.setError);
    } 

    deleteTask( idToDelete ) {
        const index = this.findTaskIndexById( idToDelete );
        fetch( "https://api-nodejs-todolist.herokuapp.com/task/"+idToDelete , {
                  method: 'DELETE'
                , headers: {'Content-Type': 'application/json' , 'Authorization': 'Bearer '+this.state.token}
            }).then((response) => response.json()).then((response)=>this.handleTaskChange(index,idToDelete,response,true,false)).catch(this.setError);
    } 

    addTask( newDescr ) {
        const params = {description: newDescr};
        fetch( "https://api-nodejs-todolist.herokuapp.com/task" , {
                  method: 'POST'
                , headers: {'Content-Type': 'application/json' , 'Authorization': 'Bearer '+this.state.token}
                , body: JSON.stringify(params)
            }).then((response) => response.json()).then((response)=>this.handleTaskChange(-1,-1,response,false,true)).catch(this.setError);
    } 

    // used this twice, so i'll pull it out
    findTaskIndexById( taskid ) {
        // FIXME it would be better if this.state.tasks was a map of maps or a struct of structs instead of an array of structs (i.e. since the lookup would be immediate instead of having to do this loop). but i didn't immediately figure out how to get React to loop over a struct (i.e. forEach is a member of the array but not a member of the struct), and I am running out of time, so i gave up on that and we'll just do this lame loop. computers are fast, it'll be fine. if the guy has 10^6 tasks then he's got bigger problems anyway.
        var index = -1;
        for( var i=0; i<this.state.tasks.length; i++ ) {
            if( this.state.tasks[i]._id == taskid ) {
                index = i;
                break;
            }
        }
        return index;
    }

    render() {
        return e("div",null,e(LoginManager,{
                username: this.state.username
                ,token: this.state.token
                ,isLoggedIn: this.state.isLoggedIn
                ,handleUserChange:this.handleUserChange,tryLogin:this.tryLogin,tryRegister:this.tryRegister,tryLogout:this.tryLogout})
            ,e("div",{id:"error"},this.state.appfeedback)
            ,e(TaskTable,{isLoggedIn: this.state.isLoggedIn , tasks:this.state.tasks, updateTask:this.updateTask, deleteTask:this.deleteTask , addTask:this.addTask , loadTasks:this.loadTasks})
            );
    }
} // App

const app = ReactDOM.createRoot(document.getElementById('tasklist_container'));
app.render(e(App,null));

