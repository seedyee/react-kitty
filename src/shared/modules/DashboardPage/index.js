import React from 'react'
import { connect } from 'react-redux'
import { selectUser } from '../Auth/selectors'

class DashboardPage extends React.Component {
  render() {
    return (
      <div>
        <h1>Protected Page !</h1>
        <h2>{this.props.user ? this.props.user.email : null}</h2>
        <p> Lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum, faucibus vitae aliquet nec, ullamcorper sit? Eget nunc scelerisque viverra mauris, in aliquam sem?
        </p>
        <p> Lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum, faucibus vitae aliquet nec, ullamcorper sit? Eget nunc scelerisque viverra mauris, in aliquam sem?
        </p>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: selectUser(state),
})
export default connect(mapStateToProps)(DashboardPage)
