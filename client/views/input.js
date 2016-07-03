import React, {Component} from 'react'

export default class Input extends Component {

  constructor (props) {
    super(props)
    this.state = {
      pending: false,
      value: props.value || 0
    }
  }

  change (e) {
    const {timer} = this.state
    clearTimeout(timer)
    this.setState({
      pending: true,
      timer: setTimeout(() => this.update(), 2000),
      value: e.target.value
    })
  }

  update () {
    const {onUpdate} = this.props
    const {pending, value, timer} = this.state

    clearTimeout(timer)
    if (!pending) return
    this.setState({pending: false})
    onUpdate(value)
  }

  render () {
    const {value} = this.state

    return <input {...this.props} value={value}
      onBlur={(e) => this.update()}
      onChange={(e) => this.change(e)}
      onKeyDown={(e) => { if (e.which === 13) this.update() }}
    />
  }
}
