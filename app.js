const config = require('./config');
const { Hive } = require('@splinterlands/hive-interface');
const express = require('express')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var opsRouter = require('./routes/ops');
var usersRouter = require('./routes/users');

var app = express();
// Construct empty objects for counts (could probably be done cleaner, serves purpose for now)

// Operation counter object
let opCounter = {}

// Player counter object
let player = {
	counter: {},
	search: function () {
		return;
	}
}

// Stream for hive transactions
const hive = new Hive();
hive.stream({ 
	on_op: onOperation,
	save_state: () => null,
	load_state: () => null
});

function onOperation(op, block_num, block_id, previous, transaction_id, block_time) {
	// Filter out any operations not related to Splinterlands
	if(op[0] != 'custom_json' || !op[1].id.startsWith(config.operation_prefix))
		return;

	console.log(`Received operation: ${JSON.stringify(op)}`);
	// For each operation type, increment counter in opCounter object
	opCounter[op[1].id] += 1;
	// For each unique player operation, and count to total operations for that player
	player.counter[op[1].required_posting_auths[0]] += 1; 

}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/ops', opsRouter);
app.use('/users', usersRouter);

// Middleware to 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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


