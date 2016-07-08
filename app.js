 
var express         = require('express'),
    http            = require('http'),
    path            = require('path'),
    favicon         = require('serve-favicon'),
    logger          = require('morgan'),
    cookieParser    = require('cookie-parser'),
    bodyParser      = require('body-parser');

// 创建APP
    var app    = express();
 
// 模版引擎、路径
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
    app.set('config', {

    });

// 网页图标
    app.use(favicon(__dirname + '/public/favicon.ico'));

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());

// 静态文件路径
    app.use(express.static(path.join(__dirname, 'public')));



// 路由
    app.use('/test', require('./routes/home'));
    app.use('/test2', function(req, res, next) {

         res.send('test2');
    });

    
    app.get('/test3', function(req, res) {
        res.send('test3');
    });


    app.use('/',     require('./routes/index'));
// 捕获 404 错误
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });





// 侦听端口
    http.createServer( app ).listen(3001);
    http.createServer( app ).listen(3002);

    module.exports = app;
