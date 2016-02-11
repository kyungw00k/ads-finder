/* eslint-env phantomjs, browser */

window.findAdIFrame = function () {
  /**
   * Classify Ad Area
   */
  var adClassifier = {
    /** Daum Ad */
    isDaum: function (iframe) {
      return /ddnAdifrDAN/.test(iframe.id)
    },
    /** Google Ad */
    isGoogle: function (iframe) {
      return /google/.test(iframe.onload) || /google_ads_iframe/.test(iframe.id)
    },
    /** Other Ads */
    isThirdParty: function (iframe) {
      var src = iframe.src
      return (/dreamsearch/.test(src) || /wisenut/.test(src) || /adkpf\.newscloud\.or\.kr/.test(src) || /ilikesponsorad/.test(src) || /ad4989\.co\.kr/.test(src) || /ad\.priel\.co\.kr/.test(src) || /\adv\.imadrep\.co\.kr/.test(src) || /adnxs\.com/.test(src) || /web\.n2s\.co\.kr/.test(src) || /adn.nsmartad.com/.test(src) || /realclick/.test(src) || /criteo\.com/.test(src) || /adscope.co.kr/.test(src) || (/ad/i.test(src) && /banner/i.test(src)) || /ad.about.co.kr/.test(src) || /cauly.co.kr/.test(src) || /adn.inven.co.kr/.test(src))
    },
    /** Not Ad */
    notAd: function (iframe) {
      var id = iframe.id
      var src = iframe.src
      return (/google_osd_static/.test(id) || /oauth2/.test(src) || /facebook\.com/.test(src) || /googlesyndication/.test(src) || /apis\.google\.com/.test(src)
      )
    }
  }

  var iframes = Array.prototype.slice.call(document.getElementsByTagName('iframe'))

  return iframes.map(function (iframe) {
    /**
     * Assign unique id to unnamed iframe
     */
    if (!iframe.id) {
      var hash = 'iframe' + (Math.random() * 100000 | 0)
      iframe.id = iframe.name = hash
    }

    /**
     * Create Metadata for iframe
     */
    var rect = iframe.getBoundingClientRect()
    return {
      x: rect.left | 0,
      y: rect.top | 0,
      w: rect.width | 0,
      h: rect.height | 0,
      src: iframe.src,
      id: iframe.id,
      onload: iframe.onload,
      isDaum: adClassifier.isDaum(iframe),
      isGoogle: adClassifier.isGoogle(iframe),
      isThirdParty: adClassifier.isThirdParty(iframe),
      notAd: adClassifier.notAd(iframe)
    }
  })
}
