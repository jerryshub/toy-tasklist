'use strict';
const e = React.createElement;

class ProductCategoryRow extends React.Component {
  render() {
    const category = this.props.category;
    return e("tr", null, e("th", {
      colSpan: "2"
    }, category));
  }
}
class ProductRow extends React.Component {
  render() {
    const product = this.props.product;
    const name = product.stocked ? product.name : e("span", {
      style: {
        color: 'red'
      }
    }, product.name);
    return e("tr", null, e("td", null, name), e("td", null, product.price));
  }
}
class ProductTable extends React.Component {
  render() {
    const filterText = this.props.filterText;
    const inStockOnly = this.props.inStockOnly;
    const rows = [];
    let lastCategory = null;
    this.props.products.forEach(product => {
      if (product.name.indexOf(filterText) === -1) {
        return;
      }
      if (inStockOnly && !product.stocked) {
        return;
      }
      if (product.category !== lastCategory) {
        rows.push( e(ProductCategoryRow, {
          category: product.category,
          key: product.category
        }));
      }
      rows.push( e(ProductRow, {
        product: product,
        key: product.name
      }));
      lastCategory = product.category;
    });
    return e("table", null, e("thead", null, e("tr", null, e("th", null, "Name"), e("th", null, "Price"))), e("tbody", null, rows));
  }
}
class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleInStockChange = this.handleInStockChange.bind(this);
  }
  handleFilterTextChange(e) {
    this.props.onFilterTextChange(e.target.value);
  }
  handleInStockChange(e) {
    this.props.onInStockChange(e.target.checked);
  }
  render() {
    return e("form", null, e("input", {
      type: "text",
      placeholder: "Search...",
      value: this.props.filterText,
      onChange: this.handleFilterTextChange
    }), e("p", null, e("input", {
      type: "checkbox",
      checked: this.props.inStockOnly,
      onChange: this.handleInStockChange
    }), ' ', "Only show products in stock"));
  }
}
class FilterableProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      inStockOnly: false
    };
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleInStockChange = this.handleInStockChange.bind(this);
  }
  handleFilterTextChange(filterText) {
    this.setState({
      filterText: filterText
    });
  }
  handleInStockChange(inStockOnly) {
    this.setState({
      inStockOnly: inStockOnly
    });
  }
  render() {
    return e("div", null, e(SearchBar, {
      filterText: this.state.filterText,
      inStockOnly: this.state.inStockOnly,
      onFilterTextChange: this.handleFilterTextChange,
      onInStockChange: this.handleInStockChange
    }), e(ProductTable, {
      products: this.props.products,
      filterText: this.state.filterText,
      inStockOnly: this.state.inStockOnly
    }));
  }
}

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
                    ,e("button",{type:"button",onClick:()=>this.handleLogout()},"logout") ): 
                e("form",{id:"login-form"}
                    ,e("p",null,this.props.loginerror)
                    ,e("input",{type:"text",placeholder:"email...",onChange:this.handleUsernameInput})
                    ,e("input",{type:"password",placeholder:"password...",onChange:this.handlePasswordInput}) 
                    ,e("button",{type:"button",onClick:()=>this.handleLogin()},"login")
                    ,e("button",{type:"button",onClick:()=>this.handleRegister()},"register")
            )
        )
    }
}

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
        this.props.updateTask({id:this.props.task.id, description: this.state.descriptionFromUser }); 
        this.setState({editing:false});
    }
    handleMarkComplete(){ this.props.updateTask({id:this.props.task.id, completed:true}); this.setState({completed:true}); }
    handleDelete(){ this.props.deleteTask({id:this.props.task.id}); }
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
}

class TaskTable extends React.Component {
    render() {
        const rows = [];
        this.props.tasks.forEach( task => {
            rows.push( e(TaskFormRow,{ task: task, key: task.id , updateTask: this.props.updateTask , deleteTask: this.props.deleteTask}) );
        });
        return e("form",null,e("table",null,
                e("thead",null,e("tr",null,
                    e("th",null,"Task")
                    ,e("th",null,"completed?")
                    ,e("th",null,"delete?")
                ))
                ,e("tbody",null,rows)
            ));
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.state.username = "";
        this.state.token = "";
        this.state.isLoggedIn = "";
        this.state.loginerror = "";
        this.state.tasks = [{
                 id: "1a"
                ,description: "task 1a"
                ,completed: false
            },{
                 id: "1b"
                ,description: "task 1b"
                ,completed: false
            },{
                 id: "1c"
                ,description: "task 1c"
                ,completed: true
            },{
                 id: "1d"
                ,description: "task 1d"
                ,completed: false
            }];
            
        this.state.products = [{
                category: 'Sporting Goods',
                price: '$49.99',
                stocked: true,
                name: 'Football'
            }, {
                category: 'Sporting Goods',
                price: '$9.99',
                stocked: true,
                name: 'Baseball'
            }, {
                category: 'Sporting Goods',
                price: '$29.99',
                stocked: false,
                name: 'Basketball'
            }, {
                category: 'Electronics',
                price: '$99.99',
                stocked: true,
                name: 'iPod Touch'
            }, {
                category: 'Electronics',
                price: '$399.99',
                stocked: false,
                name: 'iPhone 5'
            }, {
                category: 'Electronics',
                price: '$199.99',
                stocked: true,
                name: 'Nexus 7'
            }]

        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleProductChange = this.handleProductChange.bind(this);
        this.tryLogin = this.tryLogin.bind(this);
        this.tryRegister = this.tryRegister.bind(this);
        this.tryLogout = this.tryLogout.bind(this);
        this.updateTask = this.updateTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
    }
    handleUserChange( resp , isLogout ) { // response from the fetch() call to login
        if( typeof resp.token !== 'undefined' && resp.token != "" ) {
            this.setState({username: resp.user.email, token: resp.token, loginerror: "", isLoggedIn:true});
        } else if( isLogout ) {
            this.setState({username: "", token: "", loginerror: "Logged out.", isLoggedIn: false})
        } else {
            var msg = "login failed";
            if( typeof resp === "String" ) {
                msg = resp;
            }
            this.setState({username: "", token: "", loginerror: "error: "+msg+" -- please try again.", isLoggedIn: false})
        }
    }
    handleProductChange( p ) {
        this.setState({products: p});
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

    updateTask( newValues ) { 
        const index = this.findTaskIndexById( newValues.id );
        console.log(this.state.tasks);
        console.log(newValues);
        console.log(index);

        this.state.tasks[index].completed = true;
        this.forceUpdate();
    } 
    deleteTask( idToDelete ) {
        const index = this.findTaskIndexById( idToDelete );
        this.state.tasks.splice(index,1);
        this.forceUpdate();
    } 

    // used this twice, so i'll pull it out
    findTaskIndexById( taskid ) {
        // FIXME it would be better if this.state.tasks was a map of maps or a struct of structs instead of an array of structs (i.e. since the lookup would be immediate instead of having to do this loop). but i didn't immediately figure out how to get React to loop over a struct (i.e. forEach is a member of the array but not a member of the struct), and I am running out of time, so i gave up on that and we'll just do this lame loop. computers are fast, it'll be fine. if the guy has 10^6 tasks then he's got bigger problems anyway.
        var index = -1;
        for( var i=0; i<this.state.tasks.length; i++ ) {
            if( this.state.tasks[i].id == taskid ) {
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
                ,loginerror: this.state.loginerror
                ,isLoggedIn: this.state.isLoggedIn
                ,handleUserChange:this.handleUserChange,tryLogin:this.tryLogin,tryRegister:this.tryRegister,tryLogout:this.tryLogout})
            ,e(TaskTable,{tasks:this.state.tasks, updateTask:this.updateTask, deleteTask:this.deleteTask})
            ,e(FilterableProductTable,{products:this.state.products,handleProductChange:this.handleProductChange}));
    }
}

const app = ReactDOM.createRoot(document.getElementById('tasklist_container'));
app.render(e(App,null));

