import Api from './Api'
import axios from 'axios'
import token from '@/services/Token' //eslint-disable-line
import { isEmpty } from '@/utils/obj/isEmpty'
import _ from 'lodash' //eslint-disable-line

export default {
  authLogic () {
    return new Promise((resolve, reject) => {
      this.auth()
        .then(success => { resolve(success) })
        .catch((err) => { reject(err) })
    })
  },
  auth () {
    const token = {
      params: {
        client_id: 'A968DCBAE348712A843CB15423E49953D7A0883F0D74E6E18044773F07393D0D',
        client_secret: 'D1BE2ECDFDC4850CF5AEAE16A6F9481EB97FD6988CCF7A9195002BF577F292EA'
      }
    }
    return new Promise((resolve, reject) => {
      Api().get('/auth/', token)
        .then((response) => {
          if (!isEmpty(response.data.token)) {
            localStorage.setItem('authToken', response.data.token)
            localStorage.setItem('authCreatedAt', Date.now())
            localStorage.setItem('authExpireAt', Date.now() - response.data.createdAt + response.data.expireAt)
          }
          resolve(response)
        })
        .catch((err) => reject(err))
    })
  },
  getID () {
    const uid = localStorage.getItem('usr')
    return Api().get(`/token?token=${uid}`)
      .then((data) => {
        if (isEmpty(data.data) || isEmpty(data.data.uid)) throw new Error('Invalid data.')
        return data.data.uid
      })
      .catch(err => console.dir(err))
  },
  get () {
    return this.authLogic()
      .then(() => this.getID())
      .then(uid => Api().get(`/user/${uid}`))
      .then(data => data)
      .catch((err) => new Error(_.get(err, 'response.data.err') || err))
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
    return new Promise((resolve, reject) => (
      this.authLogic()
        .then(() => this.getID())
        .then((uid) => {
          const params = { user_id: uid }
          Object.assign(params, filters, sort)
          return Api().get('/user/all/', { params })
        })
        .then(data => resolve(data))
        .catch(err => {
          console.dir(err)
          reject(err.response.data.err)
        })
    ))
  },
  getMatched () {
    return new Promise((resolve, reject) => (
      this.authLogic()
        .then(() => this.getID())
        .then(uid => Api().get('/user/all/', { params: {
          user_id: uid,
          filters: {
            is_match: 1
          }
        }}))
        .then(data => resolve(data))
        .catch(err => {
          console.dir(err)
          return reject(err.response.data.err)
        })
    ))
  },
  postApikey () {
    return new Promise((resolve, reject) => (
      this.authLogic()
        .then(() => this.getID())
        .then(uid => {
          if (!_.isEmpty(uid)) {
            console.log(uid)
            Api().post('/auth/credentials/', { id: uid })
          }
        })
        .then(success => resolve(success.data))
        .catch(err => { reject(err) })
    ))
  },
  getApikey () {
    return new Promise((resolve, reject) => (
      this.authLogic()
        .then(() => this.getID())
        .then(uid => Api().get(`/auth/credentials/${uid}`))
        .then(data => resolve(data))
        .catch(err => reject(err.response.data.err))
    ))
  },
  getConversation () {
    return new Promise((resolve, reject) => (
      this.authLogic()
        .then(() => this.getID())
        .then(uid => Api().get('/chat/conversation', { params: { user_id: uid } }))
        .then(data => resolve(data))
        .catch(err => {
          console.dir(err)
          reject(err.response.data.err)
        })
    ))
  },
  getMessages (receiver) {
    return new Promise((resolve, reject) => (
      this.authLogic()
        .then(() => this.getID())
        .then(uid => Api().get('/chat/message', { params: { emitter: uid, receiver } }))
        .then(data => resolve(data))
        .catch(err => {
          console.dir(err)
          reject(err.response.data.err)
        })
    ))
  },
  login (user) {
    let uid = null
    let dataToBeReturned = null
    return new Promise((resolve, reject) => {
      this.authLogic()
        .then(() => Api().get('/user/authenticate', user))
        .then(data => {
          dataToBeReturned = data
          if (data.data.err) return reject(Error(data.data.err))
          if (parseInt(data.data.user.isAccountConfirmed) === 0) return reject(Error('Your account is not confirmed'))
          uid = data.data.user.id
          return token.createToken({ 'token': data.data.user.registrationToken })
        })
        .then((tokenUser) => {
          localStorage.setItem('authClient', tokenUser.data.token)
          return Api().post('/token', { data: { uid } })
        })
        .then((data) => {
          console.log(data)
          localStorage.setItem('usr', data.data.token)
          return resolve(dataToBeReturned)
        })
        .catch(err => reject(Error(_.get(err, err.data.err, 'An error occured.'))))
        /* Add localisation here
        this.getLocalisation()
        .then(success => console.dir(success))
        .catch(err => console.dir(err))
        */
    })
  },
  register (user) {
    const data = {'redirect_uri': 'http://localhost:8080/confirm-account'}
    Object.assign(user, data)
    return new Promise((resolve, reject) => {
      this.authLogic().then(
        () => {
          Api().post('/user/', user)
            .then(success => { resolve(success) })
            .catch(err => { reject(err) })
        })
    })
  },
  resetPassword (data) {
    Object.assign(data, {'redirect_uri': 'http://localhost:8080/recover-password'})
    return new Promise((resolve, reject) => {
      Api().post('/user/recover-password', data)
        .then(success => { resolve(success) })
        .catch(err => { reject(err) })
    })
  },
  confirmAccount (body) {
    return new Promise((resolve, reject) => {
      this.authLogic()
        .then(() => {
          Api().put('/user/confirm-account', body)
            .then(success => { resolve(success) })
            .catch(err => reject(err))
        })
        .catch(err => reject(err))
    })
  },
  confirmPassword (token) {
    return new Promise((resolve, reject) => {
      try {
        Api().get('/user/recover-password?token=' + token)
          .then(success => { resolve(success) })
          .catch(err => reject(err))
      } catch (err) { reject(err) }
    })
  },
  getLocalisation () {
    return new Promise((resolve, reject) => {
      axios.get('https://api.ipify.org?format=json')
        .then(success => {
          const ip = (success.data.ip)
          axios.get('http://api.ipstack.com/' + ip +
          '?access_key=' + '94458d5655ff0c82f8f8965c2837697e')
            .then(succes => {
              const body = {
                fields: {
                  latitude: parseFloat(succes.data.latitude),
                  longitude: parseFloat(succes.data.longitude)
                }
              }
              this.update(body)
                .then((data) => resolve(data))
                .catch(err => reject(err))
            })
            .catch(err => reject(err))
        })
        .catch(err => reject(err))
    })
  },
  update (data) {
    return this.getID()
      .then(uid => Api().put(`/user/${uid}`, data))
      .then((response) => {
        return response
      })
      .catch(err => {
        console.dir(err)
      })
  },
  updatePassword (data) {
    return this.getID()
      .then(uid => Api().put(`/user/${uid}/password`, data))
      .then((response) => {
        return response
      })
      .catch(err => {
        console.dir(err)
      })
  },
  addPicture (file) {
    return this.getID()
      .then((uid) => {
        const formData = new FormData()
        formData.append('user_id', uid)
        formData.append('picture', file)
        const config = { headers: { 'content-type': 'multipart/form-data' } }
        return Api().post('/picture/', formData, config)
      })
      .then(response => response)
      .catch(err => {
        console.dir(err)
      })
  },
  logout () {
    // const token = localStorage.getItem('authClient')
    localStorage.removeItem('userLogged')
    localStorage.removeItem('usr')
    localStorage.removeItem('authClient')
    // Api().delete('/token/', { token })
    //  .catch(err => console.dir(err))
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
  unlike (send, receiver) {
    const body = { 'emitter': parseInt(send, 10), 'receiver': parseInt(receiver, 10) }
    return Api().post('/notification/unlike', body)
      .then((response) => { return response })
      .catch((err) => { return err })
  },
  block (send, receiver) {
    const body = { 'emitter': send, 'receiver': receiver }
    return Api().post('/user/block', body)
      .then((response) => { return response })
      .catch((err) => { return err })
  },
  report (send, receiver) {
    const body = { 'emitter': send, 'receiver': receiver }
    return Api().post('/user/report', body)
      .then((response) => { return response })
      .catch((err) => { return err })
  },
  unblock (send, receiver) {
    const body = { 'emitter': send, 'receiver': receiver }
    return Api().delete('/user/block', { data: body })
      .then((response) => { return response })
      .catch((err) => { return err })
  },
  sendMessageFull (message) {
    return new Promise((resolve, reject) => {
      Api().post('/chat/message', message)
        .then((response) => { resolve(response) })
        .catch((err) => { reject(err) })
    })
  },
  profileSeen (receiver) {
    return new Promise((resolve, reject) => (
      this.getID()
        .then(uid => Api().post('/notification/profile', { emitter: uid, receiver }))
        .then(response => resolve(response))
        .catch((err) => {
          console.dir(err)
          reject(err)
        })
    ))
  },
  sendMessage (receiver, message) {
    return new Promise((resolve, reject) => (
      this.getID()
        .then(uid => Api().post('/chat/message', { emitter: uid, receiver, message }))
        .then(response => resolve(response))
        .catch((err) => {
          console.dir(err)
          reject(err)
        })
    ))
  },
  getNotifications () {
    return new Promise((resolve, reject) => (
      this.getID()
        .then(uid => Api().get(`/notification/?user_id=${uid}`))
        .then(response => resolve(response))
        .catch((err) => {
          console.dir(err)
          reject(err)
        })
    ))
  },
  deletePicture (body) {
    return new Promise((resolve, reject) => (
      this.getID()
        .then((uid) => {
          Object.assign(body, { 'user_id': uid })
          return Api().delete('/picture/', { data: body })
        })
        .catch((err) => {
          console.dir(err)
          reject(err)
        })
    ))
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
