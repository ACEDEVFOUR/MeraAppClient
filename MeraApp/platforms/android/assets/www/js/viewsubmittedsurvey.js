/// <reference path="utils.js" />

/// <reference path="jquery-1.12.4.min.js" />

var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
(function () {

})(); 
$(function () {
    db.transaction(queryLoadSurveyData, errorCB);
});
var setSurveyId = function (id) {
    utils.localStorage().set('dataSurveyId', id);
}
var ViewSurveyData = function (id) {
    utils.localStorage().set('dataSurveyId', id);
    window.location.href = 'view-survey.html';
}
var EditSurveyData = function (id) {
    utils.localStorage().set('dataSurveyId', id);
    window.location.href = 'edit-survey.html';
}
var queryLoadSurveyData = function (tx) {
    var html = "";
    var query = "";
    var createGridSurveyData = function (tx, data) {
        var surveyName = utils.localStorage().get('selectedSurveyName');
        html += '<div class="clearboth"></div><div class="panel panel-default">';
        html += '<a data-toggle="collapse" data-parent="#accordion" class="color-w text-decoration" href = "#collapse1" ><div class="panel-heading" style="background:#888785;padding:2vw;">' + surveyName + '</div></a >';
        html += '</div>';
        html += '<div id="collapse1" class="panel-collapse collapse in">';
        html += '<div class="panel-body" style="padding: 1px;">';
        if (data.rows.length > 0) {
            $.each(data.rows, function (i, dat) {
                var j = dat.Id == null ?  i + 1 : dat.Id;
                html += '<div class="div-all-survey" onclick="setSurveyId(\'' + dat.SurveyId + '\')">';
                //html += '<div class="display-in-b width70 overflow-ellipse">' + j + '|' + dat.Beneficiary + '</div > ';
                html += '<div class="display-in-b width70 overflow-ellipse">' + j + '</div > ';
                html += '<div class="display-in-b width28 text-align-r overflow-ellipse">';
                if (dat.Status == 'true') {
                    html += '<a href="#"><img class="max-width20" title="Synced Survey" style="margin-right: 3vw;" src="images/synced.jpg" /></a>';
                }
                else {
                    html += '<a href="#"><img class="max-width20" title="Not yet Synced Survey" style="margin-right:3vw;" src="images/notsynced.png" /></a>';
                }
                html += '<a href="#" onclick="ViewSurveyData(\'' + dat.SurveyId + '\')" ><img class="max-width20" style="margin-right:3vw;" src="images/view.png" title="view survey" /></a ><a href="#" onclick="EditSurveyData(\'' + dat.SurveyId + '\')"><img class="max-width20" src="images/modify.png" title="edit survey" /></a>';
                html += '</div></div>';
            });
            html += '</div></div></div>';
            $('#accordion-view').html(html);
        }
        else {
            html += '<div> No Surveys found</div>';
            html += '</div></div></div>';
            $('#accordion-view').html(html);
            
        }
      
    };
    var surveyId = utils.localStorage().get('selectedSurveyId');
    query = 'SELECT sd.Id AS Id, sd.SurveyDataId AS SurveyId, sd.BeneficiaryId AS Beneficiary, su.SurveyName AS Survey, sd.SyncStatus AS Status  FROM SurveyData sd, Survey su  WHERE sd.SurveyId = su.ID AND SurveyId =' + surveyId;
    tx.executeSql(query, [], createGridSurveyData, errorCB);
};