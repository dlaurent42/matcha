import axios from 'axios'

export default () => {
  const data = { baseURL: 'http://localhost:8081' }
  const auth = {
    token: localStorage.getItem('authToken'),
    createdAt: localStorage.getItem('authCreatedAt'),
    expireAt: localStorage.getItem('authExpireAt')
  }
  if (auth.token && Date.now() < auth.expireAt) {
    Object.assign(data, {
      headers: { 'Authorization': `Bearer ${auth.token}` }
    })
  } else {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authCreatedAt')
    localStorage.removeItem('authExpireAt')
  }
  return axios.create(data)
}
