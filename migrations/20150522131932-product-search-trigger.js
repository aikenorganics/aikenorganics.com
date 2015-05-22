exports.up = function (migration, DataTypes, done) {
  migration.sequelize.query(`
    create trigger update_product_search
    before insert or update on products
    for each row execute procedure
    tsvector_update_trigger(search, 'pg_catalog.english', name);
  `).then(function () {
    done()
  })
}
