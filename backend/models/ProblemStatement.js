const mongoose = require('mongoose');

const problemStatementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    domain: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    description: { type: String, required: true },
    visible: { type: Boolean, default: true }
});

module.exports = mongoose.model('ProblemStatement', problemStatementSchema);
