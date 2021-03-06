var inquirer = require("inquirer");
var mysql = require("mysql");
var {
    table
} = require('table');

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
    supervisor();
})

function supervisor() {

    inquirer.prompt([{
        message: "What would you like to do?",
        name: "doWhat",
        type: "list",
        choices: ["View Product Sales by Department", "Create New Department"]
    }]).then(function (response) {
        switch (response.doWhat) {
            case "View Product Sales by Department":
                viewSales();
                break;

            case "Create New Department":
                createDepartment();
                break;
        }
    })
}

function makeTable(inventory) {
    console.log(table(inventory));
}


function viewSales() {
    var query = conn.query("SELECT department_name, product_sales FROM products GROUP BY department_name SUM (product_sales) AS department_sales", function (err, res) {
        if (err) throw err;

        var data = [
            ["Department ID", "Department Name", "Overhead Costs", "Department Sales", "Total Profit"]
        ];

        for (var i = 0; i < res.length; i++) {
            // department_sales[i] = sum product sales
            // for each deparment name;
            total_profit[i] = departmentSales - res[i].over_head_costs;

            data.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, department_sales[i], total_profit[i]]);

        }
        makeTable(data);
    })
}

// SELECT column - name AS alias - name
// FROM table - name alias - name
// WHERE condition

function createDepartment() {
    inquirer.prompt([{
            message: "What department would you like to create?",
            name: "department",
            type: "input"
        },
        {
            message: "What are the overhead costs for this department?",
            name: "overhead",
            type: "input"
        }
    ]).then(function (response) {
        var query = conn.query("INSERT INTO departments SET ?", {
                department_name: response.department,
                over_head_costs: response.overhead
            },
            function (err, res) {
                if (err) throw err;
                console.log(response.department + " department created!");
                doMore();

            }
        )
    })
}

function doMore() {
    inquirer.prompt([{
        message: "Would you like to complete another task?",
        name: "more",
        type: "confirm",
        default: false
    }]).then(function (response) {
        if (response.more === true) {
            supervisor();
        } else {
            console.log("Have a nice day!")
            conn.end();
        }
    })
}