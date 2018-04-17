var user = require("./bamazonCustomer.js");
var manager = require("./bamazonManager.js");
var supervisor = require("./bamazonSupervisor.js");
var inquirer = require("inquirer");
var mysql = require("mysql");

var conn = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "DexterMorgan",
    database: "bamazon_db"
});

conn.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + conn.threadId + "\n");
    bamazonCLI();
})

function bamazonCLI() {
    inquirer.prompt([{
        message: "Welcome to Bamazon CLI. Please select the mode you would like to use",
        choices: ["Customer", "Manager", "Supervisor"],
        name: "mode",
        type: "list"
    }]).then(function (response) {
        switch (response.mode) {
            case "Customer":
                // readProducts();
                user();
                break;

            case "Manager":
                // authManager();
                manager();
                break;

            case "Supervisor":
                authSupervisor();

        }
    })
}

function authManager() {
    inquirer.prompt([{
        message: "Please enter you manager password.",
        type: "input",
        name: "password"
    }]).then(function (response) {
        if (response.password === "bigdeal") {
            manager();
        } else {
            console.log("Sorry, you are not authorized to enter Manager mode.");
            user();
        }
    })
}

function authSupervisor() {
    inquirer.prompt([{
        message: "Please enter you supervisor password.",
        type: "input",
        name: "password"
    }]).then(function (response) {
        if (response.password === "headhoncho") {
            manager();
        } else {
            console.log("Sorry, you are not authorized to enter Supervisor mode.");
            user();
        }
    })
}
// bamazonCLI();
// the app should default to customer mode with an option to select manager or supervisor modes. Manager and supervisor modes will require a password