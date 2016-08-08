import {GET, DELETE, POST} from '../json'
import store from '../store'

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
export const BUSY = 'BUSY'
export const DONE = 'DONE'
export const SET_ERRORS = 'SET_ERRORS'
export const REPLACE = 'REPLACE'
export const ADD_PAYMENT = 'ADD_PAYMENT'
export const SET_MESSAGE = 'SET_MESSAGE'
export const CLEAR_MESSAGE = 'CLEAR_MESSAGE'

// Busy

export const busy = (value) => {
  store.dispatch({type: BUSY})
  return value
}

export const done = (value) => {
  store.dispatch({type: DONE})
  if (value instanceof Error) throw value
  return value
}

// Errors

export const setErrors = (errors) => store.dispatch({type: SET_ERRORS, errors})

// Message

let messageTimer
export const setMessage = (type, text) => {
  clearTimeout(messageTimer)
  store.dispatch({type: SET_MESSAGE, message: {active: true, type, text}})
  messageTimer = setTimeout(clearMessage, 10000)
}

export const clearMessage = () => {
  clearTimeout(messageTimer)
  store.dispatch({type: CLEAR_MESSAGE})
}

// Navigate

export const navigate = (url, {push} = {}) => {
  busy()
  if (push !== false) window.history.pushState(null, document.title, url)
  return GET(url).then((state) => {
    // If the version has changed, reload the whole page.
    if (store.getState().version !== state.version) {
      window.location = url
      return
    }

    store.dispatch({type: REPLACE, state})
    window.scrollTo(0, 0)
    done()
  }).catch(done)
}

// Signin

export const signin = (values) => {
  busy()
  return POST('/auth/signin', {body: values}).then(done).catch(done)
}

export const forgot = (values) => {
  busy()
  return POST('/auth/forgot', {body: values}).then(done).catch(done)
}

export const reset = (token, values) => {
  busy()
  return POST(`/auth/reset/${token}`, {body: values}).then(done).catch(done)
}

// Signup

export const signup = (values) => {
  busy()
  return POST('/signup', {body: values}).then(done).catch(done)
}

// Market

export const updateMarket = (values) => {
  busy()
  return POST('/admin/market', {body: values}).then((values) => {
    store.dispatch({type: UPDATE_MARKET, values})
    done()
  }).catch(done)
}

// Cart

export const updateCart = (product_id, quantity) => {
  busy()
  return POST('/cart', {body: {product_id, quantity}}).then(() => {
    store.dispatch({type: UPDATE_CART, product_id, quantity})
    done()
  }).catch(done)
}

export const checkout = (values) => {
  busy()
  return POST('/cart/checkout', {body: values}).then(done).catch(done)
}

// UserGrowers

export const createUserGrower = (grower_id, user_id) => {
  busy()
  return POST('/admin/user-growers', {body: {grower_id, user_id}}).then((userGrower) => {
    store.dispatch({type: CREATE_USER_GROWER, userGrower})
    done()
  }).catch(done)
}

export const destroyUserGrower = (id) => {
  busy()
  return DELETE(`/admin/user-growers/${id}`).then(() => {
    store.dispatch({type: REMOVE_USER_GROWER, id})
    done()
  }).catch(done)
}

// Growers

export const createGrower = (values) => {
  busy()
  return POST('/growers', {body: values}).then(done).catch(done)
}

export const updateGrower = (id, values) => {
  busy()
  return POST(`/growers/${id}`, {body: values}).then(() => {
    store.dispatch({type: UPDATE_GROWER, id, values})
    done()
  }).catch(done)
}

export const imageGrower = (id, file) => {
  const data = new window.FormData()
  data.append('image', file)
  busy()
  return POST(`/growers/${id}/image`, {body: data}).then((values) => {
    store.dispatch({type: UPDATE_GROWER, id, values})
    done()
  }).catch(done)
}

// Orders

export const cancelOrder = (id) => {
  busy()
  return DELETE(`/orders/${id}`).then(() => {
    store.dispatch({type: CANCEL_ORDER, id})
    done()
  }).catch(done)
}

export const updateOrder = (id, values) => {
  busy()
  return POST(`/orders/${id}`, {body: values}).then((values) => {
    store.dispatch({type: UPDATE_ORDER, id, values})
    done()
  }).catch(done)
}

// Payments

export const createPayment = (id, amount) => {
  busy()
  return POST(`/admin/orders/${id}/charge`, {body: {amount}}).then((values) => {
    store.dispatch({type: ADD_PAYMENT, values})
  }).catch(done)
}

// Products

export const createProduct = (id, values) => {
  busy()
  return POST(`/growers/${id}/products`, {body: values}).then(done).catch(done)
}

export const updateProduct = (id, values) => {
  busy()
  return POST(`/products/${id}`, {body: values}).then(({product}) => {
    store.dispatch({type: UPDATE_PRODUCT, id, values: product})
    done()
  }).catch(done)
}

export const imageProduct = (id, file) => {
  const data = new window.FormData()
  data.append('image', file)
  busy()
  return POST(`/products/${id}/image`, {body: data}).then((values) => {
    store.dispatch({type: UPDATE_PRODUCT, id, values})
    done()
  }).catch(done)
}

// Product Orders

export const createProductOrder = (values) => {
  busy()
  return POST('/admin/product-orders', {body: values}).then((values) => {
    store.dispatch({type: ADD_PRODUCT_ORDER, values})
    done()
  }).catch(done)
}

export const updateProductOrder = (id, values) => {
  busy()
  return POST(`/admin/product-orders/${id}`, {body: values}).then((values) => {
    store.dispatch({type: UPDATE_PRODUCT_ORDER, id, values})
    done()
  }).catch(done)
}

export const destroyProductOrder = (id) => {
  busy()
  return DELETE(`/admin/product-orders/${id}`).then(() => {
    store.dispatch({type: REMOVE_PRODUCT_ORDER, id})
    done()
  }).catch(done)
}

// Categories

export const updateCategory = (id, values) => {
  busy()
  return POST(`/admin/categories/${id}`, {body: values}).then(() => {
    store.dispatch({type: UPDATE_CATEGORY, id, values})
    done()
  }).catch(done)
}

export const destroyCategory = (id) => {
  busy()
  return DELETE(`/admin/categories/${id}`).then(() => {
    store.dispatch({type: REMOVE_CATEGORY, id})
    done()
  }).catch(done)
}

export const createCategory = (values) => {
  busy()
  return POST('/admin/categories', {body: values}).then(done).catch(done)
}

// Locations

export const updateLocation = (id, values) => {
  busy()
  return POST(`/admin/locations/${id}`, {body: values}).then(() => {
    store.dispatch({type: UPDATE_LOCATION, id, values})
    done()
  }).catch(done)
}

export const destroyLocation = (id) => {
  busy()
  return DELETE(`/admin/locations/${id}`).then(() => {
    store.dispatch({type: REMOVE_LOCATION, id})
    done()
  }).catch(done)
}

export const createLocation = (values) => {
  busy()
  return POST('/admin/locations', {body: values}).then(done).catch(done)
}

// Settings

export const updateSettings = (values) => {
  busy()
  return POST('/settings', {body: values}).then((user) => {
    store.dispatch({type: UPDATE_USER, id: user.id, values})
    done()
  }).catch(done)
}

export const updateCard = (id, token) => {
  busy()
  return POST('/settings/card', {body: {token}}).then((values) => {
    store.dispatch({type: UPDATE_USER, id, values})
    done()
  }).catch(done)
}

// Users

export const createUser = (values) => {
  busy()
  return POST('/admin/users', {body: values}).then(done).catch(done)
}

export const updateUser = (id, values) => {
  busy()
  return POST(`/admin/users/${id}`, {body: values}).then(() => {
    store.dispatch({type: UPDATE_USER, id, values})
    done()
  }).catch(done)
}

export const destroyUser = (id) => {
  busy()
  return DELETE(`/admin/users/${id}`).then(done).catch(done)
}

export const imageUser = (id, file) => {
  const data = new window.FormData()
  data.append('image', file)
  busy()
  return POST(`/admin/users/${id}/image`, {body: data}).then((values) => {
    store.dispatch({type: UPDATE_USER, id, values})
    done()
  }).catch(done)
}
