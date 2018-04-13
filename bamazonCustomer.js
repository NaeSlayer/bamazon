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
                var stockQuantity = res[0].stock_quantity;
                var totalSales = res[0].product_sales;
                // console.log(price + "  " + stockQuantity);

                if (stockQuantity >= response.quantityNeeded) {
                    // fulfill the order, calculate total price, adjust quantity available
                    var totalPrice = price * response.quantityNeeded;
                    totalSales = totalSales + totalPrice;
                    console.log("Total Sales: " + totalSales);
                    // console.log("stock quantity: " + stockQuantity);
                    stockQuantity -= response.quantityNeeded;
                    // console.log("new stock quantity: " + stockQuantity);
                    var query = conn.query("UPDATE products SET ? WHERE ?", [{
                            stock_quantity: stockQuantity,
                            product_sales: totalSales
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


            }
        )
    })
}

function readProducts() {
    var query = conn.query("SELECT * FROM products",
        function (err, res) {
            if (err) throw err;
            console.log("All available products: \n")
            for (var i = 0; i < res.length; i++) {

                console.log("Item Number: " + res[i].item_id + " \nProduct: " + res[i].product_name + " \nPrice: " + res[i].price + " \nQuantity: " + res[i].stock_quantity + "\n");
            }

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