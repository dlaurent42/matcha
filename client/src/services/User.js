import Api from './Api'
import { isEmpty } from '@/utils/obj/isEmpty'

export default {
  authLogic () {
    return new Promise((resolve, reject) => {
      this.auth()
        .then(success => {
          resolve(success)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  auth () {
    const token =
    {
      params: {
        client_id: 'A968DCBAE348712A843CB15423E49953D7A0883F0D74E6E18044773F07393D0D',
        client_secret: 'D1BE2ECDFDC4850CF5AEAE16A6F9481EB97FD6988CCF7A9195002BF577F292EA'
      }
    }
    return new Promise((resolve, reject) => {
      Api().get('/auth/', token)
        .then((response) => {
          if (!isEmpty(response.data.token)) sessionStorage.setItem('jwt', response.data.token)
          resolve(response)
        })
        .catch((err) => reject(err))
    })
  },
  getID () {
    return sessionStorage.getItem('userID')
  },
  get () {
    const userID = sessionStorage.getItem('userID')
    return new Promise((resolve, reject) => {
      if (isEmpty(userID)) reject(Error('No user id'))
      this.authLogic().then(() => {
        Api().get('/user/' + userID)
          .then(data => resolve(data))
          .catch(err => reject(err.response.data.err))
      })
    })
  },
  getUser (id) {
    return new Promise((resolve, reject) => {
      this.authLogic().then(() => {
        Api().get('/user/' + id)
          .then(data => resolve(data))
          .catch(err => reject(err.response.data.err))
      })
    })
  },
  getProfilePic (id) {
    return new Promise((resolve, reject) => {
      this.authLogic().then(() => {
        Api().get('/user/' + id)
          .then(data => {
            if (data.data.user.profilePic === null) reject(Error('No profile Picture'))
            const path = 'http://localhost:8081/assets/' + data.data.user.profilePic
            resolve(path)
          })
          .catch(err => reject(err))
      })
    })
  },
  getAll (filters, sort) {
    const userID = sessionStorage.getItem('userID')
    let param = { user_id: userID }
    Object.assign(param, filters, sort)
    return new Promise((resolve, reject) => {
      if (isEmpty(userID)) reject(Error('No user id'))
      this.authLogic().then(() => {
        Api().get('/user/all/', { params: param })
          .then(data => {
            resolve(data)
          })
          .catch(err => {
            console.dir(err)
            reject(err.response.data.err)
          })
      })
    })
  },
  getMatched () {
    const userID = sessionStorage.getItem('userID')
    let param = {
      user_id: userID,
      filters: {
        is_match: 1
      }
    }
    return new Promise((resolve, reject) => {
      if (isEmpty(userID)) reject(Error('No user id'))
      this.authLogic().then(() => {
        Api().get('/user/all/', { params: param })
          .then(data => {
            resolve(data)
          })
          .catch(err => {
            console.dir(err)
            reject(err.response.data.err)
          })
      })
    })
  },
  getConversation () {
    const userID = sessionStorage.getItem('userID')
    let param = { user_id: userID }
    return new Promise((resolve, reject) => {
      if (isEmpty(userID)) reject(Error('No user id'))
      this.authLogic().then(() => {
        Api().get('/chat/conversation', { params: param })
          .then(data => {
            resolve(data)
          })
          .catch(err => {
            console.dir(err)
            reject(err.response.data.err)
          })
      })
    })
  },
  getMessages (receiver) {
    const userID = sessionStorage.getItem('userID')
    let param = { emitter: userID, 'receiver': receiver }
    return new Promise((resolve, reject) => {
      if (isEmpty(userID)) reject(Error('No user id'))
      this.authLogic().then(() => {
        Api().get('/chat/message', { params: param })
          .then(data => {
            resolve(data)
          })
          .catch(err => {
            console.dir(err)
            reject(err.response.data.err)
          })
      })
    })
  },
  login (user) {
    return new Promise((resolve, reject) => {
      this.authLogic().then(success => {
        Api().get('/user/authenticate', user)
          .then(data => {
            resolve(data)
          })
          .catch(err => {
            console.dir(err)
            reject(err.response.data.err)
          })
      })
    })
  },
  register (user) {
    const data = {'redirect_uri': 'http://localhost:8080/confirm-account'}
    Object.assign(user, data)
    return new Promise((resolve, reject) => {
      this.authLogic().then(
        () => {
          Api().post('/user/', user)
            .then(success => {
              resolve(success)
            }, error => {
              reject(error)
            })
            .catch(err => {
              reject(err)
            })
        })
    })
  },
  confirmAccount (body) {
    return new Promise((resolve, reject) => {
      Api().put('/user/confirm-account', body)
        .then(success => {
          resolve(success)
        }, error => {
          reject(error)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  update (data) {
    const userID = sessionStorage.getItem('userID')
    return Api().put('/user/' + userID, data)
      .then((response) => {
        return response
      })
      .catch(err => {
        console.dir(err)
      })
  },
  addPicture (file) {
    const userID = sessionStorage.getItem('userID')
    let formData = new FormData()
    formData.append('user_id', userID)
    formData.append('picture', file)
    const config = { headers: { 'content-type': 'multipart/form-data' } }
    return Api().post('/picture/', formData, config)
      .then((response) => { return response })
      .catch(err => {
        console.dir(err)
      })
  },
  logout () {
    sessionStorage.removeItem('jwt')
  },
  getGender () {
    return new Promise((resolve, reject) => {
      this.authLogic().then(success => {
        Api().get('/user/genders')
          .then(data => {
            resolve(data)
          })
          .catch(err => {
            console.dir(err)
            reject(err.response.data.err)
          })
      })
    })
  },
  like (send, receiver) {
    const body = {'emitter': send, 'receiver': receiver}
    return Api().post('/notification/like', body)
      .then((response) => {
        return response
      })
      .catch((err) => {
        return err
      })
  },
  block (send, receiver) {
    const body = { 'emitter': send, 'receiver': receiver }
    return Api().post('/user/block', body)
      .then((response) => {
        return response
      })
      .catch((err) => {
        console.dir(err)
        return err
      })
  },
  sendMessageFull (message) {
    return new Promise((resolve, reject) => {
      Api().post('/chat/message', message)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          console.dir(err)
          reject(err)
        })
    })
  },
  profileSeen (receiver) {
    const emitter = sessionStorage.getItem('userID')
    const body = { 'emitter': emitter, 'receiver': receiver }
    return new Promise((resolve, reject) => {
      if (isEmpty(emitter)) reject(Error('No user id'))
      Api().post('/notification/profile', body)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          console.dir(err)
          reject(err)
        })
    })
  },
  sendMessage (receiver, content) {
    const emitter = sessionStorage.getItem('userID')
    const body = { 'emitter': emitter, 'receiver': receiver, 'message': content }
    return new Promise((resolve, reject) => {
      if (isEmpty(emitter)) reject(Error('No user id'))
      Api().post('/chat/message', body)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          console.dir(err)
          reject(err)
        })
    })
  },
  getNotifications () {
    const id = sessionStorage.getItem('userID')
    return new Promise((resolve, reject) => {
      if (isEmpty(id)) reject(Error('No user id'))
      Api().get('/notification/?user_id=' + id)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          console.dir(err)
          reject(err)
        })
    })
  },
  suppressNotification (id) {
    return new Promise((resolve, reject) => {
      Api().delete('/notification/' + id)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => { reject(err) })
    })
  }
}
