/* global describe, it */

'use strict'

const renderPage = require('./../lib/render-page')
const chai = require('chai')
const http = require('http')
const imageType = require('image-type')
const validator = require('validator')

chai.should()

describe('renderPage', function () {
  var currentPageData

  it('Ad data should be loaded from url', function (done) {
    this.timeout(40 * 1000)

    renderPage(
      'http://m.inven.co.kr',
      {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4',
        viewportSize: '375x627'
      }
    ).then(function (pageData) {
      pageData.ads.length.should.be.at.least(1)
      pageData.pageWidth.should.be.a('number')
      pageData.pageHeight.should.be.a('number')
      validator.isURL(pageData.snapshotImageUrl).should.be.true

      currentPageData = pageData

      done()
    }).catch(function (err) {
      console.log(err)
    })
  })

  it('snapshotImageUrl should be a valid PNG image', function (done) {
    http.get(currentPageData.snapshotImageUrl, function (res) {
      res.once('data', function (chunk) {
        res.destroy()

        var type = imageType(chunk)

        type.should.have.property('ext', 'png')
        type.should.have.property('mime', 'image/png')

        done()
      })
    })
  })
})
