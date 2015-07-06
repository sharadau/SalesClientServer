'use strict';

/**
 * @ngdoc service
 * @name dashboardApp.prospect
 * @description
 * # prospect
 * Service in the dashboardApp.
 */
angular.module('dashboardApp')
  .service('ProspectService', function ($http) {
    var prospects = [];

    // AngularJS will instantiate a singleton by calling "new" on this function
    this.getAllProspects = function () {
      //console.log("getAllprojects");
      var successCallback, errorCallback;
      var response = {
        success: function (callback) {
          successCallback = callback;
          return response;
        },
        error: function (callback) {
          errorCallback = callback;
          return response;
        }
      };

//fecth prospecs from nodejs server
      //$http.get('http://localhost:3000/api/projects')
        $http.get(service_base_url+'/api/projects')

        .success(function (items) {
          prospects = items;
          successCallback(prospects);
        })
        .error(function (error) {
          if (error) {
            errorCallback(error);
          }
        });

//fetch prospects from java server
     /* $.ajax({
        type: "POST",
        dataType: 'json',
        url: 'http://localhost:8080/SalesDashBoard/rest/prospect/fetchProspects/1',
        //crossDomain : true,
        headers: {
          'Content-Type': 'application/json'
        }
      })
       .success(function (items) {
          prospects = items['data'];
          console.log("in service "+items['data']);          
          successCallback(prospects);
        })
        .error(function (error) {
          if (error) {
            errorCallback(error);
          }
        });

    */
      return response;

    };
    this.getProspect = function (prospectId) {
      var successCallback, errorCallback;
      var response = {
        success: function (callback) {successCallback = callback; return response;},
        error: function (callback) {errorCallback = callback; return response;}
      };
      
      $http.get(service_base_url+'/api/projects/'+prospectId)
        .success(function(item){
                successCallback(item);
        })
        .error(function(error){
          if (error) {
            errorCallback({msg: 'No prospect with: ' + prospectId + ' id'});
          }
        });

      return response;
    };
        this.getProspectsInitiatedInMonth = function (month, year) {
            var successCallback, errorCallback;
            var response = {
                success: function (callback) {successCallback = callback; return response;},
                error: function (callback) {errorCallback = callback; return response;}
            };

            $http.get(service_base_url+'/api/projects/getProjectForMonth/'+month+"::"+year)
                .success(function(item){
                    successCallback(item);
                })
                .error(function(error){
                    if (error) {
                        errorCallback({msg: 'No prospect with: ' + prospectId + ' id'});
                    }
                });

            return response;
        };
    this.addProspect = function(newProspect1) {
      var newProspect={};
        if(typeof newProspect1.description != 'string')
        {
            newProspect1.description = '';
        }
        if(typeof newProspect1.othercomments != 'string')
        {
            newProspect1.othercomments = '';
        }
        if(typeof newProspect1.companyURL != 'string')
        {
            newProspect1.companyURL = '';
        }
        if(typeof newProspect1.company != 'string')
        {
            newProspect1.company = '';
        }



      newProspect1.organization = newProspect1.company;
      newProspect1.employees = ['Ram','Raghu'];
      newProspect1.owner = 'Ram';
      newProspect1.openpositions = 2;
      newProspect1.reddays = 0;
      newProspect1.state = newProspect1.state;
      newProspect1.state_id = newProspect1.state_id;
      newProspect1.company = newProspect1.company;
      newProspect1.companyURL = newProspect1.companyURL;
      newProspect1.description = newProspect1.description;
      newProspect1.othercomments = newProspect1.othercomments;
      newProspect1.sendEmail = newProspect1.sendEmail;
      newProspect1.updatedDate = new Date().toDateString();
      newProspect1.updatedBy = 1;  
      newProspect1.area = newProspect1.area;
      newProspect1.initiatedBy = newProspect1.initiatedBy;
      newProspect1.start_date = new Date().toDateString();
     // newProspect1._id = newProspect1.id;
      console.log(newProspect1);
      $http.post(service_base_url+'/api/projects', newProspect1)
        .success(function (item) {
          prospects.push(item);
        })
        .error(function (error) {
          if (error) {
            errorCallback(error);
          }
        });

        //add prospect to nodejs server
        //initiatedProspect add participant
        if(newProspect1.initiatedBy != '')
        {

        }

    };

    this.deleteProspectById = function(projId) {
    	
      $http.delete(service_base_url+'/api/projects/'+projId)
        .success(function (item) {var idx = getProspectIndex (prospects, '' + projId);
          if (idx !== -1) {
            prospects.splice(idx, 1);
          }
        })
        .error(function (error) {
          if (error) {
            errorCallback(error);
          }
        });
    };

    this.updateProspect = function(newProspect) {
      
      console.log(newProspect);

        $http.put(service_base_url+'/api/projects/' + newProspect._id, newProspect)
          .success(function (item) {
            var idx = getProspectIndex(prospects, '' + newProspect._id);
            if (idx !== -1) {
              prospects[idx] = item;
            }
          })
          .error(function (error) {
            if (error) {
              console.log(error);
            }
          });

    };
    this.ClosureDetails = function(prospect_id, stage, stage_id, closureNotes, engagementLetter) {
        var newProspect = {};
        newProspect._id = prospect_id;
        newProspect.closureNotes = closureNotes;
        newProspect.engagementLetter = engagementLetter;
        newProspect.state = stage;
        newProspect.state_id = stage_id;
        newProspect.end_date = new Date().toDateString();

        $http.put(service_base_url+'/api/projects/' + newProspect._id, newProspect)
            .success(function (item) {
                alert("Prospect closure completed");
            })
            .error(function (error) {
                if (error) {
                    console.log(error);
                }
            });
    }
        this.saveNotes = function(prospect_id, notes, stage) {
            var newProspect = {};

            newProspect._id = prospect_id;
            if(stage == '1'){
                newProspect.notes1 = notes;
            }else if (stage == '2'){
                newProspect.notes2 = notes;
            }else if (stage == '3'){
                newProspect.notes3 = notes;
            }else if (stage == '4'){
                newProspect.notes4 = notes;
            }else if (stage == '5'){
                newProspect.notes5 = notes;
            }


            console.log("prospect:"+newProspect);
            $http.put(service_base_url+'/api/projects/' + newProspect._id, newProspect)
                .success(function (item) {
                    alert("Prospect notes saved");
                })
                .error(function (error) {
                    if (error) {
                        console.log(error);
                    }
                });
        }
        this.addQuestions = function(prospect_id, questions, questionsDoc) {
            var newProspect = {};

            newProspect._id = prospect_id;
            newProspect.questions = questions;
            if(questionsDoc != '')
            {
                newProspect.questionsDoc = questionsDoc;
            }

            console.log("prospect:"+newProspect);
            $http.put(service_base_url+'/api/projects/' + newProspect._id, newProspect)
                .success(function (item) {
                    alert("Prospect questions added");
                })
                .error(function (error) {
                    if (error) {
                        console.log(error);
                    }
                });
        }
    this.updateStage = function(prospect_id, stage,stage_id) {

        var newProspect = {};
        newProspect._id = prospect_id;
        newProspect.state = stage;
        newProspect.state_id = stage_id;

          $http.put(service_base_url+'/api/projects/updateStage/' + newProspect._id, newProspect)
            .success(function (item) {
            	 console.log("success");
            	 alert("Prospect stage completed");
            })
            .error(function (error) {
              if (error) {
                console.log(error);
              }
            });

      };


    this.getProspectByName = function (prospects, name) {
      if (!prospects) {
        return undefined;
      }
      var len = prospects.length;
      for (var idx = 0; idx < len; idx++) {
        if (prospects[idx].name === name) {
          return prospects[idx];
        }
      }
      if (len > 0) {
        return prospects[0];
      }
      return undefined;
    };

    var getProspectIndex = function (prospects, prospectId) {
      var len = prospects.length;
      for (var idx = 0; idx < len; idx++) {
        if ('' + prospects[idx]._id === prospectId) {
          return idx;
        }
      }
      return -1;
    };
  });
