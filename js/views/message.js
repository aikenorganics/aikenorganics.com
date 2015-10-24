let React = require('react')

module.exports = class Message extends React.Component {

  alertClass () {
    switch (this.props.type) {
      case 'error': return 'danger'
      case 'info': return 'info'
      case 'success': return 'success'
      default: return ''
    }
  }

  render () {
    return <div className={`message ${this.props.active ? 'active' : ''}`}>
      <span className={`alert alert-${this.alertClass()}`}>
        {this.props.message}
      </span>
    </div>
  }

}
