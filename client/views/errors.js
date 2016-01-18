import React from 'react'

export default ({errors}) => {
  if (!errors) return <span></span>

  return <div className='alert alert-danger'>
    <p>
      <strong>Whoops!</strong> We had some trouble saving your data.
    </p>
    <ul>
      {Object.keys(errors).map((name) => {
        return errors[name].map((error) => <li>{error}</li>)
      })}
    </ul>
  </div>
}
