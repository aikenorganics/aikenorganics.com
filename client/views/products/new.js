import React from 'react'
import Form from './form'

export default ({busy, categories, errors, grower}) => {
  const {name} = grower

  return <div>
    <h1>New Product</h1>
    <h4>{name}</h4>
    <Form busy={busy} categories={categories} errors={errors} grower={grower}/>
  </div>
}
