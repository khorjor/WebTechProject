const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const cartRouter = require('./routes/cart');
const productRouter = require('./routes/product');

app.use('/api/login', require('./routes/login'));
app.use('/api/register', require('./routes/register'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/products', require('./routes/product'));


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});