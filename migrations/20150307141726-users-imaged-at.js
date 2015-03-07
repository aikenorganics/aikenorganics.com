"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('users', 'imaged_at', {
      type: DataTypes.DATE
    }).complete(done);
  }
};
