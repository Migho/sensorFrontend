export const findFirstDataEntry = (sensorData) => {
  if (sensorData === undefined || sensorData.length === 0) { return sensorData }
  return sensorData.reduce((acc, cur) => new Date(acc.id).getTime() < new Date(cur.id).getTime() ? acc : cur)
}

export const convertSensorDataToChartFormat = (from, to, sensorData) => {
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
  return {labels: labels, sensorTableData: sensorTableData}
}