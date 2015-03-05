"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('growers', 'url', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    }).complete(done);
  }
};
