const config = require('./config');
const { Hive } = require('@splinterlands/hive-interface');
const express = require('express')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const opsRouter = require('./routes/ops');
const playersRouter = require('./routes/players');
const usersRouter = require('./routes/users');

const app = express();
/*
//Set up default mongoose connection
const mongoDB = 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const transactSchema = new mongoose.Schema({
	operation: String,

})
*/

let transactions = []

transaction_full = []

let opCounter = {}


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
	// player.counter[op[1].required_posting_auths[0]] += 1; 
	let transaction = {
		op: op,
		block_num: block_num,
		block_id: block_id,
		transaction_id: transaction_id,
		block_time: block_time
	}
	transaction_full.push(transaction);
	transactions.push(op);
}



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.locals.transactions = transactions;

app.use('/', indexRouter);
app.use('/ops', opsRouter);
app.use('/users', usersRouter);
app.use('/players', playersRouter);

// Set local res variables to be accessed in views when a request is submitted




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


