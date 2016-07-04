import React, {Component} from 'react'

export default class Form extends Component {

  focus ({target: {value}}) {
    this.value = value
  }

  blur ({target: {value}}) {
    this.value = value
    this.button.click()
  }

  change (e) {
    this.pending = true
    clearTimeout(this.timer)
    this.timer = setTimeout(() => this.button.click(), 2000)
    this.value = e.target.value
  }

  submit (e) {
    e.preventDefault()
    clearTimeout(this.timer)
    if (!this.pending) return
    this.pending = false
    this.props.onUpdate(this.value)
  }

  render () {
    return <form style={{display: 'inline'}}
      onSubmit={(e) => this.submit(e)}
      onChange={(e) => this.change(e)}
      onBlur={(e) => this.blur(e)}
      onFocus={(e) => this.focus(e)}>
      {this.props.children}
      <button style={{display: 'none'}} ref={(button) => { this.button = button }}>
      </button>
    </form>
  }

}
