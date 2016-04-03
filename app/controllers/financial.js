// requiring financial gives you the toExport function which
// takes in a ticker and a callback function, queries the Yahoo Finance API
// to get historic data, and allows for callback function to run on that data

// this gives you a full html page with historic data
// http://finance.yahoo.com/q/hp?s=WU&a=01&b=19&c=2010&d=01&e=19&f=2010&g=d

// this supposedly gives you a csv with historical data
// http://ichart.finance.yahoo.com/table.csv?s=WU&a=01&b=19&c=2010&d=01&e=19&f=2010&g=d&ignore=.csv


var toExport = function(ticker, callback){
    var https = require('https');
    var start_month = '03';
    var start_day = '02';
    var start_year = '2015';
    var end_month = '04';
    var end_day = '02';
    var end_year = '2016';
    var qPath = '/table.csv?s=' + ticker + '&a=' + start_month + '&b=' + start_day + '&c=' + start_year + '&d=' + end_month + '&e=' + end_day + '&f=' + end_year + '&g=d';
    
    var options = {
     	host : 'ichart.finance.yahoo.com',
     	path : qPath
    };
    
    var yahooFinanceResCallback = function(response){
        var body = "";
        response.on('data', function(data) {
            body += data;
        });
        response.on('end', function() {
            callback(body);
            // var annie = require('annie.js');
            // var result = annie(function(body){
            //     callback(body);
            // });
        });
     }
     
    var request = https.request(options, yahooFinanceResCallback);
    request.on('error', function(e) {
        console.log('Problem with request: ' + e.message);
    });
    request.end();
    
    //console.log(body);
}

module.exports = toExport;

// var annie = require('./calculate.js');
// annie('K', function(result){
//     console.log(result);
// })

