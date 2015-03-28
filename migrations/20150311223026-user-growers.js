exports.up = function (migration, DataTypes, done) {
  migration.createTable('user_growers', {
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
    },
    grower_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: 'growers',
      referencesKey: 'id'
    }
  }).complete(done)
}
