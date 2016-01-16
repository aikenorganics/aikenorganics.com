import json from '../json'
import store from '../store'

// Action Constants
export const UPDATE_CART = 'UPDATE_CART'
export const CREATE_LOCATION = 'CREATE_LOCATION'
export const REMOVE_LOCATION = 'REMOVE_LOCATION'
export const UPDATE_LOCATION = 'UPDATE_LOCATION'
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT'

// Cart

export const updateCart = (product_id, quantity) => {
  return json(`/cart`, {method: 'POST', body: {product_id, quantity}}).then(() => {
    store.dispatch({type: UPDATE_CART, product_id, quantity})
  })
}

// Products

export const updateProduct = (id, values) => {
  store.dispatch({type: UPDATE_PRODUCT, id, values})
  return json(`/products/${id}`, {method: 'POST', body: values})
}

// Locations

export const updateLocation = (id, values) => {
  store.dispatch({type: UPDATE_LOCATION, id, values})
  return json(`/admin/locations/${id}`, {method: 'POST', body: values})
}

export const removeLocation = (id) => {
  store.dispatch({type: REMOVE_LOCATION, id})
  return json(`/admin/locations/${id}/delete`, {method: 'POST'})
}

export const createLocation = (values) => {
  return json(`/admin/locations`, {method: 'POST', body: values})
}
