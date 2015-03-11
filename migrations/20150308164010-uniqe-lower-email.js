module.exports = {
  up: function (migration, DataTypes, done) {
    migration.sequelize.query(
      'CREATE UNIQUE INDEX users_lower_case_email_index ON users ((lower(email)))'
    ).then(function () {
      done()
    })
  }
}
