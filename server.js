const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//connect to database
var con = mysql.createConnection({
  host: "35.239.175.117",
  port: 3306,
  user: "root",
  password: "sose",
  database: "company"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
app.get("/api/employee", (req, res) => {
  con.query("SELECT * FROM company.employee", function(err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});
app.get("/api/department", (req, res) => {
  con.query("SELECT * FROM company.department", function(err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});

app.post("/api/specificDepartment", async (req, res) => {
  try {
    const departmentInfo = await con
      .promise()
      .query(
        "SELECT * FROM company.department WHERE DNUMBER = " + req.body.post
      );
    const departLocationInfo = await con
      .promise()
      .query(
        "SELECT DLOCATION FROM dept_locations where DNUM = " + req.body.post
      );
    const projectInfo = await con
      .promise()
      .query(
        "SELECT PNUMBER,PNAME,PLOCATION FROM project WHERE DNUMBER = " +
          req.body.post
      );
    const employeeInfo = await con
      .promise()
      .query(
        `select * from employee where ssn in (select essn from works_on where PNO in (select PNUMBER from project where DNUMBER = ${
          req.body.post
        }))`
      );
    const managerInfo = await con
      .promise()
      .query(
        `select * from employee where ssn = (select MGRSSN from department where DNUMBER = ${
          req.body.post
        })`
      );
    const response = {
      departmentInfo,
      departLocationInfo,
      projectInfo,
      employeeInfo,
      managerInfo
    };
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

app.get("/api/projects", (req, res) => {
  con.query("SELECT * FROM company.project", function(err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});

// API calls
app.get("/api/hello", (req, res) => {
  res.send({ express: "I like my dogs dog bro" });
});

app.post("/api/specificEmployee", (req, res) => {
  console.log(req.body);
  con.query(
    "SELECT * FROM company.employee WHERE SSN = " + req.body.post,
    function(err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
  // res.send(
  //   `I received your POST request. This is what you sent me: ${req.body.post}`
  // );
});

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));

  // Handle React routing, return all requests to React app
  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
