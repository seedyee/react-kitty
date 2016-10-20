import React, { Component, PropTypes } from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import { connect } from 'react-redux'
import validate from '../validate'
import { loginActionTypes } from '../actions'
import { onSubmitActions } from '../../../utils/reduxFormSubmitSaga'
import Styles from './LoginForm.css'

const renderField = ({ input, label, labelFor, forgetPassword, id, type, meta: { touched, error, warning } }) => (
  <div className={Styles.field}>
    <div className={Styles.labelContainer}>
      <label htmlFor={labelFor}> {label} </label>
      {forgetPassword ? <span className={Styles.forgetPassword}>{forgetPassword}</span> : null}
    </div>
    <input {...input} id={id} type={type} />
    <div className={Styles.error}>
      {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  </div>
)

class LoginForm extends Component {
  render() {
    const { handleSubmit, submitting, pristine } = this.props
    return (
      <form onSubmit={handleSubmit} className={Styles.LoginForm}>
        <h1> Sigin in </h1>
        <Field
          name="email"
          labelFor="email"
          id="email"
          component={renderField}
          label="Email (phone for mobile accounts)"
          type="email"
        />
        <Field
          name="password"
          id="password"
          labelFor="password"
          component={renderField}
          label="Password"
          type="password"
          forgetPassword="Forget your password ?"
        />
        <button className={Styles.submitBtn} type="submit" disabled={pristine || submitting}>Submit</button>
        <button className={Styles.signUp} type="button" disabled={submitting}>Sign up</button>
      </form>
    )
  }
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
}

const comp = reduxForm({
  form: 'LoginForm', // a unique name for this form
  validate,
  onSubmit: onSubmitActions(loginActionTypes),
})(LoginForm)
const initialValues = {
  email: 'seedyee@mail.com',
}

export default connect(() => ({
  initialValues,
}))(comp)
