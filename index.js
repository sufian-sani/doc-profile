const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const scheduleRouter = require('./routes/schedule');
const path = require('path');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Sync Sequelize models with the database
sequelize.sync().then(() => console.log('Database synced'));


// Routes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/schedule', scheduleRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
