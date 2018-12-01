import Api from './Api'

export default {
  isLogged () {
    return Api().get('user/credentials')
      .then((response) => {
        if (response.data.token !== 'undefined') {
          localStorage.setItem('jwt', response.data.token)
        }
        return response
      })
  },
  count () {
    return Api().get('user/count')
  },
  login (user) {
    return Api().post('user/authenticate', user)
      .then((response) => {
        console.log('return from login with response = ', response)
        if (response.data.token !== 'undefined') {
          console.log('login: add token to localstorage')
          localStorage.setItem('jwt', response.data.token)
        }
        return response
      })
  },
  register (user) {
    return Api().post('user/add', user)
      .then((response) => {
        console.log('return from register with response = ', response)
        if (response.data.token !== 'undefined') {
          localStorage.setItem('jwt', response.data.token)
        }
        return response
      })
  },
  logout () {
    return Api().post('/user/logout')
      .then((response) => {
        console.log('return from logout with response = ', response)
        if (response.data.token !== 'undefined') {
          localStorage.removeItem('jwt')
        }
        return response
      })
  }
}
