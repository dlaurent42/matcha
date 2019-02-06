import axios from 'axios'

export default () => {
  const data = { baseURL: 'http://localhost:8081' }
  if (sessionStorage.getItem('jwt') !== undefined && sessionStorage.getItem('jwt') !== null) {
    Object.assign(data, { headers: {
      'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
    }})
  }
  return axios.create(data)
}
