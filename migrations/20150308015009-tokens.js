exports.up = function (migration, DataTypes, done) {
  migration.createTable('tokens', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    expires_at: {
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
