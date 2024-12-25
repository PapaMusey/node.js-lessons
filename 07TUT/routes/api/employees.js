const express = require('express');
const router = express.Router(); //defining our router 
const path = require('path');
const data = {};
data.employees = require('../../data/employees.json') // this is for connecting to the database

router.route('/')
    .get((req, res) => {
        res.json(data.employees)
    })
    .post((req, res) => {
        res.json({
            "firstname": req.body.firstname,
            "lastname": req.body.lastname
        })
    })
    .put((req, res) => {   // the http method you would use when updating an employee for example
        res.json({
            "firstname": req.body.firstname,
            "lastname": req.body.lastname
        });
    })
    .delete((req, res) => {
        res.json({ "id": req.body.id })
    })
    
    router.route('/:id')
    .get((req,res) => {
        res.json ({ "id": req.params.id })
    });
    



module.exports = router 