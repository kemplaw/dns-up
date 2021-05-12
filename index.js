#!/usr/bin/env node

const path = require('path')
const { WINDOWS_HOSTS_PATH } = require('./config')
const {
  getFile,
  getDnsIPv4,
  writeFile,
  replaceAll,
  flushdns,
  getArgs,
} = require('./utils')
const { isIPv4, genUrlWithIPv4Reg } = require('./regexp')

;(async () => {
  try {
    const hostsPath = path.resolve(WINDOWS_HOSTS_PATH)
    const hosts = await getFile(hostsPath)

    if (hosts === undefined) throw new Error('could not find valid hosts file!')

    // 获取 ipv4 地址
    const [url] = getArgs()

    if (!url) throw new Error('valid url required!')

    console.log(`mapping url is ${url}`)

    const ipv4 = await getDnsIPv4(url)

    if (!ipv4 || !isIPv4.test(ipv4)) {
      throw new Error('could not find valid ipv4 address')
    }

    // 匹配url
    const reg = genUrlWithIPv4Reg(url, 'ig')
    const matchedLines = hosts.match(reg)
    const newUrlMapStr = `${ipv4} ${url}`

    // 无匹配结果，直接新增
    if (!matchedLines || matchedLines.length === 0) {
      console.log('no matched, will append')

      const res = await writeFile(WINDOWS_HOSTS_PATH, `\n${newUrlMapStr}`, {
        flags: 'a',
      })

      if (res) {
        console.log(`hosts updated! result is ${newUrlMapStr}`)

        // 替换之后执行更新dns命令
        const isFlushdns = await flushdns()

        if (isFlushdns) {
          console.log('dns flush sucessfully')
        }

        return
      }
    }

    // 有匹配结果，替换之后新增
    if (matchedLines.length) {
      let replaced = replaceAll(hosts, reg, '')
      let result = replaced + newUrlMapStr

      const res = await writeFile(WINDOWS_HOSTS_PATH, result)

      if (res) {
        console.log(`updated, result is ${result}`)
      }
    }

    // 替换之后执行更新dns命令
    const isFlushdns = await flushdns()

    if (isFlushdns) {
      console.log('dns flush sucessfully')
    }
  } catch (error) {
    console.warn(error)
  }
})()
