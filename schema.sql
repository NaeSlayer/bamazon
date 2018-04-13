DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;
CREATE TABLE products
(
    item_id INTEGER NOT NULL
    AUTO-INCREMENT,
    product_name VARCHAR
    (50) NOT NULL,
    department_name VARCHAR
    (50),
    price FLOAT
    (7, 3) NOT NULL,
    stock_quantity INTEGER
    (10),
);

    CREATE TABLE departments
    (
        department_id INTEGER
        AUTO-INCREMENT PRIMARY KEY,
    department_name VARCHAR
        (50) NOT NULL,
    over_head_costs FLOAT
        (7, 2) 
)