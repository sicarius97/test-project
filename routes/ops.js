var express = require('express');
var router = express.Router();



/* GET ops page */
router.get('/', function(req, res, next){
    let transactions = req.app.locals.transactions;

    let opCounter = {}

    for (let i = 0; i < transactions.length; i++){
        if (!Object.keys(opCounter).includes(transactions[i][1].id)) {
            opCounter[transactions[i][1].id] = 0
        } 
        opCounter[transactions[i][1].id] += 1
    }
    console.log(opCounter)
    res.render('ops', {opCount: opCounter});
});

module.exports = router;