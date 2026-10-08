const mongoose =
    require("mongoose");


// ============================================
// ORDER ITEM SCHEMA
// ============================================

const orderItemSchema =
    new mongoose.Schema(
        {
            product: {
                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "Product",

                required: true
            },

            name: {
                type: String,

                required: true,

                trim: true
            },

            price: {
                type: Number,

                required: true,

                min: 0
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
// ORDER SCHEMA
// ============================================

const orderSchema =
    new mongoose.Schema(
        {
            // --------------------------------
            // CUSTOMER
            // --------------------------------

            user: {
                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "User",

                required: true
            },


            // --------------------------------
            // ORDER ITEMS
            // --------------------------------

            items: {
                type: [orderItemSchema],

                required: true,

                validate: {
                    validator: function (items) {
                        return items.length > 0;
                    },

                    message:
                        "Order must contain at least one item"
                }
            },


            // --------------------------------
            // SUBTOTAL
            // --------------------------------

            subtotal: {
                type: Number,

                required: true,

                min: 0
            },


            // --------------------------------
            // ORDER STATUS
            // --------------------------------

            status: {
                type: String,

                enum: [
                    "pending",
                    "confirmed",
                    "processing",
                    "shipped",
                    "delivered",
                    "cancelled"
                ],

                default: "pending"
            },


            // --------------------------------
            // PAYMENT STATUS
            // --------------------------------

            paymentStatus: {
                type: String,

                enum: [
                    "pending",
                    "paid",
                    "failed",
                    "refunded"
                ],

                default: "pending"
            }
        },
        {
            timestamps: true
        }
    );


// ============================================
// CREATE MODEL
// ============================================

const Order =
    mongoose.model(
        "Order",
        orderSchema
    );


module.exports = Order;