const axios = require('axios')
const cheerio = require('cheerio')

// 为给定 ID 的 user 创建请求
axios
  .get('https://github.com.ipaddress.com/')
  .then(function ({ data }) {
    let $ = cheerio.load(data)
    console.log($('.panel-item .comma-separated').first().text())
  })
  .catch(function (error) {
    console.log(error)
  })
