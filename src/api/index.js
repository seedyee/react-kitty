const emailList = ['seedyee@mail.com', 'vimniky@mail.com', 'jundo@mail.com']
const api = {
  login(payload) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (emailList.indexOf(payload.email) === -1) {
          reject({ error: true, message: 'User doesn\'t exist !' })
        } else {
          resolve({ error: false, message: 'logined !' })
        }
      }, 300)
    })
  },
  logout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ error: false, message: 'logouted !' })
      }, 300)
    })
  },
}

export default api

