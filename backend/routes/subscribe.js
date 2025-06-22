const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path')

// 1.read existing file
// 2.parse Data
// 3. add new data into Array
// 4.save array into file

router.post('/', (req, res) => {
    const { email } = req.body;
    const subscribe = { subscribeAt: new Date(), email };
    const filePath = path.join(__dirname, '..', 'data', 'subscribe.json');

    let subscribes = [];

    try {
        // If the file exists, read and parse it
        if (fs.existsSync(filePath)) {
            const filedata = fs.readFileSync(filePath, 'utf-8');
            if (filedata.trim()) {
                subscribes = JSON.parse(filedata);
            }
        }

        // Push the new subscription
        subscribes.push(subscribe);

        // Save back to file
        fs.writeFileSync(filePath, JSON.stringify(subscribes, null, 2));
        console.log('Subscription saved:', email);

        res.status(200).json({ status: "Message Received" });

    } catch (err) {
        console.error('Failed to handle subscription:', err.message);
        res.status(500).json({ status: "Error", message: err.message });
    }
});

module.exports = router;
