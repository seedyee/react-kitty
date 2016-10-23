import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

class DashboardPage extends React.Component {
  render() {
    const { logined, user: { email } } = this.props
    if (!logined) {
      return (
        <div>
          <h1> Protected page! Please login first . </h1>
          <Link to="/login"> Login </Link>
        </div>
      )
    }
    return (
      <div>
        <h2>Hi ! {email || null}</h2>
        <p> Lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum, faucibus vitae aliquet nec, ullamcorper sit? Eget nunc scelerisque viverra mauris, in aliquam sem?
        </p>
        <p> Lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum, faucibus vitae aliquet nec, ullamcorper sit? Eget nunc scelerisque viverra mauris, in aliquam sem?
        </p>
      </div>
    )
  }
}

import { selectUser, selectLogined } from '../Auth/selectors'

const mapStateToProps = (state) => ({
  user: selectUser(state),
  logined: selectLogined(state),
})

export default connect(mapStateToProps)(DashboardPage)
