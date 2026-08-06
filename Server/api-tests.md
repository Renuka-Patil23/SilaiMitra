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


## measurement module 

## add Measurement 
POST http://localhost:5000/api/measurements

Content-Type: application/json

{
    "customer_id": 2,
    "garment_type": "Shirt",
    "chest": 38,
    "waist": 32,
    "hip": 40,
    "shoulder": 17,
    "sleeve": 24,
    "neck": 15,
    "length": 29,
    "inseam": null,
    "thigh": null,
    "bottom": null,
    "front_neck": null,
    "back_neck": null,
    "notes": "Regular fit",
    "status": "Active"
}

## get all measurements 

GET http://localhost:5000/api/measurements

## get measurement by id 
 GET http://localhost:5000/api/measurements/1

 ## get measurement of 1 customer 
  GET http://localhost:5000/api/measurements/customer/1

## update measurement record 
 PUT http://localhost:5000/api/measurements/1

 {
    "customer_id": 2,
    "garment_type": "Shirt",
    "chest": 40,
    "waist": 34,
    "hip": 41,
    "shoulder": 18,
    "sleeve": 25,
    "neck": 16,
    "length": 30,
    "inseam": null,
    "thigh": null,
    "bottom": null,
    "front_neck": null,
    "back_neck": null,
    "notes": "Slim fit",
    "status": "Active"
}

## delete measurement 

DELETE http://localhost:5000/api/measurements/1