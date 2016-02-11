const Horseman = require('node-horseman')
const tenthImageUploader = require('./image-uploader')
const validator = require('validator')
const protocolify = require('protocolify')
const objectAssign = require('object-assign')

const info = require('../package.json')

const debug = require('debug')(`${info.name}:renderPage`)

module.exports = function (url, opts) {
  if (!url || !validator.isURL(url)) {
    throw new Error('URL must be valid')
  }

  opts = opts || {}

  if (/mobile|desktop/.test(opts['strategy'])) {
    if (opts['strategy'] === 'mobile') {
      /* iPhone 6 */
      opts.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'
      opts.viewportSize = '375x627'
    } else {
      /* Chrome, Mac */
      opts.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'
      opts.viewportSize = '1280x1024'
    }
  }

  opts['zoom'] = 1
  opts['delay'] = opts['delay'] || 300
  var viewportSize = (opts.viewportSize || '').split('x')
  delete opts.viewportSize

  opts = objectAssign({delay: 1}, opts, {
    url: protocolify(url),
    pageWidth: viewportSize[0] || 1024,
    pageHeight: viewportSize[1] || 768,
    userAgent: opts.userAgent || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36',
    zoom: opts.zoom || 1,
    delay: opts.delay || 3000
  })

  debug(`URL : ${url}`)
  debug(`User-Agent : ${opts.userAgent}`)
  debug(`ViewPort : ${opts.pageWidth}x${opts.pageHeight}`)
  debug(`ZoomFactor: ${opts.zoom}`)
  debug(`Wait ${opts.delay}ms after page loaded`)

  return new Promise((resolve, reject) => {
    var horseman = new Horseman({injectJquery: false})

    function closeAndResolve (horseman, data) {
      'use strict'
      debug('Closing instance of Horseman')
      horseman.close()
      debug('Job done')
      resolve(data)
    }

    horseman
      .userAgent(opts.userAgent)

      .viewport(opts.pageWidth, opts.pageHeight)

      .zoom(opts.zoom)

      .on('error', (err) => {
        debug(`Failed to render the content due to error : ${err}`)
        throw err
      })

      .open(opts.url)

      .wait(opts.delay)

      .injectJs(__dirname + '/browser/find-ad-iframe.js')

      .evaluate(function () {
        return {
          pageWidth: document.body.scrollWidth,
          pageHeight: document.body.scrollHeight,
          pageTile: window.document.title,
          ads: window.findAdIFrame()
        }
      })

      .then(function (result) {
        debug('Filtering Ads')

        result.ads = result.ads
          .filter(iframe => (iframe.isDaum || iframe.isGoogle || iframe.isThirdParty))

        if (result.ads.length) {
          debug('Taking page screenshot')
          return horseman
            .viewport(result.pageWidth, result.pageHeight)
            .screenshotBase64('PNG')
            .then(tenthImageUploader)
            .then(function (imageUrl) {
              result.snapshotImageUrl = imageUrl
              closeAndResolve(horseman, result)
            })
        } else {
          debug('There is no ad in this page')
          closeAndResolve(horseman, result)
        }
      })
      .catch(reject)
  })
}
