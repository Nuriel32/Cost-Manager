const mongoose = require('mongoose');

/**
 * @module models/Cost
 * @description Defines the Cost schema for MongoDB, storing user expenses.
 */

/**
 * @typedef {Object} Cost
 * @property {string} description - Description of the expense.
 * @property {string} category - Category of the expense (Allowed: 'food', 'health', 'housing', 'sport', 'education').
 * @property {number} userid - Numeric ID of the user associated with the cost.
 * @property {mongoose.Schema.Types.ObjectId} user - Reference to the User collection.
 * @property {number} sum - Amount spent.
 * @property {Date} date - Date of the expense (defaults to the current date).
 */

const costSchema = new mongoose.Schema({
    /** Description of the expense. */
    description: { type: String, required: true },

    /** Category of the expense (food, health, housing, sport, education). */
    category: {
        type: String,
        enum: ['food', 'health', 'housing', 'sport', 'education'],
        required: true
    },

    /** Numeric ID of the user associated with the expense. */
    userid: { type: Number, required: true },

    /** Reference to the User collection. */
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    /** The amount spent on the expense. */
    sum: { type: Number, required: true },

    /** Date when the expense was recorded (defaults to current date). */
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Cost', costSchema);
