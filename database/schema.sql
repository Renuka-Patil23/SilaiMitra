-- MySQL table definitions

-- user module for authentication, login and authorization

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff') NOT NULL DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- customers table 
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Measurements Table

CREATE TABLE measurements (
    id INT PRIMARY KEY AUTO_INCREMENT,

    customer_id INT NOT NULL,

    garment_type Enum('Shirt',
    'Pant',
    'Kurta',
    'Blouse',
    'Dress',
    'Suit',
    'Jacket',
    'Other') NOT NULL,

    chest DECIMAL(5,2),
    waist DECIMAL(5,2),
    hip DECIMAL(5,2),
    shoulder DECIMAL(5,2),
    sleeve DECIMAL(5,2),
    neck DECIMAL(5,2),
    length DECIMAL(5,2),

    inseam DECIMAL(5,2),
    thigh DECIMAL(5,2),
    bottom DECIMAL(5,2),

    front_neck DECIMAL(5,2),
    back_neck DECIMAL(5,2),

    notes TEXT,

    status ENUM('Active','Archived') DEFAULT 'Active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE CASCADE
);


-- orders table 
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,

    customer_id INT NOT NULL,
    measurement_id INT NOT NULL,

    garment_type ENUM(
        'Shirt',
        'Pant',
        'Kurta',
        'Blouse',
        'Dress',
        'Suit',
        'Jacket',
        'Other'
    ) NOT NULL,

    quantity INT NOT NULL DEFAULT 1,

    order_date DATE NOT NULL DEFAULT (CURRENT_DATE),

    delivery_date DATE NOT NULL,

    total_amount DECIMAL(10,2) NOT NULL,

    advance_amount DECIMAL(10,2) NOT NULL DEFAULT 0,

    remaining_amount DECIMAL(10,2) NOT NULL,

    status ENUM(
        'Pending',
        'In Progress',
        'Ready',
        'Delivered',
        'Cancelled'
    ) DEFAULT 'Pending',

    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_order_measurement
        FOREIGN KEY (measurement_id)
        REFERENCES measurements(id)
        ON DELETE CASCADE
);


--payments table

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('Cash', 'UPI', 'Card','Bank Transfer', 'Other') NOT NULL,
    payment_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
);


-- feedback table 
CREATE TABLE feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    rating INT,
    comment TEXT,

    FOREIGN KEY (customer_id)
    REFERENCES customers(id)
    ON DELETE CASCADE
);






