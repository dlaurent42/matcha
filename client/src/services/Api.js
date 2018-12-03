import axios from 'axios'

export default() => {
  if (localStorage.getItem('jwt') !== 'undefined') {
    return axios.create({
      baseURL: `http://localhost:8081`,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      }
    })
  }
  return axios.create({
    baseURL: `http://localhost:8081`
  })
}
