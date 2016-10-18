import React, { Component, PropTypes } from 'react'
import { Field, reduxForm } from 'redux-form'

class LoginForm extends Component {
  render() {
    const { handleSubmit } = this.props
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label><br />
          <Field name="email" component="input" type="email" />
        </div>
        <div>
          <label htmlFor="password">Password</label><br />
          <Field name="password" component="input" type="password" />
        </div>
        <div>
          <label htmlFor="password1">Confirm your password</label><br />
          <Field name="password1" component="input" type="password" />
        </div>
        <button type="submit">Submit< /button>
      < /form>
    )
  }
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
}

export default reduxForm({
  form: 'LoginForm', // a unique name for this form
})(LoginForm)
