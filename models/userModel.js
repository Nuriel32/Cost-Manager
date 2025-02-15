const mongoose = require('mongoose');

/**
 * @module models/User
 * @description Defines the User schema for MongoDB, storing user details.
 */

/**
 * @typedef {Object} User
 * @property {number} id - Unique numeric identifier for the user.
 * @property {string} first_name - The first name of the user.
 * @property {string} last_name - The last name of the user.
 * @property {Date} birthday - The date of birth of the user.
 * @property {string} marital_status - The marital status of the user.
 */

const userSchema = new mongoose.Schema({
    /** Unique numeric identifier for the user (indexed for fast lookups). */
    id: { type: Number, unique: true, required: true, index: true },

    /** The first name of the user. */
    first_name: { type: String, required: true },

    /** The last name of the user. */
    last_name: { type: String, required: true },

    /** The date of birth of the user. */
    birthday: { type: Date, required: true },

    /** The marital status of the user. */
    marital_status: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
