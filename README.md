
# Nutty & Fruity

Our project aims to transform the traditional grocery shopping experience by introducing an innovative online platform dedicated to the sale of fresh fruits, and dry fruits. This platform will provide customers with a convenient and efficient way to purchase high-quality produce from the comfort of their homes.



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
- npm install express express-session
- npm install -g nodemon
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

- INSERT INTO users (email, user_password,fname, lname, shipping_address)
 VALUES ('saleem@gmail.com', 'sal12345', 'Saleem', 'Nauman', 'F8/4 islamabad'), 
 ('kareem@gmail.com', 'kar12345', 'Kareem','Rehman', 'G10/4 islamabad');

- Sample data for admin
-  INSERT INTO users (email, user_password,fname, lname, user_type) VALUES
('saad@gmail.com', 'saad@admin', 'Saad', 'Jamil', 'super_admin'  );

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
- Fruit category
- INSERT INTO Products (name, weight, price, image, category,total_quantity, remaining_quantity) VALUES 
('Dragon Fruit', 0.5, 5000,"https://images.unsplash.com/photo-1527325678964-54921661f888?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" , 'Fruits', 40,40), 
('Avocardo', 0.25 , 3500,"https://images.unsplash.com/photo-1590005024862-6b67679a29fb?q=80&w=1940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" , 'Fruits',35,35), 
('Pineapple', 2.5, 2000,"https://images.unsplash.com/photo-1550828520-4cb496926fc9?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" , 'Fruits', 53, 53), 
('Blueberries', 0.3 , 1000,"https://images.unsplash.com/photo-1554795808-3231c32711cf?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" , 'Fruits', 66, 66);
-Dry Fruit category
- INSERT INTO Products (name, weight, price, image, category,total_quantity, remaining_quantity) VALUES 
('Almods', 1, 2000,"https://images.unsplash.com/photo-1508061253366-f7da158b6d46?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" , 'Dry-Fruits', 140,140), 
('Roasted Cashews', 1 , 3200,"https://images.unsplash.com/photo-1509912760195-4f6cfd8cce2c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" , 'Dry-Fruits',210,210), 
('Salted Pistachio', 0.5, 1850,"https://images.unsplash.com/photo-1614061810671-e6f5ff055104?q=80&w=1866&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" , 'Dry-Fruits', 189 , 189), 
('Dry Apricot', 1, 850,"https://images.unsplash.com/photo-1595412017587-b7f3117dff54?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" , 'Dry-Fruits', 135 , 135),  
('Walnuts', 0.8 , 1200,"https://images.unsplash.com/photo-1617471217326-011df77101be?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" , 'Dry-Fruits', 245, 245);

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
    quantity INT,
    price_single_item DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
);
