'use strict'

const userGrowerJson = require('../user-growers/user-grower')

module.exports = (set, grower) => {
  set(grower,
    'id',
    'url',
    'name',
    'email',
    'active',
    'location',
    'image_updated_at',
    'image_ext',
    'smallImage',
    'mediumImage'
  )

  if (grower.userGrowers) {
    set('userGrowers', grower.userGrowers, userGrowerJson)
  }
}
