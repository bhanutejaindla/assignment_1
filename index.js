const express = require('express');
const connectDB = require('./config/db.js');
const userRoutes = require('./routes/userRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');



const app = express();
require('dotenv').config();



connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/admins', adminRoutes);

app.use(express.json());
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server running on  ${port}`));