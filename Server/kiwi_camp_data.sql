-- Create User Table
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Youth', 'Adult Leader', 'Group Leader', 'Manager', 'Staff', 'Admin') NOT NULL,
    salt VARCHAR(255) NOT NULL
);

-- Create Youth Table
CREATE TABLE youth (
    camper_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_num VARCHAR(255) NOT NULL,
    gender ENUM('Female', 'Male') NOT NULL,
    dob DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create Adult Leader Table
CREATE TABLE adult_leader (
    adult_leader_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_num VARCHAR(255),
    gender ENUM('Female', 'Male') NOT NULL,
    dob DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create Group Leader Table
CREATE TABLE group_leader (
    group_leader_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_num VARCHAR(255),
    gender ENUM('Female', 'Male') NOT NULL,
    dob DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create Manager Table
CREATE TABLE manager (
    manager_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_num VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create Staff Table
CREATE TABLE staff (
    staff_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_num VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create Admin Table
CREATE TABLE admin (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_num VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create Camp Table
CREATE TABLE camp (
    camp_id INT PRIMARY KEY AUTO_INCREMENT,
    location VARCHAR(255),
    start_date DATE,
    end_date DATE,
    capacity INT NOT NULL,
    description VARCHAR(255),
    status VARCHAR(50)
);

-- Create Participant Group Table
CREATE TABLE participant_group (
    group_id INT PRIMARY KEY AUTO_INCREMENT,
    group_leader_id INT,
    camp_id INT,
    number_of_attendees INT,
    account_status VARCHAR(50),
    FOREIGN KEY (group_leader_id) REFERENCES users(user_id),
    FOREIGN KEY (camp_id) REFERENCES camp(camp_id)
);

-- Create Activity Table
CREATE TABLE activity (
    activity_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    duration VARCHAR(50),
    description VARCHAR(255),
    cost FLOAT NOT NULL,
    capacity INT 
);

-- Create Cabin Table
CREATE TABLE cabin (
    cabin_id INT PRIMARY KEY AUTO_INCREMENT,
    cabin_name VARCHAR(255),
    capacity INT,
    location VARCHAR(255)
);

-- Create Payment Table
CREATE TABLE payment (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    amount FLOAT,
    payment_date DATE,
    camp_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (camp_id) REFERENCES camp(camp_id)
);

-- Create Waitlist Table
CREATE TABLE waitlist (
    waitlist_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    camp_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (camp_id) REFERENCES camp(camp_id)
);

-- Create Discount Table
CREATE TABLE discount (
    discount_id INT PRIMARY KEY AUTO_INCREMENT,
    camp_id INT,
    discount_type VARCHAR(50),
    discount_amount FLOAT,
    FOREIGN KEY (camp_id) REFERENCES camp(camp_id)
);

-- Create News Table
CREATE TABLE news (
    news_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    content VARCHAR(255),
    publish_date DATE
);

-- Create Health Record Table
CREATE TABLE health_record (
    health_record_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    medical_condition VARCHAR(255),
    emergency_contacts VARCHAR(255),
    allergies VARCHAR(255),
    dietary_requirement VARCHAR(255),
    last_updated_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

INSERT INTO users (username, password_hash, role, salt) VALUES
('john_doe', 'passwordhash1', 'Youth', 'salt1'),
('jane_doe', 'passwordhash2', 'Group Leader', 'salt2'),
('mark_smith', 'passwordhash3', 'Manager', 'salt3'),
('sarah_jones', 'passwordhash4', 'Staff', 'salt4'),
('admin_user', 'passwordhash5', 'Admin', 'salt5');

INSERT INTO youth (user_id, first_name, last_name, email, phone_num, gender, dob) VALUES
(1, 'John', 'Doe', 'john@example.com', '+64-123-456-7890', 'Male', '10-05-2005'),
(2, 'Emma', 'Johnson', 'emma@example.com', '+64-987-654-3210', 'Female', '15-08-2006');


INSERT INTO group_leader (user_id, first_name, last_name, email, phone_num, gender, dob) VALUES
(2, 'Jane', 'Doe', 'jane@example.com', '+64-456-789-0123', 'Female', '20-03-1980');

INSERT INTO manager (user_id, first_name, last_name, email, phone_num) VALUES
(3, 'Mark', 'Smith', 'mark@example.com', '+64-789-012-3456');

INSERT INTO staff (user_id, first_name, last_name, email, phone_num) VALUES
(4, 'Sarah', 'Jones', 'sarah@example.com', '+64-345-678-9012');

INSERT INTO admin (user_id, first_name, last_name, email, phone_num) VALUES
(5, 'Admin', 'User', 'admin@example.com', '+64-111-222-3333');

INSERT INTO camp (location, start_date, end_date, capacity, description, status) VALUES
('Campsite A', '15-07-2024', '20-07-2024', 100, 'Summer Camp', 'Registration'),
('Campsite B', '05-08-2024', '10-08-2024', 120, 'Adventure Camp', 'In Progress');

INSERT INTO participant_group (group_leader_id, camp_id, number_of_attendees, account_status) VALUES
(2, 1, 20, 'Approved'),
(2, 2, 25, 'Pending');

INSERT INTO activity (name, duration, description, cost, capacity) VALUES
('Hiking', '2 hours', 'Explore the trails', 10.00, 30),
('Canoeing', '1.5 hours', 'Paddle along the river', 15.00, 20);

INSERT INTO cabin (cabin_name, capacity, location) VALUES
('Cabin A', 10, 'Woodland Area'),
('Cabin B', 15, 'Lakefront');

INSERT INTO payment (user_id, amount, payment_date, camp_id) VALUES
(1, 250.00, '01-06-2024', 1),
(2, 300.00, '15-06-2024', 1);

INSERT INTO waitlist (user_id, camp_id) VALUES
(3, 2),
(4, 2);
 
 INSERT INTO discount (camp_id, discount_type, discount_amount) VALUES
(1, 'Percentage', 10.00),
(2, 'Fixed', 50.00);

INSERT INTO news (title, content, publish_date) VALUES
('Welcome to Summer Camp!', 'Exciting adventures await!', '01-06-2024'),
('Important Announcement', 'Campsite B is at full capacity.', '25-07-2024');


INSERT INTO health_record (user_id, medical_condition, emergency_contacts, allergies, dietary_requirement, last_updated_date) VALUES
(1, 'None', 'John Doe (Parent) - +64-123-456-7890', 'None', 'None', '01-06-2024'),
(2, 'Asthma', 'Jane Doe (Parent) - +64-456-789-0123', 'Peanuts', 'Vegetarian', '15-06-2024');
