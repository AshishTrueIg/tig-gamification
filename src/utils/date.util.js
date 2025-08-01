const moment = require('moment')
export const getBonusExpiryDate = (hours) => {
  const currentDate = moment()
  const futureDate = currentDate.add(hours, 'h')
  return futureDate.format('YYYY-MM-DD HH:mm:ss')
}

export const getFutureBonusExpiryDate = (days, hours) => {
  const currentDate = moment()
  const futureDate = currentDate.add(days, 'd').add(hours, 'h')
  return futureDate.format('YYYY-MM-DD HH:mm:ss')
}

export const getFutureBonusStartDate = (days) => {
  const currentDate = moment()
  const futureDate = currentDate.add(days, 'd')
  return futureDate.format('YYYY-MM-DD HH:mm:ss')
}
