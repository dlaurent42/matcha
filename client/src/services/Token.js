import Api from '@/services/Api'
import { isEmpty } from '@/utils/obj/isEmpty'

export default {
  setToken (token) {
    if (!isEmpty(token)) localStorage.setItem('jwt', token)
  },
  getToken () {
    if (!isEmpty(localStorage.getItem('jwt'))) {
      return localStorage.getItem('jwt')
    }
    return null
  },
  createToken (data) {
    Api().post('/token', data)
      .then(
        success => { return success }
      )
    return null
  },
  destroyToken (token) {
    Api().del('/token/', token)
      .then(() => { return true })
    return false
  },
  decodeToken (token) {
    const param = {
      params: { 'token': token }
    }
    Api().get('/token/', param)
      .then(
        success => { return success },
        err => { return err }
      )
  }
}