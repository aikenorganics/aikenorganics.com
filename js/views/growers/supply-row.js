let React = require('react')
let json = require('../../json')
let message = require('../../message')

module.exports = class Supply extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      pending: false,
      supply: this.props.product.supply
    }
  }

  handleChange (e) {
    if (this.timer) clearTimeout(this.timer)
    this.timer = setTimeout(() => { this.save() }, 2000)
    this.setState({
      pending: true,
      supply: e.target.value
    })
  }

  handleBlur (e) {
    this.save()
  }

  handleKeyDown (e) {
    if (e.keyCode === 13) this.save()
  }

  save () {
    if (this.timer) clearTimeout(this.timer)
    if (!this.state.pending) return
    this.setState({pending: false})
    message('info', 'Saving…')
    json(`/products/${this.props.product.id}`, {
      method: 'POST',
      body: {supply: this.state.supply}
    }).then(() => {
      message('success', 'Saved.')
    })
  }

  render () {
    return <tr>
      <td>{this.props.product.name}</td>
      <td>
        <input className='form-control' type='number' value={this.state.supply}
          onChange={this.handleChange.bind(this)}
          onBlur={this.handleBlur.bind(this)}
          onKeyDown={this.handleKeyDown.bind(this)}
        />
      </td>
    </tr>
  }

}

