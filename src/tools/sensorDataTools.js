export const findFirstDataEntry = (sensorData) => {
  if (sensorData === undefined || sensorData.length === 0) { return sensorData }
  return sensorData.reduce((acc, cur) => new Date(acc.id).getTime() < new Date(cur.id).getTime() ? acc : cur)
}

