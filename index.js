const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

dotenv.config();
const app = express();
app.use(express.json());

// Sync Sequelize models with the database
sequelize.sync().then(() => console.log('Database synced'));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
