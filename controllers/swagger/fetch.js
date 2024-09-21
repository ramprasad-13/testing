
const { getswaggerData, getEndpoints, generateTestCases } = require('../../updatedCode');
const fetchSwagger = async (req, res) => {
    const { swaggerUrl } = req.query;
    try {
        if (!swaggerUrl) {
            return res.status(400).json({ "error": "swaggerUrl is required" });
        }

        // Fetch Swagger data
        const swaggerData = await getswaggerData(swaggerUrl);
        if (!swaggerData) {
            return res.status(500).json({ "error": "Failed to fetch Swagger data" });
        }

        // Get endpoints
        const endpoints = getEndpoints(swaggerData);

        // Generate test cases
        const testCases = generateTestCases(endpoints);

        // For demonstration purposes, just send back the test cases
        res.status(200).json(testCases);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "error": error.message });
    }
}

module.exports = fetchSwagger;