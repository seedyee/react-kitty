const emailList = ['seedyee@mail.com', 'vimniky@mail.com', 'jundo@mail.com']
const api = {
  login({ email }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (emailList.indexOf(email) === -1) {
          reject({ message: `${email} doesn't exist !` })
        } else {
          resolve({ email })
        }
      }, 300)
    })
  },
  logout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({})
      }, 300)
    })
  },
  register(payload) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (emailList.indexOf(payload.email) !== -1) {
          reject({ message: `${payload.email} already exist !` })
        } else {
          resolve(payload)
        }
      }, 300)
    })
  },
}

export default api

