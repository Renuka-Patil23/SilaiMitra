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


## add orders 
POST http://localhost:5000/api/orders

{
  "customer_id": ,3
  "measurement_id": 1,
  "garment_type": "Shirt",
  "quantity": 2,
  "delivery_date": "2026-08-15",
  "total_amount": 2000,
  "advance_amount": 500,
  "notes": "Full sleeves"
}

## get all orders 

GET http://localhost:5000/api/orders

## get orders by ID 

GET http://localhost:5000/api/orders/1

## get orders by customers
GET http://localhost:5000/api/orders/customer/3

## update order
PUT http://localhost:5000/api/orders/1

{
    "customer_id": 3,
    "measurement_id": 3,
    "garment_type": "Shirt",
    "quantity": 3,
    "delivery_date": "2026-08-20",
    "total_amount": 3000,
    "advance_amount": 1000,
    "status": "In Progress",
    "notes": "Urgent stitching"
}

## delete order
DELETE http://localhost:5000/api/orders/1


## add payment
POST http://localhost:5000/api/payments

{
  "order_id": 3,
  "amount": 500,
  "payment_method": "UPI",
  "payment_date": "2026-08-08",
  "notes": "Advance payment"
}

## get all payments 
GET http://localhost:5000/api/payments

## get payment by id 
GET http://localhost:5000/api/payments/1

## get payment by order 
GET http://localhost:5000/api/payments/order/2

## update payment 
PUT PUT http://localhost:5000/api/payments/1
{
  "order_id": 3,
  "amount": 700,
  "payment_method": "Cash",
  "payment_date": "2026-08-08",
  "notes": "Updated payment"
}

## delete payment
DELETE http://localhost:5000/api/payments/1


## dashboard APIs

## summary api
GET http://localhost:5000/api/dashboard/summary

## recent orders 
 GET http://localhost:5000/api/dashboard/recent-orders

# upcoming deliveries 
GET /api/dashboard/upcoming-deliveries

# payment summary
GET /api/dashboard/payment-summary

# customer summary
GET /api/dashboard/customer-summary


## search and filtering 

# search by name 
GET http://localhost:5000/api/customers/search?name=Renu

# search by phone 
GET http://localhost:5000/api/customers/search?phone=9876

# search by both name and phone 
GET http://localhost:5000/api/customers/search?name=ABC&phone=9876543210

# filter orders by status pending 
GET http://localhost:5000/api/orders/filter?status=Pending

# filter orders by garment type 
GET http://localhost:5000/api/orders/filter?garment_type=Kurta

# filter orders by customer
GET http://localhost:5000/api/orders/filter?customer_id=1

# filter orders by delivery date
GET http://localhost:5000/api/orders/filter?delivery_date=2026-08-25 

# to update the status 
PATCH http://localhost:5000/api/orders/2/status

{
    "status": "In Progress"
}

# show upcoming deliveries
GET http://localhost:5000/api/orders/delivery/upcoming



## Login and registeration api

# registration 
# (admin)
POST http://localhost:5000/api/auth/register

{
    "name": "Admin",
    "email": "admin@silaimitra.com",
    "password": "Admin@123",
    "role": "admin"
}

# --->
 {
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@silaimitra.com",
    "role": "admin",
    "created_at": "2026-08-21T09:35:58.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzaWxhaW1pdHJhLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4NzMwNDk1OCwiZXhwIjoxNzg3MzkxMzU4fQ._tFwtLHnvz1L9SAtgc-40fKb2Bs9eRiXd1zkR_QSI8I"
}

# (Staff)

{
    "name": "Staff User",
    "email": "staff@silaimitra.com",
    "password": "Staff@123",
    "role": "staff"
}

{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 2,
    "name": "Staff User",
    "email": "staff@silaimitra.com",
    "role": "staff",
    "created_at": "2026-08-21T14:36:10.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJzdGFmZkBzaWxhaW1pdHJhLmNvbSIsInJvbGUiOiJzdGFmZiIsImlhdCI6MTc4NzMyMjk3MCwiZXhwIjoxNzg3NDA5MzcwfQ.pPM4nWEkxarHh7Yye-hFPZxeimz9acfYS54mGk4DQM0"
}

# login  
POST http://localhost:5000/api/auth/login

{
    "email": "admin@silaimitra.com",
    "password": "Admin@123"
}

# --->
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@silaimitra.com",
    "role": "admin",
    "created_at": "2026-08-21T09:35:58.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzaWxhaW1pdHJhLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4NzMwNTE1OSwiZXhwIjoxNzg3MzkxNTU5fQ.2wwVapNUpdQhjA1Z94AfTYWM4Tw-XTOca6qPVm18How"
}


# test /me
GET http://localhost:5000/api/auth/me

---> pass the authorization - Bearer _Token here_

