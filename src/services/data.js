import axios from 'axios'
const source = 'https://sensorbackend.herokuapp.com/api/sensors'

const getAllSensorData = () => {
  const request = axios.get(source)
  return request.then(response => response.data)
}

export default { getAllSensorData }