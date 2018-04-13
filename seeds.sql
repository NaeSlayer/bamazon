INSERT INTO bamazon_db.products
    (product_name, department_name, price, stock_quantity)
VALUES("sewing machine", "home goods", 50, 3),
    ("backpack", "home goods", 15, 4),
    ("dog bed", "home goods", 10, 3),
    ("steering wheel cover", "automotive", 10, 3),
    ("car seat covers", "automotive", 30, 2),
    ("french press", "kitchen", 20, 5),
    ("12 inch skillet", "kitchen", 15, 3),
    ("silverware", "kitchen", 20, 4),
    ("pizza cutter", "kitchen", 5, 3),
    ("patio table and chairs", "outdoors", 150, 2);
SELECT *
FROM bamazon_db.products;