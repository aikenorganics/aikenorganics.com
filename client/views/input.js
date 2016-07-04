import React, {Component} from 'react'

export default class Input extends Component {

  constructor (props) {
    super(props)
    this.state = {
      pending: false,
      value: props.value || ''
    }
  }

  change (e) {
    const {timer} = this.state
    clearTimeout(timer)
    this.setState({
      pending: true,
      timer: setTimeout(() => this.button.click(), 2000),
      value: e.target.value
    })
  }

  submit (e) {
    e.preventDefault()

    const {onUpdate} = this.props
    const {pending, value, timer} = this.state

    clearTimeout(timer)
    if (!pending) return
    this.setState({pending: false})
    onUpdate(value)
  }

  render () {
    const {value} = this.state

    return <form onSubmit={(e) => this.submit(e)} style={{display: 'inline'}}>
      <input {...this.props} value={value}
        onBlur={(e) => this.button.click()}
        onChange={(e) => this.change(e)}
      />
      <button style={{display: 'none'}} ref={(button) => this.button = button}></button>
    </form>
  }
}
