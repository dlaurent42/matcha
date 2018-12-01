import Api from './Api'

export default {
  fetch () {
    return Api().get('user/credentials')
  }
}
