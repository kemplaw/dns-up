const { genUrlWithIPv4Reg } = require('../regexp')
const { getFile, writeFile, replaceAll } = require('../utils')
const path = require('path')

const url = 'github.com'
const ipd = '123.123.123.123'

const newStr = `\n${ipd} ${url}`
const filePath = path.resolve(__dirname, './hosts')
const reg = genUrlWithIPv4Reg(url, 'ig')

getFile(filePath).then((hosts) => {
  if (hosts) {
    const matched = hosts.match(reg)

    if (!matched) {
      writeFile(filePath, newStr)

      return
    }

    if (matched.length) {
      console.log('matched: ', matched)

      let replaced = replaceAll(matched, hosts, { reg, replaced: '' })
      console.log('replaced: ', replaced)

      let result = replaced + newStr
      console.log('result: ', result)
      writeFile(filePath, result)
    } else {
      writeFile(filePath, newStr)
    }
  }
})
