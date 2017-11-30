var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var fs = require('fs');
var exec         = require('child_process').execSync;

var index = require('./routes/index');
var users = require('./routes/users');

var http         = require('http');
var jade = require('jade');
var renderFunc_enter = jade.compileFile('./jade/enter.jade');
var renderFunc_wait = jade.compileFile('./jade/wait.jade');

var app = express();


// Type 3: Persistent datastore with automatic loading
var Datastore = require('nedb')
  , db = new Datastore({ filename: 'ne.db', autoload: true });
// You can issue commands right away

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

var namn;
http.createServer(
	function (req, res)
	{
		console.log( "request is : " + req.url + "\n" );
		var justurl = req.url.split('?')[0];
		namn = req.url.split('=')[1];
		console.log( "just request is : " + justurl + "\n" );
		if(justurl == '/')
		{
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(renderFunc_enter());
			return res.end();
		}
		else if (justurl == '/wait.html')
		{
			db.update({ _id:'ident'}, {$set:{name: namn }}, {}, function(){} );

			var form = new formidable.IncomingForm();
			form.parse(req, function (err, fields, files)
			{
				var oldpath = files.filename.path;
				var newpath = 'C:/GIT/EXJOBB/test.fil' ;
				fs.rename(oldpath, newpath, function (err) {
					if (err) throw err;
					res.writeHead(200, {'Content-Type': 'text/html'});
					res.write(renderFunc_wait());
					return res.end();
				});
			});
		}
		else if (justurl == '/process.html')
		{
			//db.find({_id:'ident'}, function (err, docs) {
			//	//console.log(docs);
			//	namn = docs[0].name;
			//	//console.log(namn);
			//	
			//	
			//});
			exe = "path to exe";
		}
		else if (justurl == '/favicon.ico')
		{
			res.status(404).send('Not found');
		}
	}
).listen(2000); 



