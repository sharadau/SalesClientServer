var express = require('express'),
  path = require('path'),
  favicon = require('serve-favicon'),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  cookieParser = require('cookie-parser'),
  cors = require('cors'),
  multer  = require('multer'),
  maillistener2  = require('mail-listener2');


module.exports=function(){

  var app = express();

  app.use(cors());
  app.use(favicon(path.join(__dirname,'../favicon.ico')));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended:false}));
  app.use(methodOverride('_method'));
  app.use(cookieParser());
  //app.use(express.static(path.join(__dirname,    '../public/')));
  app.use('/static', express.static(path.join(__dirname,    '../public/')));

    /*Configure the multer.*/

    app.use(multer({ dest: './uploads/',
        rename: function (fieldname, filename) {
            return filename+Date.now();
        },
        onFileUploadStart: function (file) {
            console.log(file.originalname + ' is starting ...')
        },
        onFileUploadComplete: function (file) {
            console.log(file.fieldname + ' uploaded to  ' + file.path)
            done=true;
        }
    }));

    /*Handling routes.*/

    /*app.get('/',function(req,res){
        res.sendfile("index.html");
    });*/



  return app;
}
