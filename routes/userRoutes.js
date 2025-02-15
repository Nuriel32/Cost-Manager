const express = require('express');
const { addUser, getUserDetails, editUser, removeUser, getDevelopers } = require('../controllers/userController');

const router = express.Router();

/**
 * @route GET /api/users/:id
 * @description Retrieves user details by user ID.
 * @access Public
 * @param {Object} req - Express request object
 * @param {string} req.params.id - The user ID
 * @returns {Object} 200 - The user details including total costs
 */
router.get('/:id', getUserDetails);

/**
 * @route POST /api/users
 * @description Creates a new user.
 * @access Public
 * @param {Object} req - Express request object
 * @param {Object} req.body - The user data
 * @param {number} req.body.id - The unique user ID
 * @param {string} req.body.first_name - The first name of the user
 * @param {string} req.body.last_name - The last name of the user
 * @param {Date} req.body.birthday - The date of birth of the user
 * @param {string} req.body.marital_status - The marital status of the user
 * @returns {Object} 201 - The newly created user object
 */
router.post('/', addUser);

/**
 * @route PUT /api/users/:id
 * @description Updates an existing user’s details.
 * @access Public
 * @param {Object} req - Express request object
 * @param {string} req.params.id - The user ID to update
 * @param {Object} req.body - The updated user data
 * @returns {Object} 200 - The updated user object
 */
router.put('/:id', editUser);

/**
 * @route DELETE /api/users/:id
 * @description Deletes a user by ID.
 * @access Public
 * @param {Object} req - Express request object
 * @param {string} req.params.id - The user ID to delete
 * @returns {Object} 200 - Success message confirming deletion
 */
router.delete('/:id', removeUser);

module.exports = router;
