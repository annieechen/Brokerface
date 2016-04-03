// we lose one data point apparently, which isn't so bad, right?
// we can require this, and run it with a callback function that takes the 
// JSON as an input and processes it the way it wants

var fs = require('fs');
var parse = require('../../node_modules/csv-parse');
var financial = require('./financial.js');
var statFunctions = require('./statFunctions.js');
var buySell = require('./buySell.js');
var addtoData = require('./addtoData.js');

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
        var headers = [data[0]];
        data = data.splice(2);
        data.reverse();
        data = headers.concat(data);
        var addChange = addtoData.dailychange;
        data = addChange(data);
        //console.log(data);
        // now data is the csv 2-D array that we want
        // run the things that we need to run on the data
        var optimal = statFunctions.opt(data);
        var simple = statFunctions.simple(data);
        var randOut = statFunctions.rando(data);
        var wentToJaredOptions = {'optimal': optimal,
                                  'simple': simple,
                                  'randOut': randOut,
                                  'ticker': options.ticker};
        if(options.algorithm_id.startsWith('dchange')){
            var n = options.algorithm_id.substring(7);
            n = parseInt(n);
            if(Number.isNaN(n)){
                console.log("ya'll motherfuckers didn't calculate.js an integer to parse!");
                n = 3;
            }
            var buySellObject = buySell.dchange(data, n);
            wentToJaredOptions.descript = 'This algorithm uses recent daily averages to predict peaks and troughs in the stock\'s price. After ' + n + ' straight days of downward movement, buy in to aim for a lower entry cost, and similarly, sell after ' + n + ' straight days of gains.'
            //console.log(jsonResult);
            callback(wentToJaredOptions, buySellObject);
        }
        else if(options.algorithm_id == 'kd'){
            var buySellObject = buySell.kd(data);
            wentToJaredOptions.descript = 'This algorithm looks at slow stochastics (K) and fast stochastics (D) to approximate the movement and momentum, respectively, of the stock. When K is above D, the recent movements are pulling the general trend upward, meaning the stock is going up, and vice versa.'
            callback(wentToJaredOptions, buySellObject);
        }
        else if(options.algorithm_id == 'rando'){
            var buySellObject = buySell.rando(data);
            wentToJaredOptions.descript = 'This algorithm determines when to buy and sell completely randomly and thus should have no advantage over the market.'
            callback(wentToJaredOptions, buySellObject);
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