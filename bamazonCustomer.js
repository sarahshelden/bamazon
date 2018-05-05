// requiring

let mysql = require('mysql');
let inquirer = require('inquirer');
let Table = require('easy-table');

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

    var t = new Table;

    res.forEach(function(product) {
        t.cell('Item Id', product.item_id);
        t.cell('Product Name', product.product_name);
        t.cell('Department', product.department_name);
        t.cell('Price, USD', product.price, Table.number(2));
        t.cell('Stock Quantity', product.stock_quantity);
        t.newRow()
    })
    console.log(t.toString());



    //npm cli-table documentation
    // var table = new Table({
    //     head: ['Item Id', 'Product Name', 'Department', 'cost', 'stock'],
    //     colWidths: [10, 45,40, 8,8]
    // });
    // // for loop to loop through responses
    // for ( i =0; i < res.length; i++) {
    //     table.push([res[i].item_id,res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quanity]);
    // }
    //  console.log(table.toString();
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
                console.log(res);
                console.log(answer);
                var itemID = answer.item;
                console.log(itemID);
                var chosenItem = res[itemID-1];
                console.log(chosenItem);
                var newQuantity = chosenItem.stock_quantity - answer.quantity;
                if(newQuantity >= 0){
                    connection.query("UPDATE products SET ? WHERE item_id = ?",[{stock_quantity: newQuantity}, itemID],function(err,response) { if (err){
                        throw err
                    }
                        console.log(response);
                    });
                    startBuying();
                } else {
                    console.log('there are not enough in stock for you to purchase that many items.');
                }
            })
    })


    };