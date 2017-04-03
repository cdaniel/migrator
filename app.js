/*eslint-env node*/
/*jshint esversion: 6 */

var express = require('express');
var cfenv = require('cfenv');
var app = express();
app.get('/', function(res){
  res.send(200);
});

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var q = require('q');
mongoose.Promise = q.Promise;


// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

var ca = [new Buffer('certificateencoded', 'base64')];
  var  options = {
        mongos: {
            ssl: true,
            sslValidate: true,
            sslCA: ca,
            poolSize: 1,
            reconnectTries: 1
        }
    };

var target = mongoose.createConnection('mongodb://admin:password@url:17166/admin', options);
// target.db.dropDatabase();

// var sourceWorkspace = require('./workspace-schema')(source);
var targetWorkspace = require('./workspace-schema')(target);

// var sourceMap = require('./map-schema')(source);
var targetMap = require('./map-schema')(target);

// var sourceNode = require('./node-schema')(source);
var targetNode = require('./node-schema')(target);


var promises1 = [
  // targetWorkspace.remove({}),
  // targetMap.remove({}),
  targetNode.remove({})
];

var server = app.listen(appEnv.port, '0.0.0.0', function() {
    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);

});

var  eachRecursive = function(obj){
    if(obj && obj.$oid){
      return new ObjectId(obj.$oid);
    }
    for (var k in obj){
        if(Array.isArray(obj[k])){
          for(var j =0; j< obj[k].length; j++){
            obj[k][j] = eachRecursive(obj[k][j]);
          }
        }
        if (k === '_id'){
          obj._id = new ObjectId(obj._id.$oid);
        } else if(obj[k] && obj[k].$oid){
          obj[k] = new ObjectId(obj[k].$oid);
        } if(typeof obj[k] === 'object') {
            obj[k] = eachRecursive(obj[k]);
        }
    }
    return obj;
};

q.all(promises1).
then(function(results){
  var fs = require('fs');
  var promises = [];

  //universal reader. note that json array may require different handling

  var array = fs.readFileSync('nodes.json', 'utf8').toString().split("\n");
  for(var z = 0; z < array.length; z++){
    array[z] = JSON.parse(array[z]);
    console.log(array[z]);
    array[z] = eachRecursive(array[z]);
    console.log(array[z]);
    promises.push(new targetNode(array[z]).save());
  }

  return q.all(promises);
})
.done(function(v,e){
  console.log(v,e);
});

server.___app = app;
module.exports=server;
