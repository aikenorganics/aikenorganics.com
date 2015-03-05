"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('products', 'grower_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: 'growers',
      referencesKey: 'id'
    }).complete(done);
  }
};
