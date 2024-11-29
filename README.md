# Project Info
- Project Name: DrinkOrderSystem
- Group Info: Group 56
- Student Names, SIDs: Wong Chun Lung, 13246191
                       Deepak Singh Rawat, 13802460
                       Wong Wing Tat, 13741718
                       Kung Kai Chun, 13408786

# Project File Intro
- server.js: Main server file that handles routing and middleware.
- package.json: Lists all dependencies and project scripts.
- public (folder): Contains static files like CSS, JavaScript, and images.
- views (folder): Contains EJS templates for web pages.

- models (folder): Contains Mongoose schema files for database models.
>> drink.js for drinks schema
>> User.js for User schema 

# Cloud URL
- [Our server URL: (https://drink-order-2.onrender.com)]

# Operation Guides
## Login/Logout Pages
- Valid login information: admin/admin, guest/guest
- Sign in steps: Enter the User Name and Password in the box provided and press the "Login" button.
- If you login as normal user, it should redirect the the ordering page.

## CRUD Web Pages
Here are the CRUD Web Pages instructions tailored for users who can log in as guests. 
## CRUD Web Pages for Users
- **Login**: 
  1. Navigate to the login page.
  2. Enter the username `guest` and password `guest`.
  3. Click the "Login" button to access the order page.

- **Create (Place an Order)**:
  1. Navigate to the order page after logging in.
  2. Choose a drink by selecting the desired option (Milk Tea, Orange Tea, or Green Tea).
  3. Select your preferred ice level, order amount, size, and sugar level.
  4. Click the "CREATE" button to place a new order.

- **Read (View Your Order)**:
  1. While on the order page, you can view your order details by clicking the "READ" button.
  2. The details of your order will be displayed, showing the drink name, ice level, order amount, size, and sugar level.

- **Update (Modify Your Order)**:
  1. If you need to update your order, make the necessary changes to your drink selection, ice level, order amount, size, or sugar level.
  2. Click the "UPDATE" button to modify your existing order.

- **Delete (Cancel Your Order)**:
  1. If you wish to cancel your order, click the "DELETE" button on the order page.
  2. This will remove the existing order details.

- **Reset (Clear the Form)**:
  1. If you want to clear the form and start over, click the "RESET" button.
  2. This will reset all fields on the form to their default values.

- **Logout**:
  1. To log out, click the "LOGOUT" button on the order page.
  2. This will redirect you back to the login page.

## Navigation
- **Back Home Button**: After performing any action (create, update, read, delete), use the "Back Home" button to return to the CRUD web page.

## RESTful CRUD Services
- APIs: [List all APIs with HTTP request types and path URIs]
- User
- Create User
  HTTP Method: POST
  Path URI: /api/user
  Payload Example:
  {
    "username": "newuser",
    "password": "password"
  }

- Read User
  HTTP Method: GET
  Path URI: /api/user

- Update User
  HTTP Method: PUT
  Path URI: /api/user/username/:username (Where :username is the User's name)

- Delete User
  HTTP Method: DELETE
  Path URI: /api/user/username/:username (Where :username is the User's name)


- Drinks
- Create Drinks
  HTTP Method: POST
  Path URI: /api/drinks
  Payload Example:
  {
    "drinks_name": "mike tea",
    "drinks_vaild": "100"
  }

- Read Drinks
  HTTP Method: GET
  Path URI: /api/drinks

- Update Drinks
  HTTP Method: PUT
  Path URI: /api/drinks/drinks_name/:drinks_name (Where :drinks_name is the drink's name)

- Delete Drinks
  HTTP Method: DELETE
  Path URI: /api/drinks/drinks_name/:drinks_name (Where :drinks_name is the drink's name)


- Orders
- Create
  HTTP Method: GET
  Path URI: /api/orders
  Payload Example:
  {
    "drinks_name": "milk tea",
    "drinks_orderAmount": 2,
    "drinks_ice": "50%",
    "drinks_sugar": "75%",
    "drinks_size": "M"
  }

- Read Drinks
  HTTP Method: GET
  Path URI: /api/orders

- Update Drinks
  HTTP Method: PUT
  Path URI: /api/orders/drinks_name/drinks_name (Where :drinks_name is the drink's name)

- Delete Drinks
  HTTP Method: DELETE
  Path URI: /api/orders/drinks_name/drinks_name (Where :drinks_name is the drink's name)


- How to test them: [Provide instructions on how to test the APIs]
- User
  Create User:
  curl -X POST http://localhost:8099/api/user -H "Content-Type: application/json" -d '{"username": "Mike", "password": "12345"}'

  Read All Users:
  curl -X GET http://localhost:8099/api/user

  Update User Password:
  curl -X PUT http://localhost:8099/api/user/password/Mike -H "Content-Type: application/json" -d '{"password": "abcde"}'

  Delete User:
  curl -X DELETE http://localhost:8099/api/user/username/Mike


- Drink
  Create new Drinks:
  curl -X POST http://localhost:8099/api/drinks -H "Content-Type: application/json" -d '{"name": "milk tea", "vaild": "100"}'

  Read All Drinks:
  curl -X GET http://localhost:8099/api/drinks

  Update Drinks info:
  curl -X PUT http://localhost:8099/api/drinks/drinks_name/milk%20tea -H "Content-Type: application/json" -d '{"drinks_vaild": "101"}'

  Delete a Drinks:
  curl -X DELETE http://localhost:8099/api/drinks/drinks_name/milk%20tea


- Order
  Create new Order:
  curl -X POST http://localhost:8099/api/orders -H "Content-Type: application/json" -d '{"drinks_name": "milk tea", "drinks_orderAmount": 2, "drinks_ice": "50%", "drinks_sugar": "75%", "drinks_size": "M"}'

  Read All Order:
  curl -X GET http://localhost:8099/api/orders

  Update an Order info:
  curl -X PUT http://localhost:8099/api/orders/drinks_name/milk%20tea -H "Content-Type: application/json" -d '{"drinks_orderAmount": "3", "drinks_ice": "0%", "drinks_sugar": "100%", "drinks_size": "S"}'

  Delete an Order
  curl -X DELETE http://localhost:8099/api/orders/drinks_name/milk%20tea
