const User = require('../models/userModel');
const Cost = require('../models/costModel');


/**

 @file User Controller

 @description Handles all operations related to user, including creation, updates, deletion, and fetching reports.
 */

/**
* Creates a new user and ensures the user ID is unique.
* @async
* @function createUser
* @param {Object} userData - The user details.
* @param {number} userData.id - Unique numeric identifier for the user.
* @param {string} userData.first_name - The first name of the user.
* @param {string} userData.last_name - The last name of the user.
* @param {Date} userData.birthday - The date of birth of the user.
* @param {string} userData.marital_status - The marital status of the user.
* @returns {Promise<{status: number, data?: Object, error?: string}>}
* Returns the created user object if successful, or an error message if the user already exists or another error occurs.
*/
const createUser = async (userData) => {
    try {
        const existingUser = await User.findOne({ id: userData.id });
        if (existingUser) {
            return { status: 400, error: "User ID already exists." };
        }

        const newUser = new User(userData);
        const savedUser = await newUser.save();
        return { status: 201, data: savedUser };
    } catch (error) {
        return { status: 500, error: error.message };
    }
};

/**
 * Controller to handle adding a new user.
 * @async
 * @function addUser
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The user data.
 * @param {number} req.body.id - Unique numeric identifier for the user.
 * @param {string} req.body.first_name - The first name of the user.
 * @param {string} req.body.last_name - The last name of the user.
 * @param {Date} req.body.birthday - The date of birth of the user.
 * @param {string} req.body.marital_status - The marital status of the user.
 * @param {Object} res - Express response object.
 * @returns {JSON} Returns the created user object if successful, or an error message if any field is missing or the user already exists.
 */
const addUser = async (req, res) => {
    const { id, first_name, last_name, birthday, marital_status } = req.body;

    if (!id || !first_name || !last_name || !birthday || !marital_status) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const result = await createUser({ id, first_name, last_name, birthday, marital_status });

    if (result.error) {
        return res.status(result.status).json({ error: result.error });
    }
    return res.status(result.status).json(result.data);
};
/**
 * Updates an existing user's details by their unique user ID.
 * @async
 * @function updateUser
 * @param {number} userId - The unique user ID of the user to update.
 * @param {Object} updateData - The updated user data.
 * @param {string} [updateData.first_name] - The updated first name of the user.
 * @param {string} [updateData.last_name] - The updated last name of the user.
 * @param {Date} [updateData.birthday] - The updated date of birth of the user.
 * @param {string} [updateData.marital_status] - The updated marital status of the user.
 * @returns {Promise<{status: number, data?: Object, error?: string}>}
 * Returns the updated user object if successful, or an error message if the user is not found or another error occurs.
 */
const updateUser = async (userId, updateData) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { id: userId },
            updateData,
            { new: true }
        );

        if (!updatedUser) {
            return { status: 404, error: "User not found." };
        }

        return { status: 200, data: updatedUser };
    } catch (error) {
        return { status: 500, error: error.message };
    }
};
/**
 * Controller to handle updating a user's details.
 * @async
 * @function editUser
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The user ID to update.
 * @param {Object} req.body - The updated user data.
 * @param {string} [req.body.first_name] - The updated first name of the user.
 * @param {string} [req.body.last_name] - The updated last name of the user.
 * @param {Date} [req.body.birthday] - The updated date of birth of the user.
 * @param {string} [req.body.marital_status] - The updated marital status of the user.
 * @param {Object} res - Express response object.
 * @returns {JSON} Returns the updated user object if successful, or an error message if validation fails or the user is not found.
 */
const editUser = async (req, res) => {
    const userId = req.params.id;
    const updateData = req.body;

    if (!userId || isNaN(userId)) {
        return res.status(400).json({ error: "Valid user ID is required." });
    }

    const result = await updateUser(Number(userId), updateData);

    if (result.error) {
        return res.status(result.status).json({ error: result.error });
    }
    return res.status(result.status).json(result.data);
};
/**
 * Deletes a user by their unique user ID.
 * @async
 * @function deleteUser
 * @param {number} userId - The unique user ID of the user to delete.
 * @returns {Promise<{status: number, message?: string, error?: string}>}
 * Returns a success message if the deletion is successful, or an error message if the user is not found or another error occurs.
 */
const deleteUser = async (userId) => {
    try {
        const deletedUser = await User.findOneAndDelete({ id: userId });

        if (!deletedUser) {
            return { status: 404, error: "User not found." };
        }

        return { status: 200, message: "User deleted successfully." };
    } catch (error) {
        return { status: 500, error: error.message };
    }
};

const removeUser = async (req, res) => {
    const userId = req.params.id;

    if (!userId || isNaN(userId)) {
        return res.status(400).json({ error: "Valid user ID is required." });
    }

    const result = await deleteUser(Number(userId));

    if (result.error) {
        return res.status(result.status).json({ error: result.error });
    }
    return res.status(result.status).json({ message: result.message });
};

/**
 * Fetches user details by their unique user ID, including their total cost.
 * @async
 * @function fetchUserDetails
 * @param {number} userId - The unique user ID to fetch details for.
 * @returns {Promise<{status: number, data?: Object, error?: string}>}
 * Returns user details including first name, last name, and total costs if successful,
 * or an error message if the user is not found or another error occurs.
 */
const fetchUserDetails = async (userId) => {
    try {
        const user = await User.findOne({ id: userId });

        if (!user) {
            return { status: 404, error: 'User not found' };
        }

        // Fetch total cost for the user
        const totalCostResult = await Cost.aggregate([
            { $match: { userid: user.id } },
            { $group: { _id: null, total: { $sum: "$sum" } } }
        ]);

        const totalCost = totalCostResult.length > 0 ? totalCostResult[0].total : 0;

        return {
            status: 200,
            data: {
                first_name: user.first_name,
                last_name: user.last_name,
                id: user.id,
                total: totalCost
            }
        };
    } catch (error) {
        return { status: 500, error: error.message };
    }
};

const getUserDetails = async (req, res) => {
    const userId = req.params.id;

    if (!userId || isNaN(userId)) {
        return res.status(400).json({ error: "Valid user ID is required." });
    }

    const result = await fetchUserDetails(Number(userId));

    if (result.error) {
        return res.status(result.status).json({ error: result.error });
    }
    return res.status(result.status).json(result.data);
};


module.exports = { addUser, getUserDetails, editUser, removeUser };
