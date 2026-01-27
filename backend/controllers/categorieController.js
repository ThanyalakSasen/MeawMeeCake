const categoriesModel = require('../models/categoriesModel.js');

exports.createCategory = async (req, res) => {
  try {
    const { category_name, description, unit } = req.body;
    const newCategory = new categoriesModel({
      category_name,
      description,
        unit
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await categoriesModel.find();
    res.status(200).json(categories);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
    const category = await categoriesModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'ไม่พบหมวดหมู่ที่คุณเลือก' });
    }
    res.status(200).json(category);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};
exports.updateCategory = async (req, res) => {
  try {
    const { category_name, description, unit, is_active } = req.body;
    const category = await categoriesModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'ไม่พบหมวดหมู่ที่คุณเลือก' });
    }
    category.category_name = category_name || category.category_name;
    category.description = description || category.description;
    category.unit = unit || category.unit;
    category.is_active = is_active !== undefined ? is_active : category.is_active;
    category.updated_at = Date.now();
    await category.save();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.softDeleteCategory = async (req, res) => {
  try {
    const category = await categoriesModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'ไม่พบหมวดหมู่ที่คุณเลือก' });
    }
    category.is_active = true;
    category.updated_at = Date.now();
    await category.save();
    res.status(200).json({ message: 'หมวดหมู่ถูกลบอย่างนุ่มนวลแล้ว' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.harddeleteCategory = async (req, res) => {
  try {
    const category = await categoriesModel.findById(req.params.id); 
    if (!category) {
      return res.status(404).json({ message: 'ไม่พบหมวดหมู่ที่คุณเลือก' });
    }
    await categoriesModel.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'หมวดหมู่ถูกลบอย่างถาวรแล้ว' });
  }
    catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getActiveCategories = async (req, res) => {
  try {
    const categories = await categoriesModel.find({ is_active: false });
    res.status(200).json(categories);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }   
};

exports.getInactiveCategories = async (req, res) => {
  try {
    const categories = await categoriesModel.find({ is_active: true });
    res.status(200).json(categories);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};

exports.activateCategory = async (req, res) => {
  try {
    const category = await categoriesModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'ไม่พบหมวดหมู่ที่คุณเลือก' });
    }
    category.is_active = false;
    category.updated_at = Date.now();
    await category.save();
    res.status(200).json({ message: 'หมวดหมู่ถูกเปิดใช้งานแล้ว' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};