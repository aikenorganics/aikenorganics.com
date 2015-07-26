var aws = require('aws-sdk')
var ses = new aws.SES({
  apiVersion: '2010-12-01',
  region: 'us-east-1'
})

module.exports = function (options, next) {
  if (!process.env.AWS_ACCESS_KEY_ID) return next()
  if (!process.env.AWS_SECRET_ACCESS_KEY) return next()
  ses.sendEmail({
    Destination: {
      ToAddresses: [options.to],
      CcAddresses: [],
      BccAddresses: []
    },
    Message: {
      Subject: {
        Data: options.subject,
        Charset: 'utf-8'
      },
      Body: {
        Html: {
          Data: options.body,
          Charset: 'utf-8'
        },
        Text: {
          Data: options.body,
          Charset: 'utf-8'
        }
      }
    },
    Source: 'Aiken Organics <support@aikenorganics.com>'
  }, next)
}
