function roundOf (number, decimal) {
  return parseInt(number * 10 ** decimal) / 10 ** decimal
}

function getTimeByCrashRate (crashRate) {
  return +(Math.log2(crashRate) / 0.09).toFixed(1)
}

/**
 * Get Random Integer from min to max (both inclusive)
 * @param {*} max
 * @returns
 */
function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max + 1)
  return Math.floor(Math.random() * (max - min) + min)
}

module.exports = {
  roundOf,
  getTimeByCrashRate,
  getRandomInt
}
