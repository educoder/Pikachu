
/*jshint node:true */

"use strict";

var express = require('express'),
  http = require('http'),
  path = require('path'),
  fs = require('fs'),
  _ = require('lodash');

var app = express();

var DATA_DIR = path.join(__dirname, 'data');

app.configure(function(){
  app.set('port', process.env.PORT || 2596);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(cors);
  app.use(express.bodyParser({keepExtensions: true, uploadDir: '/tmp'}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(DATA_DIR));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/upload.html', function (req, res) {
  res.type('html');
  res.sendfile(path.join(__dirname, 'upload.html'));
});

app.get('/', function (req, res) {
  fs.readdir(DATA_DIR, function (err, files) {
    res.type('json');

    if (err) {
      res.send(500, JSON.stringify(err));
    } else {
      // don't show hidden files
      var nonHiddenFiles = _.filter(files, function(file) { return !isUnixHiddenPath(file); });
      res.send(JSON.stringify(nonHiddenFiles));
    }
  });
});

app.post('/', function (req, res) {
  fs.readdir(DATA_DIR, function (err, files) {
    var newId = Math.random() * 9007199254740992; // max int value, see http://stackoverflow.com/questions/307179/what-is-javascripts-max-int-whats-the-highest-integer-value-a-number-can-go-t
    var newFilename = newId.toString(36) + path.extname(req.files.file.filename);
    fs.rename(req.files.file.path, path.join(DATA_DIR, newFilename), function (err) {
      res.type('json');
      if (err) {
        res.send(500, JSON.stringify(err));
      } else {
        var f = {
          url: newFilename,
          size: req.files.file.size,
          type: req.files.file.type
        };
        res.send(JSON.stringify(f));
      }
    });
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

function cors(req, res, next) {
    var oneof = false;
    if(req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    if(req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if(req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    if(oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    // intercept OPTIONS method
    if (oneof && req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
}

/**
 * Checks whether a path starts with or contains a hidden file or a folder.
 * @param {string} source - The path of the file that needs to be validated.
 * returns {boolean} - `true` if the source is blacklisted and otherwise `false`.
 * via http://stackoverflow.com/questions/8905680/nodejs-check-for-hidden-files
 */
var isUnixHiddenPath = function (path) {
    return (/(^|.\/)\.+[^\/\.]/g).test(path);
};