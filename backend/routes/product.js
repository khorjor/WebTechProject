const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Location of the JSON file folder
const DATA_DIR = path.join(__dirname, '../data/product');

// GET: Get products by category
router.get('/:category', (req, res) => {
  const { category } = req.params;
  const filePath = path.join(DATA_DIR, `${category}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Category not found' });
  }

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Error reading data file' });
  }
});

// POST: Add new product to a category
router.post('/:category', (req, res) => {
  const { category } = req.params;
  const filePath = path.join(DATA_DIR, `${category}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Category not found' });
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const newProduct = req.body;

    const orderedProduct = {
      id: data.length > 0 ? data[data.length - 1].id + 1 : 1,
      image: newProduct.image,
      name: newProduct.name,
      price: newProduct.price,
      hoverImage: newProduct.hoverImage,
      rating: newProduct.rating,
      brand: newProduct.brand,
      description: newProduct.description,
      detailLink: newProduct.detailLink
    };

    data.push(orderedProduct);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    res.json({ success: true, product: orderedProduct });
  } catch (err) {
    res.status(500).json({ error: 'Error writing data file' });
  }
});

// PUT: Update product in category by ID
router.put('/:category/:id', (req, res) => {
  const { category, id } = req.params;
  const filePath = path.join(DATA_DIR, `${category}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Category not found' });
  }

  try {
    let data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const index = data.findIndex(p => String(p.id) === String(id));
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updatedProduct = Object.fromEntries([
      ['id', data[index].id],
      ['image', req.body.image],
      ['name', req.body.name],
      ['price', req.body.price],
      ['hoverImage', req.body.hoverImage],
      ['rating', req.body.rating],
      ['brand', req.body.brand],
      ['description', req.body.description],
      ['detailLink', req.body.detailLink]
    ]);

    data[index] = updatedProduct;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

    res.json({ success: true, product: updatedProduct });
  } catch (err) {
    res.status(500).json({ error: 'Error updating product' });
  }
});

// DELETE: Delete a product from a category by ID.
router.delete('/:category/:id', (req, res) => {
  const { category, id } = req.params;
  const filePath = path.join(DATA_DIR, `${category}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Category not found' });
  }

  try {
    let data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const filteredData = data.filter(p => String(p.id) !== String(id));

    if (filteredData.length === data.length) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const reassignedData = filteredData.map((product, index) => ({
      ...product,
      id: index + 1
    }));

    fs.writeFileSync(filePath, JSON.stringify(reassignedData, null, 2), 'utf-8');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting product' });
  }
});

module.exports = router;
