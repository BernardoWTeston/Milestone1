const express = require('express');

const usersRoutes = require('./routes/users');
const resourcesRoutes = require('./routes/resources');
const reservationsRoutes = require('./routes/reservations');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

app.use('/api/users', usersRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/reservations', reservationsRoutes);

app.use(errorHandler);

module.exports = app;
