
# Orchard Oasis Online

Our project aims to transform the traditional grocery shopping experience by introducing an innovative online platform dedicated to the sale of fresh fruits, vegetables, and dry fruits. This platform will provide customers with a convenient and efficient way to purchase high-quality produce from the comfort of their homes.



## Features

- User Friendly Interface
- Wide Selection of Categories
- Customizable Orders


## Setup
For the setup of project
- Install node js
- Downlaod zip file of project and unzip it
- Open the folder in vs code
Run these Commands
- npm init -y
- npm install express@4.17.1
- npm install ejs@3.1.6
## Setup database
- Install mysql database
On mysql workbench, run these commands: 
-  create database dbms_project
- right click on on and select it as default schema
- For users table
- CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  user_password CHAR(64) NOT NULL,
fname varchar(255) not null,
lname varchar(255) null,
  shipping_address VARCHAR(255) NULL,
  user_type ENUM('super_admin', 'child_user') DEFAULT 'child_user'
);

- Sample data for users

- INSERT INTO users (email, user_password,fname, lname, shipping_address) VALUES
('saleem@gmail.com', 'sal12345', 'saleem', 'nauman', 'F8/4 islamabad'),
('kareem@gmail.com', 'kar12345', , 'kareem, 'rehman, 'G10/4 islamabad');

- Sample data for admin
- INSERT INTO users (email, user_password,fname, lname, user_type) VALUES
('saad@gmail.com', 'saad@admin', , 'kareem, 'rehman, 'super_admin'  );

- Table for products
- CREATE TABLE Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    weight DECIMAL(10, 2),
    price DECIMAL(10, 2) NOT NULL,
    image varchar(255),
    category VARCHAR(100) NOT NULL,
    total_quantity INT NOT NULL,
    remaining_quantity INT NOT NULL
);

- sample data
- INSERT INTO Products (name, weight, price, image, category,total_quantity, remaining_quantity) 
VALUES 
    ('Red Chilli', 0.5, 250,"https://images.unsplash.com/photo-1526346698789-22fd84314424?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" , 'Vegetables', 100,100),
    ('Red Apple', 1 , 400,"https://images.unsplash.com/photo-1439127989242-c3749a012eac?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" , 'Fruits',200,200),
    ('Green Chilli', 0.25, 150,"https://images.unsplash.com/photo-1576763595295-c0371a32af78?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" , 'Vegetables',135,135),
    ('Carrot', 0.5 , 100,"https://images.unsplash.com/photo-1582515073490-39981397c445?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" , 'Vegetables',75,75);

- table to maintain orders 
- CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total int,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-table to maintain order details
- CREATE TABLE order_details (
    order_id INT,
    product_name VARCHAR(255),
    product_id int,
    quantity INT,
    price_per_piece DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
