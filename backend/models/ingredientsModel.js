const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ingredientsSchema = new Schema({
  ingredient_name: {
    type: String,
    required: true,
    unique: true
  },
  category_id: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  Uint : {
    type: String,
    required: true
    },
    stock_quantity: {
    type: Number,
    required: true,
    default: 0
    },
    price_per_unit: {
    type: Number,
    required: true,
    default: 0
    },
    reorder_level: {
    type: Number,
    required: true,
    default: 0
    },
    sofeDelete: {
    type: Boolean,
    default: false
    },
    in_status: {
    type: String,
    enum: ['IN_STOCK', 'NOT_IN_STOCK'],
    default: 'IN_STOCK'
    },
    Deleted_at: {
    type: Date,
    default: null
    }

}, { timestamps: true })
module.exports = mongoose.model('Ingredients', ingredientsSchema)
