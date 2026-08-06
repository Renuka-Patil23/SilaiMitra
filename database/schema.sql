-- MySQL table definitions

-- users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
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

-- orders table 
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    dress_type VARCHAR(100),
    fabric VARCHAR(100),
    delivery_date DATE,
    status VARCHAR(50) DEFAULT 'Pending',
    price DECIMAL(10,2),

    FOREIGN KEY (customer_id)
    REFERENCES customers(id)
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