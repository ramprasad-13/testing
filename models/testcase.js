const mongoose = require('mongoose');

const TestCaseSchema = new mongoose.Schema({
    testCases: [
        {
            name: { type: String, required: true },
            description: { type: String, default: '' },
            request: {
                method: { type: String, required: true },
                path: { type: String, required: true },
                params: { type: Object, default: {} }
            },
            expected: {
                statusCode: { type: Number, required: true },
                body: { type: Object, default: {} }
            },
            responseTime: {
                acceptableLimit: { type: Number, default: null },
                shouldFailIfWithinLimit: { type: Boolean, default: false }
            }
        }
    ]
});

const TestModel = mongoose.model('TestCase', TestCaseSchema);
module.exports = TestModel;
