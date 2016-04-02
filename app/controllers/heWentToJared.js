var calculate = require('./calculate.js');
var buySell = require('./buySell.js');

var toExport = function(options, callback){
    calculate(options, function(optimal, buySellObject){
        var returnObject = {};
        // WE NEED TO REPLACE KDCROSS WITH A CASE FOR WHAT THE ALGORITHM IS 
        returnObject.series = buySellObject;
        //console.log(buySellObject);
        var notOpt = buySellObject[buySellObject.length - 1].profit;
        returnObject.efficiency = notOpt / optimal;
        callback(returnObject);
    })
}

module.exports = toExport;