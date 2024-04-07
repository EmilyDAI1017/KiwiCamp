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
    gender ENUM('Female', 'Male','Other') NOT NULL,
    dob DATE NOT NULL,
    parent_guardian_name  VARCHAR(255) NOT NULL,
    parent_guardian_phone VARCHAR(255) NOT NULL,
    parent_guardian_email VARCHAR(255) NOT NULL,
    activity_preferences VARCHAR(255),
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
    gender ENUM('Female', 'Male','Other') NOT NULL,
    dob DATE NOT NULL,
    emergency_contacts_name  VARCHAR(255),
    emergency_contacts_phone VARCHAR(255),
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
    gender ENUM('Female', 'Male','Other') NOT NULL,
    dob DATE NOT NULL,
    emergency_contacts_name  VARCHAR(255),
    emergency_contacts_phone VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create Manager Table
CREATE TABLE manager (
    manager_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    gender ENUM('Female', 'Male','Other') NOT NULL,
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
    gender ENUM('Female', 'Male','Other') NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_num VARCHAR(255),
    emergency_contacts_name  VARCHAR(255),
    emergency_contacts_phone VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create Admin Table
CREATE TABLE admin (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    gender ENUM('Female', 'Male','Other') NOT NULL,
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
    allergies_information VARCHAR(255),
    last_updated_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

