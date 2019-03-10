export const formChartData = (labels, sensorTableData) => {
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
  return {
    labels: labels,
    datasets: dataSets
  }
}