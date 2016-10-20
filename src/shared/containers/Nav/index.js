import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Styles from './Nav.css'
import { logoutRequest } from '../Auth/actions'
import { selectLogined } from '../Auth/selectors'

class Nav extends React.Component {
  render() {
    return (
      <div className={Styles.Nav}>
        <ul>
          <li onClick={() => this.props.push('/')}>Home</li>
          <li onClick={() => this.props.push('/about')}>About</li>
          <li onClick={() => this.props.push('/dashboard')}>Dashboard</li>
          {this.props.logined ?
            <li onClick={() => this.props.logoutRequest()}>Logout</li> :
              <li onClick={() => this.props.push('/login')}>Login</li>}
        </ul>
      </div>
    )
  }
}

Nav.propTypes = {
  push: React.PropTypes.func,
  logoutRequest: React.PropTypes.func,
  logined: React.PropTypes.bool,
}

const mapStateToProps = (state) => ({
  logined: selectLogined(state),
})
export default connect(mapStateToProps, { push, logoutRequest })(Nav)

