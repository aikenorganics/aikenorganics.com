"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('posts', 'title', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    }).complete(done);
  }
};
