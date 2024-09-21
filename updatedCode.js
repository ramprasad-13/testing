const axios = require('axios');

// Function to fetch Swagger JSON data
const getswaggerData = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching Swagger data:', error);
        throw new Error('Error fetching Swagger data');
    }
};

// Function to generate unique values
function generateUniqueValue(prefix) {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

// Function to get all endpoints with parameters
function getEndpoints(swaggerData) {
    if (!swaggerData || !swaggerData.paths) {
        console.error('Invalid Swagger data');
        return [];
    }

    const paths = swaggerData.paths;
    const endpoints = [];

    for (const path in paths) {
        const methods = paths[path];
        for (const method in methods) {
            if (methods.hasOwnProperty(method)) {
                const operation = methods[method];
                const parameters = operation.parameters || [];

                const formattedParameters = parameters.map(param => ({
                    name: param.name,
                    in: param.in,
                    description: param.description || '',
                    required: param.required || false,
                    type: param.type,
                    format: param.format || null,
                    enum: param.enum || null
                }));

                endpoints.push({
                    path: path,
                    method: method.toUpperCase(),
                    parameters: formattedParameters
                });
            }
        }
    }

    return endpoints;
}

// Function to generate test cases
function generateTestCases(endpoints) {
    const testCases = [];

    endpoints.forEach(endpoint => {
        const { path, method, parameters } = endpoint;

        const testCaseTemplate = {
            name: `Test ${method} ${path}`,
            description: `Test cases for ${method} ${path}`,
            request: {
                method: method,
                path: path,
                params: {}
            },
            expected: {
                statusCode: 200,
                body: {}
            },
            responseTime: {
                acceptableLimit: null,
                shouldFailIfWithinLimit: false
            }
        };

        if (parameters.length > 0) {
            parameters.forEach(param => {
                const validValue = generateUniqueValue(param.name);
                const invalidValue = 'invalidValue';

                if (param.required) {
                    testCases.push({
                        ...testCaseTemplate,
                        name: `Verify response when ${param.name} is missing`,
                        request: {
                            ...testCaseTemplate.request,
                            params: {},
                            path: path.replace(`{${param.name}}`, '')
                        },
                        expected: {
                            statusCode: 400,
                            body: { error: `${param.name} is required` }
                        }
                    });
                }

                testCases.push({
                    ...testCaseTemplate,
                    name: `Verify successful retrieval when ${param.name} is valid`,
                    request: {
                        ...testCaseTemplate.request,
                        params: { [param.name]: validValue },
                        path: path.replace(`{${param.name}}`, validValue)
                    },
                    expected: {
                        statusCode: 200
                    }
                });

                testCases.push({
                    ...testCaseTemplate,
                    name: `Verify response when ${param.name} is invalid`,
                    request: {
                        ...testCaseTemplate.request,
                        params: { [param.name]: invalidValue },
                        path: path.replace(`{${param.name}}`, invalidValue)
                    },
                    expected: {
                        statusCode: 400,
                        body: { error: `Invalid ${param.name}` }
                    }
                });
            });
        } else {
            testCases.push({
                ...testCaseTemplate,
                name: 'Verify response with no parameters',
                expected: {
                    statusCode: 200
                }
            });
        }
    });

    return testCases;
}

module.exports = {
    getswaggerData,
    getEndpoints,
    generateTestCases
};
