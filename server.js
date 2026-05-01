// necessary imports
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/db');
const swaggerSpec = require('./config/swagger');

// import routes
const users = require("./routes/usersRoute");
const products = require("./routes/productsRoute");
const carts = require("./routes/cartRoutes");

// setup initial setup functions
dotenv.config();
connectDB();

// create server
const app = express();

// setup middleware
app.use(express.json());
app.use(cors());

// setup routes
app.use('/users', users);
app.use('/products', products);
app.use('/carts', carts);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, ()=>console.log(`server running in PORT ${PORT}`))
