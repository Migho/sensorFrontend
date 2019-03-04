import React, { useState, useEffect } from 'react' 
import {Line} from 'react-chartjs-2'
import dataService from './services/data'

const ConstructChart = ({ dateFrom, dateTo, sensorData }) => {
  const from = new Date(dateFrom)
  const to = new Date(dateTo || new Date())
  
  if (Boolean(+from) && Boolean(+to) && from <= to) {
    if (to.getTime() - from.getTime() < 604800000) {  // 7 days. With more than seven days calculate averages?
      const i = new Date(from)
      let labels = []
      let sensorTableData = []
      let amountOfColumns=0
      while (i <= to) {
        labels.push(i.toISOString())
        let row = {...sensorData.filter(n => n.id === i.toISOString())[0]}
        // Actual data transformation from JSON to table
        if (row !== undefined) { // Found data. Process it.
          delete row["id"]
          for (const [key, value] of Object.entries(sensorTableData)) { // Find and add all sensors which already have data in table.
            if (row[key] !== undefined) {
              value.push(row[key])
            } else {
              value.push(undefined)
            }
            delete row[key]
          }
          for (const [key, value] of Object.entries(row)) { // In case new sensors have appeared, they are being included as well.
            sensorTableData[key] = []
            for (let j=0; j<amountOfColumns; j++) {
              sensorTableData[key].push(undefined)
            }
            sensorTableData[key].push(value)
          }
        } else { // Missing data for some reason. Process missing data.
          for (const [key] of Object.entries(sensorTableData)) {
            sensorTableData[key].push(undefined)
          }
        }
        amountOfColumns++
        i.setHours(i.getHours()+1)
      }
      return (
        <>
          <h3>{`${from} - ${to}`}</h3>
          <DrawChart labels={labels} sensorTableData={sensorTableData} />
        </>
      )
    }
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
  const [ dateFrom, setDateFrom ] = useState('2019-03-04T17:00:00.000Z') // Oldest element is hard-coded
  const handleDateFromChange = (event) => { setDateFrom(event.target.value) }
  const [ dateTo, setDateTo ] = useState(new Date())
  const handleDateToChange = (event) => { setDateTo(event.target.value) }

  // ### Initialize data ###
  useEffect(() => {
    dataService.getAllSensorData().then(data => {
      setSensorData(data)
    })
  }, [])
  
  return (
    <div>
      <div>From: <input onChange={handleDateFromChange}/></div>
      <div>To: <input onChange={handleDateToChange}/></div>
      <ConstructChart dateFrom={dateFrom} dateTo={dateTo} sensorData={sensorData}/>
    </div>
  );

}

export default App;
