const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Path to JSON "database"
const cartFilePath = path.join(__dirname, '..', 'data', 'cart.json');

// POST /api/cart
router.post('/', (req, res) => {
    const { username, productId, productName, productPrice, productImage, quantity } = req.body;

    if (!username || !productId || !productName || !productPrice) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const qty = parseInt(quantity) || 1; 
    // Load cart database
    let carts = {};
    try {
        const data = fs.readFileSync(cartFilePath, 'utf8');
        carts = JSON.parse(data);
    } catch (err) {
        console.warn("cart.json not found or empty, starting new");
    }

    // Initialize user cart
    if (!carts[username]) {
        carts[username] = [];
    }

    const userCart = carts[username];
    const existingIndex = userCart.findIndex(item => String(item.productId) === String(productId));

    if (existingIndex >= 0) {
        // If product exists, increase quantity
        userCart[existingIndex].quantity += qty;
    } else {
        // If not, add it as a new item
        userCart.push({
            productId: String(productId),
            productName,
            productPrice,
            productImage: productImage || '',
            quantity: qty,
            addedAt: new Date().toISOString()
        });
    }


    // Save back
    try {
        fs.writeFileSync(cartFilePath, JSON.stringify(carts, null, 2));
        res.json({ success: true, message: "Product added to cart" });
    } catch (err) {
        console.error("Failed to save cart:", err);
        res.status(500).json({ success: false, message: "Could not write cart data" });
    }

    
});

// DELETE /api/cart
router.delete('/', (req, res) => {
    const { username, productId } = req.body;

    if (!username || !productId) {
        return res.status(400).json({ success: false, message: "Missing username or productId" });
    }

    let carts = {};
    try {
        const data = fs.readFileSync(cartFilePath, 'utf8');
        carts = JSON.parse(data);
    } catch (err) {
        return res.status(500).json({ success: false, message: "Could not read cart database" });
    }

    if (!carts[username]) {
        return res.status(404).json({ success: false, message: "User cart not found" });
    }

    carts[username] = carts[username].filter(item => item.productId !== productId);

    try {
        fs.writeFileSync(cartFilePath, JSON.stringify(carts, null, 2));
        res.json({ success: true, message: "Item removed from cart" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to update cart" });
    }
});


module.exports = router;