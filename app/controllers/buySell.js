// functions to convert output of statFunctions to buy/sell data

var statFunctions = require('./statFunctions.js');

// kdStatOutputArray is an array of objects in the form {date, value, avevalue}
// where value is K, avevalue is D
var kd = function(data){
    var kdStatOutputArray = statFunctions.kd(data);
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
        insertObject.hold = (k > d);
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
               // console.log("ahhh the world is ending");
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

// buy and sell after a daily change of n up/down in a row
// so sell if it goes up n days in row, buy if it goes down n days in a row
var dchange = function(data, n){
    var buySell = [];
    for(var i = 0; i < data.length - 1; i++){
        var insertObject = {}
        if(i < n){
            insertObject.date = parseFloat(data[i+1][0]);
            insertObject.price = parseFloat(data[i+1][4]);
            insertObject.profit = 0;
            insertObject.hold = false;
            insertObject.buy = false;
            insertObject.sell = false;
            buySell.push(insertObject);
            continue;
        }
        
        // set the default values
        insertObject.date = parseFloat(data[i+1][0]);
        insertObject.price = parseFloat(data[i+1][4]);
        insertObject.profit = buySell[i-1].profit;
        insertObject.hold = buySell[i-1].hold;
        insertObject.sell = false;
        insertObject.buy = false;
        
        // if we're currently holding, we need to check whether to sell
        if(buySell[i-1].hold){
            // also if we're holding, then we update profits
            insertObject.profit = buySell[i-1].profit + insertObject.price - buySell[i-1].price;
            
            //check the last n days and see whether they're all going up
            var allUp = true;
            for(var j = i - n + 1; j <= i; j++){
                if(parseFloat(data[j+1][7]) <= 0){
                    allUp = false;
                    break;
                }
            }
            // if it's gone up the past n days we want to sell
            if(allUp){
                insertObject.sell = true;
                insertObject.hold = false;
                insertObject.buy = false;
            }
        }
        // otherwise if we're not holding we want to check if we buy
        else{
            // now check if the last n days are all going down
            var allDown = true;
            for(var j = i - n + 1; j <= i; j++){
                if(parseFloat(data[j+1][7]) >= 0){
                    allDown = false;
                    break;
                }
            }
            // if it's gone down the past n days we want to buy
            if(allDown){
                insertObject.sell = false;
                insertObject.buy = true;
                insertObject.hold = true;
            }
        }
        
        buySell.push(insertObject);
    }
    return buySell;
}

// algorithm that randomly buys and sells
var rando = function(data){
    var i = 0;
    var tradingDays = data.length;
    var wait = Math.floor(Math.random() * 15) + 1;
    var buySell = [];
    while(i < tradingDays - 1){
        var insertObject = {}
        insertObject.date = parseFloat(data[i+1][0]);
        insertObject.price = parseFloat(data[i+1][4]);
        if(wait > 0){
            if(i == 0){
                insertObject.hold = false;  
            }
            else{
                insertObject.hold = buySell[i-1].hold;
            }
            insertObject.buy = false;
            insertObject.sell = false;
            if(insertObject.hold){
                insertObject.profit = buySell[i-1].profit + insertObject.price - buySell[i-1].price;
            }
            else if(i == 0){
                insertObject.profit = 0;
            }
            else{
                insertObject.profit = buySell[i-1].profit;
            }
            buySell.push(insertObject);
            i++;
            wait--;
            continue;
        }
        // then we make a transaction
        // if we were holding before, then we sell now and reset wait to random
        else if(wait == 0 && buySell[i-1].hold){
            insertObject.hold = false;
            insertObject.sell = true;
            insertObject.buy = false;
            insertObject.profit = buySell[i-1].profit + insertObject.price - buySell[i-1].price;
            // reset wait
            wait = Math.floor(Math.random() * 15) + 15;
        }
        // otherwise, we weren't holding, so we buy and reset wait to random
        else if(wait == 0){
            insertObject.hold = true;
            insertObject.sell = false;
            insertObject.buy = true;
            wait = Math.floor(Math.random() * 15) + 15;
            insertObject.profit = buySell[i-1].profit;
        }
        buySell.push(insertObject);
        i++;
    }
    return buySell;
}

module.exports.kd = kd;
module.exports.dchange = dchange;
module.exports.rando = rando;