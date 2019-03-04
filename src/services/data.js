import axios from 'axios'
const source = 'http://localhost:3000/api/sensors'

const getAllSensorData = () => {
  const request = axios.get(source)
  return request.then(response => response.data)
}

export default { getAllSensorData }