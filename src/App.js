import React, { useState, useEffect } from 'react' 
import { Line } from 'react-chartjs-2'
import dataService from './services/data'
import { findFirstDataEntry, convertSensorDataToChartFormat } from './tools/sensorDataTools'
import { formChartData } from './tools/chartTools'

const MAX_DAYS_TO_DISPLAY = 31

const DrawChart = ({ dateFrom, dateTo, sensorData }) => {
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
          <Line data={formChartData(labels, sensorTableData)} />
        </>
      )
    }
  } else if (sensorData.length === 0) {
    return (
      <h2>Loading data...</h2>
    )
  }
  return (
    <h2>Too wide range (max range {MAX_DAYS_TO_DISPLAY} days) or invalid dates. Maybe try ISO format (for example 2019-03-04T17:00:00.000Z)?</h2>
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
      <DrawChart dateFrom={dateFrom} dateTo={dateTo} sensorData={sensorData}/>
    </div>
  );

}

export default App;