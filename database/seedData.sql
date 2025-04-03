SET search_path TO qp;

INSERT INTO users (email, password, role) VALUES
('admin@grocery.com', '$2b$10$fPs7Xvhm7t3N2RvHaFG7GOCVpF.K6uVgUKJAI7AB3luFiVvmlkW/C', 'admin'), -- password: admin123
('Alex@grocery.com', '$2b$10$qdczw9BQm8Ww70eMVAGEeerIMFvCmDlvQ4Vwfej7y3ix75oyvGtcG', 'user'), -- password: Alex@123
('John@grocery.com', '$2b$10$WVcNZDT0N5y9zmWtxPuhjeVXgs4Gcn6qLc3hkJXqGueXQ36UHdwp6', 'user'); -- password: John123


INSERT INTO groceries (name, price, inventory, category, description) VALUES
('Apple', 180.00, 100, 'Fruits', 'Fresh red apples'),
('Banana', 60.00, 150, 'Fruits', 'Ripe yellow bananas'),
('Milk', 32.49, 50, 'Dairy', 'Whole milk 1 gallon'),
('Bread', 22.99, 40, 'Bakery', 'Whole wheat bread'),
('Eggs', 83.29, 60, 'Dairy', 'Large white eggs, dozen'),
('Chicken', 150.00, 30, 'Meat', 'Boneless chicken breast'),
('Rice', 44.49, 80, 'Grains', 'Long grain white rice 5lb'),
('Tomato', 21.29, 70, 'Vegetables', 'Vine-ripened tomatoes'),
('Potato', 10.79, 90, 'Vegetables', 'Russet potatoes'),
('Orange Juice', 30.00, 40, 'Beverages', '100% pure orange juice');

INSERT INTO orders (user_id, items, total, status) VALUES
(3, '[{"name": "Rice", "price": 44.49, "quantity": 1, "subtotal": 44.49, "groceryId": 7}, {"name": "Tomato", "price": 21.29, "quantity": 1, "subtotal": 21.29, "groceryId": 8}]', 65.78, 'pending'),
(3, '[{"name": "Banana", "price": 60, "quantity": 1, "subtotal": 60, "groceryId": 2}, {"name": "Bread", "price": 22.99, "quantity": 1, "subtotal": 22.99, "groceryId": 4}]', 82.99, 'pending'),
(2, '[{"name": "Banana", "price": 60, "quantity": 1, "subtotal": 60, "groceryId": 2}, {"name": "Bread", "price": 22.99, "quantity": 1, "subtotal": 22.99, "groceryId": 4}]', 82.99, 'pending'),
(2, '[{"name": "Milk", "price": 32.49, "quantity": 1, "subtotal": 32.49, "groceryId": 3}, {"name": "Chicken", "price": 150, "quantity": 1, "subtotal": 150, "groceryId": 6}]', 182.49, 'pending'),
(2, '[{"name": "Apple", "price": 180, "quantity": 1, "subtotal": 180, "groceryId": 1}, {"name": "Eggs", "price": 83.29, "quantity": 1, "subtotal": 83.29, "groceryId": 5}]', 263.29, 'pending');