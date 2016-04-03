// this file holds all of the functions to calculate various stats
// each on should take in a two-dimensional array of data and return
// a list of objects that return the stat over time
// 
var calcStochastic = function(data)
{
    var len = data.length;
    var Kstochastic =[];
    for (var i = 1; i < len -1; i++)
    { 
        var max = parseFloat(data[i][2]);
        var min = parseFloat(data[i][3]);
        // calculate high and low of past 14 days
        for (var j = i - 14; j <= i; j++)
        {
            if(j < 1){
                continue;
            }
            // high
            if(parseFloat(data[j][2]) > max)
            {
              max = parseFloat(data[j][2]);
            }
            // low
            if(parseFloat(data[j][3]) < min)
            {
                min = parseFloat(data[j][3]);
            }
        }
        var k = 100 *(parseFloat(data[i][4]) - min) /(max - min);
        // initialize to object
        Kstochastic[i-1] = {};
        Kstochastic[i-1].date = data[i][0];
        Kstochastic[i-1].value = k; 
        Kstochastic[i-1].avevalue = 0;
        Kstochastic[i-1].price = parseFloat(data[i][4]);
    }
    return Kstochastic;
}


var calcStoAverage = function(data)
{
    var Kstochastic = calcStochastic(data);
    //console.log(Kstochastic);
    var len = Kstochastic.length;
    for (var i = 0; i < len; i++)
    {
        var avehigh = 0;
        var counter = 0;
        for (var j = i - 3; j < i; j++)
        {
            // make sure not indexing past the array
            if(j < 1)
            {
                continue;
            }
            avehigh = avehigh + Kstochastic[j].value;
            counter++;
        }
        avehigh = avehigh/counter;
        if(counter == 0)
        {
            avehigh = Kstochastic[i].value;
        }
        Kstochastic[i].avevalue = avehigh;
    }
    return Kstochastic;
}

// wrapper to calcStoAverage that can take in data instead of stochastic output
var exportStoAverage = function(data){
    return calcStoAverage(calcStochastic(data));
}

// takes in data files, returns max profit as a float
// calculates assuming you can own a max of one share at a time
// must parsefloat every time
var findMaxProfit = function(data)
{
    var close = 4;
    var profit = 0;
    var numDays = data.length;
    var haveStock = false; // determine whether looking to buy or sell
    var boughtAt;
    for (var i = 1; i < numDays -1; i++)
    {
        // determine when to buy the first stock
        if(!haveStock)
        {
            if (parseFloat(data[i+1][close]) > parseFloat(data[i][close]))
            {
                boughtAt = parseFloat(data[i][close]);
                haveStock = true;
            }
        }
        // else, you have a stock, when should you buy?
        else
        {
            // looking for where price will drop the next day
            if(parseFloat(data[i+1][close]) < parseFloat(data[i][close]))
            {
                if(boughtAt > parseFloat(data[i][close]))
                {
                    console.log("What are you doing you ho");
                }
                profit += parseFloat(data[i][close]) -  boughtAt;
                haveStock = false;
            }
        }
    }
    // process how much you'd make throughout the rest
    return profit;
}

// determines how much you would have made if you bought at begin, sold at end
var findSimpleBuySell = function(data)
{
    var numDays = data.length - 1;
    var result = parseFloat(data[numDays][4]) - parseFloat(data[1][4]);
    return result;
}

// determines how much you would make if you bought and sold at random
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
    var profit = buySell[buySell.length - 1].profit;
    return profit
}


module.exports.kd = calcStoAverage;
module.exports.opt = findMaxProfit;
module.exports.simple = findSimpleBuySell;
module.exports.rando = rando;






 