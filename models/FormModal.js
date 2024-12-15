const mongoose = require('mongoose');

// Question Schema
const QuestionSchema = new mongoose.Schema({
    type: { 
        type: String, 
        enum: ['Text', 'Grid', 'CheckBox'], 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    description: String,
    required: { 
        type: Boolean, 
        default: false 
    },
    image: String, // Base64 or URL
    options: [String], // For Grid and CheckBox
    gridRows: [String], // For Grid type
    gridColumns: [String] // For Grid type
});

// Form Schema
const FormSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: String,
    headerImage: String, // Base64 or URL
    questions: [QuestionSchema],
    shareableLink: { 
        type: String, 
        unique: true 
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Response Schema
const ResponseSchema = new mongoose.Schema({
    formId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Form', 
        required: true 
    },
    answers: [{
        questionId: { 
            type: mongoose.Schema.Types.ObjectId, 
            required: true 
        },
        value: mongoose.Schema.Types.Mixed
    }],
    submittedAt: { 
        type: Date, 
        default: Date.now 
    }
});

const Form = mongoose.model('Form', FormSchema);
const Response = mongoose.model('Response', ResponseSchema);

module.exports = { Form, Response };