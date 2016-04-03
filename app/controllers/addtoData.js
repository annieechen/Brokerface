
//  [ 'Date', 'Open', 'High', 'Low', 'Close', 'Volume', 'Adj Close' ],
// returns an added column to data, close of each day
// adds daily changes to data
var addDailyChange = function(data)
{
    var numDays = data.length;
    data[0].push("Daily Change");
    for (var i = 2; i < numDays; i++)
    {
        var dailyChange = data[i][4] - data[i-1][4];
        data[i].push(dailyChange);
    }
    return data;
}
//console.log(addDailyChange(data));

module.exports.dailychange = addDailyChange;