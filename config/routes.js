module.exports=function(app){


    require('../routes/organizations.route')(app);
    require('../routes/projects.route')(app);
    require('../routes/employees.route')(app);
    require('../routes/billable_status.route')(app);
    require('../routes/participants.route')(app);
    require('../routes/emails.route')(app);
    require('../routes/fileupload.route')(app);
    require('../routes/cycles.route')(app);
    require('../routes/users.route')(app);
    require('../routes/privilages.route')(app);

    app.use('/api/*', function(req,res,next){
        res.status(404).json({"error":"No such service present"});
    })

  app.use('*',function(req, res, next) {
    res.send('<html><body><h1>404 Page Not Found</h1></body></html>',404);
  });



}