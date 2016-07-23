'use strict'

const {html} = require('ozymandias/html')

exports.html = ({url}) => html`
<p>
  Hi! We’ve received your order and updated it accordingly. You can view or
  change it below.
</p>
<a href='${url}'>View Your Order</a>
`

exports.text = ({url}) => `
Hi! We’ve received your order and updated it accordingly. You can view or
change it below.

${url}
`
