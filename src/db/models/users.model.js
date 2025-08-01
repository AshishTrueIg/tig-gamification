'use strict'

const GENDER = require('../../utils/constants/public.constants')

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('User', {
    userId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isPhoneVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lastLoginDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    phoneCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    locale: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'EN'
    },
    isInternalUser: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    refParentId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cxToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    affiliateId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isKycVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    promoCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    gender: {
      type: DataTypes.ENUM(Object.values(GENDER)),
      allowNull: true,
      defaultValue: 'Male'
    }
  }, {
    sequelize,
    tableName: 'users',
    schema: 'public',
    timestamps: true,
    underscored: true,
    paranoid: false
  })

  User.associate = function (model) {
    User.belongsTo(model.User, { foreignKey: 'refParentId', as: 'referrer' })
    User.hasMany(User, { foreignKey: 'refParentId', as: 'referredUsers' })
    User.hasOne(model.UserDetails, { foreignKey: 'userId', as: 'userDetails', constraints: false, onDelete: 'cascade' })
    User.hasMany(model.UserTierProgress, { foreignKey: 'userId', as: 'userTierProgresses' })
    User.belongsToMany(model.Segment, { through: 'user_segments', foreignKey: 'user_id', otherKey: 'segment_id', as: 'segments' })
  }
  return User
}
