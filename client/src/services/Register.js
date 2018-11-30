import Api from './Api'

export default {
  register (user) {
    return Api().post('user/add', user)
  }
}
