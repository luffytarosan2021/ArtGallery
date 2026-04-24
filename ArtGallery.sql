CREATE DATABASE art_gallery_db;
USE art_gallery_db;
CREATE TABLE user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    role ENUM('admin','artist','visitor'),
    status ENUM('active','inactive') DEFAULT 'active'
);
CREATE TABLE artist (
    artist_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    bio TEXT,
    verified_status ENUM('verified','unverified'),
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);
CREATE TABLE category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50)
);
CREATE TABLE artwork (
    artwork_id INT AUTO_INCREMENT PRIMARY KEY,
    artist_id INT,
    category_id INT,
    title VARCHAR(100),
    price DECIMAL(10,2),
    approval_status ENUM('pending','approved','rejected'),
    FOREIGN KEY (artist_id) REFERENCES artist(artist_id),
    FOREIGN KEY (category_id) REFERENCES category(category_id)
);
CREATE TABLE exhibition (
    exhibition_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    start_date DATE,
    end_date DATE
);
CREATE TABLE exhibition_artwork (
    exhibition_id INT,
    artwork_id INT,
    PRIMARY KEY (exhibition_id, artwork_id),
    FOREIGN KEY (exhibition_id) REFERENCES exhibition(exhibition_id),
    FOREIGN KEY (artwork_id) REFERENCES artwork(artwork_id)
);
CREATE TABLE enquiry (
    enquiry_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    artwork_id INT,
    message TEXT,
    status ENUM('pending','responded'),
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (artwork_id) REFERENCES artwork(artwork_id)
);
SHOW TABLES;
INSERT INTO user (name, email, password, role) VALUES
('Aarav', 'aarav@gmail.com', 'pass123', 'artist'),
('Admin One', 'admin1@gmail.com', 'admin123', 'admin'),
('Diya Singh', 'diya@gmail.com', 'pass123', 'artist'),
('Rohan Mehta', 'rohan@gmail.com', 'pass123', 'artist'),
('Ananya Rao', 'ananya@gmail.com', 'pass123', 'artist'),
('Vikram Patel', 'vikram@gmail.com', 'pass123', 'visitor'),
('Neha Verma', 'neha@gmail.com', 'pass123', 'visitor'),
('Kabir Joshi', 'kabir@gmail.com', 'pass123', 'visitor'),
('Pooja Nair', 'pooja@gmail.com', 'pass123', 'visitor'),
('Rahul Khanna', 'rahul@gmail.com', 'pass123', 'visitor');
INSERT INTO artist (user_id, bio, verified_status) VALUES
(1, 'Contemporary painter', 'verified'),
(3, 'Digital artist', 'verified'),
(4, 'Landscape artist', 'unverified'),
(5, 'Modern artist', 'verified');
INSERT INTO category (category_name) VALUES
('Painting'),
('Digital Art'),
('Landscape');
INSERT INTO artwork (artist_id, category_id, title, price, approval_status) VALUES
(1, 1, 'Ocean Dream', 3000.00, 'approved'),
(2, 2, 'Digital Storm', 7000.00, 'pending'),
(3, 3, 'Pixel World', 4500.00, 'approved'),
(4, 4, 'Mountain View', 6000.00, 'rejected'),
(5, 5, 'Green Valley', 3500.00, 'approved'),
(6, 6, 'Abstract Fire', 8000.00, 'pending'),
(7, 7, 'Neon Lights', 5500.00, 'approved');
INSERT INTO exhibition (name, start_date, end_date) VALUES
('Modern Art Expo', '2025-01-01', '2025-01-10'),
('Colors of Nature', '2025-02-01', '2025-02-15'),
('Abstract World', '2025-03-05', '2025-03-20'),
('Digital Vision', '2025-04-01', '2025-04-12'),
('Classic Creations', '2025-05-01', '2025-05-18'),
('Urban Expressions', '2025-06-01', '2025-06-14'),
('Heritage Art Show', '2025-07-01', '2025-07-15'),
('Modern Masters', '2025-08-01', '2025-08-20'),
('Creative Minds', '2025-09-01', '2025-09-10'),
('Fusion Fest', '2025-10-01', '2025-10-25');
INSERT INTO exhibition_artwork (exhibition_id, artwork_id) VALUES
(1,1),(2,1),(3,1),(4,1),(5,1),
(6,1),(7,1),(8,1),(9,1),(10,1);
INSERT INTO enquiry (user_id, artwork_id, message, status) VALUES
(6, 1, 'Is this artwork still available?', 'pending'),
(7, 1, 'What are the dimensions?', 'responded'),
(8, 1, 'Is the price negotiable?', 'pending'),
(9, 1, 'Is framing included?', 'responded'),
(10, 1, 'Is this limited edition?', 'pending');
SELECT * FROM user;
SELECT * FROM artist;
SELECT * FROM category;
SELECT * FROM artwork;
SELECT * FROM exhibition;
SELECT * FROM exhibition_artwork;
SELECT * FROM enquiry;
ALTER TABLE user
ADD CONSTRAINT chk_email_format 
CHECK (email LIKE '%@%.%');
SELECT user_id, name, email
FROM user;
-- Add UNIQUE constraint for artist + title
ALTER TABLE artwork
ADD CONSTRAINT unique_artist_title 
UNIQUE (artist_id, title);

-- Retrieve artist who uploaded more than 1 artwork
SELECT u.name AS artist_name, COUNT(*) AS total_artworks
FROM artwork a
JOIN artist ar ON a.artist_id = ar.artist_id
JOIN user u ON ar.user_id = u.user_id
GROUP BY u.name
HAVING COUNT(*) > 1;

-- Add CHECK constraint
ALTER TABLE artwork
ADD CONSTRAINT chk_price 
CHECK (price > 0);

-- Retrieve artworks
SELECT artwork_id, title, price
FROM artwork;

INSERT INTO exhibition_artwork (exhibition_id, artwork_id) VALUES
(2,3),(2,4),
(3,5),(3,6),
(4,7),(4,8);

INSERT INTO enquiry (user_id, artwork_id, message, status) VALUES
(6, 1, 'Available?', 'pending'),
(7, 2, 'Dimensions?', 'responded'),
(8, 3, 'Negotiable?', 'pending'),
(9, 4, 'Framed?', 'responded'),
(10, 5, 'Original?', 'pending');
SELECT artwork_id, COUNT(*) AS total_enquiries
FROM enquiry
GROUP BY artwork_id;

SELECT u.name AS artist_name, COUNT(a.artwork_id) AS total_artworks
FROM artwork a
JOIN artist ar ON a.artist_id = ar.artist_id
JOIN user u ON ar.user_id = u.user_id
GROUP BY u.name
HAVING COUNT(a.artwork_id) > 1;

SELECT c.category_name, AVG(a.price) AS avg_price
FROM artwork a
JOIN category c ON a.category_id = c.category_id
GROUP BY c.category_name;

SELECT artwork_id FROM exhibition_artwork
UNION
SELECT artwork_id FROM enquiry;

SELECT DISTINCT ea.artwork_id
FROM exhibition_artwork ea
JOIN enquiry e ON ea.artwork_id = e.artwork_id;

SELECT DISTINCT artwork_id
FROM exhibition_artwork
WHERE artwork_id IN (
    SELECT artwork_id
    FROM enquiry
);

SELECT artwork_id 
FROM exhibition_artwork
WHERE artwork_id NOT IN (
    SELECT artwork_id FROM enquiry
);

SELECT title, price
FROM artwork
WHERE price > (
    SELECT AVG(price)
    FROM artwork
);

SELECT DISTINCT u.name AS artist_name
FROM user u
JOIN artist ar ON u.user_id = ar.user_id
JOIN artwork a ON ar.artist_id = a.artist_id
WHERE a.category_id IN (
    SELECT category_id
    FROM artwork
    GROUP BY category_id
    HAVING COUNT(*) > 1
);

SELECT DISTINCT u.name AS artist_name
FROM user u
JOIN artist ar ON u.user_id = ar.user_id
WHERE ar.artist_id IN (
    SELECT a.artist_id
    FROM artwork a
    WHERE EXISTS (
        SELECT 1
        FROM enquiry e
        WHERE e.artwork_id = a.artwork_id
    )
);

-- joins
SELECT u.name AS artist_name, a.title, a.price
FROM artwork a
JOIN artist ar ON a.artist_id = ar.artist_id
JOIN user u ON ar.user_id = u.user_id;

SELECT a.title, e.message, e.status
FROM artwork a
LEFT JOIN enquiry e ON a.artwork_id = e.artwork_id;

SELECT u.name AS artist_name, c.category_name
FROM user u
JOIN artist ar ON u.user_id = ar.user_id
CROSS JOIN category c;

-- views
CREATE VIEW artwork_details AS
SELECT u.name AS artist_name, a.title, a.price, a.approval_status
FROM artwork a
JOIN artist ar ON a.artist_id = ar.artist_id
JOIN user u ON ar.user_id = u.user_id;

SELECT * FROM artwork_details;

CREATE VIEW enquiry_details AS
SELECT e.enquiry_id, u.name AS user_name, a.title, e.message, e.status
FROM enquiry e
JOIN user u ON e.user_id = u.user_id
JOIN artwork a ON e.artwork_id = a.artwork_id;

SELECT * FROM enquiry_details;

CREATE VIEW category_avg_price AS
SELECT c.category_name, AVG(a.price) AS avg_price
FROM artwork a
JOIN category c ON a.category_id = c.category_id
GROUP BY c.category_name;

SELECT * FROM category_avg_price;

-- triggers
DELIMITER $$

CREATE TRIGGER auto_enquiry_on_artwork
AFTER INSERT ON artwork
FOR EACH ROW
BEGIN
    INSERT INTO enquiry(user_id, artwork_id, message, status)
    VALUES (6, NEW.artwork_id, 'Auto-generated enquiry', 'pending');
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER before_artwork_insert
BEFORE INSERT ON artwork
FOR EACH ROW
BEGIN
    SET NEW.approval_status = 'pending';
END$$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER check_price
BEFORE INSERT ON artwork
FOR EACH ROW
BEGIN
    IF NEW.price <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Price must be positive';
    END IF;
END$$

DELIMITER ;

-- cursors
DELIMITER $$

CREATE PROCEDURE artist_artwork_count()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE a_id INT;

    DECLARE cur CURSOR FOR
        SELECT artist_id FROM artist;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO a_id;
        IF done THEN
            LEAVE read_loop;
        END IF;

        SELECT a_id AS artist_id,
               COUNT(*) AS total_artworks
        FROM artwork
        WHERE artist_id = a_id;

    END LOOP;

    CLOSE cur;
END$$

DELIMITER ;
CALL artist_artwork_count();
-- cursor2
DELIMITER $$

CREATE PROCEDURE pending_artworks()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE t VARCHAR(100);

    DECLARE cur CURSOR FOR
        SELECT title
        FROM artwork
        WHERE approval_status = 'pending';

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO t;
        IF done THEN
            LEAVE read_loop;
        END IF;

        SELECT t AS artwork_title;
    END LOOP;

    CLOSE cur;
END$$

DELIMITER ;

CALL pending_artworks();
-- cursor3
DELIMITER $$

CREATE PROCEDURE artworks_with_enquiries()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE a_id INT;

    DECLARE cur CURSOR FOR
        SELECT DISTINCT artwork_id FROM enquiry;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO a_id;
        IF done THEN
            LEAVE read_loop;
        END IF;

        SELECT a_id AS artwork_id;
    END LOOP;

    CLOSE cur;
END$$

DELIMITER ;

CALL artworks_with_enquiries();
START TRANSACTION;
INSERT INTO category (category_name) VALUES ('Pop Art');
SAVEPOINT A;
INSERT INTO category (category_name) VALUES ('Surrealism');
SAVEPOINT B;
INSERT INTO category (category_name) VALUES ('Cubism');
SAVEPOINT C;
SELECT * FROM category;
ROLLBACK TO B;
SELECT * FROM category;
ROLLBACK TO A;
SELECT * FROM category;
START TRANSACTION;
UPDATE artwork SET price = 5500.00 WHERE artwork_id = 1;
SAVEPOINT A;
UPDATE artwork SET price = 7800.00 WHERE artwork_id = 2;
SAVEPOINT B;
UPDATE artwork SET price = 6500.00 WHERE artwork_id = 3;
SAVEPOINT C;
SELECT artwork_id, title, price FROM artwork LIMIT 3;
ROLLBACK TO B;
SELECT artwork_id, title, price FROM artwork LIMIT 3;
ROLLBACK TO A;
SELECT artwork_id, title, price FROM artwork LIMIT 3;

START TRANSACTION;
UPDATE user SET status = 'inactive' WHERE user_id = 6;
SAVEPOINT A;
UPDATE user SET status = 'inactive' WHERE user_id = 7;
SAVEPOINT B;
UPDATE user SET status = 'inactive' WHERE user_id = 8;
SAVEPOINT C;
SELECT user_id, name, status FROM user WHERE user_id IN (6, 7, 8);
ROLLBACK TO B;
SELECT user_id, name, status FROM user WHERE user_id IN (6, 7, 8);
ROLLBACK TO A;
SELECT user_id, name, status FROM user WHERE user_id IN (6, 7, 8);

START TRANSACTION;
INSERT INTO exhibition_artwork (exhibition_id, artwork_id) VALUES (2, 6);
SAVEPOINT A;
INSERT INTO exhibition_artwork (exhibition_id, artwork_id) VALUES (2, 7);
SAVEPOINT B;
INSERT INTO exhibition_artwork (exhibition_id, artwork_id) VALUES (2, 8);
SAVEPOINT C;
SELECT * FROM exhibition_artwork WHERE exhibition_id = 2;
ROLLBACK TO B;
SELECT * FROM exhibition_artwork WHERE exhibition_id = 2;
ROLLBACK TO A;
SELECT * FROM exhibition_artwork WHERE exhibition_id = 2;
START TRANSACTION;
UPDATE enquiry SET status = 'responded' WHERE enquiry_id = 1;
SAVEPOINT A;
UPDATE enquiry SET status = 'responded' WHERE enquiry_id = 3;
SAVEPOINT B;
UPDATE enquiry SET status = 'responded' WHERE enquiry_id = 5;
SAVEPOINT C;
SELECT enquiry_id, message, status FROM enquiry WHERE enquiry_id IN (1, 3, 5);
ROLLBACK TO B;
SELECT enquiry_id, message, status FROM enquiry WHERE enquiry_id IN (1, 3, 5);
ROLLBACK TO A;
SELECT enquiry_id, message, status FROM enquiry WHERE enquiry_id IN (1, 3, 5);

START TRANSACTION;

SELECT * FROM artwork
WHERE artwork_id = 1
LOCK IN SHARE MODE;
SELECT * FROM artwork WHERE artwork_id = 1;
UPDATE artwork SET approval_status = 'rejected' WHERE artwork_id = 1;
SELECT * FROM artwork
WHERE artwork_id = 1
FOR UPDATE;
SELECT * FROM artwork WHERE artwork_id = 1;
UPDATE artwork SET approval_status = 'approved' WHERE artwork_id = 1;
UPDATE artwork
SET approval_status = 'rejected'
WHERE artwork_id = 1;
COMMIT;
UPDATE artwork
SET approval_status = 'approved'
WHERE artwork_id = 1;
COMMIT;
LOCK TABLE artwork READ;
SELECT * FROM artwork;
 UPDATE artwork SET approval_status = 'rejected';
UNLOCK TABLES;
LOCK TABLE artwork WRITE;
SELECT * FROM artwork;
UPDATE artwork SET approval_status = 'rejected';
UPDATE artwork
SET approval_status = 'rejected'
WHERE artwork_id = 2;
ROLLBACK;
UNLOCK TABLES;
UPDATE user
SET password = 'NEW_HASH'
WHERE email = 'admin1@gmail.com';

