const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path')

// 1.read existing file
// 2.parse Data
// 3. add new data into Array
// 4.save array into file

router.post('/', (req, res) => {
    const {email} = req.body;
    const subscribe = {subscribeAt : new Date(), email};

    const filePath = path.join(__dirname,'..','data','subscribe.json')


    let subscribes = [];

    if(fs.existsSync(filePath)){
        //file is there
        const filedata = fs.readFileSync(filePath, 'utf-8');
        subscribes = JSON.parse(filedata);
        subscribes.push(subscribe);
        fs.writeFileSync(filePath, JSON.stringify(subscribes, null, 2))
        res.status(200).json({status:"Message Recieved"});
        console.log('Content form submitted', {email});

    }else{
        //no file
        subscribes.push(subscribe)
        fs.writeFileSync(filePath, JSON.stringify(subscribes, null, 2))
        res.status(200).json({status:"Message Recieved"});
        console.log('Content form submitted', {email});
    }

    

});

module.exports = router;
