var inquirer = require("inquirer");
var mysql = require("mysql");
var table = require("table");

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
    manager();
})

function manager() {
    inquirer.prompt([

        {
            type: "list",
            name: "doingWhat",
            message: "What would you like to do??",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add new Product"]
        },


    ]).then(function (response) {
        switch (response.doingWhat) {
            case "View Products for Sale":
                readProducts();
                break;

            case "View Low Inventory":
                queryLowInventory();
                break;

            case "Add to Inventory":
                updateInventory();
                break;

            case "Add new Product":
                createProduct();

        }
    })
}

function readProducts() {
    var query = conn.query("SELECT * FROM products",
        function (err, res) {
            if (err) throw err;
            console.log("All available products: \n")
            for (var i = 0; i < res.length; i++) {
                // const products = require('products');
                // let data,
                //     output,
                //     options;

                // data = [
                //     [res[i].item_id, res[i].product_name, res[i].pric, res[i].stock_quantity],

                // ];

                // options = {
                //     columns: {
                //         1: {
                //             width: 10
                //         }
                //     }
                // };

                // output = table(data, options);

                // console.log(output);
                console.log("Item Number: " + res[i].item_id + " \nProduct: " + res[i].product_name + " \nPrice: " + res[i].price + " \nQuantity: " + res[i].stock_quantity + "\n");
            }

            // conn.end()
            doMore();
        })
}

function queryLowInventory() {
    var query = conn.query("SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity < 5",
        function (err, res) {
            if (err) throw err;
            console.log("Products with less than 5 in stock\n");
            for (var i = 0; i < res.length; i++) {
                console.log("Item Number: " + res[i].item_id + " \nProduct: " + res[i].product_name + " \nQuantity: " + res[i].stock_quantity + "\n");
            }
            // conn.end();
            doMore();

        })
}

function updateInventory() {

    inquirer.prompt([{
            message: "What is the Id of the product you would like to update?",
            name: "itemId",
            type: "input"
        },
        {
            message: "How many units would you like to add?",
            name: "quantityAdded",
            type: "input"

        }
    ]).then(function (response) {
        var query = conn.query("SELECT * FROM products WHERE ?", {
                item_id: response.itemId
            },
            function (err, res) {
                console.log(res);

                var stockQuantity = res[0].stock_quantity;
                console.log("stock quantity: " + stockQuantity);
                stockQuantity += parseInt(response.quantityAdded);
                console.log("new stock quantity: " + stockQuantity);

                query = conn.query("UPDATE products SET ? WHERE ?", [{
                        stock_quantity: stockQuantity
                    },
                    {
                        item_id: response.itemId
                    }
                ], )
                // conn.end();
                doMore();
            }
        )


    })

}

function createProduct() {

    inquirer.prompt([{
            message: "What is the name of the product you would like to add?",
            name: "name",
            type: "input"
        },
        {
            message: "What department would you like to add this product to?",
            name: "department",
            type: "input"
        },
        {
            message: "What is the price per unit for this product?",
            name: "price",
            type: "input"
        },
        {
            message: "What is the quantity for the product you would like to add?",
            name: "quantity",
            type: "input"
        }

    ]).then(function (response) {
        var query = conn.query("INSERT INTO products SET ?", {
                product_name: response.name,
                department_name: response.department,
                price: response.price,
                stock_quantity: response.quantity
            },
            function (err, res) {
                readProducts();

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
            manager();
        } else {
            console.log("Have a nice day!")
            conn.end();
        }
    })
}