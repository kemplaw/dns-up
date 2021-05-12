const fs = require('fs')
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
 * @description: 获取 ipv4 地址
 * @param {*} url
 * @return {*}
 */
function getDnsIPv4(url) {
  return new Promise((resolve, reject) =>
    dns.lookup(url, { family: 4 }, (err, addr) => {
      if (err) {
        return reject(err)
      }

      resolve(addr)
    })
  )
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

function replaceAll(str, reg, replaced) {
  if (!reg) return str

  let newStr = ''
  const matched = str.match(reg)

  matched.forEach(() => {
    newStr = str.replace(reg, replaced)
  })

  return newStr
}

module.exports = {
  getFile,
  writeFile,
  getDnsIPv4,
  replaceAll,
}
