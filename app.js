const express = require('express')
const { title } = require('process')
const app = express()
const port = 3030
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

//setting view engine
app.set('view engine', 'ejs')
//using session
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));
// creating pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'dbms_project',
    connectionLimit: 10,
    queueLimit: 0
});
//check for connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
    connection.release();
});

app.use(bodyParser.urlencoded({ extended: true }));
// render home page
app.get('/', (req, res) => {
    res.render('pages/index', {
        title: 'Home',
        userId: req.session.userId
    })
})

app.get('/login', (req, res) => {
    const successMessage = req.session.successMessage;
    const errorMessage = req.session.errorMessage;

    // Clear messages from session
    req.session.successMessage = null;
    req.session.errorMessage = null;

    res.render('pages/login', {
        title: 'Login',
        errorMessage: errorMessage || null,
        successMessage: successMessage || null,
        userId: req.session.userId // Pass userId to frontend

    });
});

// Login route
app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Example query to check if the user exists in the database
    pool.query('SELECT * FROM users WHERE email = ? AND user_password = ?', [email, password], (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.length > 0) {
            const userId = results[0].id;
            req.session.userId = userId;
            req.session.successMessage = 'Login Successful';
            res.redirect('/product');
        } else {
            console.log("error login ");
            req.session.errorMessage = 'Invalid email or password.';
            res.redirect('/login');
        }
    });
});

//rending signup page
app.get('/signup', (req, res) => {
    res.render('pages/signup', {
        // user,
        title: 'Signup',
        userId: req.session.userId // Pass userId to frontend

    })
})
// rendering product page
app.get('/product', (req, res) => {
    // const userId = req.session.userId;
    pool.query('SELECT name, image, weight, price, category FROM products', (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        // Separate categories from the result set
        const categories = results.map(product => product.category);
        // Remove duplicate categories
        const uniqueCategories = [...new Set(categories)];
        // Render the page with unique categories and product data
        res.render('pages/product', {
            title: 'Product',
            categories: uniqueCategories,
            products: results,
            userId: req.session.userId // Pass userId to frontend

        });
    });
});

app.post('/product', (req, res) => {
    const userId = req.session.userId;
    const { total, products } = req.body;

    // Check if the user is logged in
    if (!req.session.userId) {
        // User is not logged in, return an error response
        res.status(401).send('Unauthorized: Please login first.');
        return;
    }

    const productsJSON = JSON.stringify(products);

    // Insert into orders table
    console.log('User ID:', userId);
    console.log('Total:', total);

    pool.query('INSERT INTO orders (user_id, total) VALUES (?, ?)', [userId, total], (error, results, fields) => {
        if (error) {
            console.error('Error placing order:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('Order placed successfully!');

        // Get the inserted order_id
        const user_order_id = results.insertId;
        console.log('Order ID:', user_order_id);

        let updateCount = 0;
        let errorOccurred = false;

        products.forEach(product => {
            const { name, price, quantity } = product;

            // Insert into order_details table
            pool.query('INSERT INTO order_details (order_id, product_name, price_single_item, quantity) VALUES (?, ?, ?, ?)', [user_order_id, name, price, quantity], (error, results, fields) => {
                if (error) {
                    console.error('Error placing insertion:', error);
                    if (!errorOccurred) {
                        errorOccurred = true;
                        res.status(500).send('Internal Server Error');
                    }
                    return;
                }
                console.log('Product inserted successfully:', product);

                pool.query('UPDATE products SET remaining_quantity = remaining_quantity - ? WHERE name = ?', [quantity, name], (error) => {
                    if (error) {
                        console.error('Error updating product quantity:', error);
                        if (!errorOccurred) {
                            errorOccurred = true;
                            res.status(500).send('Internal Server Error');
                        }
                        return;
                    }
                    console.log('Product quantity updated successfully for product:', name);

                    updateCount++;
                    // Send success response after all updates are done
                    if (updateCount === products.length && !errorOccurred) {
                        res.send('Order placed successfully!');
                    }
                });
            });
        });
    });
});

app.listen(port, () => {
    console.log(`App listening at port ${port}`)
})

app.get('/orderDetails', (req, res) => {
    const userId = req.session.userId;

    pool.query(
        'SELECT orders.order_id, order_details.product_name, order_details.quantity, orders.total, orders.order_date FROM orders INNER JOIN order_details ON orders.order_id = order_details.order_id WHERE orders.user_id = ?', [userId],

        (error, results, fields) => {
            if (error) {
                console.error('Error executing query:', error);
                res.status(500).send('Internal Server Error');
                return;
            }


            // Structuring the data
            const ordersMap = results.reduce((acc, row) => {
                if (!acc[row.order_id]) {
                    acc[row.order_id] = {
                        order_id: row.order_id,
                        // order_date: row.order_date,
                        order_date: new Date(row.order_date).toLocaleDateString('en-US', { timeZone: 'Asia/Karachi' }),
                        // order_date: new Date(row.order_date).toLocaleString('en-US', { timeZone: 'Asia/Karachi', timeZoneName: 'short', weekday: 'short', month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }),

                        total: row.total,
                        products: []
                    };
                }



                // Find if the product already exists in the products array
                const existingProduct = acc[row.order_id].products.find(product => product.product_name === row.product_name);

                if (existingProduct) {
                    // If the product exists, add the quantity
                    existingProduct.quantity += row.quantity;
                } else {
                    // If the product does not exist, add it to the products array
                    acc[row.order_id].products.push({
                        product_name: row.product_name,
                        quantity: row.quantity
                    });
                }

                return acc;
            }, {});



            var ordersArray = Object.values(ordersMap);
            // console.log(ordersArray);
            // console.log(account_info);
            res.render('pages/orderDetails', {
                title: 'Account',
                orders: ordersArray,
                userId: req.session.userId // Pass userId to frontend


            });
            // req.session.destroy((err) => {
            //     if (err) {
            //         console.error('Error destroying session:', err);
            //         // return res.redirect('/product'); // Redirect to another page if logout fails
            //     }
            //     ordersArray = [];
            //     // res.redirect('/login');
            // });


        }
    );
});


app.get('/account', (req, res) => {
    const userId = req.session.userId;

    pool.query('SELECT email, shipping_address FROM users WHERE id = ?', [userId], (error, account_info, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        const firstAccountInfo = account_info[0]; // Access the first object in the array   

        // console.log(ordersArray);
        // console.log(account_info);
        res.render('pages/account', {
            title: 'Account',
            // orders: ordersArray, // Ensure `orders` is passed here
            // info: { email, shipping_address } // Pass email and shipping_address as an object
            info: firstAccountInfo,
            userId: req.session.userId // Pass userId to frontend
            // Pass email and shipping_address as an object

        });

    }
    );
});
app.post('/account', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            // return res.redirect('/product'); // Redirect to another page if logout fails
        }
        // ordersArray = [];
        res.redirect('/login');
    });

})

