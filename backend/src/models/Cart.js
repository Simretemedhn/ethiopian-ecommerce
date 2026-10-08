const mongoose = require("mongoose");


// ============================================
// CART ITEM SCHEMA
// ============================================

const cartItemSchema =
    new mongoose.Schema(
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },

            quantity: {
                type: Number,
                required: true,
                min: 1,
                max: 99
            }
        },
        {
            _id: false
        }
    );


// ============================================
// CART SCHEMA
// ============================================

const cartSchema =
    new mongoose.Schema(
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
                unique: true
            },

            items: {
                type: [cartItemSchema],
                default: []
            }
        },
        {
            timestamps: true
        }
    );


// ============================================
// CREATE MODEL
// ============================================

const Cart =
    mongoose.model(
        "Cart",
        cartSchema
    );


module.exports = Cart;