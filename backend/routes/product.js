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

// POST: Add new product and sort key.
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
      ['id', data[index].id], // เก็บ ID เดิมไว้
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
    const originalLength = data.length;
    data = data.filter(p => String(p.id) !== String(id));

    if (data.length === originalLength) {
      return res.status(404).json({ error: 'Product not found' });
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting product' });
  }
});

module.exports = router;
