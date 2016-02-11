/* global describe, it */

'use strict'

const isValidUrl = require('./../lib/is-valid-url')
const chai = require('chai')
const expect = chai.expect

describe('isValidUrl', () => {
  it('http://www.google.com', () => {
    expect(isValidUrl('http://www.google.com')).to.be.false
  })

  it('http://display.daumdn.com', () => {
    expect(isValidUrl('http://display.daumdn.com')).to.be.false
  })
})
