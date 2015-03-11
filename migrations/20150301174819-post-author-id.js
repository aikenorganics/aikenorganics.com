module.exports = {
  up: function (migration, DataTypes, done) {
    migration.addColumn('posts', 'author_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: 'users',
      referencesKey: 'id'
    }).complete(done)
  }
}
