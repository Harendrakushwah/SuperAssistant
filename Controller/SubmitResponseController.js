const { Response } = require('../models/FormModal');

// Submit form response
const submitResponse = async (req, res) => {
    try {
        const { formId, answers } = req.body;
        
        const newResponse = new Response({
            formId,
            answers
        });
        
        const savedResponse = await newResponse.save();
        
        res.status(201).json({
            message: 'Response submitted successfully',
            response: savedResponse
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error submitting response',
            error: error.message
        });
    }
};

module.exports = { submitResponse }; 