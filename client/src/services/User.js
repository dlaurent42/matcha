import Api from './Api'
import Token from './Token'
import { isEmpty } from '@/utils/obj/isEmpty'

export default {
  auth () {
    const token = Token.getToken()
    if (isEmpty(token)) return null
    else {
      const user = Token.decodeToken(token)
      Api().get('/auth/', { params: user })
        .then((response) => {
          if (!isEmpty(response.data.token)) localStorage.setItem('jwt', response.data.token)
          return response
        })
        .catch((err) => {
          console.dir(err)
          return null
        })
    }
  },
  login (user) {
    return Api().get('/user/authenticate', user)
      .then((response) => {
        if (!isEmpty(response.data.token)) localStorage.setItem('jwt', response.data.token)
        return response
      })
  },
  register (user) {
    const data = {'redirect_uri': 'http://localhost:8080/home'}
    Object.assign(user, data)
    return Api().post('/user/', user)
      .then((response) => {
        return response
      })
  },
  update (user) {
    return Api().put('/user/', user)
      .then((response) => {
        if (response.data.token !== 'undefined') localStorage.setItem('jwt', response.data.token)
        return response
      })
  },
  logout () {
    localStorage.removeItem('jwt')
    localStorage.removeItem('userId')
    // add a blacklist token here
  },
  like (send, receiver) {
    // Verify route
    return Api().post('/user/like', send, receiver)
      .then((response) => {
        return response
      })
  }
}
