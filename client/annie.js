// we lose one data point apparently, which isn't so bad, right?

var fs = require('fs');
var parse = require('../node_modules/csv-parse');
// 0 = date
// 1 = open
// 2 = high
// 3 = low
// 4 = close
var parser = parse({delimiter: ','}, function(err, data){
  var len = data.length;
  var Dstochastic = [];
  var Kstochastic = {};
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
        Kstochastic[data[i][0]] = (k);

//   console.log("len =" + len);
//   console.log("n = " + Kstochastic.length);
//   for (var k = 0, n = Kstochastic.length; k < n; k++)
//     {
//         console.log(Kstochastic[k]);
//      //   console.log(Kstochastic[k]);
//     }
    //console.log(JSON.stringify(Kstochastic));
});

fs.createReadStream(__dirname+'/tempfile').pipe(parser);
