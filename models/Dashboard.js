const { Model, DataTypes } = require('sequelize');
const db = require('../config/connection');

class Dashboard extends Model { }

Dashboard.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            min: 5
        }
    }, entry: {
        type: DataTypes.TEXT,
        allowNull: true,
    }

},
    {
        sequelize: db,
        modelName: 'dashboard'

    });

module.exports = Dashboard;