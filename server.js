var http = require("http");
var fs = require("fs");
var server = http.createServer(serverfunction);
var data = fs.readFileSync("accelerometer.html");
function serverfunction(req,res) {
  if(req.url=="/") {
    res.end(data);
  }
var PORT = 8080;
server.listen(PORT,function(){
  console.log(`listening on PORT ${PORT}`);
});
