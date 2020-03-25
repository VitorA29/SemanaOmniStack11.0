const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// CORS
app.use(cors());

// define the requisition type
app.use(express.json());

// define the routes
app.use(routes);

app.listen('3333');
