// Defines the API URL

const express = require("express");
const router = express.Router();

const {
    addCustomer,
    getCustomers
} = require("../controllers/customerController");

router.get("/", getCustomers); //get all coustomers
router.post("/", addCustomer); //add new customer

module.exports = router;