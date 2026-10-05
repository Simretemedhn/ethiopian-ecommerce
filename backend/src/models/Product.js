const mongoose = require("mongoose");


// ============================================
// PRODUCT SCHEMA
// ============================================

const productSchema =
    new mongoose.Schema(
        {
            name: {
                type: String,
                required: true,
                trim: true
            },

            description: {
                type: String,
                required: true,
                trim: true
            },

            price: {
                type: Number,
                required: true,
                min: 0
            },

            category: {
                type: String,
                required: true,
                trim: true
            }
        },

        {
            timestamps: true
        }
    );


// ============================================
// PRODUCT MODEL
// ============================================

const Product =
    mongoose.model(
        "Product",
        productSchema
    );


module.exports = Product;