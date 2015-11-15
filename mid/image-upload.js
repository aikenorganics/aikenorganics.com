'use strict'

module.exports = function (name) {
  return (req, res) => {
    req[name].uploadImage(req.files.image[0]).then(() => {
      res.flash('Image Uploaded.')
      res.redirect(req.body.return_to)
    }).catch(res.error)
  }
}
