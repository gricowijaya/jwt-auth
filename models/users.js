'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const {
    JWT_SIGNATURE_KEY
} = process.env

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    checkPassword(password) { 
        return bcrypt.compareSync(password, this.password);
    }
    generateToken() {
        const payload = { 
            id: this.id,
            username: this.username,
            email: this.email,
        };

        return jwt.sign(payload, process.env.JWT_SECRET_KEY);
    }

    static authenticate = async ({email, password}) => { 
        try { 
            const users = await this.findOne({where: { email: email }});
            if (!users) return Promise.reject("User not Found"); 
             
            const isPasswordValid = users.checkPassword(password);
            if (!isPasswordValid) return Promise.reject("Wrong Password"); 

            return Promise.resolve(users);

        } catch(err) { 
            return Promise.reject(err)
        }
    }

    static associate(models) {
      // define association here
    }
  }

  Users.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    roles: DataTypes.ENUM('SuperAdmin', 'Admin', 'User')
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};
