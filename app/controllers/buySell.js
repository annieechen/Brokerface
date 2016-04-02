// functions to convert output of statFunctions to buy/sell data

var statFunctions = require('./statFunctions.js');

// kdStatOutputArray is an array of objects in the form {date, value, avevalue}
// where value is K, avevalue is D
var kdCross = function(kdStatOutputArray){
    var buySell = [];
    // initialize lastBuy to -1 if there was no previous purchase of shares
    var lastBuy = -1;
    // whether or not you hold shares (NOT NECESSARILY EQUAL TO object.hold CAUSE I DONT KNOW HOW ELSE TO DO IT)
    var ownsShares = false;
    for(var i = 0; i < kdStatOutputArray.length; i++){
        var insertObject = {}
        // set the date and price to be, well, the date and price
        // set the hold to be whether K > D
        insertObject.date = kdStatOutputArray[i].date;
        insertObject.price = kdStatOutputArray[i].price;
        insertObject.hold = (kdStatOutputArray[i].value > kdStatOutputArray[i].avevalue);
        insertObject.buy = false;
        insertObject.sell = false;

        if(i == 0){
            // then just set your money to zero
            insertObject.money = 0;
            continue;
        }
        
        // update our money account
        var pastMoney = buySell[i-1].money;
        if(ownsShares){
            insertObject.money = pastMoney + insertObject.price - buySell[i-1].price;
        }
        
        // if we were in the hold period before, but not now, then we want to
        // sell
        if(buySell[i-1].hold && !(insertObject.hold)){
            insertObject.sell = true;
            ownsShares = false;
        }
        // otherwise if we were not in the hold period before but we are now,
        // then we want to buy
        else if(!(buySell[i-1].hold) && insertObject.hold){
            insertObject.buy = true;
            ownsShares = true;
        }
        
        
    }
}