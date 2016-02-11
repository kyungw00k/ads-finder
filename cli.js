#!/usr/bin/env node

/**
 * Module dependencies.
 */

const prettyjson = require('prettyjson')
const chalk = require('chalk')
const meow = require('meow')
const globby = require('globby')
const protocolify = require('protocolify')
const updateNotifier = require('update-notifier')
const humanizeUrl = require('humanize-url')
const indentString = require('indent-string')
const logSymbols = require('log-symbols')
const eachAsync = require('each-async')
const evaluatePage = require('./lib/evaluate-page')
const clc = require('cli-color')
const CLI = require('clui')
const Progress = CLI.Progress
const Line = CLI.Line

const cli = meow(`
    Usage
      $ adsFinder <urls>

    Example
      adsFinder http://m.inven.co.kr
      adsFinder www.daum.net m.inven.co.kr

    Options
      -s, --strategy                Strategy to use when analyzing the page(mobile|desktop). defaults to 'desktop'
      -d, --delay                   Sets the delay(ms) capturing the page. defaults to 300
`, {
  alias: {
    s: 'strategy',
    d: 'delay'
  }
})

const debug = require('debug')(`${cli.pkg.name}`)
const error = chalk.bold.red

debug('Package Check')
updateNotifier({pkg: cli.pkg}).notify()

cli.flags['strategy'] = cli.flags['strategy'] || 'desktop'

console.log(prettyjson.render(cli.flags))

if (cli.input.length === 0) {
  console.error(error('Please supply at least one URL'))
  process.exit(1)
}

debug('Mapping Protocols to URLs')

var urls = globby.sync(cli.input, {
  // Ensure not-found paths (like "google.com"), are returned.
  nonull: true
}).map(protocolify)

debug('Running...')

var doneCount = 0
var failCount = 0
var totalCount = urls.length
var results = ''

function drawProgress (current, total) {
  console.log(clc.reset)
  console.log(chalk.bold.magenta(`${cli.pkg.name}@${cli.pkg.version}`))

  var blankLine = new Line().fill().output()

  new Line()
    .padding(2)

    .column('Progress', 40, [clc.cyan])
    .fill()
    .output()

  blankLine.output()

  var thisProgressBar = new Progress(20)

  new Line()
    .padding(2)
    .column(thisProgressBar.update(current, total), 40)
    .fill()
    .output()

  blankLine.output()
}

drawProgress(doneCount + failCount, totalCount)

eachAsync(urls, function (url, i, next) {
  'use strict'

  evaluatePage(url, cli.flags)
    .then(function (pageData) {
      'use strict'

      results += (indentString(logSymbols.info + ' ' + chalk.underline(chalk.cyan(humanizeUrl(url))), ' ', 2)) + '\n\n'
      if (pageData.crawl.ads.length === 0) {
        results += (indentString(error(`${logSymbols.error} Ad not found.`), ' ', 4)) + '\n'
      } else {
        results += (indentString(`${logSymbols.success} Found ${pageData.crawl.ads.length} ad(s).`, ' ', 4)) + '\n'
      }

      results += ('\n')
      results += (indentString(prettyjson.render(pageData), ' ', 4)) + '\n'
      results += ('\n')
      doneCount++
      drawProgress(doneCount + failCount, totalCount)
      next()
    })
    .catch(function (err) {
      failCount++
      drawProgress(doneCount + failCount, totalCount)
      results += (indentString(logSymbols.info + ' ' + chalk.underline(chalk.cyan(humanizeUrl(url))), ' ', 2)) + '\n'
      results += (indentString(error(err.toString()), ' ', 4)) + '\n'
    })
}, function () {
  'use strict'
  process.stdout.write('\n')
  console.log(results)
})

debug('Job Done')
