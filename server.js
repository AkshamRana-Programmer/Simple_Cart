// necessary imports
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// import routes
const users = require("./routes/usersRoute");

// setup initial setup functions
dotenv.config();
connectDB();

// create server
const app = express();

// setup middleware
app.use(express.json());
app.use(cors());

// setup routes
app.use('/', users);

// start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, ()=>console.log(`server running in PORT ${PORT}`))