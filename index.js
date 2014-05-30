var request = require('request')
var crypto = require('crypto')
var through = require('through2')
var combiner = require('stream-combiner')

var base = 'https://www.googleapis.com/upload/drive/v2/'
module.exports = function(opts, cb) {
  if (!opts) opts = {}
  if (!opts.token) return cb(new Error('you must specify google token'))
  
  // opts.contentType || 'text/plain'
  
  var hasher = crypto.createHash(this.hashFunc)
  var buffer = hash.read();
  
  var hash = through({ end: false },
    function write(ch, enc, next) {
      
    },
    function end() {
      
    }
  )
  
  
  var post = request.post(base + 'files?uploadType=resumable', {
    headers: {
     'Content-Type': 'application/json',
     'Authorization': "Bearer " + opts.token
    },
    json: opts.metadata
  }, function(err, resp, initJson) {
    if (err || resp.statusCode > 299) return cb(err || resp.statusCode)
    var resumableURL = resp.headers.location
  })
  
  return 
}
