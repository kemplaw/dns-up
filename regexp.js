const isIPv4 = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/

/**
 * @description: 生成ip以及url地址的正则
 * @param {*} url
 * @return {*}
 */
const genUrlWithIPv4Reg = (url, flags) => {
  if (!url) throw Error('url required!')

  return new RegExp(
    `((2[0-4]\\d|25[0-5]|[01]?\\d\\d?)\\.){3}(2[0-4]\\d|25[0-5]|[01]?\\d\\d?)(\\s|\\w)+${url}`,
    flags
  )
}

module.exports = {
  isIPv4,
  genUrlWithIPv4Reg,
}
