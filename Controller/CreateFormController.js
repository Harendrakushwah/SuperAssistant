const { Form } = require('../models/FormModal');
const { v4: uuidv4 } = require('uuid');

// Create a new form
const createForm = async (req, res) => {
    try {
        const { title, description, headerImage, questions } = req.body;
        
        // Generate a unique shareable link
        console.log("Create form------", title, description, headerImage, questions)
        const shareableLink = uuidv4();
        
        const newForm = new Form({
            title,
            description,
            headerImage,
            questions,
            shareableLink
        });
        
        const savedForm = await newForm.save();
        
        res.status(200).json({
            message: 'Form created successfully',
            form: savedForm,
            shareableLink: `/fill/${shareableLink}`
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating form',
            error: error.message
        });
    }
};

module.exports = { createForm };