let React = require('react')
let SubNav = require('../subnav')
let Row = require('./supply-row')

module.exports = class Supply extends React.Component {

  render () {
    return <main className='container'>
      <SubNav {...this.props}/>
      <div className='row'>
        <div className='col-md-2 text-center'>
          <ul className='nav nav-pills nav-stacked hidden-print'>
            <li>
              <a href={`/growers/${this.props.grower.id}`}>
                Info
              </a>
            </li>
            <li>
              <a href={`/growers/${this.props.grower.id}/edit`}>
                Edit
              </a>
            </li>
            <li>
              <a href={`/growers/${this.props.grower.id}/orders`}>
                Orders
              </a>
            </li>
            <li className='active'>
              <a href={`/growers/${this.props.grower.id}/supply`}>
                Supply
              </a>
            </li>
          </ul>
        </div>
        <div className='col-md-10'>
          <h1>{this.props.grower.name}</h1>
          <h2>Supply</h2>
          <hr/>
          <table className='table'>
            <thead>
              <tr>
                <th>Product</th>
                <th>Supply</th>
              </tr>
            </thead>
            <tbody>
              {this.props.products.map((product) => {
                return <Row product={product} key={product.id}/>
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  }

}