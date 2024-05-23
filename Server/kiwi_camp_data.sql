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
    location VARCHAR(255),
    start_date DATE,
    end_date DATE,
    capacity INT NOT NULL,
    schedule VARCHAR(255),
    description VARCHAR(255),
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
    payment_status ENUM('Unpaid', 'Paid') NOT NULL DEFAULT 'Unpaid'
    FOREIGN KEY (group_leader_id) REFERENCES group_leader(group_leader_id),
    FOREIGN KEY (camp_id) REFERENCES camps(camp_id)
);


-- Create Team Table
CREATE TABLE camp_teams (
    team_id INT PRIMARY KEY AUTO_INCREMENT,
    group_id INT NOT NULL,
    team_name VARCHAR(255) NOT NULL,
    adult_leader_id INT,  
    accommodation_id INT,
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
    group_leader_id INT NOT NULL,
    camp_id INT NOT NULL,
    registration_date DATE,
    status ENUM('Registered', 'Cancelled', 'Completed') NOT NULL,
    FOREIGN KEY (group_leader_id) REFERENCES group_leader(group_leader_id),
    FOREIGN KEY (camp_id) REFERENCES camps(camp_id)
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

CREATE TABLE accommodations (
    accommodation_id INT PRIMARY KEY AUTO_INCREMENT,
    ground_id INT NOT NULL,
    type ENUM('Tent', 'Cabin') NOT NULL,
    capacity INT NOT NULL,
    location_description VARCHAR(255),
    status ENUM('Active', 'Inactive') NOT NULL,
    picture VARCHAR(255),
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
    dietary_requirement VARCHAR(255),
    last_updated_date VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
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
    camper_id INT NOT NULL,
    status ENUM('Registered', 'Cancelled', 'Completed') NOT NULL,
    registration_date DATE NOT NULL,
    FOREIGN KEY (activity_id) REFERENCES activity(activity_id),
    FOREIGN KEY (camper_id) REFERENCES youth(camper_id)
);

-- Create Payment Table
CREATE TABLE payment (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    camp_id INT NOT NULL,
    amount FLOAT NOT NULL,
    payment_date DATE NOT NULL,
    description VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (camp_id) REFERENCES camps(camp_id)
);

-- Create Payment Installments Table
CREATE TABLE payment_installments (
    installment_id INT PRIMARY KEY AUTO_INCREMENT,
    payment_id INT NOT NULL,
    due_date DATE,
    amount FLOAT,
    status ENUM('Due', 'Paid') NOT NULL,
    FOREIGN KEY (payment_id) REFERENCES payment(payment_id)
);




