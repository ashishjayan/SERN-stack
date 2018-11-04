import React, { Component, Button } from "react";
import { NavLink, Switch, Route } from "react-router-dom";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="app">
        <Navigation />
        <Main />
      </div>
    );
  }
}

class Navigation extends Component {
  render() {
    return (
      <nav>
        <ul>
          <li>
            <NavLink
              exact
              activeClassName="current"
              to="/app"
              onClick={this.forceUpdate}
            >
              Employee List
            </NavLink>
          </li>
          <li>
            <NavLink
              exact
              activeClassName="current"
              onClick={this.forceUpdate}
              to="/app/department"
            >
              Department List
            </NavLink>
          </li>
        </ul>
      </nav>
    );
  }
}

class Employee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      response: "",
      post: "",
      responseToPost: [],
      showResults: false
    };
  }
  handleChange = value => {
    console.log(`selected ${value}`);
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch("/api/employee");
    const body = await response.json();
    this.setState({
      users: body,
      post: body[0].SSN
    });
    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  handleSubmit = async e => {
    this.setState({
      showResults: true
    });
    console.log("working");
    e.preventDefault();
    const response = await fetch("/api/specificEmployee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ post: this.state.post })
    });
    const body = await response.json();

    this.setState({ responseToPost: body });
    console.log(this.state.responseToPost);
  };
  change = e => {
    this.setState({ post: e.target.value });
  };
  checkNULL = MINIT => {
    if (MINIT === "  NULL") return "";
    else return MINIT;
  };
  render() {
    let result = null;
    if (this.state.showResults) {
      result = (
        <div>
          {this.state.responseToPost.map(employee => (
            <strong key={employee.FNAME}>
              {employee.FNAME} {this.checkNULL(employee.MINIT)},{" "}
              {employee.LNAME}{" "}
            </strong>
          ))}
        </div>
      );
    }

    return (
      <div className="App">
        <h4>Get Employee Details for :</h4>
        <select onChange={this.change}>
          {this.state.users.map(users => (
            <option key={users.SSN} value={users.SSN}>
              {users.SSN}
            </option>
          ))}
        </select>
        <button onClick={this.handleSubmit}>CLICK ME</button>
        {result}
      </div>
    );
  }
}

class Department extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departments: []
    };
  }

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch("/api/department");
    const body = await response.json();
    this.setState({
      departments: body
    });
    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    console.log(this.state.departments);
    return (
      <div className="App">
        <tbody>
          <table>
            <tr>
              <th>Department Name </th>
              <th> Department Number</th>
            </tr>
            {this.state.departments.map(department => (
              <tr key={department.DNUMBER}>
                <td>{department.DNAME}</td>
                <td>
                  {department.DNUMBER}
                  <Button />
                </td>
              </tr>
            ))}
          </table>
        </tbody>
      </div>
    );
  }
}

const Delete = () => (
  <div className="contact">
    <p>Dank</p>
  </div>
);

const Main = () => (
  <Switch>
    <Route exact path="/app" component={Employee} />
    <Route exact path="/app/department" component={Department} />
    <Route exact path="/app/delete" component={Delete} />
  </Switch>
);

export default App;
