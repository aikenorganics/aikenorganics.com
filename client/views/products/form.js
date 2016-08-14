import React, {Component, PropTypes} from 'react'
import Errors from '../errors'
import {createProduct, navigate, updateProduct} from '../../actions/index'

export default class Form extends Component {

  static get propTypes () {
    return {
      busy: PropTypes.bool,
      currentUser: PropTypes.object,
      categories: PropTypes.array,
      errors: PropTypes.object,
      grower: PropTypes.object,
      product: PropTypes.object
    }
  }

  constructor (props) {
    super(props)

    const {
      category_id,
      cost,
      description,
      featured,
      name,
      supply,
      unit
    } = props.product || {}

    this.state = {
      category_id: category_id || props.categories[0].id,
      cost: cost || '',
      description: description || '',
      featured: featured || false,
      name: name || '',
      supply: supply || '',
      unit: unit || ''
    }
  }

  save (event) {
    event.preventDefault()
    if (this.props.product) {
      const {id} = this.props.product
      updateProduct(id, this.state).catch(() => {})
    } else {
      const {id} = this.props.grower
      createProduct(id, this.state).then(({product: {id}}) => {
        navigate(`/products/${id}`)
      }).catch(() => {})
    }
  }

  render () {
    const {busy, categories, currentUser: {is_admin}, errors} = this.props
    const {category_id, cost, description, featured, name, supply, unit} = this.state

    return <form onSubmit={(event) => this.save(event)}>
      <Errors errors={errors}/>
      <div className='form-group'>
        <label htmlFor='name'>Name</label>
        <input autoFocus type='text' id='name' className='form-control' required value={name} onChange={({target: {value}}) => this.setState({name: value})}/>
      </div>
      <div className='form-group'>
        <label htmlFor='cost'>Cost</label>
        <div className='input-group'>
          <span className='input-group-addon'>$</span>
          <input id='cost' className='form-control' required value={cost} onChange={({target: {value}}) => this.setState({cost: value})}/>
        </div>
      </div>
      <div className='form-group'>
        <label htmlFor='unit'>Unit</label>
        <input type='text' id='unit' className='form-control' required value={unit} onChange={({target: {value}}) => this.setState({unit: value})}/>
      </div>
      <div className='form-group'>
        <label htmlFor='supply'>Supply</label>
        <input type='number' id='supply' min='0' className='form-control' required value={supply} onChange={({target: {value}}) => this.setState({supply: value})}/>
      </div>
      <div className='form-group'>
        <label htmlFor='category_id'>Category</label>
        <select type='text' id='category_id' className='form-control' required value={category_id} onChange={({target: {value}}) => this.setState({category_id: value})}>
          {categories.map((category) => {
            return <option key={category.id} value={category.id}>
              {category.name}
            </option>
          })}
        </select>
      </div>
      <div className='form-group'>
        <label htmlFor='description'>Description</label>
        <textarea rows='5' id='description' className='form-control' value={description} onChange={({target: {value}}) => this.setState({description: value})}/>
      </div>
      {is_admin
        ? <div className='form-group'>
          <label>
            <input type='checkbox' checked={featured} onChange={({target: {checked}}) => this.setState({featured: checked})}/>
            <span> Featured</span>
          </label>
        </div>
        : null
      }
      <p className='text-right'>
        <button type='submit' className='btn btn-success' disabled={busy}>
          Save
        </button>
      </p>
    </form>
  }

}
