exports.up = function (migration, DataType, done) {
  migration.sequelize.query(`
    alter table products add column search tsvector;

    update products set
    search = to_tsvector('pg_catalog.english', coalesce(name, ''));

    create index product_search_index on products
    using gin(search);
  `).then(function () {
    done()
  })
}
