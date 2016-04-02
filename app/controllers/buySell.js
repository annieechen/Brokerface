// functions to convert output of statFunctions to buy/sell data

var statFunctions = require('./statFunctions.js');
var data = statFunctions.data;
var kdOutput = statFunctions.kd(data);

// kdStatOutputArray is an array of objects in the form {date, value, avevalue}
// where value is K, avevalue is D
var kdCross = function(kdStatOutputArray){
    var buySell = [];
    // whether or not you hold shares (NOT NECESSARILY EQUAL TO object.hold CAUSE I DONT KNOW HOW ELSE TO DO IT)
    var ownsShares = false;
    for(var i = 0; i < kdStatOutputArray.length; i++){
        var insertObject = {}
        var k = kdStatOutputArray[i].value;
        var d = kdStatOutputArray[i].avevalue;
        // set the date and price to be, well, the date and price
        // set the hold to be whether K > D
        insertObject.date = kdStatOutputArray[i].date;
        insertObject.price = kdStatOutputArray[i].price;
        insertObject.hold = (k < d);
        insertObject.buy = false;
        insertObject.sell = false;

        if(i == 0){
            // then just set your money to zero
            insertObject.profit = 0;
            buySell.push(insertObject);
            continue;
        }
        //console.log(buySell)
        // update our money account
        var pastProfit = buySell[i-1].profit;
        if(ownsShares){
            insertObject.profit = pastProfit + insertObject.price - buySell[i-1].price;
            if(insertObject.profit < pastProfit){
                console.log("ahhh the world is ending");
            }
        }
        else{
            insertObject.profit = pastProfit;
        }
        
        // if we were in the hold period before, but not now, then we want to
        // sell
        if(buySell[i-1].hold && !(insertObject.hold)){
            insertObject.sell = true;
            ownsShares = false;
        }
        // otherwise if we were not in the hold period before but we are now,
        // then we want to buy
        else if(!(buySell[i-1].hold) && insertObject.hold && !(k > 80 || d > 80)){
            insertObject.buy = true;
            ownsShares = true;
        }
        buySell.push(insertObject);
    }
    return buySell;
}

var array = kdCross(kdOutput);
console.log(array[array.length - 1].profit)