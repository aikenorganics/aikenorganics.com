import React, {PureComponent} from 'react'

export default class Form extends PureComponent {

  focus ({target: {value}}) {
    this.value = value
  }

  blur ({target: {value}}) {
    this.value = value
    this.button.click()
  }

  change (event) {
    this.pending = true
    clearTimeout(this.timer)
    this.timer = setTimeout(() => this.button.click(), 2000)
    this.value = event.target.value
  }

  submit (event) {
    event.preventDefault()
    clearTimeout(this.timer)
    if (!this.pending) return
    this.pending = false
    this.props.onUpdate(this.value)
  }

  render () {
    return <form style={{display: 'inline'}}
      onSubmit={(event) => this.submit(event)}
      onChange={(event) => this.change(event)}
      onBlur={(event) => this.blur(event)}
      onFocus={(event) => this.focus(event)}>
      {this.props.children}
      <button style={{display: 'none'}} ref={(button) => { this.button = button }} />
    </form>
  }

}
