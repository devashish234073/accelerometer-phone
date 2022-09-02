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
    res.end(JSON.stringify(queryObject));
  }
}
var PORT = 8080;
server.listen(PORT,function(){
  console.log(`listening on PORT ${PORT}`);
});
