var psi = require('psi')
var renderPage = require('./render-page')

module.exports = function (url, opts) {
  'use strict'

  opts = opts || {}

  var results = {}
  return psi(url, {nokey: true, strategy: opts.strategy || 'desktop', locale: 'ko_KR'})
    .then(function (psiData) {
      results.psi = {
        pageStats: psiData.pageStats,
        ruleGroups: psiData.ruleGroups
      }
      return renderPage(url, opts)
    })
    .then(function (pageData) {
      results.crawl = pageData
      return results
    })
    .catch(err => {
      throw err
    })
}
