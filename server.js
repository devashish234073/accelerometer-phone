var http = require("http");
var fs = require("fs");
const url = require('url');


var server = http.createServer(serverfunction);
var data = fs.readFileSync("accelerometer.html");
function serverfunction(req,res) {
  if(req.url=="/") {
    res.end(data);
  } else if(req.url.indexOf("/data")==0) {
    const queryObject = url.parse(req.url, true).query;
    console.log(queryObject);
    writeToFileAsynchronously(queryObject);
    res.end(JSON.stringify(queryObject));
  }
}

var objArr = [];
function writeToFileAsynchronously(obj) {
  objArr.push(obj);//for testing reduced it to 2 will change back to 100
  if(objArr.length%2==0) {//to insert file only after 100th data
    console.log("writing to file, array size has become"+objArr.length);
    fName = "data.txt";
    var oldData = "";
    if (fs.existsSync(fName)) {
      oldData = fs.readFileSync(fName);
    }
    fs.writeFileSync(fName,oldData+",,,"+JSON.stringify(objArr));
    objArr = [];
  }
}

var PORT = 8080;
server.listen(PORT,function(){
  console.log(`listening on PORT ${PORT}`);
});
