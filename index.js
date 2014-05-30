var request = require('request')
var base = 'https://www.googleapis.com/upload/drive/v2/'
module.exports = function(opts, cb) {
  if (!opts) opts = {}
  if (!opts.token) return cb(new Error('you must specify google token'))
  
  var reqOpts = {
    url: (opts.base || base) + 'files' + (opts.query || ''),
    headers: {
     'Content-Type': opts.contentType || 'text/plain',
     'Authorization': "Bearer " + opts.token
    },
    json: opts.json
  }
  return request.post(reqOpts, cb)
}


