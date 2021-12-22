/// <reference path="utils.js" />
/// <reference path="jquery-1.12.4.min.js" />
var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
var SurveyPage = function () {
    window.location.href = 'startsurvey.html';
}
var ViewSurveyPage = function () {
    window.location.href = 'view-submitted-survey.html';
}
var LoadSurvey = function (identifier) {
    utils.localStorage().set('selectedSurveyId',$(identifier).data('id'));
    utils.localStorage().set('selectedSurveyName', $(identifier).data('survey'));
    $('#myModal').modal('show');
    //window.location.href = 'startsurvey.html';
};
(function () {

})();
$(function () {
   
    db.transaction(queryGetAllSurveys, errorCB);
}); 

var queryGetAllSurveys = function (tx) {
   
    var queryGetAllSurveysSuccess = function (tx, surveys) {
        
        var divSurveys = '';
        var len = surveys.rows.length;
        if (len > 0) {
            utils.localStorage().set(surveys.rows)
            for (var i = 0; i < len; i++) {
                divSurveys += '<div class="survey-box-style" data-id="' + surveys.rows.item(i).Id + '" data-survey="' + surveys.rows.item(i).SurveyName + '"  onclick="LoadSurvey(this)" >' + surveys.rows.item(i).SurveyName + '</div > ';
            }
        }
        $("#divSurveys").append(divSurveys);
    };
    var query = "SELECT Id, SurveyName FROM Survey"; 
    //WHERE StartDate <='" + utils.today() + "' AND EndDate >='" + utils.today() + "';"
    tx.executeSql(query, [], queryGetAllSurveysSuccess, errorCB);
};
var errorCB = function(err) {
    //  $('#SyncUpdateProgress').modal('hide');
    var errMsg = err.message;
    console.log(errMsg);
    //
    //    alert("Error fetching Data: " + err.message);
}