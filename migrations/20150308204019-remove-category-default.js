"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.sequelize.query(
      'alter table products alter column category_id drop default'
    ).then(function(){
      done();
    });
  }
};
