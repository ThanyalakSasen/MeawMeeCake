const ingredientsModel = require('../models/ingredientsModel.js');
const CategoryModel = require('../models/categoriesModel.js');

exports.createIngredient = async (req, res) => {
  try {
    const { ingredient_name, category_id, Uint, stock_quantity, price_per_unit, reorder_level } = req.body;

    // Check if the category exists
    const category = await CategoryModel.findById(category_id);
    if (!category) {
      return res.status(404).json({ message: 'ไม่พบหมวดหมู่ที่คุณเลือก' });
    }

    // Create the ingredient
    const newIngredient = new ingredientsModel({
      ingredient_name,
      category_id,
      Uint,
      stock_quantity,
      price_per_unit,
      reorder_level
    });

    await newIngredient.save();
    res.status(201).json(newIngredient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllIngredients = async (req, res) => {
  try {
    const ingredients = await ingredientsModel
      .find({ sofeDelete: false })
      .populate('category_id')
      .sort({ ingredient_name: 1 });
    
    res.status(200).json({
      success: true,
      message: 'Ingredients retrieved successfully',
      data: ingredients
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// เพิ่ม function ใหม่สำหรับดึงวัตถุดิบที่พร้อมใช้งาน
exports.getAvailableIngredients = async (req, res) => {
  try {
    const ingredients = await ingredientsModel
      .find({ 
        sofeDelete: false,
        in_status: 'IN_STOCK'
      })
      .select('ingredient_name _id')
      .sort({ ingredient_name: 1 });
    
    res.status(200).json({
      success: true,
      message: 'Available ingredients retrieved successfully',
      data: ingredients
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.getIngredientById = async (req, res) => {
  try {
    const ingredient = await ingredientsModel.findById(req.params.id).populate('category_id');
    if (!ingredient || ingredient.sofeDelete) {
      return res.status(404).json({ message: 'ไม่พบวัตถุดิบที่คุณเลือก' });
    }
    res.status(200).json(ingredient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateIngredient = async (req, res) => {
  try {
    const { ingredient_name, category_id, Uint, stock_quantity, price_per_unit, reorder_level, in_status } = req.body;
    const ingredient = await ingredientsModel.findById(req.params.id);

    if (!ingredient || ingredient.sofeDelete) {
      return res.status(404).json({ message: 'ไม่พบวัตถุดิบที่คุณเลือก' });
    }
    
    // Check if the category exists
    const category = await CategoryModel.findById(category_id);
    if (!category) {
      return res.status(404).json({ message: 'ไม่พบหมวดหมู่ที่คุณเลือก' });
    }
    
    ingredient.ingredient_name = ingredient_name;
    ingredient.category_id = category_id;
    ingredient.Uint = Uint;
    ingredient.stock_quantity = stock_quantity;
    ingredient.price_per_unit = price_per_unit;
    ingredient.reorder_level = reorder_level;
    ingredient.in_status = in_status;
    
    await ingredient.save();
    res.status(200).json(ingredient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sofeDeleteIngredient = async (req, res) => {
  try {
    const ingredient = await ingredientsModel.findById(req.params.id);
    if (!ingredient || ingredient.sofeDelete) {
      return res.status(404).json({ message: 'ไม่พบวัตถุดิบที่คุณเลือก' });
    }
    ingredient.sofeDelete = true;
    ingredient.Deleted_at = new Date();
    await ingredient.save();
    res.status(200).json({ message: 'ลบวัตถุดิบสำเร็จ' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } 
};

exports.hardDeleteIngredient = async (req, res) => {
  try {
    const ingredient = await ingredientsModel.findById(req.params.id);
    if (!ingredient) {
      return res.status(404).json({ message: 'ไม่พบวัตถุดิบที่คุณเลือก' });
    }
    await ingredientsModel.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'ลบวัตถุดิบถาวรสำเร็จ' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLowStockIngredients = async (req, res) => {
  try {
    const reorder_level = req.query.reorder_level || 10;
    const lowStockIngredients = await ingredientsModel.find({
      stock_quantity: { $lte: reorder_level },
      sofeDelete: false
    }).populate('category_id');
    res.status(200).json(lowStockIngredients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStockQuantity = async (req, res) => {
  try {
    const { quantity_change } = req.body;
    const ingredient = await ingredientsModel.findById(req.params.id);

    if (!ingredient || ingredient.sofeDelete) {
      return res.status(404).json({ message: 'ไม่พบวัตถุดิบที่คุณเลือก' });
    }
    
    ingredient.stock_quantity += quantity_change;
    await ingredient.save();
    res.status(200).json(ingredient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.recoveryIngredient = async (req, res) => {
  try {
    const ingredient = await ingredientsModel.findById(req.params.id);
    if (!ingredient || !ingredient.sofeDelete) {
      return res.status(404).json({ message: 'ไม่พบวัตถุดิบที่คุณเลือก' });
    }
    ingredient.sofeDelete = false;
    ingredient.Deleted_at = null;
    await ingredient.save();
    res.status(200).json({ message: 'กู้คืนวัตถุดิบสำเร็จ' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};