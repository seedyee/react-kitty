import React, { Component, PropTypes } from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import { connect } from 'react-redux'
import validate from './validate'
import { loginActionTypes } from './actions'
import { onSubmitActions } from '../../utils/reduxFormSubmitSaga'

const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
  <div>
    <div>
      <input {...input} placeholder={label} type={type} />
      {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  </div>
)

class LoginForm extends Component {
  render() {
    const { handleSubmit, reset, submitting, pristine } = this.props
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label><br />
          <Field name="email" component={renderField} type="email" />
        </div>
        <div>
          <label htmlFor="password">Password</label><br />
          <Field name="password" component={renderField} type="password" />
        </div>
        <button type="reset" onClick={reset} disabled={pristine || submitting} >Reset</button>
        <button type="submit" disabled={pristine || submitting} >Submit</button>
      </form>
    )
  }
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
}

const comp = reduxForm({
  form: 'LoginForm', // a unique name for this form
  validate,
  onSubmit: onSubmitActions(loginActionTypes),
})(LoginForm)
const initialValues = {
  email: 'vimniky@mail.com',
}

export default connect(() => ({
  initialValues,
}))(comp)
