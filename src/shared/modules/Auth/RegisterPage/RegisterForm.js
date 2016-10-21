import React, { Component, PropTypes } from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import validate from '../validate'
import { registerActions } from '../actions'
import { onSubmitActions } from '../../../utils/reduxFormSubmitSaga'
import Styles from './register.css'

const renderField = ({ input, label, id, type, meta: { touched, error, warning } }) => (
  <div className={Styles.field}>
    <label htmlFor={id}> {label} </label>
    <input {...input} id={id} type={type} />
    <div className={Styles.error}>
      {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  </div>
)

class RegisterForm extends Component {
  render() {
    const { handleSubmit, submitting, pristine, pushRoute } = this.props
    return (
      <form onSubmit={handleSubmit} className={Styles.RegisterForm}>
        <h1> Sigin up </h1>
        <Field
          name="email"
          type="email"
          id="email"
          component={renderField}
          label="Email (phone for mobile accounts)"
        />
        <Field
          name="username"
          type="text"
          id="username"
          component={renderField}
          label="Username"
        />
        <Field
          name="password"
          id="password"
          component={renderField}
          label="Password"
          type="password"
        />
        <button className={Styles.submitBtn} type="submit" disabled={pristine || submitting}>Sigin up</button>
        <p className={Styles.signIn}>
          Already have an account?
          <button type="button" disabled={submitting} onClick={() => pushRoute('/login')}>Sign in</button>
        </p>
      </form>
    )
  }
}

RegisterForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
}

const comp = reduxForm({
  form: 'RegisterForm', // a unique name for this form
  validate: validate({ register: true }),
  onSubmit: onSubmitActions(registerActions),
})(RegisterForm)

const mapStateToProps = (state) => ({ // eslint-disable-line no-unused-vars
})

export default connect(mapStateToProps, { pushRoute: push })(comp)

