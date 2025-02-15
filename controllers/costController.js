const Cost = require('../models/costModel');
const User = require('../models/userModel');

/**

 @file Cost Controller

 @description Handles all operations related to costs, including creation, updates, deletion, and fetching reports.
 */


/**
 * Validates cost input fields to ensure they meet required constraints.
 * @function validateCostInput
 * @param {string} description - The description of the cost.
 * @param {string} category - The category of the cost (Allowed: 'food', 'health', 'housing', 'sport', 'education').
 * @param {number} userid - The numeric ID of the user associated with the cost.
 * @param {number} sum - The amount spent.
 * @returns {string|null} Returns an error message if validation fails, otherwise returns `null` if input is valid.
 */
    const validateCostInput = (description, category, userid, sum) => {
    const allowedCategories = ['food', 'health', 'housing', 'sport', 'education'];

    if (!description || typeof description !== 'string' || description.trim() === '') {
        return "Description is required and must be a string.";
    }
    if (!allowedCategories.includes(category)) {
        return "Category must be one of: food, health, housing, sport, education.";
    }
    if (!userid || typeof userid !== 'number' || userid <= 0) {
        return "User ID must be a positive number.";
    }
    if (!sum || typeof sum !== 'number' || sum <= 0) {
        return "Sum must be a positive number.";
    }
    return null;
};

/**
 * Creates a new cost entry and associates it with a user.
 * @async
 * @function createCost
 * @param {Object} costData - The cost details.
 * @param {string} costData.description - The description of the cost.
 * @param {string} costData.category - The category of the cost (Allowed: 'food', 'health', 'housing', 'sport', 'education').
 * @param {number} costData.userid - The ID of the user associated with the cost.
 * @param {number} costData.sum - The amount spent.
 * @param {Date} [costData.date] - The date of the expense (defaults to the current date if not provided).
 * @returns {Promise<{status: number, data?: Object, error?: string}>}
 * Returns the created cost entry if successful, or an error message if the user is not found or another error occurs.
 */const createCost = async (costData) => {
    try {
        const { description, category, userid, sum, date } = costData;

        const user = await User.findOne({ id: userid });
        if (!user) {
            return { status: 404, error: "User not found. Cannot add cost." };
        }

        const newCost = new Cost({
            description,
            category,
            userid,
            user: user._id,
            sum,
            date: date || Date.now()
        });

        const savedCost = await newCost.save();

        // Return only required fields
        return {
            status: 201,
            data: {
                description: savedCost.description,
                category: savedCost.category,
                userid: savedCost.userid,
                sum: savedCost.sum,
                date: savedCost.date
            }
        };
    } catch (error) {
        return { status: 500, error: error.message };
    }
};

/**
 * Updates a cost entry by its ID.
 * @async
 * @function updateCost
 * @param {string} costId - The ID of the cost entry to update.
 * @param {Object} updateData - The updated cost data.
 * @param {string} [updateData.description] - The updated description of the cost.
 * @param {string} [updateData.category] - The updated category of the cost (food, health, housing, sport, education).
 * @param {number} [updateData.sum] - The updated amount of the cost.
 * @param {Date} [updateData.date] - The updated date of the cost.
 * @returns {Promise<{status: number, data?: Object, error?: string}>}
 * Returns the updated cost entry if successful, or an error message if not found or an error occurs.
 */
const updateCost = async (costId, updateData) => {
    try {
        const updatedCost = await Cost.findByIdAndUpdate(costId, updateData, { new: true });
        if (!updatedCost) {
            return { status: 404, error: "Cost not found." };
        }
        return { status: 200, data: updatedCost };
    } catch (error) {
        return { status: 500, error: error.message };
    }
};

/**
 * Deletes a cost entry by its ID.
 * @async
 * @function deleteCost
 * @param {string} costId - The ID of the cost entry to delete.
 * @returns {Promise<{status: number, message?: string, error?: string}>}
 * Returns a success message if the deletion is successful, or an error message if the cost is not found or an error occurs.
 */const deleteCost = async (costId) => {
    try {
        const deletedCost = await Cost.findByIdAndDelete(costId);
        if (!deletedCost) {
            return { status: 404, error: "Cost not found." };
        }
        return { status: 200, message: "Cost deleted successfully." };
    } catch (error) {
        return { status: 500, error: error.message };
    }
};

/**
 * Fetches the monthly cost report for a specific user, grouping costs by category.
 * @async
 * @function fetchMonthlyReport
 * @param {number} id - The user ID for whom the report is generated.
 * @param {number} year - The year for the report.
 * @param {number} month - The month for the report (1-12).
 * @returns {Promise<{status: number, data?: Object[], error?: string}>}
 * Returns a grouped cost report for the user if successful, or an error message.
 */
const fetchMonthlyReport = async (id, year, month) => {
    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const costs = await Cost.find({
            userid: Number(id),
            date: { $gte: startDate, $lte: endDate }
        });

        // Initialize the categories
        const categories = ['food', 'health', 'housing', 'sport', 'education'];
        const groupedCosts = {};

        // Ensure all categories exist in the response
        categories.forEach(category => {
            groupedCosts[category] = [];
        });

        // Populate categories with cost data
        costs.forEach(cost => {
            groupedCosts[cost.category].push({
                sum: cost.sum,
                description: cost.description,
                day: new Date(cost.date).getDate()
            });
        });

        return {
            status: 200,
            data: {
                userid: Number(id),
                year: Number(year),
                month: Number(month),
                costs: Object.keys(groupedCosts).map(category => ({
                    [category]: groupedCosts[category]
                }))
            }
        };
    } catch (error) {
        return { status: 500, error: error.message };
    }
};

// Controller for adding a new cost
const addCost = async (req, res) => {
    const { description, category, userid, sum, date } = req.body;
    const validationError = validateCostInput(description, category, userid, sum);
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }
    const result = await createCost({ description, category, userid, sum, date });
    if (result.error) {
        return res.status(result.status).json({ error: result.error });
    }
    return res.status(result.status).json(result.data);
};

// Controller for updating cost details
const editCost = async (req, res) => {
    const costId = req.params.id;
    const updateData = req.body;
    const result = await updateCost(costId, updateData);
    if (result.error) {
        return res.status(result.status).json({ error: result.error });
    }
    return res.status(result.status).json(result.data);
};

// Controller for deleting a cost
const removeCost = async (req, res) => {
    const costId = req.params.id;
    const result = await deleteCost(costId);
    if (result.error) {
        return res.status(result.status).json({ error: result.error });
    }
    return res.status(result.status).json({ message: result.message });
};

/**
 * Controller to retrieve the monthly cost report for a specific user.
 * @async
 * @function getMonthlyReport
 * @param {Object} req - Express request object.
 * @param {Object} req.query - The query parameters.
 * @param {string} req.query.id - The user ID for whom the report is generated.
 * @param {number} req.query.year - The year for the report.
 * @param {number} req.query.month - The month for the report (1-12).
 * @param {Object} res - Express response object.
 * @returns {JSON} Returns the grouped cost report if successful,
 * or an error message if validation fails or an error occurs.
 */
const getMonthlyReport = async (req, res) => {
    const { id, year, month } = req.query;

    if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Valid user ID is required." });
    }
    if (!year || isNaN(year) || year < 2000 || year > new Date().getFullYear()) {
        return res.status(400).json({ error: "Valid year is required." });
    }
    if (!month || isNaN(month) || month < 1 || month > 12) {
        return res.status(400).json({ error: "Month must be between 1 and 12." });
    }

    const result = await fetchMonthlyReport(id, year, month);
    if (result.error) {
        return res.status(result.status).json({ error: result.error });
    }
    return res.status(result.status).json(result.data);
};
const fetchDevelopers = () => {
    return {
        status: 200,
        data: [
            { first_name: "Noy", last_name: "Atedgi" },
            { first_name: "Coral", last_name: "Shahaff" },
        ]
    };
};
/**
 * Controller to retrieve information about the developers.
 * @async
 * @function getDevelopers
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {JSON} Returns a list of developers' first and last names.
 */
const getDevelopers = async (req, res) => {
    const result = fetchDevelopers();
    return res.status(result.status).json(result.data);
};


module.exports = { addCost, editCost, removeCost, getMonthlyReport,getDevelopers };
