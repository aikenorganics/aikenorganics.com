module.exports = {
  up: function (migration, DataTypes, done) {
    migration.createTable('orders', {
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
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: 'users',
        referencesKey: 'id'
      }
    }).complete(done)
  }
}
