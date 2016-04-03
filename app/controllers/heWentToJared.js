var calculate = require('./calculate.js');

var toExport = function(options, callback){
    calculate(options, function(wentToJaredOptions, buySellObject){
        // initialize the object that will be returned with the response
        var returnObject = {};
        // add the data series
        returnObject.series = buySellObject;
        var notOpt = buySellObject[buySellObject.length - 1].profit;
        
        // now get the current hold, buy, sell
        var currentState = buySellObject[buySellObject.length - 1];
        returnObject.currentHold = currentState.hold;
        returnObject.currentBuy = currentState.buy;
        returnObject.currentSell = currentState.sell;
        
        returnObject.descript = wentToJaredOptions.descript;
        
        var optimal = wentToJaredOptions.optimal;
        var simple = wentToJaredOptions.simple;
        var randOut = wentToJaredOptions.randOut;
        returnObject.efficiency = (notOpt - optimal) / Math.abs(optimal);
        returnObject.simpleEfficiency = (notOpt - simple)/Math.abs(simple);
        returnObject.randomEfficiency = (notOpt - randOut)/Math.abs(randOut);
        returnObject.ticker = wentToJaredOptions.ticker;
        callback(returnObject);
    })
}

module.exports = toExport;