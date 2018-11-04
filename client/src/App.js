import React, { Component, Button } from "react";
import { NavLink, Switch, Route } from "react-router-dom";
import "./App.css";
import { async } from "rxjs/internal/scheduler/async";

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
      departments: [],
      metaData: null,
      departmentInfo: null,
      departLocationInfo: null,
      projectInfo: null,
      employeeInfo: null
    };
  }
  async fetchDetails(department) {
    const response = await fetch("/api/specificDepartment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ post: department.DNUMBER })
    });
    const body = await response.json();
    this.setState({
      departLocationInfo: body.departLocationInfo[0],
      departmentInfo: body.departmentInfo[0],
      projectInfo: body.projectInfo[0],
      employeeInfo: body.employeeInfo[0]
    });
    if (response.status !== 200) throw Error(body.message);
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
  handleClick = department => {
    console.log(department);
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
            {this.state.departments.map((department, index) => {
              return (
                <tr key={index} onClick={() => this.fetchDetails(department)}>
                  <td data-title="DNAME">{department.DNAME}</td>
                  <td data-title="DNUMBER">{department.DNUMBER}</td>
                </tr>
              );
            })}
          </table>
          {this.state.projectInfo ? (
            <table>
              <tr>
                <th>Project Number </th>
                <th> Project Name</th>
                <th> Project Location</th>
              </tr>
              {this.state.projectInfo.map((project, index) => {
                return (
                  <tr key={index}>
                    <td data-title="PNUMBER">{project.PNUMBER}</td>
                    <td data-title="PNAME">{project.PNAME}</td>
                    <td data-title="PLOCATION">{project.PLOCATION}</td>
                  </tr>
                );
              })}
            </table>
          ) : null}

          {this.state.employeeInfo ? (
            <table>
              <tr>
                <th>Employee SSN </th>
                <th> Last Name</th>
                <th> First Name</th>
              </tr>
              {this.state.employeeInfo.map((employee, index) => {
                return (
                  <tr key={index}>
                    <td data-title="SSN">{employee.SSN}</td>
                    <td data-title="LNAME">{employee.LNAME}</td>
                    <td data-title="FNAME">{employee.FNAME}</td>
                  </tr>
                );
              })}
            </table>
          ) : null}
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
