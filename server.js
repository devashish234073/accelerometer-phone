var http = require("http");
var fs = require("fs");
const url = require('url');
var MAX_CACHE_SIZE = 100;
const fName = "data.txt";

if(process.argv.length==3) {
  try {
    var cache_size = parseInt(process.argv[2]);
    MAX_CACHE_SIZE = cache_size;
    console.log(`cache size updated to ${MAX_CACHE_SIZE}`);
  } catch(e) {

  }
}

var server = http.createServer(serverfunction);
var data = fs.readFileSync("accelerometer.html");
var graphs = String(fs.readFileSync("graphs.html"));
var livegraph = String(fs.readFileSync("livegraph.html"));
var bell = String(fs.readFileSync("bell.html"));
function serverfunction(req,res) {
  if(req.url=="/") {
    res.end(data);
  } else if(req.url.indexOf("/data")==0) {
    const queryObject = url.parse(req.url, true).query;
    console.log(queryObject);
    writeToFileAsynchronously(queryObject);
    res.end(JSON.stringify(queryObject));
  } else if(req.url=="/graphs") {
    if (!fs.existsSync(fName)) {
      res.end("No data exists to plot graph");
    } else {
      var oldData = String(fs.readFileSync(fName));
      if(oldData=="") {
        res.end("No data exists to plot graph");
      } else {
        res.end(graphs.replace(`var data = "[]"`,`var data = ${JSON.stringify(oldData)}`));
      }
    }
  } else if(req.url=="/bells") {
    res.end(bell);
  } else if(req.url=="/livegraph") {
    res.end(livegraph);
  } else {
    res.end("invalid page. Go to <a href='/'>Home</a>");
  }
}

var objArr = [];
function writeToFileAsynchronously(obj) {
  objArr.push(obj);
  if(objArr.length%MAX_CACHE_SIZE==0) {//to insert to file only after MAX_CACHE_SIZEth data
    var oldData = "";
    if (fs.existsSync(fName)) {
      oldData = fs.readFileSync(fName);
      //console.log(`old file content [ ${oldData} ]`);
    }
    var o = undefined;
    if(oldData!="") {
      o = JSON.parse(oldData);
      o = o.concat(objArr);
    }
    if(o==undefined) {
      fs.writeFileSync(fName,JSON.stringify(objArr));
      console.log("written new data to file, array size has become "+objArr.length);
    } else {
      fs.writeFileSync(fName,JSON.stringify(o));
      console.log("appended new data to file, array size has become "+objArr.length+", total data size in file "+o.length);
    }
    objArr = [];
  }
}

var PORT = 8080;
server.listen(PORT,function(){
  console.log(`listening on PORT ${PORT}`);
});
