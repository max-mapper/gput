#!/usr/bin/env node

var path = require('path')
var fs = require('fs')

var gput = require('./')
var configPath = path.join(process.env.HOME || process.env.USERPROFILE, '.config', 'googleauth.json')

var input
if (!process.stdin.isTTY) {
  input = process.stdin
} else if (process.argv[2]) {
  input = fs.createReadStream(process.argv[2])
} else {
  throw new Error('no input specified')
}

var put = gput({
  token: JSON.parse(fs.readFileSync(configPath)).access_token
})

input.pipe(put)

put.on('response', function(resp) {
  resp.pipe(process.stdout)
})

put.on('error', function(err) {
  console.error('Put Error', err)
})