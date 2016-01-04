
export default (state, action) => {
  const {type, Component} = action

  switch (type) {
    case 'NAVIGATE':
      return Object.assign({}, state, {Component})
    default:
      return state
  }
}
