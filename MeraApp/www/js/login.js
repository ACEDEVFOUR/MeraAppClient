    /// <reference path="jquery-2.2.4.js" />
/// <reference path="utils.js" />
analytics = this;


function LoadLanguages() {
    var MyDB = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
    MyDB.transaction(queryLanguages, errorCB);



}
function queryLanguages(tx) {
    var queryText = "SELECT ID, Name, Description FROM LanguageMaster";
    tx.executeSql(queryText, [], queryLanguageSuccess, errorCB);

}
function queryLanguageSuccess(tx, data) {
    var len = data.rows.length;
    if (len > 0) {
        var listItems = "";
        listItems += "<option value='-1' selected='true' disabled='disabled'>" + 'Select Language' + "</option>";
        for (var i = 0; i < len; i++) {
            listItems += "<option value='" + data.rows.item(i).ID + "'>" + data.rows.item(i).Description + "</option>";
        }
        $('#language').html(listItems);
    }
}
(function () {

    $(function () {

        document.addEventListener("deviceready", onDeviceReady, false);

        var login = false;
        if (login == true) {
            //$('#userId').hide();
            //$('#password').hide();
            //$('#login').hide();
            //$('#goToWelcome').show();
            //$('#logOut').show();
            //$('#AlreadyLoggedIn').show();

            window.location.href = 'welcome.html';
        }
        else {
            $('#userId').show();
            $('#password').show();
            $('#login').show();
            $('#goToWelcome').hide();
            $('#logOut').hide();
            $('#AlreadyLoggedIn').hide();
            LoadLanguages();
        }
        $('#logOut').click(function () {
            utils.localStorage().set('loggedIn', false);
            $('#userId').show();
            $('#password').show();
            $('#login').show();
            $('#goToWelcome').hide();
            $('#logOut').hide();
            $('#AlreadyLoggedIn').hide();
        });
        $('#login').click(function () {

            var ajaxObj = {
                //url: utils.Urls.AuthenticateWebLogin + $('#userId').val() + '&password=' + $('#password').val(),
                //type: 'GET',
                obj: {
                 //   userName: $('#userId').val(), password: $('#password').val(), IMEI: $('#simNo').html() }
                    userName: $('#userId').val(), password: $('#password').val()
                }

            };
            var lang = $('#language').val();
            $('#returnMessage').html('');
            if (ajaxObj.obj.userName.length <= 0) {
                $('#returnMessage').append('User name cannot be blank');
                $('#returnMessage').show();
                return false;
            }
            else if (ajaxObj.obj.password.length <= 0) {
                $('#returnMessage').append('password cannot be blank');
                $('#returnMessage').show();
                return false;
            }
            else if (lang == -1 || lang == null) {
                $('#returnMessage').append('Language selection is mandatory');
                $('#returnMessage').show();
                return false;
            }
            else {
                $('#returnMessage').hide();
                // utils.ajaxCallUrl(ajaxObj.url, ajaxObj.type, callBack);

                //Validate from Local DB
                var MyDB = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
                MyDB.transaction(queryDB, errorCB);

            }
        });
        var callBack = function (data) {
            if (data.roleId == 7 && data.status == true) {
                utils.localStorage().set('user', data);
                utils.localStorage().set('loggedIn', true);

                utils.Analytics.trackUser(data.userName);
                window.location.href = 'welcome.html';

            }
            else {
                $('#returnMessage').append('There was a problem authenticating the User, contact Administrator');
                $('#returnMessage').show();
            }
        };

    });

})();
function onDeviceReady() {
    var user = utils.localStorage().get('user');
  //  var setSimInfo = utils.localStorage().get('simInfo');
    var pageVal = null;
    if (user != null) {
        pageVal = 'Login Page || ' + 'User:' + user.userName + ' || StateID: ' + user.StateID;
    }
    else {
        pageVal = 'Login Page';
    }
    try {
        utils.Analytics.trackPage(pageVal);
    } catch (e) {
        console.log(JSON.stringify(e));
    }
    //if (setSimInfo != null) {
    //    //$('#setSimInfo').html(JSON.stringify(setSimInfo));
    //    $('#simNo').html(setSimInfo.cards[0].deviceId);
    //    $('#userId').val(getMobileNumber(setSimInfo.cards[0].phoneNumber));
        
    //}
}
function getMobileNumber(mob) {
    var len = mob.length;
    var mobNumer = '';
    if (len > 10) {
        mobNumer = mob.substring(len - 10, len);
    }
    else {
        mobNumer = mob;
    }
    return mobNumer;
}


$("#language").change(function () {
    var currentLanguage = $('#language').val();
    var LangId = utils.localStorage().get('LangID');
    //if ((LangId!=undefined || LangId!=null) && LangId != currentLanguage)
    //{
    var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
    db.transaction(queryCMS, errorCB);
    //}
});

function queryCMS(tx) {
    var LangId = 1;
    LangId = $('#language').val();;
    var queryText = "SELECT ApplicationId, CMSKeyId, CMSKeyValueId, KeyName, KeyValue, LanguageId FROM CMS  WHERE LanguageId =" + LangId;
    tx.executeSql(queryText, [], queryCMSSuccess, errorCB);
}

// Query the success callback
function queryCMSSuccess(tx, data) {
    var len = data.rows.length;
    if (len > 0) {
        for (var i = 0; i < len; i++) {
            switch (data.rows.item(i).KeyName) {
                case 'CmsForgotPassword':
                    $('#aForgotPassword').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsPassword':
                    $('#password').attr("placeholder", data.rows.item(i).KeyValue);
                    break;
                case 'CmsMobileNumber':
                    $('#userId').attr("placeholder", data.rows.item(i).KeyValue);
                    break;

                case 'CmsLogIn':
                    $('#DivLoginText').html(data.rows.item(i).KeyValue);
                    break;
            }

        }
        utils.localStorage().set('LangID', $('#language').val());
        //  window.location.href = 'login.html';
    }
}
// Query the database
function queryDB(tx) {
    var username = $('#userId').val();
    var password = $('#password').val();
   // var IMEI = $('#simNo').html();
    //var queryText = "SELECT U.UserName AS userName, U.Status AS Status, U.StateID, U.DistrictID, U.RoleID FROM USERS U WHERE U.UserName='" + username + "' AND U.Password='" + password + "' AND U.IMEI='" + IMEI + "' AND U.Status = 'true' AND U.RoleID = 7 AND (U.IsDeleted = 'false' or U.IsDeleted is null)";
    var queryText = "SELECT U.UserName AS userName, U.Status AS Status, U.StateID, U.DistrictID, U.RoleID FROM USERS U WHERE U.UserName='" + username + "' AND U.Password='" + password + "' AND U.Status = 'true' AND U.RoleID = 7 AND (U.IsDeleted = 'false' or U.IsDeleted is null)";
    tx.executeSql(queryText, [], querySuccess, errorCB);
}

function AddLoginAnalytics(tx) {

    var user = utils.localStorage().get('user');
    var LangId = utils.localStorage().get('LangID');
    var param1 = new Date();
    var today = (param1.getMonth() + 1) + '/' + param1.getDate() + '/' + param1.getFullYear() + ' ' + param1.getHours() + ':' + param1.getMinutes() + ':' + param1.getSeconds();
    utils.localStorage().set('LoggedInTime', today);
    var sqlStmt = "INSERT INTO AnalyticsApp (AnalyticsCode, Feature, SoochnaPreneur, StateId, LangId, ObjectId, ObjectType, FeatureClicked, EventDateTime)  VALUES ";
    sqlStmt += "  ('U0001','User','" + user.userName + "'," + user.StateID + "," + LangId + ",'ObjectId','ObjectType','Login','" + today + "')";

    tx.executeSql(sqlStmt);
}


// Query the success callback
function querySuccess(tx, results) {
    var len = results.rows.length;

    if (len > 0) {
        if (results.rows.item(0).Status == 'true') {
            utils.localStorage().set('user', results.rows.item(0));
            utils.localStorage().set('LangID', $('#language').val());
            utils.localStorage().set('loggedIn', true);

            AddLoginAnalytics(tx);
            var track = {
                Category: 'User', Action: 'Logged in user', Label: results.rows.item(0).userName, Value: 1
            };
            //  if (utils.isMobile() && utils.IsOnline()) {
            utils.Analytics.trackEvent(track);
            // }
            window.location.href = 'welcome.html';
        }
        else {
            $('#returnMessage').append('There was a problem authenticating the User, contact Administrator');
            $('#returnMessage').show();
        }
    }
    else {
        $('#returnMessage').append('There was a problem authenticating the User, contact Administrator');
        $('#returnMessage').show();
    }
}