var express = require('express');
var router = express.Router();






/* GET ops page */
router.use(function (req, res, next){
    let transactions = req.app.locals.transactions;

    
    let players = {}

    for (let i = 0; i < transactions.length; i++){
        if (!Object.keys(players).includes(transactions[i].op[1].required_posting_auths[0])) {
            players[transactions[i].op[1].required_posting_auths[0]] = [];
            players[transactions[i].op[1].required_posting_auths[0]].push(transactions[i]);
        } else {
            players[transactions[i].op[1].required_posting_auths[0]].push(transactions[i]);
        }
        
    }

    
    let playersCount = {}

    for (const prop in players) {
        playersCount[prop] = players[prop].length
    }
    res.locals.players = players
    res.locals.playersCount = playersCount
    next()
    //res.render('players', {playersCount: playersCount});
})

router.get('/', function (req, res, next){
    res.render('players', {playersCount: res.locals.playersCount})
})

router.get('/search', function (req, res, next){
    const player = req.query.q
    let data = res.locals.players[player]
    res.send(data)
})

module.exports = router;