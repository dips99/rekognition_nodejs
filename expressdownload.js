var express = require('express');
var app = express(),path = require("path");
var fs = require('fs');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));    
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'www')));
var aws = require('aws-sdk');
var promise = require("bluebird");
require('dotenv').config();
    
app.post('/s3Proxy', function(req, res){
    // download the file via aws s3 here
    aws.config.update({
        accessKeyId: process.env.id,
        secretAccessKey: process.env.key,
      }
    );
    var s3 = new aws.S3();
    var location = "users_"+req.body.id+"/"+req.body.filename;
    var params = {
        Key: location || null,
        Bucket: req.body.bucketname || null
    };

    var filePath = path.join('', req.body.filename);

    var file = fs.createWriteStream(filePath, 'utf8');

    file.on('finish', function(){ 
        console.log("File Downloaded "+req.body.filename);
        ocr(req.body.filename, res);
        fs.unlinkSync(filePath);
        console.log(req.body.filename+" File deleted!");
    });
    s3.getObject(params).createReadStream().pipe(file);
});

function ocr(req, res){
    aws.config.update({ 
        accessKeyId: process.env.id, 
        secretAccessKey: process.env.key, 
        region: String(process.env.region)
    });
    var rekognition = new aws.Rekognition();
    var img_loc = req;
    var img_bytes = fs.readFileSync(img_loc);
    var params = {
      Image: { /* required */
        Bytes: img_bytes
        } /* Strings will be Base-64 encoded on your behalf */,
    };
    return new Promise( (resolve, reject) => {
        rekognition.detectText(params, function(err, data) {
          if (err){
                reject(err); // an error occurred
          } 
          else{ // successful response
                let words = data.TextDetections.filter((word) => {
                    return word.Type === 'LINE'; //we could filter by 'LINE' or 'WORD'
                }).map(filteredWord => {
                    return filteredWord.DetectedText + '\n';
                }).reduce((previous, current) => {
                    return previous.concat(current);
                }, ''); //note that we are initialzing the reduce function with a '' value. This is important if no text is detected on the image to avoid errors.
                //log the words found in the image to the console. 
                //You could also easily store this in a DB for future use
                console.log(words);
                resolve(words); 
            };
        });
    }).then(data => res.status(200).send(data)).catch(err=>res.status(500).send(err));
}
    
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('S3 Proxy app listening at http://%s:%s', host, port);
});