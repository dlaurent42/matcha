import axios from 'axios'

export default () => {
  const data = { baseURL: 'http://localhost:8081' }
  const auth = {
    token: sessionStorage.getItem('authToken'),
    createdAt: sessionStorage.getItem('authCreatedAt'),
    expireAt: sessionStorage.getItem('authExpireAt')
  }
  if (auth.token && Date.now() < auth.expireAt) {
    console.log(`Session storage is valid: ${JSON.stringify(auth)}`)
    Object.assign(data, {
      headers: { 'Authorization': `Bearer ${auth.token}` }
    })
  } else {
    sessionStorage.removeItem('authToken')
    sessionStorage.removeItem('authCreatedAt')
    sessionStorage.removeItem('authExpireAt')
    console.log(`Session storage is not valid: ${JSON.stringify(auth)}`)
  }
  return axios.create(data)
}
