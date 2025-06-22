const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const checkoutFilePath = path.join(__dirname, '..', 'data', 'checkout.json');

router.post("/", (req, res) => {
  const {
    firstName, lastName, company, email,
    country, address, city, zipCode,
    phone, comment, paymentMethod,
    cartItems
  } = req.body;

  if (
    !firstName || !lastName || !email || !country || !address ||
    !city || !zipCode || !phone || !paymentMethod ||
    !cartItems || !Array.isArray(cartItems) || cartItems.length === 0
  ) {
    return res.status(400).json({ error: "Missing required fields or cart is empty." });
  }

  const data = {
    customer: {
      firstName, lastName, company, email,
      country, address, city, zipCode,
      phone, comment, paymentMethod
    },
    cartItems,
    total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    timestamp: new Date().toISOString()
  };

  try {
    fs.writeFileSync(checkoutFilePath, JSON.stringify(data, null, 2));
    res.json({ message: "Checkout saved successfully." });
  } catch (err) {
    console.error("Error writing file:", err);
    res.status(500).json({ error: "Failed to save checkout data." });
  }
});

module.exports = router;
