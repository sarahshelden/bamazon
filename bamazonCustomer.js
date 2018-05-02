// requiring

let mysql = require('mysql');
let inquirer = require('inquirer');
let Table = require('cli-table');

// sql connection
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'MyNewPass',
    database: 'bamazon'
});

// error
connection.connect(function(err) {
    if (err) throw err;
    console.log('Connected as id' + connection.threadId);
    startBuying();
});


function printStuff (res) {
    const arr = [];
    const table = new Table({
        head: ['Item Id', 'Product Name', 'Department', 'cost', 'stock'],
        colWidths: [10, 45,40, 8,8]
    });

    for (let i =0; i < res.length; i++) {
        table.push(res[i].item_id);
        // table.push(res[i].product_name);
        // table.push(res[i].department_name);
        // table.push(res[i].price);
        // table.push(res[i].stock_quanity);
    }
     console.log(table.toString());
}

var startBuying = function() {
    connection.query('SELECT * FROM products', function(err, res) {
        printStuff(res);
        var choiceArray = [];
        for (var i = 0; i < res.length; i++) {
            choiceArray.push(res[i].product_name);
        }

        inquirer.prompt([{
            name: "item",
            type: "input",
            message: 'Which item would you like to purchase? (Enter item ID)'
        },
            { name:'quantity',
              type: 'input',
              message: "How many would you like to purchase?"

            }]).then(function(answer) {
                console.log(answer);
                var itemID = answer.item;
                console.log(itemID);
                var chosenItem = res[itemID-1];
                console.log(chosenItem);
                var newQuantity = chosenItem.stock_quantity - answer.quantity;
                if(newQuantity >= 0){
                    connection.query("UPDATE products SET ? WHERE itemID = ?",[{stock_quantity: newQuantity}, itemID]);
                    startBuying();
                } else {
                    console.log('there are not enough in stock for you to purchase that many items.');
                }
            })
    })


    };
