'use strict'

module.exports = require('./db').define({

  tableName: 'locations',

  columns: [
    {name: 'id'},
    {name: 'name'},
    {name: 'created_at', property: 'createdAt'},
    {name: 'updated_at', property: 'updatedAt'}
  ],

  get name () {
    return this.data.get('name') || ''
  },

  set name (value) {
    this.data.set('name', value || '')
  }

})
