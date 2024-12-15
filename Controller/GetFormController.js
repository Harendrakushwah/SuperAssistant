const { Form } = require('../models/FormModal');

// Get form by shareable link
const getFormByLink = async (req, res) => {
    try {
        const form = await Form.findOne({ shareableLink: req.params.link });
        
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }
        
        res.json(form);
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};

const getFormList = async (req, res) => {
    try {
        const form = await Form.find({});
        
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }
        
        res.status(200).json(form);
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = { getFormByLink, getFormList }; 