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