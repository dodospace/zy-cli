const uuidv4 = require('uuid/v4')

/**
 * 生成随机的指定位数的UUID
 * @param {Number} num uuid的位数，默认36位
 */
function uuid (num) {
  const uuid = uuidv4()
  if (num && typeof num === 'number') {
    return uuid.replace(/-/g, '').slice(0, num)
  } else {
    return uuid.replace(/-/g, '')
  }
}

module.exports = uuid