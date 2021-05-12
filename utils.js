const fs = require('fs')
const dns = require('dns')
const axios = require('axios')
const cheerio = require('cheerio')

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
 * @description: 获取 ipv4 地址
 * @param {*} url
 * @return {*}
 */
function getDnsIPv4(url) {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://${url}.ipaddress.com/`)
      .then(({ data }) => {
        let $ = cheerio.load(data)

        resolve($('.panel-item .comma-separated').first().text())
      })
      .catch((err) => reject(err))
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

module.exports = {
  getFile,
  flushdns,
  writeFile,
  getDnsIPv4,
  replaceAll,
}
