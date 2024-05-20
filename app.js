const express = require('express')
const { title } = require('process')
const app = express()
const port = 8080
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
        title: 'Home'
    })
})
// rendering login page
app.get('/login', (req, res) => {
    res.render('pages/login', {
        title: 'Login',
        errorMessage: null, // Initialize errorMessage as null
        successMessage: null // Initialize successMessage as null
    })
})
// login route
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
            res.redirect('/product');
        } else {
            // Render login page with error message
            res.render('pages/login', {
                title: 'Login',
                errorMessage: 'Invalid email or password.',
                successMessage: null
            });
        }

    });
});
//rending signup page
app.get('/signup', (req, res) => {
    res.render('pages/signup', {
        // user,
        title: 'Signup'
    })
})
// rendering product page
app.get('/product', (req, res) => {

    pool.query('SELECT name, image_data, weight, price, category FROM products', (error, results, fields) => {
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

    // Check if the user is logged in
    if (!req.session.userId) {
        // User is not logged in, return an error response
        res.status(401).send('Unauthorized: Please login first.');
        return;
    }

    const userId = req.session.userId;
    const { products, total } = req.body;
    const productsJSON = JSON.stringify(products);

    console.log('User ID:', userId);
    console.log('Total:', total);
    // Insert the order details into the database
    pool.query('INSERT INTO orders (user_id, total) VALUES (?, ?)', [userId, total], (error, results, fields) => {
        if (error) {
            console.error('Error placing order:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('Order placed successfully!');
        res.send('Order placed successfully!');
    });

    pool.query('select order_id from orders where user_id = ?', [userId], (error, results, fields) => {
        if (error) {
            console.error('Error finding order_id:', error);
            // res.status(500).send('Internal Server Error');
            return;
        }
        const user_order_id = results[results.length - 1].order_id;
        console.log('Order ID:', user_order_id);

        products.forEach(product => {
            const { name, price, quantity } = product;

            pool.query('INSERT INTO order_details ( order_id, product_name, price_single_item, quantity) VALUES ( ?, ?, ?, ?)', [user_order_id, name, price, quantity], (error, results, fields) => {
                if (error) {
                    console.error('Error placing insertion:', error);
                    res.status(500).send('Internal Server Error');
                    return;
                }
                console.log('Product inserted successfully:', product);
            });
        });
    });



});

app.listen(port, () => {
    console.log(`App listening at port ${port}`)
})