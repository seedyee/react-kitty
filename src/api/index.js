const emailList = ['seedyee@mail.com', 'vimniky@mail.com', 'jundo@mail.com']
const api = {
  login(data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (emailList.indexOf(data.email) === -1) {
          reject({ error: true, message: 'User doesn\'t exist !' })
        } else {
          resolve({ error: false, message: 'logined !' })
        }
      }, 300)
    })
  },
}

export default api

