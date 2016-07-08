
    var express = require('express');
    var router  = express.Router();
    var http = require('http');


    router.get('/', function(req, res, next) {

        res.sendfile('demo/冬瓜百科 - 首页.html')
    });

    router.get('/:id', function(req, res, next) {

        res.send('index'+req.url);
    });



    module.exports = router;
