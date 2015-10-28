let page = require('page')

page((c, next) => {

  // Get some JSON data from a script tag.
  c.data = (id) => {
    let el = document.getElementById(id)
    return el ? JSON.parse(el.innerHTML) : null
  }

  c.user = c.data('user')
  c.market = c.data('market')

  next()
})

page('/growers/:id/orders', (c) => {
})

page({
  click: false,
  popstate: false
})
