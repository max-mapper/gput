#!/usr/bin/env node

var path = require('path')
var fs = require('fs')
var mime = require('mime')
var url = require('url')
var argv = require('minimist')(process.argv.slice(2))

var gput = require('./')

var configPath = path.join(process.env.HOME || process.env.USERPROFILE, '.config', 'googleauth.json')
var token = JSON.parse(fs.readFileSync(configPath)).access_token

if (argv._.length === 0) throw new Error('no input specified')
if (argv._.length === 1) put()
else if (argv._[0] === 'mkdir') mkdir()
else console.error('command not supported')

function put() {
  var filepath = argv._[0]
  var filename = path.basename(filepath)
  var parentID = argv.dir
  var mimeType = mime.lookup(filename)

  var metaOpts = {
    token: token,
    query: '?uploadType=resumable',
    json: {
      title: filename,
      mimeType: mimeType
    },
    contentType: 'application/json'
  }
  
  if (parentID) metaOpts.json.parents = [{
    "kind": "drive#fileLink",
    "id": parentID
  }]
  
  gput(metaOpts, function(err, resp, body) {
    if (err || resp.statusCode > 299) return console.error(err, resp.headers)
    var parsed = url.parse(resp.headers.location, true)
    var session = parsed.query.upload_id
    upload(session)
  })
  
  function upload(session) {
    var input
    
    if (!process.stdin.isTTY) {
      input = process.stdin
    } else {
      input = fs.createReadStream(filepath)
    }
    
    var opts = {
      token: token,
      query: '?uploadType=resumable&upload_id=' + session
    }

    var put = gput(opts)

    input.pipe(put)

    put.on('response', function(resp) {
      resp.pipe(process.stdout)
    })

    put.on('error', function(err) {
      console.error('put error', err)
    })
  }
}

function mkdir() {
  var opts = {
    token: token,
    json: {
      title: argv._[1],
      mimeType: "application/vnd.google-apps.folder"
    },
    contentType: 'application/json',
    base: 'https://www.googleapis.com/drive/v2/'
  }
  
  var put = gput(opts)
  
  put.on('response', function(resp) {
    resp.pipe(process.stdout)
  })
  
  put.on('error', function(err) {
    console.error('mkdir error', err)
  })
}