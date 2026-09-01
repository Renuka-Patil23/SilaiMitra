const {
    authenticate,
    authorizeAdmin
} = require("../middleware/authMiddleware");

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

const {
    addCustomerValidator,
    updateCustomerValidator,
    customerIdValidator,
    searchCustomerValidator
} = require("../validators/customerValidator");

const validateRequest = require("../validators/validateRequest");

router.get("/search", authenticate, searchCustomerValidator, validateRequest, searchCustomers);  //search customers by name or phone
router.get("/:id", authenticate, customerIdValidator, validateRequest, getCustomerById); //get customer by id
router.get("/", authenticate, getCustomers); //get all coustomers
router.put("/:id", authenticate, updateCustomerValidator, validateRequest, updateCustomer); //update customer by id
router.delete("/:id", authenticate, authorizeAdmin, customerIdValidator, validateRequest, deleteCustomer); //delete customer by id
router.post("/", authenticate, addCustomerValidator, validateRequest, addCustomer); //add new customer

module.exports = router;