# Customer APIs

## Add Customer
POST http://localhost:5000/api/customers

Body:
{
  "name": "Renu",
  "phone": "9876543210",
  "email": "renu@gmail.com",
  "address": "Pune"
}

--------------------------------

## Get All Customers
GET http://localhost:5000/api/customers

--------------------------------

## Get Customer By ID
GET http://localhost:5000/api/customers/2

--------------------------------

## Update Customer
PUT http://localhost:5000/api/customers/2

Body:
{
  "name": "Renu Patil",
  "phone": "9999999999",
  "email": "renu@gmail.com",
  "address": "Nashik"
}

--------------------------------

## Delete Customer
DELETE http://localhost:5000/api/customers/2