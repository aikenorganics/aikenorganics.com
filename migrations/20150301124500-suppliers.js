"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable('suppliers', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }).complete(done);
  }
};
