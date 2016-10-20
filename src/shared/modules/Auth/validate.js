const validators = {
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
  // Minimum 8 characters at least 1 Alphabet and 1 Number:
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
}

const validate = ({ register } = { register: false }) => values => {
  const errors = {}
  const email = values.get('email')
  const password = values.get('password')
  const username = values.get('username')
  if (!email) {
    errors.email = 'Required'
  } else if (!validators.email.test(email)) {
    errors.email = 'Invalid email address'
  }

  if (!password) {
    errors.password = 'Required'
  } else if (!validators.password.test(password)) {
    errors.password = 'Minimum 8 characters at least 1 Alphabet and 1 Number'
  }

  if (register && !username) {
    errors.username = 'Required'
  }

  return errors
}

export default validate
