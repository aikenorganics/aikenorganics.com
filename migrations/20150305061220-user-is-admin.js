"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('users', 'is_admin', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }).complete(done);
  }
};
