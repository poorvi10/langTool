var express = require('express'); 
var multer = require('multer'); 
var bodyParser = require('body-parser'); 
var app = express(); 
var http = require('http');
var fs = require('fs');
app.use(bodyParser.json()); 

app.use(express.static(__dirname + '/public'));
var filename = '';

var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./files");
    },
    filename: function (req, file, callback) {
        filename = file.fieldname + "_" + Date.now() + "_" + file.originalname;
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload = multer({ storage: Storage }).array("fileUploader", 1); //Field name and max count 
app.get("/", function (req, res) { 
    res.sendFile(__dirname + "public/index.html"); 
}); 

app.post("/api/Upload", function (req, res) {
    upload(req, res, function (err) {
        if (err) { 
            return res.end("Something went wrong!"); 
        }
        //return res.end("File uploaded sucessfully!."); 
        fs.readFile('./files/'+filename, function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            return res.end(data);
        });
    }); 
});

app.listen(2000, function (a) { 
    console.log("Listening to port 2000"); 
}); 
