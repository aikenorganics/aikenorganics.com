var Sql = require('sequelize');

var sql = new Sql(process.env.DATABASE_URL, {
  omitNull: true
});

// User

var User = exports.User = sql.define('User', {
  id: {
    type: Sql.INTEGER,
    primaryKey: true
  },
  email: {
    type: Sql.STRING,
    allowNull: false
  },
  password: {
    type: Sql.STRING,
    allowNull: false
  }
}, {
  tableName: 'users',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  instanceMethods: {
    isAdmin: function() {
      return this.email === 'dunbarb2@gmail.com';
    }
  }
});

// Post

var Post = exports.Post = sql.define('Post', {
  id: {
    type: Sql.INTEGER,
    primaryKey: true
  },
  content: {
    type: Sql.TEXT,
    allowNull: false
  },
  author_id: {
    type: Sql.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'posts',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Relations

User.hasMany(Post, {
  as: 'Posts',
  foreignKey: 'author_id'
});

Post.belongsTo(User, {
  as: 'Author',
  foreignKey: 'author_id'
});
