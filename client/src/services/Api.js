import axios from 'axios'

export default() => {
  return axios.create({
    baseURL: `http://localhost:8081`,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('jwt')}`
    }
  })
}
