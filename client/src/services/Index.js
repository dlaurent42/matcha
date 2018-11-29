import Api from '@/services/Api'

export default {
  fetch () {
    return Api().get('user/count')
  }
}
