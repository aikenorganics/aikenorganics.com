import React, {Component, PropTypes} from 'react'
import {uploadImage} from '../../../actions'

export default class Image extends Component {

  static get propTypes () {
    return {
      user: PropTypes.object
    }
  }

  constructor (props) {
    super(props)
    this.state = {working: false}
  }

  upload (e) {
    const {id} = this.props.user
    this.setState({working: true})
    const done = () => {
      this.setState({working: false})
      e.target.value = ''
    }
    uploadImage(id, e.target.files[0]).then(done, done)
  }

  render () {
    const {working} = this.state
    const {mediumImage} = this.props.user

    return <div>
      <div className='form-group text-center'>
        <img className='img-rounded' src={mediumImage}/>
      </div>
      <div className='form-group'>
        <input type='file' name='image' className='form-control' onChange={(e) => this.upload(e)} disabled={working}/>
      </div>
    </div>
  }

}
