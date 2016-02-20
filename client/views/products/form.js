import React, {Component, PropTypes} from 'react'
import Errors from '../errors'
import {createProduct, updateProduct} from '../../actions'

export default class Form extends Component {

  static get propTypes () {
    return {
      busy: PropTypes.bool,
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
      name,
      supply,
      unit
    } = props.product || {}
    this.state = {
      category_id: category_id || props.categories[0].id,
      cost: cost || '',
      description: description || '',
      name: name || '',
      supply: supply || '',
      unit: unit || ''
    }
  }

  save (e) {
    e.preventDefault()
    if (this.props.product) {
      const {id} = this.props.product
      updateProduct(id, this.state).catch((e) => {})
    } else {
      const {id} = this.props.grower
      createProduct(id, this.state).then(({id}) => {
        window.location = `/products/${id}`
      }).catch((e) => {})
    }
  }

  render () {
    const {busy, categories, errors} = this.props
    const {category_id, cost, description, name, supply, unit} = this.state

    return <form onSubmit={(e) => this.save(e)}>
      <Errors errors={errors}/>
      <div className='form-group'>
        <label htmlFor='name'>Name</label>
        <input autoFocus type='text' id='name' className='form-control' required value={name} onChange={(e) => this.setState({name: e.target.value})}/>
      </div>
      <div className='form-group'>
        <label htmlFor='cost'>Cost</label>
        <div className='input-group'>
          <span className='input-group-addon'>$</span>
          <input type='text' id='cost' className='form-control' required value={cost} onChange={(e) => this.setState({cost: e.target.value})}/>
        </div>
      </div>
      <div className='form-group'>
        <label htmlFor='unit'>Unit</label>
        <input type='text' id='unit' className='form-control' required value={unit} onChange={(e) => this.setState({unit: e.target.value})}/>
      </div>
      <div className='form-group'>
        <label htmlFor='supply'>Supply</label>
        <input type='text' id='supply' className='form-control' required value={supply} onChange={(e) => this.setState({supply: e.target.value})}/>
      </div>
      <div className='form-group'>
        <label htmlFor='category_id'>Category</label>
        <select type='text' id='category_id' className='form-control' required value={category_id} onChange={(e) => this.setState({category_id: e.target.value})}>
          {categories.map((category) => {
            return <option key={category.id} value={category.id}>
              {category.name}
            </option>
          })}
        </select>
      </div>
      <div className='form-group'>
        <label htmlFor='description'>Description</label>
        <textarea rows='5' id='description' className='form-control' value={description} onChange={(e) => this.setState({description: e.target.value})}/>
      </div>
      <p className='text-right'>
        <button type='submit' className='btn btn-primary' disabled={busy}>
          Save
        </button>
      </p>
    </form>
  }

}
