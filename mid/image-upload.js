var gm = require('gm');
var async = require('async');
var mkdirp = require('mkdirp');

module.exports = function(name) {
  return function(req, res) {
    var model = req[name];
    var file = req.files.image[0];
    var tableName = model.Model.tableName;

    var dir = './public/assets/' + tableName + '/' + model.id;

    mkdirp(dir, function(e) {
      if (e) {
        console.log(e);
        return res.status(500).render('500');
      }
      async.parallel([
        resize({size: 100, name: 'small'}),
        resize({size: 250, name: 'medium'})
      ], function(e) {
        if (e) {
          console.log(e);
          return res.status(500).render('500');
        }
        model.updateAttributes({
          imaged_at: new Date
        }, ['imaged_at']).then(function() {
          res.flash('success', 'Image uploaded.');
          res.redirect(req.body.return_to);
        });
      });
    });

    function resize(options) {
      return function(next) {
        gm(file.path)
        .options({imageMagick: true})
        .resize(options.size, options.size)
        .noProfile()
        .write(dir + '/' + options.name + '.jpg', next);
      };
    }
  };
};
