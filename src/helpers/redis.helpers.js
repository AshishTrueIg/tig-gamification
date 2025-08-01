import redis from '../libs/pubSubRedisClient'

/**
 * @function removeData
 * @param {string} cacheKey - cacheKey
 */
export const removeAllData = async (cacheKeyPattern) => {
  const allMatchingKeys = await redis.client.keys(cacheKeyPattern)
  allMatchingKeys.length && await redis.client.del(allMatchingKeys)
}

export const setData = async (cacheKey, values) => {
  await redis.client.set(cacheKey, values)
}

export const getCachedData = async (cacheKey) => {
  return await redis.client.get(cacheKey)
}
