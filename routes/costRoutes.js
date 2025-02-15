const express = require('express');
const { addCost, editCost, removeCost, getMonthlyReport, getDevelopers } = require('../controllers/costController');

const router = express.Router();

/**
 * @route POST /api/add
 * @description Adds a new cost item.
 * @access Public
 * @param {Object} req - Express request object
 * @param {Object} req.body - The cost data
 * @param {string} req.body.description - The description of the cost
 * @param {string} req.body.category - The category of the cost (food, health, housing, sport, education)
 * @param {number} req.body.userid - The ID of the user associated with the cost
 * @param {number} req.body.sum - The amount spent
 * @param {Date} [req.body.date] - The date of the expense (optional, defaults to current date)
 * @returns {Object} 201 - The newly created cost object
 */
router.post('/add', addCost);

/**
 * @route GET /api/report
 * @description Retrieves the monthly cost report for a user.
 * @access Public
 * @param {Object} req - Express request object
 * @param {string} req.query.id - The user ID
 * @param {number} req.query.year - The year for the report
 * @param {number} req.query.month - The month for the report
 * @returns {Object[]} 200 - An array of grouped costs
 */
router.get('/report', getMonthlyReport);

/**
 * @route GET /api/about
 * @description Retrieves information about the developers.
 * @access Public
 * @returns {Object[]} 200 - List of developers' first and last names
 */
router.get('/about', getDevelopers);

/**
 * @route PUT /api/:id
 * @description Updates an existing cost item.
 * @access Public
 * @param {Object} req - Express request object
 * @param {string} req.params.id - The ID of the cost item to update
 * @param {Object} req.body - The updated cost data
 * @returns {Object} 200 - The updated cost item
 */
router.put('/:id', editCost);

/**
 * @route DELETE /api/:id
 * @description Deletes a cost item.
 * @access Public
 * @param {Object} req - Express request object
 * @param {string} req.params.id - The ID of the cost item to delete
 * @returns {Object} 200 - Success message confirming deletion
 */
router.delete('/:id', removeCost);

module.exports = router;
