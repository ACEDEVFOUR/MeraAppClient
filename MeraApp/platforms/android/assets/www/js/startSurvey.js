/// <reference path="utils.js" />

/// <reference path="jquery-1.12.4.min.js" />

var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);

$(function () {
    db.transaction(queryLoadSurveyForm, errorCB);
   


});
var setradio = function (cid, id) {

    var raddata = utils.localStorage().get(cid);
    var radbtn = [];
    $.each(raddata, function (i, dat) {
        if (dat.ref == id) {
            dat.val = document.getElementById(id).checked;
        }
        else {
            dat.val = false;
        }
        radbtn.push(dat);
    });
    utils.localStorage().set(cid, JSON.stringify(radbtn));
};
var setcheck = function (cid, id) {
    
    var chkdata = utils.localStorage().get(cid);
    var chkbox = [];
    $.each(chkdata, function (i, dat) {
        if (dat.ref == id) {
            dat.val = document.getElementById(id).checked;
        }
        chkbox.push(dat);
    });
    utils.localStorage().set(cid, JSON.stringify(chkbox));
};
var queryLoadSurveyForm = function (tx) {
    var html = "";
    var query = "";
    var surveyId = utils.localStorage().get('selectedSurveyId');
    var queryGetSurvey = function (tx, survey) {
        var queryGetSurveySection = function (tx, sections) {
            $.each(sections.rows, function (i, dat) {
                var queryGetSurveyDetails = function (tx, surveyDetails) {
                    html = '';

                    $.each(surveyDetails.rows, function (i, dat) {
                        html += '<div class="margin2vw">' + dat.Question;
                        if (dat.isMandatory == 'true')
                            html += '<span> * </span>';

                        html += '</div >';
                        switch (dat.InputTypes.toLowerCase()) {

                            case 'date':
                                html += '<div><input id=survey-data-' + dat.ClientId + ' type="date" class="width100"  style="border:1px solid#ccc; padding:1vw;"  data-input-type="date-input" data-required="' + dat.isMandatory + '" /></div>';
                                html += '<div class="validation" style="background:#FFFFE0;" id="validation-message-survey-data-' + dat.ClientId + '" >' + dat.ValidationMessage + '</div > ';
                                break;
                            case 'email':
                                html += '<div><input id=survey-data-' + dat.ClientId + ' type="email" class="survey-input"  data-input-type="email-input" data-required="' + dat.isMandatory + '" placeholder="' + dat.SelectValues + '" ></div>';
                                html += '<div class="validation" style="background:#FFFFE0;" id="validation-message-survey-data-' + dat.ClientId + '" >' + dat.ValidationMessage + '</div> ';
                                break;
                            case 'number':
                                html += '<div><input id=survey-data-' + dat.ClientId + ' type="tel" class="survey-input"  data-input-type="number-input" maxlength="' + dat.Size + '" data-required="' + dat.isMandatory + '" ></div>';
                                html += '<div class="validation" style="background:#FFFFE0;" id="validation-message-survey-data-' + dat.ClientId + '" >' + dat.ValidationMessage + '</div> ';
                                break;
                            case 'text':
                                html += '<div><input id=survey-data-' + dat.ClientId + ' type="text" class="survey-input" maxlength="' + dat.Size + '"  data-input-type="text-input" data-required="' + dat.isMandatory + '"  placeholder="' + dat.SelectValues + '"></div>';
                                html += '<div class="validation" style="background:#FFFFE0;" id="validation-message-survey-data-' + dat.ClientId + '" >' + dat.ValidationMessage + '</div> ';
                                break;
                            case 'multiline':
                                html += '<div><textarea id=survey-data-' + dat.ClientId + ' data-input-type="multiline-input" maxlength="' + dat.Size + '" style="border:1px solid#ccc; width:100%;" data-required="' + dat.isMandatory + '" placeholder="' + dat.SelectValues + '"></textarea></div>';
                                html += '<div class="validation" style="background:#FFFFE0;" id="validation-message-survey-data-' + dat.ClientId + '" >' + dat.ValidationMessage + '</div> ';
                                break;
                            case 'radio':
                                var splitData = dat.SelectValues.split(',');
                                var radId = 'rad-' + dat.ClientId;
                                 
                                var radbtn = [];
                                html += '<div>';
                                $.each(splitData, function (j, kat) {
                                    var survId = 'survey-data-' + dat.ClientId + '-' + j;
                                    html += '<input onclick="setradio(\'' + radId + '\',\'' + survId + '\')"  id="' + survId + '" type="radio" name="' + dat.ClientId + '" data-input-type="radio-input"  class="survey-input radio-checkbox-btn-survey" data-required="' + dat.isMandatory + '" value="' + kat.trim() + '" /> <span> ' + kat.trim() + ' </span>';
                                    
                                    var rad = {
                                        'ref': survId,
                                        'val': false
                                    }
                                    radbtn.push(rad);
                                });
                                utils.localStorage().set(radId, JSON.stringify(radbtn));
                                html += '</div > ';
                                html += '<div class="validation" style="background:#FFFFE0;" id="validation-message-survey-data-' + dat.ClientId + '" >' + dat.ValidationMessage + '</div> ';
                                break;
                            case 'checkbox':
                                var splitData = dat.SelectValues.split(',');
                                html += '<div>';
                                var chkId = 'check-' + dat.ClientId;
                                var chkbox = [];
                                $.each(splitData, function (r, check) {
                                    var parse = check.split(':');

                                    var survId = 'survey-data-' + dat.ClientId + '-' + r;
                                    if (parse[1] == 'true') {
                                        html += '<span><input onclick="setcheck(\'' + chkId + '\',\'' + survId + '\')" id="' + survId + '" type = "checkbox" data-input-type="checkbox-input" class="survey-input radio-checkbox-btn-survey" checked value = "' + parse[0] + '" data - required="' + dat.isMandatory + '" />  ' + parse[0] + '  </span > ';
                                        var chk = {
                                            'ref': survId,
                                            'val': true

                                        };
                                        chkbox.push(chk);

                                    }
                                    else {
                                        html += '<span><input onclick="setcheck(\'' + chkId + '\',\'' + survId + '\')" id="' + survId + '" type="checkbox" data-input-type="checkbox-input"  class="survey-input radio-checkbox-btn-survey" value="' + parse[0] + '" data-required="' + dat.isMandatory + '"/> ' + parse[0] + '  </span>';
                                        var chk = {
                                            'ref': survId,
                                            'val': false

                                        };
                                        chkbox.push(chk);
                                    }


                                });
                                utils.localStorage().set(chkId, JSON.stringify(chkbox));
                                html += '</div > ';
                                html += '<div class="validation" style="background:#FFFFE0;" id="validation-message-survey-data-' + dat.ClientId + '" >' + dat.ValidationMessage + '</div> ';
                                break;
                            case 'option':
                                html += '<select id="survey-data-' + dat.ClientId + '" data-input-type="option-input" class="width100"  style="border:1px solid#ccc; padding:1vw;" data-required="' + dat.isMandatory + '" >';
                                html += '<option value="-1">-Select-</option>';
                                var options = dat.SelectValues.split(',');
                                $.each(options, function (j, opt) {
                                    html += '<option data-input-type="combo-option" >' + opt + '</option>';
                                });
                                html += '</select>';
                                html += '<div class="validation" style="background:#FFFFE0;" id="validation-message-survey-data-' + dat.ClientId + '" >' + dat.ValidationMessage + '</div> ';
                                break;
                            case 'query':
                               
                                html += '<div><input type="text" id=survey-data-' + dat.ClientId + ' class="survey-input" data-input-type="query-input" data-required="' + dat.isMandatory + '" ></div>';
                                html += '<div class="validation" style="background:#FFFFE0;" id="validation-message-survey-data-' + dat.ClientId + '" >' + dat.ValidationMessage + '</div> ';
                                break;
                            default:
                                html += '<div><input id=survey-data-' + dat.ClientId + ' type="text" class="survey-input" data-input-type="text-input" data-required="' + dat.isMandatory + '" ></div>';
                                html += '<div class="validation" style="background:#FFFFE0;" id="validation-message-survey-data-' + dat.ClientId + '" >' + dat.ValidationMessage + '</div> ';
                                break;
                        }
                       
                    });
                    $('#details-' + dat.SectionId).html(html); 
                };
                html += '<div class="clearboth"></div>';
                html += '<div class="upper-case"><b>' + dat.SectionHeader + '</b></div>';
                
                html += '<div id="details-' + dat.SectionId + '" style="border: 1px solid #000; padding: 10px 10px 10px 10px;"></div>'
                query = "SELECT  SurveyId ,Question ,InputTypes ,HasSubQuestion , SectionId ,Condition ,ValidationMessage ,isMandatory ,isAvailable ,isSearchable ,SelectValues ,ClientId, LangId, Size FROM SurveyDetails WHERE SurveyId = " + surveyId + " AND SectionId = " + dat.SectionId;
                tx.executeSql(query, [], queryGetSurveyDetails, errorCB);
            });
            $('#surveyForm').html(html); 
        };
        $('#surveyName').html(survey.rows.item(0).SurveyName);
        query = "SELECT Id, SurveyId, SectionId, SectionHeader FROM SurveySections WHERE SurveyId =" + surveyId;

        tx.executeSql(query, [], queryGetSurveySection, errorCB);
    }; 

    query = "SELECT Id, SurveyName FROM Survey WHERE Id =" + surveyId;
    tx.executeSql(query, [], queryGetSurvey, errorCB);
}
var SaveSurvey = function () {
    var user = utils.localStorage().get('user');
    var UserName = '';
    if (user != undefined || user != null) {
        UserName = user.userName;
    }
    surveyDataId = utils.getGUID();
    ide = utils.smallRandomNum();
    surveyId = utils.localStorage().get('selectedSurveyId');
    var validSurvey = ValidateSurvey();
    var surveyData = $('[id]');
    var surveyDataDetails = [];
    var h = '';
    var InsertSurveyData = function (tx) {
        var param1 = new Date();
        var today = (param1.getMonth() + 1) + '/' + param1.getDate() + '/' + param1.getFullYear() + ' ' + param1.getHours() + ':' + param1.getMinutes() + ':' + param1.getSeconds();

        var geoData = utils.localStorage().get('geolocation');
        if (geoData == null || geoData == undefined) {
            geoData = {
                Latitude : 'NA',
                Longitude : 'NA',
                Timestamp: today
            };
            
        }
        var surveyData = "INSERT INTO SurveyData (Id, SurveyId, SurveyDataId, BeneficiaryId, SoochnaPrenuer, Latitude, Longitude, Timestamp, SyncStatus) VALUES ";
        surveyData += "('" + ide + "'," + surveyId + ", '" + surveyDataId + "', 0, '" + UserName + "','" + geoData.Latitude + "','" + geoData.Longitude + "','" + geoData.Timestamp + "', 'false')";
        tx.executeSql(surveyData);
    }
    var InsertSurveyDataDetails = function (tx) {
        $.each(surveyData, function (i, dat) {

            var id = dat.id;
            if (id.startsWith("survey-data")) {

                var $Id = id.replace('survey-data-', '');
                var $type = $(dat).attr('data-input-type').replace('-input', '');
                var $input = '';
                switch ($type.toLowerCase()) {

                    case 'date':
                        $input = $('#' + id).val();
                        break;

                    case 'text':
                        $input = $('#' + id).val();
                        break;
                    case 'email':
                        $input = $('#' + id).val();
                        break;
                    case 'number':
                        $input = $('#' + id).val();
                        break;
                    case 'tel':
                        $input = $('#' + id).val();
                        break;
                    case 'multiline':
                        $input = $('#' + id).val();
                        break;

                    case 'option':
                        $input = $('#' + id).val();
                        break;
                    
                    case 'radio':
                        $input = document.getElementById(id).value + ':' + document.getElementById(id).checked;
                        break;

                    case 'checkbox':
                        $input = document.getElementById(id).value + ':' + document.getElementById(id).checked;
                        break;

                    case 'query':
                        $input = $('#' + id).val();
                        break;
                    default:
                        $input = $('#' + id).val();
                        break;
                }

        surveyDataDetails = "INSERT INTO SurveyDataDetails (Id, SurveyDataId, SurveyDetailsId, SurveyDetailsData, InputType, SurveyId, SurveyDataFK, SyncStatus) VALUES ( ";
        surveyDataDetails += utils.smallRandomNum() + ",'" +  surveyDataId + "','" + $Id + "','" + $input + "','" + $type + "'," + surveyId + ",'" + ide + "','false')";
        console.log(surveyDataDetails);
        tx.executeSql(surveyDataDetails);
            };
        });
        $('.save-proceed').css('disabled', 'disabled');
        $("#myModal").dialog("open");
    }
    if (validSurvey) {
        db.transaction(InsertSurveyData, errorCB);
        db.transaction(InsertSurveyDataDetails, errorCB);
    }
       
    
}
var ValidateSurvey = function () {
    var dataId = $('[id]');
    var status = true;
    
    $('.validation').addClass('hidden');
    //var $text = '<p class="validation" style="color: red;">This is a mandatory field, can\'t be empty</p>';
    $.each(dataId, function (i, dat) {
        var id = dat.id;
        var $input = $('#' + id).val();
        if (id.startsWith("survey-data") && status == true) {
            var $reqd = $(dat).attr('data-required');
            var $type = $(dat).attr('data-input-type').replace('-input', '');
            if ($reqd == 'true' && status == true) {
                if ($type.toLowerCase() == 'radio') {
                    var ids = id.split('-');
                    var cid = 'rad-' + ids[2] + '-' + ids[3] + '-' + ids[4];
                    var radValidate = utils.localStorage().get(cid);
                    status = false;
                    $.each(radValidate, function (i, dat) {
                        if (dat.val == true)
                            status = true;
                    });
                    if (status == false) {

                        $('#validation-message-' + id.substring(0, id.lastIndexOf('-'))).removeClass('hidden');
                        $('#validation-message-' + id.substring(0, id.lastIndexOf('-'))).css('display', 'block');
                    }
                }
                else if ($type.toLowerCase() == 'checkbox') {
                    var ids = id.split('-');
                    var cid = 'check-' + ids[2] + '-' + ids[3] + '-' + ids[4];
                    var chkValidate = utils.localStorage().get(cid);
                    status = false;
                    $.each(chkValidate, function (i, dat) {
                        if (dat.val == true)
                            status = true;
                    });
                    if (status == false) {

                        $('#validation-message-' + id.substring(0, id.lastIndexOf('-'))).removeClass('hidden');
                        $('#validation-message-' + id.substring(0, id.lastIndexOf('-'))).css('display', 'block');
                    }
                }
                else if ($type.toLowerCase() == 'option') {
                   
                    if ($input == '-1') {
                        status = false;

                        $('#validation-message-' + id).removeClass('hidden');
                        $('#validation-message-' + id).css('display', 'block');
                    }
                }
                else {
                    if ($input.length <= 0) {

                        $('#validation-message-' + id).removeClass('hidden');
                        $('#validation-message-' + id).css('display', 'block');
                        status = false;
                    }
                }
            }
            else if (status == true) {
                var $validation = $('#validation-message-' + id);
                switch ($type.toLowerCase()) {
                    case 'date':
                        if ($input.length > 0) {
                            var epos = Date.parse($input);
                            if (epos.toString() == 'NaN') {
                                status = false;
                                var $text = '<p style="color: red;">Invalid Date, please correct and try again.</p>';
                                $validation.removeClass('hidden');
                                $validation.css('display', 'block');
                                $validation.html($text);
                            }
                        }
                        break;
                    case 'email':
                        var pattern = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                        if (!pattern.test($input)) {
                            status = false;
                            var $text = '<p style="color: red;">Invalid e-mail id, please correct and try again.</p>';
                            $validation.removeClass('hidden');
                            $validation.css('display', 'block');
                            $validation.html($text);
                        } 
                        break;
                    case 'text':
                        var attr = $('#' + id).attr('maxlength');
                        if ($input.length > attr) {
                            status = false;
                            var $text = '<p style="color: red;">Length has exceeded the maximum length allowed.</p>';

                            $validation.removeClass('hidden');
                            $validation.css('display', 'block');
                            $validation.html($text);
                        }
                        break;
                    case 'multiline':
                        var attr = $('#' + id).attr('maxlength');
                        if ($input.length > attr) {
                            status = false;
                            var $text = '<p style="color: red;">Length has exceeded the maximum length allowed.</p>';

                            $validation.removeClass('hidden');
                            $validation.css('display', 'block');
                            $validation.html($text);
                        }
                        break;
                    case 'number':
                        var pattern = /^\d+$/;
                        if ($input.length <= 0)
                            break;

                        if (!pattern.test($input)) {
                            status = false;
                            var $text = '<p style="color: red;">Invalid number, please correct and try again.</p>';

                            $validation.removeClass('hidden');
                            $validation.css('display', 'block');
                            $validation.html($text);
                        }
                        else {
                            var attr = $('#' + id).attr('maxlength');
                            if ($input.length < attr) {
                                status = false;
                                var $text = '<p style="color: red;">Entered Data length should be equal to :' + attr +  ' in length .</p>';

                                $validation.removeClass('hidden');
                                $validation.css('display', 'block');
                                $validation.html($text);
                            }
                            else if ($input.length > attr) {
                                status = false;
                                var $text = '<p style="color: red;">Length has exceeded the maximum length allowed.</p>';

                                $validation.removeClass('hidden');
                                $validation.css('display', 'block');
                                $validation.html($text);
                            }


                        }
                        break;
                    case 'tel':
                        var pattern = /^\d+$/;
                        if ($input.length <= 0)
                            break;

                        if (!pattern.test($input)) {
                            status = false;
                            var $text = '<p style="color: red;">Invalid number, please correct and try again.</p>';

                            $validation.removeClass('hidden');
                            $validation.css('display', 'block');
                            $validation.html($text);
                        }
                        else {
                            var attr = $('#' + id).attr('maxlength');
                            if ($input.length > attr) {
                                status = false;
                                var $text = '<p style="color: red;">Length has exceeded the maximum length allowed.</p>';

                                $validation.removeClass('hidden');
                                $validation.css('display', 'block');
                                $validation.html($text);
                            }


                        }
                        break;

                }
            }
               

        }
    });
    return status;
}