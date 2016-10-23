import React from 'react'
import { connect } from 'react-redux'
import Styles from './Nav.css'
import { logoutActions } from '../Auth/actions'
import { selectLogined } from '../Auth/selectors'
import { Link } from 'react-router'

const Nav = ({ logoutRequest, logined }) => (
  <div className={Styles.Nav}>
    <ul style={{ marginTop: '1rem' }}>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/about">About</Link></li>
      <li><Link to="/dashboard">Dashboard</Link></li>
      {logined ? <li onClick={() => logoutRequest()}>Logout</li> : <li><Link to="/login">login</Link></li>}
    </ul>
  </div>
)

Nav.propTypes = {
  logoutRequest: React.PropTypes.func,
  logined: React.PropTypes.bool,
}

const mapStateToProps = (state) => ({
  logined: selectLogined(state),
})

export default connect(mapStateToProps, { logoutRequest: logoutActions.request })(Nav)

