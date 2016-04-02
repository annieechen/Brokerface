// this can write out the csv to a file called /client/tempfile



// this gives you a full html page with historic data
// http://finance.yahoo.com/q/hp?s=WU&a=01&b=19&c=2010&d=01&e=19&f=2010&g=d

// this supposedly gives you a csv with historical data
// http://ichart.finance.yahoo.com/table.csv?s=WU&a=01&b=19&c=2010&d=01&e=19&f=2010&g=d&ignore=.csv

var https = require('https');

var ticker = 'AAPL';
var start_month = '01';
var start_day = '10';
var start_year = '2010';
var end_month = '01';
var end_day = '25';
var end_year = '2015';
var qPath = '/table.csv?s=' + ticker + '&a=' + start_month + '&b=' + start_day + '&c=' + start_year + '&d=' + end_month + '&e=' + end_day + '&f=' + end_year + '&g=d';

var options = {
 	host : 'ichart.finance.yahoo.com',
 	path : qPath
};

var callback = function(response){
    var body = "";
    response.on('data', function(data) {
        body += data;
    });
    response.on('end', function() {
        var fs = require('fs');
        fs.writeFile("../../client/tempfile", body, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        }); 
    });
 }
 
var request = https.request(options, callback);
request.on('error', function(e) {
    console.log('Problem with request: ' + e.message);
});
request.end();

//console.log(body);