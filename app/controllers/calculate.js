// we lose one data point apparently, which isn't so bad, right?
// we can require this, and run it with a callback function that takes the 
// JSON as an input and processes it the way it wants

var fs = require('fs');
var parse = require('../../node_modules/csv-parse');
var financial = require('./financial.js');
var statFunctions = require('./statFunctions.js');

function dummy(data){
    return "huzzah!";
}



// 0 = date
// 1 = open
// 2 = high
// 3 = low
// 4 = close
// var parser = parse({delimiter: ','}, function(err, data){
//   var Kstochastic = calcStochastic(data);
//   Kstochastic = calcStoAverage(Kstochastic);
//     console.log(JSON.stringify(Kstochastic));
//     });

// fs.createReadStream(__dirname+'/tempfile').pipe(parser);

// apiResponse is the body...the csv
var toExport = function(options, callback){
    financial(options.ticker, function(apiResponse){
        var splitLines = apiResponse.split("\n");
        var data = splitLines.map((line) => line.split(','));
        data.splice(-1,1);
        // console.log(data);
        // now data is the csv 2-D array that we want
        // run the things that we need to run on the data
        if(options.algorithm_id == 'k'){
            var jsonResult = statFunctions.k(data);
            //console.log(jsonResult);
            callback(jsonResult);
        }
        else if(options.algorithm_id == 'kd'){
            var jsonResult = statFunctions.kd(data);
            var optimal = statFunctions.opt(data);
            callback(optimal, jsonResult);
        }
    })
}

// // This should return the JSON results based on which stat you want
// var toExport = function(stat, callback){
//     var parser = parse({delimiter: ','}, function(err, data){
//         if(err){
//             console.log("mayday! mayday!");
//         }
//         // eventually there should be a switch statement here to call different
//         // functions based on the stat
//         // each one should call callback(result) so financial.js can get it
//         var result = dummy(data);
        
//         // result will hold the JSON output of whatever stats we choose to use
//         callback(result);        
//     });

//     fs.createReadStream(__dirname+'/tempfile').pipe(parser);
// }
module.exports = toExport