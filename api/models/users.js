'use strict';
const {
  Model
} = require('sequelize');
const exercises = require('./exercises');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.hasMany(models.exercises,{ foreignKey: 'user_id' })
    }
  }
  Users.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    role: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    hash: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};