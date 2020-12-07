let Injury = require('../models/injury_schema')
let express = require('express')
let router = express.Router()


//get all injuries - MongoDB
router.get('/injuries', (req, res) => {
    Injury.find((err, injuries) => {
        if(err) {
            //res.send(err)
            res.sendStatus(500)
            res.end()
            return
        } else {
            //res.json(injuries)
            console.log('data: ' + injuries)
            res.render('injurypage', {title: 'Injury List', injuryData: injuries})
        }
    })
})

//post injury - MongoDB (requires all parameters)
router.post('/injuries', (req, res) => {
    if(!req.body) {
        return res.status(400).send('Request body is missing')
    }

    let model = new Injury(req.body)
    model.save()
        .then(doc => {
            if(!doc || doc.length == 0) {
                return res.status(500).send(doc); //model doesn't match or empty
            }
            res.status(201).send(doc);
        })
        .catch(err => {
            res.status(500).json(err);
        })

})

//query injuries by return data
router.post('/return_injury', (req, res) => {
    let input_date = new Date(req.body.dateJSON);
    console.log(input_date)
    Injury.find({ returnDate: { $lte: input_date} }, (err, injuries) => {
        if (err) throw err;
        
        // console.log('new data: ' + injuries);
        // console.log('num: ' + injuries.length)
        // res.render('injurypage', {title: 'Injury List', injuryDate: injuries})
        res.end(JSON.stringify(injuries));
    })
})

//update injury - MongoDB. Match by ID and update return Date and comments
router.patch('/injuries/:id', (req, res) => {
    Injury.findOneAndUpdate({_id: req.params.id}, {returnDate: req.body.returnDate, Status: req.body.Status}, {upsert: true}, function(err, doc) {
        if(err) return res.send(500, {error: err});
        return res.send("Injury successfully updated");
    });

})

//update percentage - MongoDB. Match by ID
router.patch('/injuries/:id/pct', (req, res) => {
    Injury.findOneAndUpdate({_id: req.params.id}, {pts_pct: req.body.pcts_pct}, {upsert: true}, function(err, doc) {
        if(err) return res.send(500, {error: err});
        return res.send("Injury successfully updated");
    })
})

module.exports = router