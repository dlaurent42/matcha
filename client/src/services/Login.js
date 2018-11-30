import Api from './Api'

export default {
  login (user) {
    return Api().post('user/authenticate', user)
  }
}
