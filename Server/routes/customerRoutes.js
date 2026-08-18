// Defines the API URL

const express = require("express");
const router = express.Router();

const {
    addCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    searchCustomers
} = require("../controllers/customerController");

router.get("/search", searchCustomers);  //search customers by name or phone
router.get("/:id", getCustomerById); //get customer by id
router.get("/", getCustomers); //get all coustomers
router.put("/:id", updateCustomer); //update customer by id
router.delete("/:id", deleteCustomer); //delete customer by id
router.post("/", addCustomer); //add new customer

module.exports = router;