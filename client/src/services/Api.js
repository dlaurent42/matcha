import axios from 'axios'

export default () => {
  const data = { baseURL: 'http://localhost:8081' }
  if (localStorage.getItem('jwt') !== undefined && localStorage.getItem('jwt') !== null) {
    Object.assign(data, { headers: {
      'Authorization': `Bearer ${localStorage.getItem('jwt')}`
    }})
  }
  return axios.create(data)
}
