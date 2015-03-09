"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('products', 'reserved', {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }).complete(done);
  }
};
