import React from 'react'
import LoginForm from './LoginForm'
import Styles from './LoginPage.css'

class LoginPage extends React.Component {
  render() {
    return (
      <div className={Styles.LoginPage}>
        <LoginForm />
      </div>
    )
  }
}

export default LoginPage
