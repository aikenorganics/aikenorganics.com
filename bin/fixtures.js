#!/usr/bin/env node

var bcrypt = require('bcrypt');
var Promise = require('sequelize').Promise;
var models = require('../models');

var User = models.User;
var Grower = models.Grower;
var Category = models.Category;

// password
var password = '$2a$12$2FHxoTbYsrn5/Hi4CFbc6.yB2TXaVx8u2p8EwQ2uhJ1Ghrxtzn0QW';

Promise.all([
  User.findOrCreate({
    where: {email: 'admin@example.com'},
    defaults: {
      is_admin: true,
      password: password
    }
  }),
  User.findOrCreate({
    where: {email: 'user@example.com'},
    defaults: {
      is_admin: false,
      password: password
    }
  }),
  Grower.findOrCreate({
    where: {name: 'Watsonia Farms'},
    defaults: {
      url: 'http://watsoniafarms.com/',
      email: 'wfsales@watsoniafarms.com',
      description: 'For four generations, from 1918 to the present, the Watson family has been bringing the best in fruit and produce to the people of South Carolina. And now, you can enjoy the same farm-fresh goodness in your own home.'
    }
  }),
  Category.findOrCreate({where: {name: 'Fruits & Veggies'}}),
  Category.findOrCreate({where: {name: 'Prepared Food'}}),
  Category.findOrCreate({where: {name: 'Herbs'}}),
  Category.findOrCreate({where: {name: 'Beauty'}}),
  Category.findOrCreate({where: {name: 'Dairy & Eggs'}}),
  Category.findOrCreate({where: {name: 'Meat'}})
]).then(function() {
  models.close();
});
