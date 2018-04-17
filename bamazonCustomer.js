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
    readProducts();
    // user();
})

function user() {

    inquirer.prompt([{
            message: "Welcome to Bamazon! What is the Id of the product you would like to purchase?",
            type: "input",
            name: "itemId"
        },
        {
            message: "How many units would you like to purchase?",
            type: "input",
            name: "quantityNeeded"
        }
    ]).then(function (response) {
        var query = conn.query("SELECT * FROM products WHERE ?", {
                item_id: response.itemId
            },
            function (err, res) {
                var price = res[0].price;
                var quantity = parseInt(response.quantityNeeded);
                var stockQuantity = parseInt(res[0].stock_quantity);
                var productSales = parseInt(res[0].product_sales);
                // console.log(typeof totalSales);
                // console.log(price + "  " + stockQuantity);

                if (stockQuantity >= quantity) {
                    // fulfill the order, calculate total price, adjust quantity available
                    var totalPrice = price * quantity;

                    productSales = productSales + totalPrice;

                    // console.log("Total Sales: " + totalSales);
                    // console.log("stock quantity: " + stockQuantity);
                    stockQuantity -= quantity;
                    // console.log("new stock quantity: " + stockQuantity);
                    var query = conn.query("UPDATE products SET ? WHERE ?", [{
                            stock_quantity: stockQuantity,
                            product_sales: productSales
                        },
                        {
                            item_id: response.itemId
                        }
                    ], )

                } else {
                    console.log("Sorry! Insufficient quantity!");
                }
                console.log("Your total is $" + totalPrice);
                // conn.end();
                doMore();


            }
        )
    })
}

function makeTable(inventory) {
    console.log(table(inventory));
}

function readProducts() {
    var query = conn.query("SELECT * FROM products",
        function (err, res) {
            if (err) throw err;
            console.log("All available products: \n")
            var data = [
                ["Item Number", "Item", "Price", "Quantity Available"]
            ];
            for (var i = 0; i < res.length; i++) {
                data.push([res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]);

            }
            makeTable(data);

            // conn.end()
            // doMore();
            user();
        })
}

function doMore() {
    inquirer.prompt([{
        message: "Would you like to make another purchase?",
        name: "more",
        type: "confirm",
        default: false
    }]).then(function (response) {
        if (response.more === true) {
            user();
        } else {
            console.log("Have a nice day!")
            conn.end();
        }
    })
}

module.exports = user;