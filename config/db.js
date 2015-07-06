var env = process.env.ENV || 'dev';

var config = require('./config-'+env),
  mongoose = require('mongoose');

module.exports = function(){

  var db = mongoose.connect(config.db, function(err) {
    if (err) {
      console.error('Could not connect to MongoDB!');
      console.log(err);
    }

  });

    require('../models/dashboard.organizations.js');
    require('../models/dashboard.projects.js');
    require('../models/dashboard.employees.js');
    require('../models/dashboard.participants.js');
    require('../models/dashboard.billable_status.js');
    require('../models/dashboard.emails.js');
    require('../models/dashboard.cycles.js');
    require('../models/dashboard.users.js');
    require('../models/dashboard.privilages.js');
  return db;
}
