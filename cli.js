#!/usr/bin/env node

var path = require('path')
var fs = require('fs')
var mime = require('mime')

var gput = require('./')
var configPath = path.join(process.env.HOME || process.env.USERPROFILE, '.config', 'googleauth.json')

var input
var filename = process.argv[2]
if (!process.stdin.isTTY) {
  input = process.stdin
} else if (filename) {
  input = fs.createReadStream(filename)
} else {
  throw new Error('no input specified')
}

var opts = {
  token: JSON.parse(fs.readFileSync(configPath)).access_token
}

if (filename) opts.contentType = mime.lookup(filename)

var put = gput(opts)

input.pipe(put)

put.on('response', function(resp) {
  resp.pipe(process.stdout)
})

put.on('error', function(err) {
  console.error('Put Error', err)
})