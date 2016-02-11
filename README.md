# ads-finder
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

> Find ads from web page

![CLI Screenshot](http://t1.daumcdn.net/adfit/acs/20160105/7c179550-b364-11e5-90ed-877e318e806e.png)

## Install

```sh
$ npm install ads-finder
```

## CLI Usage

Run an audit against a URL:

```
$ adsFinder m.inven.co.kr
```

or multiple URLs:

```
$ adsFinder www.daum.net m.inven.co.kr
```


## Options
```
$ adsFinder --help

  Find ads from web page
 
   Usage
     $ adsFinder <urls>
 
   Example
     adsFinder http://m.inven.co.kr
     adsFinder www.daum.net m.inven.co.kr
 
   Options
     -s, --strategy                Strategy to use when analyzing the page(mobile|desktop). defaults to 'desktop'
     -d, --delay                   Sets the delay(ms) capturing the page. defaults to 300
```

## Module usage
```js
var adsFinder = require('ads-finder');

adsFinder('<url>')
    .then(function(results) {
        // results.ads.length;
    })
    .catch(function (err) {
        // err
    });
```

Passing options:

```js
var adsFinder = require('ads-finder');

var options = {
  strategy : 'mobile',
  delay : 400
};

adsFinder('<url>', options)
    .then(function(results) {
        // results.ads.length;
    })
    .catch(function (err) {
        // err
    });
```
