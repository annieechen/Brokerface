var data = [ [ 'Date', 'Open', 'High', 'Low', 'Close', 'Volume', 'Adj Close' ],
  [ '2015-02-25',
    '535.90245',
    '546.222501',
    '535.447406',
    '543.872489',
    '1825900',
    '543.872489' ],
  [ '2015-02-24',
    '530.002419',
    '536.792403',
    '528.252381',
    '536.092424',
    '1005000',
    '536.092424' ],
  [ '2015-02-23',
    '536.052398',
    '536.441404',
    '529.412422',
    '531.912381',
    '1457800',
    '531.912381' ],
  [ '2015-02-20',
    '543.132484',
    '543.75247',
    '535.802444',
    '538.952441',
    '1444300',
    '538.952441' ],
  [ '2015-02-19',
    '538.042413',
    '543.11247',
    '538.012424',
    '542.872432',
    '989100',
    '542.872432' ],
  [ '2015-02-18',
    '541.402458',
    '545.492471',
    '537.512456',
    '539.702422',
    '1453000',
    '539.702422' ],
  [ '2015-02-17',
    '546.83245',
    '550.00246',
    '541.092465',
    '542.842443',
    '1616800',
    '542.842443' ],
  [ '2015-02-13',
    '543.352447',
    '549.912491',
    '543.132484',
    '549.012501',
    '1900300',
    '549.012501' ],
  [ '2015-02-12',
    '537.252405',
    '544.822482',
    '534.675391',
    '542.932472',
    '1620200',
    '542.932472' ],
  [ '2015-02-11',
    '535.302416',
    '538.452412',
    '533.380397',
    '535.972405',
    '1377700',
    '535.972405' ],
  [ '2015-02-10',
    '529.302379',
    '537.702431',
    '526.922378',
    '536.942412',
    '1749800',
    '536.942412' ],
  [ '2015-02-09',
    '528.002366',
    '532.002411',
    '526.022388',
    '527.832406',
    '1267700',
    '527.832406' ],
  [ '2015-02-06',
    '527.64237',
    '537.202402',
    '526.412373',
    '531.002415',
    '1763500',
    '531.002415' ] ];
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
        Kstochastic[i-1].price = data[i][4];
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

module.exports.kd = calcStoAverage;

var Kstochastic = calcStochastic(data);
Kstochastic = calcStoAverage(Kstochastic);


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
console.log(findMaxProfit(data));

//console.log()
// if first one goes up, bought the first time, 
// highest right before sell goes down
//sell- buy + total profits
 