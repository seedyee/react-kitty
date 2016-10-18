import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Styles from './Nav.css'

class Nav extends React.Component {
  render() {
    return (
      <div className={Styles.Nav}>
        <ul>
          <li onClick={() => this.props.push('/')}>Home</li>
          <li onClick={() => this.props.push('/about')}>About</li>
          <li onClick={() => this.props.push('/login')}>Login</li>
          <li onClick={() => this.props.push('/register')}>Register</li>
          <li onClick={() => this.props.push('/dashboard')}>Dashboard</li>
        </ul>
      </div>
    )
  }
}

Nav.propTypes = {
  push: React.PropTypes.func,
}

export default connect(null, { push })(Nav)
