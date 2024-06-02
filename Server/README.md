# KiwiCamp

## Overview
The KiwiCamp system efficiently manages camp details, user accounts, payments, activities, and accommodations. It includes a user-friendly interface, robust security measures, and comprehensive reporting tools. The system was validated by actual users to ensure functionality and ease of use. Its strengths lie in its flexibility, scalability, and security, while limitations involve managing large-scale data and ensuring continuous integration.

## Features
- **User Management:** Comprehensive account management for campers, group leaders, adult leaders, staff, and managers.
- **Camp Management:** CRUD operations for camps, groups, and registrations.
- **Activity Management:** CRUD operations for activities, including assignment to specific camps.
- **Accommodations Management:** CRUD operations for accommodations.
- **Payment Processing:** Manage payments, discounts, and approval of bank transfers.
- **Reporting Tools:** Generate various reports for administrative and management purposes.

## Getting Started
### Prerequisites
- Node.js
- npm (Node Package Manager)
- MySQL

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/EmilyDAI1017/KiwiCamp.git
   cd KiwiCamp

2.  Set up the database:

- Import the kiwi_camp_data.sql file into your MySQL database.

3. Run the client side:
        cd client
        npm install
        npm run dev
4. Run the server side::
        cd server
        npm install
        node server.js
### Database Setup
Run the kiwi_camp_data.sql script to set up the database schema and initial data.

mysql> create database kiwi_camp;
mysql> use kiwi_camp;

copy paste the kiwi_camp_data.sql or source the file path.


### Users for Testing
Admin:
        Username: admin1
        Password: 123
Staff:
        Username: staff1
        Password: 123
Manager:
        Username: manager1
        Password: 123
Youth Camper:
        Username: youth1
        Password: 123
Adult Leader:
        Username: adult_leader1
        Password: 123
Group Leader:
        Username: group_leader1
        Password: 123

### Assumptions
1. Each ground can handle only one camp at a time, and each group can choose only one camp at a time.
2. The group leader is responsible for paying for the camp, considering the best capacity and attendance.
3. Camp prices are for group bookings. Group leaders will set registration fees for youth campers and adult leaders based on the costs incurred.
4. A team can have a maximum of 10 members, excluding the adult leader. Each team will have one large tent (5-10 people) and a cabin for the adult leaders.
5. Managers can manage payments and approve bank transfer payments.

### Running Tests
Navigate to the client folder and run tests using the following command:
        cd client
        npm test --detectOpenHandles 