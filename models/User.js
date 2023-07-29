const { Model, DataTypes } = require('sequelize');
const { hash, compare } = require('bcrypt');
const db = require('../config/connection');


class User extends Model { }

User.init({
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            min: 5
        }
    },
    password: {
        type: DataTypes.STRING,
        validate: {
            min: 6
        }
    }
}, {
    sequelize: db,
    modelName: 'user',
    hooks: {
        async beforeCreate(user) {
            const hashPassword = await hash(user.password, 7);
            user.password = hashPassword;
        },
        async beforeUpdate(updatedUserData) {
            updatedUserData.email = await updatedUserData.email.toLowerCase();
            return updatedUserData;
        },
    }
});

User.prototype.validatePass = async function (formPassword) {
    const isValid = await compare(formPassword, this.password);
    return isValid;
};

module.exports = User;