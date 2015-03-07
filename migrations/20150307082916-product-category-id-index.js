"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addIndex('products', ['category_id'], {
      indexName: 'products_category_id_index'
    }).complete(done);
  }
};
