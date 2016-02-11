const moment = require('moment')
const uuid = require('node-uuid')
const info = require('../package.json')

const debug = require('debug')(`${info.name}:imageUploader`)
const imgur = require('imgur');

module.exports = function (base64Png) {
  'use strict'

  return new Promise((resolve, reject) => {
    try {
      imgur.uploadBase64(base64Png)
        .then(function (json) {
          debug(`Image uploaded to ${json.data.link}`)
          resolve(json.data.link)
        })
        .catch(function (err) {
          debug(`Failed to upload image due to an error : ${err}`)
          reject(err)
        });
    } catch (_) {
      reject(_)
    }
  })
}
