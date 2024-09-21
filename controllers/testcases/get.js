const TestModel = require('../../models/testcase');
const { getswaggerData, getEndpoints, generateTestCases } = require('../../updatedCode');

const getTestcase = async (req, res) => {
    const { swaggerUrl } = req.query;
    try {
        if (!swaggerUrl) {
            return res.status(400).json({ error: "swaggerUrl is required" });
        }

        const swaggerData = await getswaggerData(swaggerUrl);
        if (!swaggerData) {
            return res.status(500).json({ error: "Failed to fetch Swagger data" });
        }

        const endpoints = getEndpoints(swaggerData);
        const testCases = generateTestCases(endpoints);

        // Validate test cases
        const hasRequiredFields = testCases.every(tc => 
            tc.name && tc.request.method && tc.request.path && tc.expected.statusCode
        );

        if (!hasRequiredFields) {
            return res.status(400).json({ error: "One or more test cases are missing required fields." });
        }

        // Save all test cases in a single document
        const testcaseDocument = new TestModel({ testCases });
        await testcaseDocument.save();

        res.status(200).json(testCases);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = getTestcase;
