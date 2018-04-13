var user = require("./bamazonCustomer.js");
var manager = require("./bamazonManager.js");
var supervisor = require("./bamazonSupervisor.js");

function bamazonCLI() {
    inquirer.prompt([{
        message: "Welcome to Bamazon CLI"
    }])
}
// the app should default to customer mode with an option to select manager or supervisor modes. Manager and supervisor modes will require a password