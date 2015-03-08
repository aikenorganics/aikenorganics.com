"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('users', 'password', {
      type: DataTypes.STRING,
      allowNull: false
    }).complete(done);
  }
};