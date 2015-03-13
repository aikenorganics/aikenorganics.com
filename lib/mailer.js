var postmark = require('postmark')

if (process.env.POSTMARK_API_TOKEN) {
  module.exports = new postmark.Client(process.env.POSTMARK_API_TOKEN)

} else {
  module.exports = {
    sendEmail: function (options, next) {
      next()
    }
  }
}
