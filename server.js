var express = require('express');
var exphbs = require('express-handlebars')

var app = express();
app.set('port', process.env.PORT || 8000);
app.use(express.static(__dirname + '/public'));

// Set up handlebars view engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Homepage
app.get('/', function (req, res) {
  res.render('home');
})

// Result
app.get('/:id', function (req, res) {
  id = req.params.id;
  var result = {};
  if (Date.parse(id) || +id) {
    function naturalTimeFormat(date) {
      d = new Date(date * 1000);
      var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      var str = monthNames[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
      return str;
    }
    var naturalTime = (Date.parse(id) > 0) ? id : naturalTimeFormat(id);
    var unixTime = (+id) ? id : Date.parse(id) / 1000;
    result = {
      "UNIX": unixTime,
      "natural": naturalTime
    }
    result = JSON.stringify(result);
    res.render('result', {
      result: result
    });
  } else {
    result = {
      "UNIX": null,
      "natural": null
    }
    result = JSON.stringify(result);
    res.render('result', {
      result: result
    });
  }

})

// Get headers page
app.get('/headers', function (req, res) {
  res.set('Content-Type', 'text/plan');
  var s = '';
  for (var name in req.headers) {
    s += name + ': ' + req.headers[name] + '\n';
  }
  res.send(s);
})

// Custom 404 page
app.use(function (req, res) {
  console.log('404');
  res.status(404);
  res.render('404');
})

// Custom 500 page
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
})

app.listen(app.get('port'), function () {
  console.log('Express server started on http://localhost:' + app.get('port') + '. Press Ctrl-C to terminate connection.');
});