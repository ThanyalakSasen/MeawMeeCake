const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const categorySchema = new Schema(
  {
    category_name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: false,
    },
    unit: {
      type: String,
      required: false,
    },
    is_active: {
      type: Boolean,
      default: false,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Category", categorySchema);
