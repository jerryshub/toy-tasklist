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
        this.state.failedLogin = false;
        this.state.failedRegister = false;
        this.state.isLoggedIn = false;
        this.handleUsernameInput = this.handleUsernameInput.bind(this);
        this.handlePasswordInput = this.handlePasswordInput.bind(this);
    }

    handleLogin() {
        if( typeof this.state.usernameFromUser.target !== "undefined" && typeof this.state.passwordFromUser.target !== "undefined" ) {
            if( this.props.tryLogin(this.state.usernameFromUser.target.value,this.state.passwordFromUser.target.value) ) {
                this.setState({failedLogin:false,failedRegister:false,isLoggedIn:true});
            } else {
                this.setState({failedLogin:true,failedRegister:false,isLoggedIn:false});
            }
        }
    }

    handleRegister() {
        if( typeof this.state.usernameFromUser.target !== "undefined" && typeof this.state.passwordFromUser.target !== "undefined" ) {
            if( this.props.tryRegister(this.state.usernameFromUser.target.value,this.state.passwordFromUser.target.value) ) {
                this.handleLogin();
            } else {
                this.setState({failedLogin:false,failedRegister:true,isLoggedIn:false});
            }
        }
    }

    handleUsernameInput(t){ this.setState({usernameFromUser:t}); }
    handlePasswordInput(t){ this.setState({passwordFromUser:t}); }
    render(){
        return e("div",null, this.state.isLoggedIn ? e("span",null,"logged in as: "+this.props.username) : 
            e( "form",{id:"login-form"}
                ,e("input",{type:"text",placeholder:"username...",onChange:this.handleUsernameInput})
                ,e("input",{type:"password",placeholder:"password...",onChange:this.handlePasswordInput}) 
                ,e("span",null,this.state.failedLogin?"login failed (bad password?), please try again":"")
                ,e("span",null,this.state.failedRegister?"user registration failed (user already exists?), please try again":"")
                ,e("button",{type:"button",onClick:()=>this.handleLogin()},"login")
                ,e("button",{type:"button",onClick:()=>this.handleRegister()},"register")
            )
        )
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.state.username = "";
        this.state.logintoken = "";
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
    }
    handleUserChange( u , t ) {
        this.setState({username: u, token: t});
    }
    handleProductChange( p ) {
        this.setState({products: p});
    }
    tryLogin( username , password ) {
        if( username=="jerry" && password=="password" ) {
            this.handleUserChange("jerry","token");
            return true;
        } else {
            return false;
        }
    }
    tryRegister( username , password ) {
        return false;
    }
    render() {
        return e("div",null,e(LoginManager,{username:this.state.username,token:this.state.logintoken,handleUserChange:this.handleUserChange,tryLogin:this.tryLogin,tryRegister:this.tryRegister})
            ,e(FilterableProductTable,{products:this.state.products,handleProductChange:this.handleProductChange}));
    }
}

const app = ReactDOM.createRoot(document.getElementById('tasklist_container'));
app.render(e(App,null));

