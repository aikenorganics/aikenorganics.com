module.exports = {
  up: function (migration, DataTypes, done) {
    migration.createTable('products', {
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
      }
    }).complete(done)
  }
}
