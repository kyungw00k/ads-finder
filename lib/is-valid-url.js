/**
 * HTTP/HTTPS 이면서 제외 대상이 아닌 URL 검증
 *
 * @param url
 * @returns {boolean}
 */
module.exports = function (url) {
  var excludeRules = require('./../exclude-rules.json') || []
  return /^http[s]*:/.test(url) && !excludeRules.some(regExp => new RegExp(regExp, 'i').test(url))
}
