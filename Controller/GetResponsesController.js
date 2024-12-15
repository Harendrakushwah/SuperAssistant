const { Response } = require('../models/FormModal');

// Get all responses for a form
const getAllResponses = async (req, res) => {
    try {
        const responses = await Response.find({ formId: req.params.formId });
        
        res.json(responses);
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = { getAllResponses }; 