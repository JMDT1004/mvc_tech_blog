const { Model, DataTypes } = require('sequelize');
const db = require('../config/connection');

class Post extends Model { }

Post.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [5]
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id',
        },
    }
}, {
    sequelize: db,
    modelName: 'post'
});

module.exports = Post;