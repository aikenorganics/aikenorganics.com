"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable('product_orders', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: 'orders',
        referencesKey: 'id'
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: 'products',
        referencesKey: 'id'
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    }).complete(done);
  }
};
