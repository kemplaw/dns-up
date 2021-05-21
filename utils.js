const fs = require('fs')
const axios = require('axios')
const cheerio = require('cheerio')
const dns = require('dns')

/**
 * @description: 获取文件读取流
 * @param {*} path
 * @return {*}
 */
function getFile(path) {
  if (!path) throw Error('need valid path!')

  return new Promise((resolve, reject) => {
    let file = ''

    const fileStream = fs.createReadStream(path)

    fileStream.on('data', (chunk) => (file += chunk))

    fileStream.on('end', () => resolve(file))

    fileStream.on('error', (err) => reject(err))
  })
}

/**
 * @description: 获取 ipv4 地址（从 ipaddress 获取）
 * @param {*} url
 * @return {*}
 */
function getIpByIpAddress(url) {
  return new Promise((resolve, reject) => {
    const isNet = /\.net/gi
    const baseUrl = isNet.test(url)
      ? `https://fastly.net.ipaddress.com/${url}`
      : `https://${url}.ipaddress.com/`

    axios
      .get(baseUrl)
      .then(({ data }) => {
        let $ = cheerio.load(data)

        resolve($('.panel-item .comma-separated').first().text())
      })
      .catch((err) => reject(err))
  })
}

/**
 * @description: 获取 ipv4 地址（从nslookup获取）
 * @param {string} url
 * @return {*}
 */
function getIpByDnsLookUp(url) {
  return new Promise((resolve, reject) => {
    dns.lookup(url, { family: 4 }, (err, addr, family) => {
      if (err) return reject(err)

      if (family !== 4) return reject('not supported url')

      resolve(addr)
    })
  })
}

/**
 * @description: 写入文件，默认采取修改文件策略
 * @param {*} path
 * @param {*} data
 * @return {*}
 */
function writeFile(path, data, { flags = 'w', ...rest } = {}) {
  return new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(path, { flags, ...rest })

    ws.write(data, (err) => {
      if (err) return reject(err)

      resolve(true)
    })
  })
}

/**
 * @description: 替换所有
 * @param {*} str
 * @param {*} reg
 * @param {*} replaced
 * @return {*}
 */
function replaceAll(str, reg, replaced) {
  if (!reg) return str

  let newStr = ''
  const matched = str.match(reg)

  matched.forEach(() => {
    newStr = str.replace(reg, replaced)
  })

  return newStr
}

/**
 * @description: 刷新dns缓存
 */
function flushdns() {
  const cmd = 'ipconfig/flushdns'

  return new Promise((resolve, reject) => {
    var process = require('child_process')

    process.exec(cmd, (err, stdout, stderr) => {
      if (err || stderr) {
        return reject(err || stderr)
      }

      resolve(stdout)
    })
  })
}

// 获取命令行参数
function getArgs() {
  return process.argv.slice(2)
}

module.exports = {
  getFile,
  getArgs,
  flushdns,
  writeFile,
  getIpByIpAddress,
  replaceAll,
  getIpByDnsLookUp,
}
