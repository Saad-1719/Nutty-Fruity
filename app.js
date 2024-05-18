const express = require('express')
const { title } = require('process')
const app = express()
const port = 8080

const bodyParser = require('body-parser');
const mysql = require('mysql2');


app.set('view engine', 'ejs')


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'dbms_project',
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
    connection.release();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.render('pages/index', {
        // user,
        title: 'Home'
    })
})

app.get('/login', (req, res) => {
    res.render('pages/login', {
        title: 'Login',
        errorMessage: null, // Initialize errorMessage as null
        successMessage: null // Initialize successMessage as null
    })
})
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
        
        // Check if any rows are returned
        if (results.length === 0) {
            // Render login page with error message
            res.render('pages/login', {
                title: 'Login',
                errorMessage: 'Invalid email or password.',
                successMessage: null // Set successMessage to null
            });
        } else {
            // Render login page with success message
            res.render('pages/login', {
                title: 'Login',
                errorMessage: null, // Set successMessage to null
                successMessage: 'Login successful!'
            });
        }
    });
});
app.get('/signup', (req, res) => {
    res.render('pages/signup', {
        // user,
        title: 'Signup'
    })
})
app.get('/product', (req, res) => {
    res.render('pages/product', {
        // user,
        title: 'Product'
    })
})

app.get('/cart', (req, res) => {
    res.render('pages/cart', {
        // user,
        title: 'Cart'
    })
})


app.listen(port, () => {
  console.log(`App listening at port ${port}`)
})