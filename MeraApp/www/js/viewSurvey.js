/// <reference path="utils.js" />
/// <reference path="jquery-1.12.4.min.js" />
var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
var localData = '';
$(function () {
    db.transaction(queryLoadSurveyDataForm, errorCB);

});
var SurveyDetailsData = function (id, input) {
        
    var html = '';
    var GetMultiData = function (id) {
        var retData = [];
        $.each(JSON.parse(localData), function (k, kat) {
            if (kat.SurveyDetailsId.indexOf(id) != -1) {
                retData.push(kat.SurveyDetailsData);
            }
        });
        return retData;
    };
    var GetData = function (id) {
        var retData = '';
        $.each(JSON.parse(localData), function (k, kat) {
            if (kat.SurveyDetailsId == id) {
                retData = kat.SurveyDetailsData;
            }
        });
        return retData;
        }
        
    switch (input.toLowerCase()) {
        case 'date':
            var surveyDat = GetData(id);
                    html = '<span>' + surveyDat + '</span>'
                    break;

        case 'text':
            var surveyDat = GetData(id);
                    html = '<span>' + surveyDat + '</span>'
            break;
        case 'number':
            var surveyDat = GetData(id);
            html = '<span>' + surveyDat + '</span>'
            break;
        case 'email':
            var surveyDat = GetData(id);
            html = '<span>' + surveyDat + '</span>'
            break;

        case 'option':
            var surveyDat = GetData(id);
            if (surveyDat == '-1') {
                html = '<span></span>';
                break;
            }
                

                html = '<span>' + surveyDat + '</span>'
                

        case 'multiline':
            var surveyDat = GetData(id);
                    html = '<span>' + surveyDat + '</span>'
                    break;

        case 'radio':
            var surveyDat = GetMultiData(id);
            $.each(surveyDat, function (r, rad) {
                
                var parse = rad.split(':');
                if (parse[1] == 'true')
                    html += '<span><input type="radio" name="'+ id +'" class="survey-input radio-checkbox-btn-survey" checked value="' + parse[0] + '" disabled=""/>  ' + parse[0] + '  </span>';
                else
                    html += '<span><input type="radio" name="' + id +'" class="survey-input radio-checkbox-btn-survey" value="' + parse[0] + '" disabled=""/>  ' + parse[0] + '  </span>';

            });
           
            
                    break;

        case 'checkbox':

            var surveyDat = GetMultiData(id);
            $.each(surveyDat, function (r, check) {
                var parse = check.split(':');
                if (parse[1] == 'true')
                    html += '<span><input type="checkbox" class="survey-input radio-checkbox-btn-survey" checked value="' + parse[0] + '" disabled=""/>  ' + parse[0] + ' </span>';
                else
                    html += '<span><input type="checkbox" class="survey-input radio-checkbox-btn-survey" value="' + parse[0] + '" disabled=""/> ' + parse[0] + '  </span>';
            });
                    break;

                case 'combo':
                    var surveyDat = GetData(id);
                        html = '<span>' + surveyDat + '</span>'
                    break;
                case 'query':
                    var surveyDat = GetData(id);
                        html = '<span>' + surveyDat  + '</span>'
                    break;
                default:
                    break;
            }
            //console.log(html);
            return html;
       
     

   
}
var queryLoadSurveyDataForm = function (tx) {
    var html = "";
    var query = "";
    var surveyId = utils.localStorage().get('selectedSurveyId');
    var surveyDataId = utils.localStorage().get('dataSurveyId');
    var createGridSurveyData = function (tx, data) {
        localData = JSON.stringify(data.rows);
        //utils.localStorage().set('selectedSurveyData', JSON.stringify(data.rows));
        query = 'SELECT Id, SurveyName  FROM Survey WHERE Id = ' + surveyId;
        var queryGetSurvey = function (tx, survey) {
            var queryGetSurveySection = function (tx, sections) {
                $.each(sections.rows, function (i, dat) {
                    var queryGetSurveyDetails = function (tx, surveyDetails) {
                        html = '';

                        $.each(surveyDetails.rows, function (i, dat) {
                            html += '<div class="view-survey-box">';
                            html += '<div class="display-in-b width50 vertical-align-top">' + dat.Question ;
                            if (dat.isMandatory == 'true')
                                html += '<span> * </span>';

                            html += '</div >';
                            var divId = dat.ClientId;
                            html += '<div class="display-in-b width50 vertical-align-top" id="' + divId + '">' + SurveyDetailsData(divId, dat.InputTypes)  + '</div > ';
                            html += '</div >';
                        });
                        $('#details-' + dat.SectionId).html(html);
                    };
                    html += '<div class="clearboth"></div><div class="panel panel-default" style="margin:0 2vw;">';
                    html += '<div class="panel-heading upper-case"><b>' + dat.SectionHeader + '</b></div>';
                    html += '<div class="panel-body" id="details-' + dat.SectionId + '"></div >';
                    html += '<div class="clearfix"></div>';
                    html += '</div >';
                    html += ' </div >';
                    query = "SELECT Id, SurveyId ,Question ,InputTypes ,HasSubQuestion , SectionId ,Condition ,ValidationMessage ,isMandatory ,isAvailable ,isSearchable ,SelectValues ,ClientId, LangId FROM SurveyDetails WHERE SurveyId = " + surveyId + " AND SectionId = " + dat.SectionId;
                    tx.executeSql(query, [], queryGetSurveyDetails, errorCB);
                });
                $('#viewsurveydata').html(html);
            };
            //$('#surveyName').html(survey.rows.item(0).SurveyName);
            query = "SELECT Id, SurveyId, SectionId, SectionHeader FROM SurveySections WHERE SurveyId =" + surveyId;

            tx.executeSql(query, [], queryGetSurveySection, errorCB);
        };
        tx.executeSql(query, [], queryGetSurvey, errorCB);
       
    };
    
    query = 'SELECT sdetails.SurveyDetailsData, sdetails.SurveyDetailsId, sdetails.InputType';
    query += ' FROM  SurveyDataDetails sdetails';//, Beneficiary ben';
   // query += ' WHERE sdata.SurveyDataId = sdetails.SurveyDataId';
    query += " WHERE sdetails.SurveyDataId = '" + surveyDataId + "'";
    query += ' ORDER BY sdetails.SurveyDetailsId';
    tx.executeSql(query, [], createGridSurveyData, errorCB);
};