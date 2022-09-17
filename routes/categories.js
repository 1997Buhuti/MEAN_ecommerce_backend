const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

// route to get all the categories
router.get(`/`, async (req, res) => {
    const categoryList = await Category.find();

    if (!categoryList) {
        res.status(500).json({ success: false });
    }
    res.send(categoryList);
});

// route to update category
router.put('/:id', async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon || category.icon,
            color: req.body.color
        },
        { new: true }
    );

    if (!category) return res.status(400).send('the category cannot be created!');

    res.send(category);
});

//route to get a specific category
router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);
    res.status(200).send(category);
});

//route to create a specific category
router.post('/', async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    });
    category = await category.save();
    if (!category)
        return res.status(404).send({
            message: "Error couldn't create category."
        });

    res.send(category);
});

//route to delete a specific category
router.delete('/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id)
        .then((category) => {
            if (category) {
                return res.status(200).json({ success: true, message: 'Category is deleted' });
            } else {
                return res.status(400).json({ success: false, message: 'Category not found' });
            }
        })
        .catch((err) => {
            return res.status(400).json({ success: false, error: err });
        });
});

module.exports = router;
