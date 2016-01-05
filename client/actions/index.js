import json from '../json'
import store from '../store'

// Action Constants
export const CHANGE_PATH = 'CHANGE_PATH'
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT'

// Dispatchers
export const changePath = (path, Component) => {
  store.dispatch({type: CHANGE_PATH, path, Component})
}

export const updateProduct = (id, values) => {
  store.dispatch({type: UPDATE_PRODUCT, id, values})
  return json(`/products/${id}`, {method: 'POST', body: values})
}
