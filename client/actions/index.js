import {_delete, post} from '../json'
import store from '../store'

// Action Constants
export const UPDATE_CART = 'UPDATE_CART'
export const CREATE_LOCATION = 'CREATE_LOCATION'
export const REMOVE_LOCATION = 'REMOVE_LOCATION'
export const UPDATE_LOCATION = 'UPDATE_LOCATION'
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT'
export const UPDATE_USER = 'UPDATE_USER'
export const BUSY = 'BUSY'
export const DONE = 'DONE'

// Busy

export const busy = () => store.dispatch({type: BUSY})
export const done = () => store.dispatch({type: DONE})

// Cart

export const updateCart = (product_id, quantity) => {
  busy()
  return post(`/cart`, {body: {product_id, quantity}}).then(() => {
    store.dispatch({type: UPDATE_CART, product_id, quantity})
    done()
  })
}

// Products

export const updateProduct = (id, values) => {
  busy()
  return post(`/products/${id}`, {body: values}).then(() => {
    store.dispatch({type: UPDATE_PRODUCT, id, values})
    done()
  })
}

// Locations

export const updateLocation = (id, values) => {
  busy()
  return post(`/admin/locations/${id}`, {body: values}).then(() => {
    store.dispatch({type: UPDATE_LOCATION, id, values})
    done()
  })
}

export const destroyLocation = (id) => {
  busy()
  return _delete(`/admin/locations/${id}`).then(() => {
    store.dispatch({type: REMOVE_LOCATION, id})
    done()
  })
}

export const createLocation = (values) => {
  busy()
  return post(`/admin/locations`, {body: values}).then(done)
}

// Users

export const updateUser = (id, values) => {
  busy()
  return post(`/admin/users/${id}`, {body: values}).then(() => {
    store.dispatch({type: UPDATE_USER, id, values})
    done()
  })
}

export const destroyUser = (id) => {
  busy()
  return _delete(`/admin/users/${id}`).then(done)
}

export const uploadImage = (id, file) => {
  const data = new window.FormData()
  data.append('image', file)
  busy()
  return post(`/admin/users/${id}/image`, {body: data}).then((values) => {
    store.dispatch({type: UPDATE_USER, id, values})
    done()
  })
}
