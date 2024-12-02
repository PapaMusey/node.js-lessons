const express = require('express');
const router = express.Router();
const path = require('path');

router.get('^/$|/index(.html)?', (req, res) => {
    // res.sendFile('./views/index.html', { root:__dirname }); 
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
})
router.get('/new-page(.html)?', (req, res) => {
    // since we are in the root we need to come back up so we can access 
    // the views folder and new-page.html hence '..'
    res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'));
})

router.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, ('/new-page.html'));
})

module.exports = router;