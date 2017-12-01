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

var renderFunc_enter  = jade.compileFile('./jade/enter.jade');
var renderFunc_wait   = jade.compileFile('./jade/wait.jade');
var renderFunc_result = jade.compileFile('./jade/result.jade');
var renderFunc_visa   = jade.compileFile('./jade/visa.jade');
var renderFunc_edit   = jade.compileFile('./jade/edit.jade');

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
		console.log(req.method);
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
				lang = fields.lang;
				console.log(lang);
				db.update({ _id:'ident'}, {$set:{lang: lang }}, {}, function(){} );
				var oldpath = files.filename.path;
				var newpath = 'C:/GIT/EXJOBB/test.mp4' ;
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
			db.find({ "_id": "ident" }, function (err, docs) {
				
				var pyth    = "C:/GIT/EXJOBB/Python27/python.exe ";
				var autosub = "C:/GIT/EXJOBB/Python27/scripts/autosub_app.py ";
				var param   = ' -F vtt -S ';
				param += docs[0].lang;
				//console.log(docs);
				param += " -D ";
				param += docs[0].lang;
				param += " ";
				console.log(param);
				var movie   = 'C:/GIT/EXJOBB/test.mp4';
				var cmd = exec(pyth + autosub + param + movie);
				
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.write("<html><head><meta http-equiv='refresh' content='1; url=result.html'></head></html>");
				
				return res.end();
			});
		}
		else if (justurl == '/ok.html')
		{
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write("<html><body>ok</body></html>");
			return res.end();
		}
		else if(justurl == '/result.html')
		{
			res.writeHead(200, {'Content-Type': 'text/html'});
			fs.readFile("C:/GIT/EXJOBB/test.vtt", 'utf8',function (err,data) {
				res.write(renderFunc_result({text:data}));
				return res.end();
			});
		}
		else if(justurl == '/visa.html')
		{
			console.log("serving visa");
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(renderFunc_visa());
			return res.end();
		}
		else if(justurl == '/edit.html')
		{
			console.log("serving visa");
			fs.readFile("C:/GIT/EXJOBB/test.vtt", 'utf8',function (err,data) {
				res.write(renderFunc_edit({text:data}));
				return res.end();
			});
		}
		else if (justurl == '/favicon.ico')
		{
			res.writeHead(404, {});
			res.write('Not found');
			res.end();
		}
		else if (justurl=='/test.mp4')
		{
			console.log("serving movie");
			res.writeHead(200, {'Content-Type': 'video/mp4'});
			fs.readFile("C:/GIT/EXJOBB/test.mp4", function(error, content) {
				res.end(content);
			});
		}
		else if (justurl=='/test.vtt')
		{
			console.log("serving subtitles");
			res.writeHead(200, {'Content-Type': 'text/vtt'});
			fs.readFile("C:/GIT/EXJOBB/test.vtt", function(error, content) {
				res.end(content, 'utf-8');
			});
		}
		else if (justurl=='/save.html')
		{
			console.log("serving save");

			var form = new formidable.IncomingForm();
			form.parse(req, function (err, fields, files)
			{
				var text = fields.text;
				//console.log(text);
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.write("<html><head><meta http-equiv='refresh' content='1; url=result.html'></head></html>");
				
				fs.writeFile("C:/GIT/EXJOBB/test.vtt", text, (err) => {
					if (err) throw err;
					console.log('The file has been saved!');
					res.end();
				});
			});
		}
		else if (justurl=='/download.vtt')
		{
			console.log("serving download");
			//res.sendFile("C:/GIT/EXJOBB/test.vtt");
			//res.writeHead(200, {'Content-Type': 'text/vtt'});
			//fs.readFile("C:/GIT/EXJOBB/test.vtt", function(error, content) {
			//	res.end(content);
			//});
			
			var stat = fs.statSync("C:/GIT/EXJOBB/test.vtt");
			var file = fs.readFileSync("C:/GIT/EXJOBB/test.vtt", 'binary');

			res.setHeader('Content-Length', stat.size);
			res.setHeader('Content-Type', 'text/vtt');
			res.setHeader('Content-Disposition', 'attachment; filename=download.vtt');
			res.write(file, 'binary');
			res.end();
		}
	}
).listen(2000); 



