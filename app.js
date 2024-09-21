const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const db = require('./connection');
const fetchSwaggerData = require('./controllers/swagger/fetch')
const port = process.env.PORT || 3000;

const getProject = require('./routes/project/get');
const getProjects = require('./routes/project/getall');
const createProject = require('./routes/project/create');
const updateProject = require('./routes/project/update');
const deleteProject = require('./routes/project/delete');

const getTestcases = require('./routes/testcases/get');


//connect to database
db();

const corsOptions = {
    origin: function(origin, callback) {
        const allowedOrigins = ['https://yourwebsite.com', 'http://localhost:5173'];
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'DELETE','PATCH','PUT'],
    credentials: true,
};

//middleware
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());



// Express Route
app.use('/api',getProject);
app.use('/api',getProjects);
app.use('/api',createProject);
app.use('/api',updateProject);
app.use('/api',deleteProject);

app.use('/api/test',getTestcases);

//routes
app.get('/', (req, res) => {
    res.status(200).json({ "message": "App is working" });
});

app.get('/fetchSwaggerData', fetchSwaggerData);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

module.exports = app;
