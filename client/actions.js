import store from './store'
import {del, post} from 'ozymandias/client/json'
import {busy, done} from 'ozymandias/client/actions'
export * from 'ozymandias/client/actions'

// Action Constants
export const UPDATE_CART = 'UPDATE_CART'
export const UPDATE_GROWER = 'UPDATE_GROWER'
export const CREATE_USER_GROWER = 'CREATE_USER_GROWER'
export const REMOVE_USER_GROWER = 'REMOVE_USER_GROWER'
export const CREATE_CATEGORY = 'CREATE_CATEGORY'
export const REMOVE_CATEGORY = 'REMOVE_CATEGORY'
export const UPDATE_CATEGORY = 'UPDATE_CATEGORY'
export const CREATE_LOCATION = 'CREATE_LOCATION'
export const REMOVE_LOCATION = 'REMOVE_LOCATION'
export const UPDATE_LOCATION = 'UPDATE_LOCATION'
export const CANCEL_ORDER = 'CANCEL_ORDER'
export const UPDATE_ORDER = 'UPDATE_ORDER'
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT'
export const ADD_PRODUCT_ORDER = 'ADD_PRODUCT_ORDER'
export const REMOVE_PRODUCT_ORDER = 'REMOVE_PRODUCT_ORDER'
export const UPDATE_PRODUCT_ORDER = 'UPDATE_PRODUCT_ORDER'
export const UPDATE_USER = 'UPDATE_USER'
export const UPDATE_MARKET = 'UPDATE_MARKET'
export const ADD_PAYMENT = 'ADD_PAYMENT'

// Signin

export const signin = (values) => {
  busy()
  return post('/session', values).then(done).catch(done)
}

export const forgot = (values) => {
  busy()
  return post('/session/forgot', values).then(done).catch(done)
}

export const reset = (token, values) => {
  busy()
  return post(`/session/reset/${token}`, values).then(done).catch(done)
}

// Signup

export const signup = (values) => {
  busy()
  return post('/signup', values).then(done).catch(done)
}

// Signout

export const signout = () => {
  busy()
  return del('/session').then(done).catch(done)
}

// Market

export const updateMarket = (values) => {
  busy()
  return post('/admin/market', values).then(({market}) => {
    store.dispatch({type: UPDATE_MARKET, values: market})
    done()
  }).catch(done)
}

// Cart

export const updateCart = (productId, quantity) => {
  busy()
  return post('/cart', {productId, quantity}).then(() => {
    store.dispatch({type: UPDATE_CART, productId, quantity})
    done()
  }).catch(done)
}

export const checkout = (values) => {
  busy()
  return post('/cart/checkout', values).then(done).catch(done)
}

// UserGrowers

export const createUserGrower = (growerId, userId) => {
  busy()
  return post('/admin/user-growers', {growerId, userId}).then(({userGrower}) => {
    store.dispatch({type: CREATE_USER_GROWER, userGrower})
    done()
  }).catch(done)
}

export const destroyUserGrower = (id) => {
  busy()
  return del(`/admin/user-growers/${id}`).then(() => {
    store.dispatch({type: REMOVE_USER_GROWER, id})
    done()
  }).catch(done)
}

// Growers

export const createGrower = (values) => {
  busy()
  return post('/growers', values).then(done).catch(done)
}

export const updateGrower = (id, values) => {
  busy()
  return post(`/growers/${id}`, values).then(() => {
    store.dispatch({type: UPDATE_GROWER, id, values})
    done()
  }).catch(done)
}

export const imageGrower = (id, file) => {
  const data = new window.FormData()
  data.append('image', file)
  busy()
  return post(`/growers/${id}/image`, data).then(({grower}) => {
    store.dispatch({type: UPDATE_GROWER, id, values: grower})
    done()
  }).catch(done)
}

// Orders

export const cancelOrder = (id) => {
  busy()
  return del(`/orders/${id}`).then(() => {
    store.dispatch({type: CANCEL_ORDER, id})
    done()
  }).catch(done)
}

export const updateOrder = (id, values) => {
  busy()
  return post(`/orders/${id}`, values).then(({order}) => {
    store.dispatch({type: UPDATE_ORDER, id, values: order})
    done()
  }).catch(done)
}

// Payments

export const createPayment = (id, amount) => {
  busy()
  return post(`/admin/orders/${id}/charge`, {amount}).then(({payment}) => {
    store.dispatch({type: ADD_PAYMENT, values: payment})
  }).catch(done)
}

// Products

export const createProduct = (id, values) => {
  busy()
  return post(`/growers/${id}/products`, values).then(done).catch(done)
}

export const updateProduct = (id, values) => {
  busy()
  return post(`/products/${id}`, values).then(({product}) => {
    store.dispatch({type: UPDATE_PRODUCT, id, values: product})
    done()
  }).catch(done)
}

export const imageProduct = (id, file) => {
  const data = new window.FormData()
  data.append('image', file)
  busy()
  return post(`/products/${id}/image`, data).then(({product}) => {
    store.dispatch({type: UPDATE_PRODUCT, id, values: product})
    done()
  }).catch(done)
}

// Product Orders

export const createProductOrder = (values) => {
  busy()
  return post('/admin/product-orders', values).then(({productOrder}) => {
    store.dispatch({type: ADD_PRODUCT_ORDER, values: productOrder})
    done()
  }).catch(done)
}

export const updateProductOrder = (id, values) => {
  busy()
  return post(`/admin/product-orders/${id}`, values).then(({productOrder}) => {
    store.dispatch({type: UPDATE_PRODUCT_ORDER, id, values: productOrder})
    done()
  }).catch(done)
}

export const destroyProductOrder = (id) => {
  busy()
  return del(`/admin/product-orders/${id}`).then(() => {
    store.dispatch({type: REMOVE_PRODUCT_ORDER, id})
    done()
  }).catch(done)
}

// Categories

export const updateCategory = (id, values) => {
  busy()
  return post(`/admin/categories/${id}`, values).then(({category}) => {
    store.dispatch({type: UPDATE_CATEGORY, id, values: category})
    done()
  }).catch(done)
}

export const destroyCategory = (id) => {
  busy()
  return del(`/admin/categories/${id}`).then(() => {
    store.dispatch({type: REMOVE_CATEGORY, id})
    done()
  }).catch(done)
}

export const createCategory = (values) => {
  busy()
  return post('/admin/categories', values).then(done).catch(done)
}

// Locations

export const updateLocation = (id, values) => {
  busy()
  return post(`/admin/locations/${id}`, values).then(() => {
    store.dispatch({type: UPDATE_LOCATION, id, values})
    done()
  }).catch(done)
}

export const destroyLocation = (id) => {
  busy()
  return del(`/admin/locations/${id}`).then(() => {
    store.dispatch({type: REMOVE_LOCATION, id})
    done()
  }).catch(done)
}

export const createLocation = (values) => {
  busy()
  return post('/admin/locations', values).then(done).catch(done)
}

// Settings

export const updateSettings = (values) => {
  busy()
  return post('/settings', values).then(({user}) => {
    store.dispatch({type: UPDATE_USER, id: user.id, values: user})
    done()
  }).catch(done)
}

export const updateCard = (id, token) => {
  busy()
  return post('/settings/card', {token}).then(({user}) => {
    store.dispatch({type: UPDATE_USER, id, values: user})
    done()
  }).catch(done)
}

// Users

export const createUser = (values) => {
  busy()
  return post('/admin/users', values).then(done).catch(done)
}

export const updateUser = (id, values) => {
  busy()
  return post(`/admin/users/${id}`, values).then(({user}) => {
    store.dispatch({type: UPDATE_USER, id, values: user})
    done()
  }).catch(done)
}

export const destroyUser = (id) => {
  busy()
  return del(`/admin/users/${id}`).then(done).catch(done)
}

export const imageUser = (id, file) => {
  const data = new window.FormData()
  data.append('image', file)
  busy()
  return post(`/admin/users/${id}/image`, data).then(({user}) => {
    store.dispatch({type: UPDATE_USER, id, values: user})
    done()
  }).catch(done)
}
