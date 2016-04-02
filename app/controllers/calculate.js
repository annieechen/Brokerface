// we lose one data point apparently, which isn't so bad, right?

var fs = require('fs');
var parse = require('../../node_modules/csv-parse');
var financial = require('./financial.js');

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
var toExport = function(stat, callback){
    financial(function(apiResponse){
        var splitLines = apiResponse.split("\n");
        var data = splitLines.map((line) => line.split(','))
        console.log(data);
        callback(data);
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

toExport('k', function(result){
    ;
})