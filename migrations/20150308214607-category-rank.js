"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('categories', 'position', {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    }).complete(done);
  }
};
