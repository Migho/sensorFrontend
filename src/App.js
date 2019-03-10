import React, { useState, useEffect } from 'react' 
import { Line } from 'react-chartjs-2'
import dataService from './services/data'
import { findFirstDataEntry, convertSensorDataToChartFormat } from './tools/sensorDataTools' 

const MAX_DAYS_TO_DISPLAY = 31

const ConstructChart = ({ dateFrom, dateTo, sensorData }) => {
  const from = new Date(dateFrom)
  from.setMinutes(0)
  from.setSeconds(0)
  from.setMilliseconds(0)
  const to = new Date(dateTo || new Date())
  
  if (Boolean(+from) && Boolean(+to) && from <= to) {
    if (to.getTime() - from.getTime() < 86400000 * MAX_DAYS_TO_DISPLAY + 3600000) { // Allow one extra hour due to the rounding
      const {labels, sensorTableData} = convertSensorDataToChartFormat(from, to, sensorData)
      return (
        <>
          <h3>{`${from} - ${to}`}</h3>
          <DrawChart labels={labels} sensorTableData={sensorTableData} />
        </>
      )
    }
  } else if (sensorData.length === 0) {
    return (
      <h2>Loading data...</h2>
    )
  }
  return (
    <h2>Too wide range or invalid dates. Maybe try ISO format (for example 2019-03-04T17:00:00.000Z)?</h2>
  )
}

const DrawChart = ({ labels, sensorTableData }) => {
  let dataSets = []
  let red = 10
  let green = 20
  let blue = 30
  for (const [sensorName, sensorData] of Object.entries(sensorTableData)) {
    // Randomize each color
    red = (red + 60) % 255
    green = (green + 75) % 255
    blue = (blue + 100) % 255
    dataSets.push({
      label: sensorName,
      fill: false,
      lineTension: 0.1,
      backgroundColor: `rgba(${red},${green},${blue},0.4)`,
      borderColor: `rgba(${red},${green},${blue},1)`,
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: `rgba(${red},${green},${blue},1)`,
      pointHoverBorderColor: `rgba(${red},${green},${blue},1)`,
      pointHoverBorderWidth: 2,
      pointRadius: 2,
      pointHitRadius: 10,
      data: sensorData
    })
  }
  const data = {
    labels: labels,
    datasets: dataSets
  }
  return (
    <Line data={data} />
  )
}


const App = () => {

  // ### Hooks ###
  const [ sensorData, setSensorData ] = useState([])
  const [ dateFrom, setDateFrom ] = useState('')
  const handleDateFromChange = (event) => { setDateFrom(event.target.value) }
  const [ dateTo, setDateTo ] = useState(new Date())
  const handleDateToChange = (event) => { setDateTo(event.target.value) }

  // ### Initialize data ###
  useEffect(() => {
    dataService.getAllSensorData().then(data => {
      setSensorData(data)
      const oldestDate = findFirstDataEntry(data).id
      const oldestAllowedDate = new Date(new Date() - 86400000 * MAX_DAYS_TO_DISPLAY).toISOString()
      setDateFrom(new Date(oldestDate).getTime() > new Date(oldestAllowedDate).getTime() ? oldestDate : oldestAllowedDate)
    })
  }, [])
  
  return (
    <div>
      <div>From: <input onChange={handleDateFromChange}/></div>
      <div>To: <input onChange={handleDateToChange} value={dateTo.toISOString()}/></div>
      <ConstructChart dateFrom={dateFrom} dateTo={dateTo} sensorData={sensorData}/>
    </div>
  );

}

export default App;