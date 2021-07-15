var express = require('express');
var router = express.Router();


var opList = [];

/* GET ops page */
router.get('/', function(req, res, next){
    for (const [key, value] of Object.entries(opCounter)){
        opList.append(`${key}: ${value}`);
    };
    next();
}, function(req, res, next){
    res.render('ops', {list: opList});
});

module.exports = router;