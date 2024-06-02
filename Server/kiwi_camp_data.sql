-- Create User Table
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Youth', 'Adult Leader', 'Group Leader', 'Manager', 'Staff', 'Admin') NOT NULL,
    salt VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    reset_password_token VARCHAR(255),
    reset_password_expires BIGINT
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
    relationship_to_camper VARCHAR(255) NOT NULL,
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

-- Create Camping Grounds Table
CREATE TABLE camp_grounds (
    ground_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    description VARCHAR(255),
    location VARCHAR(255),
    status ENUM('Active', 'Inactive') NOT NULL,
    picture VARCHAR(255)
);

-- Create Camp Table
CREATE TABLE camps (
    camp_id INT PRIMARY KEY AUTO_INCREMENT,
    ground_id INT NOT NULL,
    camp_name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    start_date DATE,
    end_date DATE,
    capacity INT NOT NULL,
    schedule VARCHAR(255),
    description VARCHAR(255),
    price FLOAT,
    status ENUM('Pending','Approved') NOT NULL,
    
    FOREIGN KEY (ground_id) REFERENCES camp_grounds(ground_id)
);

-- Create Group Table
CREATE TABLE camp_groups (
    group_id INT PRIMARY KEY AUTO_INCREMENT,
    group_leader_id INT NOT NULL,
    camp_id INT,
    number_of_attendees INT,
    group_name VARCHAR(255) NOT NULL,
    description TEXT,
    group_status ENUM('Active', 'Inactive', 'Pending') NOT NULL,
    payment_status ENUM('Unpaid', 'Paid') NOT NULL DEFAULT 'Unpaid',
    registration_fee_youth FLOAT,
    registration_fee_adult FLOAT,
    FOREIGN KEY (group_leader_id) REFERENCES group_leader(group_leader_id),
    FOREIGN KEY (camp_id) REFERENCES camps(camp_id)
);


-- Create Team Table
CREATE TABLE camp_teams (
    team_id INT PRIMARY KEY AUTO_INCREMENT,
    group_id INT NOT NULL,
    team_name VARCHAR(255) NOT NULL,
    adult_leader_id INT,  
    accommodation_id_al INT,
    accommodation_id_youth INT,
    FOREIGN KEY (group_id) REFERENCES camp_groups(group_id),
    FOREIGN KEY (adult_leader_id ) REFERENCES adult_leader(adult_leader_id )
);

-- Camper to Team Link Table
CREATE TABLE team_members (
    member_id INT PRIMARY KEY AUTO_INCREMENT,
    camper_id INT NOT NULL,
    team_id INT NOT NULL,
    FOREIGN KEY (camper_id) REFERENCES youth(camper_id),
    FOREIGN KEY (team_id) REFERENCES camp_teams(team_id)
);


-- Camper to Camp Registration Table
CREATE TABLE camp_registrations (
    registration_id INT PRIMARY KEY AUTO_INCREMENT,
    group_id INT NOT NULL,
    camp_id INT NOT NULL,
    user_id INT NOT NULL,
    camper_type ENUM('Youth', 'Adult Leader') NOT NULL,
    registration_date DATE,
    status ENUM('Registered', 'Unpaid', 'Cancelled') NOT NULL,
    FOREIGN KEY (group_id) REFERENCES camp_groups(group_id),
    FOREIGN KEY (camp_id) REFERENCES camps(camp_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);



CREATE TABLE accommodations (
    accommodation_id INT PRIMARY KEY AUTO_INCREMENT,
    ground_id INT NOT NULL,
    type ENUM('Tent', 'Cabin') NOT NULL,
    capacity INT NOT NULL,
    location_description VARCHAR(255),
    status ENUM('Active', 'Inactive') NOT NULL,
    picture VARCHAR(255),
    current_occupancy INT DEFAULT 0,
    FOREIGN KEY (ground_id) REFERENCES camp_grounds(ground_id)
);

CREATE TABLE accommodation_assignments (
    assignment_id INT PRIMARY KEY AUTO_INCREMENT,
    accommodation_id INT NOT NULL,
    user_id INT NOT NULL,
    camp_id INT NOT NULL,
    FOREIGN KEY (accommodation_id) REFERENCES accommodations(accommodation_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (camp_id) REFERENCES camps(camp_id)
);


-- Create Discount Table
CREATE TABLE discount (
    discount_id INT PRIMARY KEY AUTO_INCREMENT,
    camp_id INT,
    discount_type VARCHAR(50),
    discount_start_date DATE,
    discount_end_date DATE,
    discount_percentage FLOAT,
    FOREIGN KEY (camp_id) REFERENCES camps(camp_id)
);

-- Create News Table
CREATE TABLE news (
    news_id INT PRIMARY KEY AUTO_INCREMENT,
    receiver_id INT,
    title VARCHAR(255),
    content VARCHAR(255),
    publish_date DATE,
    to_all ENUM('Yes', 'No'), 
    to_group ENUM('Youth', 'Adult Leader', 'Group Leader','No'),
    FOREIGN KEY (receiver_id) REFERENCES users(user_id)

);

-- Create Health Record Table
CREATE TABLE health_record (
    health_record_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    medical_condition VARCHAR(255),
    allergies_information VARCHAR(255),
    dietary_requirement VARCHAR(255),
    last_updated_date VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
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

-- Create Camp Activities Link Table
CREATE TABLE camp_activities (
    camp_act_id INT PRIMARY KEY AUTO_INCREMENT,
    camp_id INT NOT NULL,
    activity_id INT NOT NULL,
    FOREIGN KEY (camp_id) REFERENCES camps(camp_id),
    FOREIGN KEY (activity_id) REFERENCES activity(activity_id)
);

-- Create Activity Registrations Table
CREATE TABLE activity_registrations (
    act_reg_id INT PRIMARY KEY AUTO_INCREMENT,
    activity_id INT NOT NULL,
    user_id INT NOT NULL,
    status ENUM('Registered', 'Cancelled', 'Completed') NOT NULL,
    registration_date DATE NOT NULL,
    FOREIGN KEY (activity_id) REFERENCES activity(activity_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create Payment Table
CREATE TABLE payment (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    camp_id INT NOT NULL,
    amount FLOAT NOT NULL,
    request_date DATE NOT NULL,
    description VARCHAR(255),
    payment_status ENUM('Paid', 'Unpaid','Due') NOT NULL,
    payment_date DATE,
    pay_type ENUM('Card', 'Bank') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (camp_id) REFERENCES camps(camp_id)
);


CREATE TABLE card (
    card_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    card_number VARCHAR(16) NOT NULL,
    expiry_date VARCHAR(5) NOT NULL,
    cvv VARCHAR(3) NOT NULL,
    cardholder_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);


-- Insert into users table
INSERT INTO users (user_id, username, password_hash, role, salt, email, reset_password_token, reset_password_expires)
VALUES 
(1, 'manager1', '$2b$10$661RgRYdVRQWBNYqrGwGwe0EZ9OK8Y6x9P93yZ6Lm363NerpT3Upu', 'Manager', '10', 'manager1@example.com', NULL, NULL),
(2, 'staff1', '$2b$10$661RgRYdVRQWBNYqrGwGwe0EZ9OK8Y6x9P93yZ6Lm363NerpT3Upu', 'Staff', '10', 'staff1@example.com', NULL, NULL),
(3, 'admin1', '$2b$10$661RgRYdVRQWBNYqrGwGwe0EZ9OK8Y6x9P93yZ6Lm363NerpT3Upu', 'Admin', '10', 'admin1@example.com', NULL, NULL),
(4, 'youth1', '$2b$10$661RgRYdVRQWBNYqrGwGwe0EZ9OK8Y6x9P93yZ6Lm363NerpT3Upu', 'Youth', '10', 'alice@example.com', NULL, NULL),
(5, 'youth2', '$2b$10$661RgRYdVRQWBNYqrGwGwe0EZ9OK8Y6x9P93yZ6Lm363NerpT3Upu', 'Youth', '10', 'tom@example.com', NULL, NULL),
(6, 'youth3', '$2b$10$661RgRYdVRQWBNYqrGwGwe0EZ9OK8Y6x9P93yZ6Lm363NerpT3Upu', 'Youth', '10', 'eve@example.com', NULL, NULL),
(7, 'youth4', '$2b$10$661RgRYdVRQWBNYqrGwGwe0EZ9OK8Y6x9P93yZ6Lm363NerpT3Upu', 'Youth', '10', 'max@example.com', NULL, NULL),
(8, 'youth5', '$2b$10$661RgRYdVRQWBNYqrGwGwe0EZ9OK8Y6x9P93yZ6Lm363NerpT3Upu', 'Youth', '10', 'sophia@example.com', NULL, NULL),
(9, 'youth6', '$2b$10$661RgRYdVRQWBNYqrGwGwe0EZ9OK8Y6x9P93yZ6Lm363NerpT3Upu', 'Youth', '10', 'luke@example.com', NULL, NULL),
(10, 'adult_leader1', '$2b$10$661RgRYdVRQWBNYqrGwGwe0EZ9OK8Y6x9P93yZ6Lm363NerpT3Upu', 'Adult Leader', '10', 'liam@example.com', NULL, NULL),
(11, 'adult_leader2', '$2b$10$661RgRYdVRQWBNYqrGwGwe0EZ9OK8Y6x9P93yZ6Lm363NerpT3Upu', 'Adult Leader', '10', 'olivia@example.com', NULL, NULL),
(12, 'adult_leader3', '$2b$10$661RgRYdVRQWBNYqrGwGwe0EZ9OK8Y6x9P93yZ6Lm363NerpT3Upu', 'Adult Leader', '10', 'noah@example.com', NULL, NULL),
(13, 'adult_leader4', '$2b$10$661RgRYdVRQWBNYqrGwGwe0EZ9OK8Y6x9P93yZ6Lm363NerpT3Upu', 'Adult Leader', '10', 'emma@example.com', NULL, NULL),
(14, 'adult_leader5', '$2b$10$661RgRYdVRQWBNYqrGwGwe0EZ9OK8Y6x9P93yZ6Lm363NerpT3Upu', 'Adult Leader', '10', 'ava@example.com', NULL, NULL),
(15, 'adult_leader6', '$2b$10$661RgRYdVRQWBNYqrGwGwe0EZ9OK8Y6x9P93yZ6Lm363NerpT3Upu', 'Adult Leader', '10', 'william@example.com', NULL, NULL),
(16, 'group_leader1', '$2b$10$661RgRYdVRQWBNYqrGwGwe0EZ9OK8Y6x9P93yZ6Lm363NerpT3Upu', 'Group Leader', '10', 'james@example.com', NULL, NULL),
(17, 'group_leader2', '$2b$10$661RgRYdVRQWBNYqrGwGwe0EZ9OK8Y6x9P93yZ6Lm363NerpT3Upu', 'Group Leader', '10', 'isabella@example.com', NULL, NULL),
(18, 'group_leader3', '$2b$10$661RgRYdVRQWBNYqrGwGwe0EZ9OK8Y6x9P93yZ6Lm363NerpT3Upu', 'Group Leader', '10', 'elijah@example.com', NULL, NULL);

-- Insert into manager table
INSERT INTO manager (user_id, first_name, last_name, gender, email, phone_num)
VALUES 
(1, 'John', 'Doe', 'Male', 'manager1@example.com', '1234567890');

-- Insert into staff table
INSERT INTO staff (user_id, first_name, last_name, gender, email, phone_num, emergency_contacts_name, emergency_contacts_phone)
VALUES 
(2, 'Jane', 'Doe', 'Female', 'staff1@example.com', '0987654321', 'Emergency', '1122334455');

-- Insert into admin table
INSERT INTO admin (user_id, first_name, last_name, gender, email, phone_num)
VALUES 
(3, 'Jim', 'Beam', 'Male', 'admin1@example.com', '1231231234');

-- Insert into youth table
INSERT INTO youth (user_id, first_name, last_name, gender, email, phone_num, parent_guardian_name, parent_guardian_phone, parent_guardian_email, relationship_to_camper, activity_preferences, dob)
VALUES 
(4, 'Alice', 'Smith', 'Female', 'alice@example.com', '1112223333', 'Bob Smith', '3332221111', 'bob@example.com', 'Father', 'Swimming, Hiking', '2010-04-04'),
(5, 'Tom', 'Johnson', 'Male', 'tom@example.com', '4445556666', 'Mary Johnson', '6665554444', 'mary@example.com', 'Mother', 'Archery, Canoeing', '2011-05-05'),
(6, 'Eve', 'Brown', 'Female', 'eve@example.com', '7778889999', 'Sam Brown', '9998887777', 'sam@example.com', 'Father', 'Arts, Crafts', '2012-06-06'),
(7, 'Max', 'Davis', 'Male', 'max@example.com', '0001112222', 'Sara Davis', '2221110000', 'sara@example.com', 'Mother', 'Fishing, Hiking', '2013-07-07'),
(8, 'Sophia', 'Wilson', 'Female', 'sophia@example.com', '3334445555', 'Paul Wilson', '5554443333', 'paul@example.com', 'Father', 'Swimming, Soccer', '2014-08-08'),
(9, 'Luke', 'Taylor', 'Male', 'luke@example.com', '6667778888', 'Laura Taylor', '8887776666', 'laura@example.com', 'Mother', 'Basketball, Tennis', '2015-09-09');

-- Insert into adult_leader table
INSERT INTO adult_leader (user_id, first_name, last_name, gender, email, phone_num, emergency_contacts_name, emergency_contacts_phone, dob)
VALUES 
(10, 'Liam', 'Anderson', 'Male', 'liam@example.com', '1234567891', 'Emma Anderson', '9876543211', '1985-10-10'),
(11, 'Olivia', 'Thomas', 'Female', 'olivia@example.com', '1234567892', 'John Thomas', '9876543212', '1986-11-11'),
(12, 'Noah', 'Moore', 'Male', 'noah@example.com', '1234567893', 'Isabella Moore', '9876543213', '1987-12-12'),
(13, 'Emma', 'Martin', 'Female', 'emma@example.com', '1234567894', 'Liam Martin', '9876543214', '1988-01-01'),
(14, 'Ava', 'Garcia', 'Female', 'ava@example.com', '1234567895', 'Noah Garcia', '9876543215', '1989-02-02'),
(15, 'William', 'Martinez', 'Male', 'william@example.com', '1234567896', 'Olivia Martinez', '9876543216', '1990-03-03');

-- Insert into group_leader table
INSERT INTO group_leader (user_id, first_name, last_name, gender, email, phone_num, emergency_contacts_name, emergency_contacts_phone, dob)
VALUES 
(16, 'James', 'Hernandez', 'Male', 'james@example.com', '1234567897', 'Sophia Hernandez', '9876543217', '1970-04-04'),
(17, 'Isabella', 'Lopez', 'Female', 'isabella@example.com', '1234567898', 'James Lopez', '9876543218', '1971-05-05'),
(18, 'Elijah', 'Gonzalez', 'Male', 'elijah@example.com', '1234567899', 'Ava Gonzalez', '9876543219', '1972-06-06');



-- Insert into camp_grounds table
INSERT INTO camp_grounds (name, capacity, description, location, status, picture)
VALUES 
('Sunny Meadow', 200, 'A beautiful camping ground with a lake and forest.', '123 Camp Road', 'Active', 'sunny_meadow.jpg'),
('Rocky Ridge', 150, 'A rugged terrain with plenty of hiking trails.', '456 Rocky Road', 'Active', 'rocky_ridge.jpg'),
('Green Valley', 250, 'A spacious area with green fields and a river.', '789 Valley Road', 'Inactive', 'green_valley.jpg'),
('Mountain Peak', 180, 'A campsite at the summit of a mountain.', '101 Mountain Road', 'Active', 'mountain_peak.jpg');

-- Insert into camps table
INSERT INTO camps (ground_id, camp_name, location, start_date, end_date, capacity, schedule, description, price, status)
VALUES 
(1, 'Summer Fun Camp', '123 Camp Road', '2024-07-01', '2024-07-14', 100, 'Daily activities and games', 'A fun summer camp for kids.', 500.0, 'Approved'),
(2, 'Adventure Camp', '456 Rocky Road', '2024-08-01', '2024-08-14', 80, 'Hiking, climbing, and more', 'An adventure-filled camp.', 600.0, 'Pending'),
(1, 'Wilderness Adventure Camp', '123 Camp Road', '2024-06-15', '2024-06-30', 120, 'Outdoor activities and survival skills', 'A camp for learning wilderness survival skills.', 550.0, 'Approved'),
(2, 'Rocky Mountain Camp', '456 Rocky Road', '2024-07-20', '2024-08-03', 90, 'Rock climbing, hiking, and camping', 'An adventurous camp in the Rocky Mountains.', 620.0, 'Pending'),
(3, 'Green Fields Camp', '789 Valley Road', '2024-06-10', '2024-06-24', 150, 'Nature walks, bird watching, and more', 'A nature-focused camp in Green Fields.', 480.0, 'Approved'),
(1, 'Lakeview Summer Camp', '123 Camp Road', '2024-08-05', '2024-08-19', 110, 'Swimming, boating, and fishing', 'A camp by the lake with various water activities.', 530.0, 'Approved'),
(2, 'Mountain Expedition Camp', '456 Rocky Road', '2024-09-01', '2024-09-15', 85, 'Expedition to the mountain summit', 'A challenging camp for mountain enthusiasts.', 640.0, 'Pending');


-- Insert into camp_groups table
INSERT INTO camp_groups (group_leader_id, camp_id, number_of_attendees, group_name, description, group_status, payment_status, registration_fee_youth, registration_fee_adult)
VALUES 
(1, 1, 20, 'Explorers', 'A group of young explorers.', 'Active', 'Paid', 150.0, 200.0),
(2, 2, 15, 'Adventurers', 'A group of adventurous spirits.', 'Pending', 'Unpaid', 200.0, 250.0),
(2, 3, 20, 'Forest Rangers', 'A group passionate about forest conservation.', 'Active', 'Paid', 160.0, 210.0),
(3, 4, 18, 'River Runners', 'A group focused on river activities.', 'Inactive', 'Paid', 170.0, 220.0),
(1, 5, 15, 'Mountain Goats', 'A group dedicated to mountain hiking.', 'Pending', 'Unpaid', 180.0, 230.0),
(2, 6, 22, 'Wildlife Watchers', 'A group for wildlife enthusiasts.', 'Active', 'Paid', 160.0, 210.0),
(3, 7, 25, 'Nature Scouts', 'A group exploring nature trails.', 'Active', 'Unpaid', 170.0, 220.0);

-- Insert into camp_teams table
INSERT INTO camp_teams (group_id, team_name, adult_leader_id, accommodation_id_al, accommodation_id_youth)
VALUES 
(1, 'Team 1', 1, 1, null);


-- Insert into team_members table
INSERT INTO team_members (camper_id, team_id)
VALUES 
(1, 1);


-- Insert into camp_registrations table
INSERT INTO camp_registrations (group_id, camp_id, user_id, camper_type, registration_date, status)
VALUES 
(1, 1, 4, 'Youth', '2024-06-01', 'Registered'),
(1, 1, 5, 'Youth', '2024-06-01', 'Registered'),
(1, 1, 6, 'Youth', '2024-06-01', 'Registered'),
(1, 1, 7, 'Youth', '2024-06-01', 'Registered'),
(1, 1, 10, 'Adult Leader', '2024-06-01', 'Registered'),
(1, 1, 12, 'Adult Leader', '2024-06-01', 'Registered'),
(1, 1, 13, 'Adult Leader', '2024-06-01', 'Registered'),
(1, 1, 11, 'Adult Leader', '2024-06-01', 'Unpaid');


-- Insert into accommodations table
INSERT INTO accommodations (ground_id, type, capacity, location_description, status, picture)
VALUES 
(1, 'Tent', 10, 'Near the lake', 'Active', '/src/images/camping.jpg'),
(2, 'Cabin', 1, 'In the forest', 'Active', '/src/images/camping.jpg'),
(2, 'Tent', 10, 'Rocky area', 'Active', '/src/images/camping.jpg'),
(1, 'Cabin', 1, 'By the river', 'Active', '/src/images/camping.jpg'),
(1, 'Tent', 10, 'In the meadow', 'Active', '/src/images/camping.jpg'),
(2, 'Cabin', 1, 'Mountain view', 'Active', '/src/images/camping.jpg');

-- Insert into accommodation_assignments table
INSERT INTO accommodation_assignments (accommodation_id, user_id, camp_id)
VALUES 
(1, 4, 1),
(2, 5, 1),
(2, 10, 1);

-- Insert into discount table
INSERT INTO discount (camp_id, discount_type, discount_start_date, discount_end_date, discount_percentage)
VALUES 
(1, 'Early Bird', '2024-01-01', '2024-03-01', 10.0),
(2, 'Group', '2024-02-01', '2024-04-01', 15.0);

-- Insert into news table
INSERT INTO news (receiver_id, title, content, publish_date, to_all, to_group)
VALUES 
(1, 'Camp Registration Open', 'Register now for summer camps!', '2024-05-01', 'Yes', 'No'),
(16, 'Group Meeting', 'A meeting for group leaders.', '2024-05-05', 'No', 'Group Leader');

-- Insert into health_record table
INSERT INTO health_record (user_id, medical_condition, allergies_information, dietary_requirement, last_updated_date)
VALUES 
(4, 'Asthma', 'Peanuts', 'Vegetarian', '2024-01-01'),
(5, 'Diabetes', 'None', 'None', '2024-01-01'),
(6, 'None', 'None', 'Gluten-Free', '2024-01-01'),
(7, 'Epilepsy', 'None', 'None', '2024-01-01'),
(8, 'None', 'None', 'Vegan', '2024-01-01'),
(9, 'None', 'None', 'None', '2024-01-01'),
(10, 'Hypertension', 'Shellfish', 'None', '2024-01-01'),
(11, 'None', 'None', 'None', '2024-01-01'),
(12, 'None', 'None', 'Kosher', '2024-01-01'),
(13, 'Asthma', 'Dairy', 'None', '2024-01-01'),
(14, 'None', 'None', 'Halal', '2024-01-01'),
(15, 'None', 'None', 'None', '2024-01-01'),
(16, 'None', 'None', 'None', '2024-01-01'),
(17, 'None', 'None', 'None', '2024-01-01'),
(18, 'None', 'None', 'None', '2024-01-01');

-- Insert into activity table
INSERT INTO activity (name, duration, description, cost, capacity)
VALUES 
('Hiking', '2 hours', 'Guided hiking in the forest.', 20.0, 30),
('Swimming', '1 hour', 'Swimming in the lake.', 10.0, 20);

-- Insert into camp_activities table
INSERT INTO camp_activities (camp_id, activity_id) VALUES (1, 1);
INSERT INTO camp_activities (camp_id, activity_id) VALUES (1, 2);
INSERT INTO camp_activities (camp_id, activity_id) VALUES (2, 1);
INSERT INTO camp_activities (camp_id, activity_id) VALUES (4, 1);
INSERT INTO camp_activities (camp_id, activity_id) VALUES (6, 1);
INSERT INTO camp_activities (camp_id, activity_id) VALUES (7, 2);
INSERT INTO camp_activities (camp_id, activity_id) VALUES (2, 2);


-- Insert into activity_registrations table
-- INSERT INTO activity_registrations (activity_id, user_id, status, registration_date)
-- VALUES 


-- Insert into payment table
INSERT INTO payment (user_id, camp_id, amount, request_date, description, payment_status, payment_date, pay_type)
VALUES 
(4, 1, 500.0, '2024-05-01', 'Camp fee', 'Paid', '2024-05-15', 'Card'),
(5, 1, 500.0, '2024-05-01', 'Camp fee', 'Paid', '2024-05-15', 'Bank'),
(16, 1, 500, '2024-06-02', 'Payment for group Group 1 at camp 123 Camp Road from user 16', 'Paid', '2024-06-03', 'Card'),
(4, 3, 160, '2024-06-02', 'Payment for Summer Fun Camp, Group: Forest Rangers', 'Paid', '2024-06-03', 'Card'),
(4, 4, 170, '2024-06-02', 'Payment for Adventure Camp, Group: River Runners', 'Unpaid', NULL, 'Bank'),
(4, 1, 150, '2024-06-02', 'Payment for Summer Fun Camp, Group: Explorers', 'Unpaid', NULL, 'Card');

-- Insert into card table
INSERT INTO card (user_id, card_number, expiry_date, cvv, cardholder_name)
VALUES 
(4, '1234567812345678', '12/24', '123', 'Alice Smith'),
(5, '8765432187654321', '11/23', '456', 'Tom Johnson');
