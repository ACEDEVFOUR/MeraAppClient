/// <reference path="utils.js" />

(function () {
    var user = utils.localStorage().get('user');
    var LangId = 1;
    if (user != undefined && user != null && user.LangId != undefined && user.LangId != null) {
        LangId = user.LangId;
    }
    var ajaxObj = {
        url: utils.Urls.news + '?StateID=' + user.StateID + '&LangID=' + LangId,
        type: 'GET',

    };
    $(function () {
        var NewsHead = utils.localStorage().get('NewsHead');
        $('#DivNewsHead').html(NewsHead);
        //Fetch News from offline Table News
        var MyDB = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
        MyDB.transaction(queryNewsDetails, errorCB);
        document.addEventListener("deviceready", onDeviceReady, false);
       
    });
    function queryNewsDetails(tx) {
        var user = utils.localStorage().get('user');
        var LangId = 1;
        LangId = utils.localStorage().get('LangID');
        var newsId = localStorage.getItem("NewsId");
        var queryText = "SELECT N.ID, N.NewsTitle, N.NewsDetails,N.Publisher, N.PublishedDate, N.IsActive FROM News N ";
        queryText += " WHERE  N.LangID = " + LangId;// + " AND  N.PublishedDate<= " + today ;
        queryText += " AND N.IsActive='true'  AND N.StateID= " + user.StateID + " AND N.ID = " + newsId;
        //console.log(queryText);
        tx.executeSql(queryText, [], queryNewsDetailsSuccess, errorCB);
    }

    function queryNewsDetailsSuccess(tx, data) {
        var len = data.rows.length;
        if (len > 0) {
            var newsDiv = '<div class="body7"> <div class="width100 padding5 text-align-c"> <div class="upper-case width100 padding5 white-space-n">';
            newsDiv += data.rows.item(0).NewsTitle + '</div>';
            newsDiv += '<div class="font3 anchor3 white-space-n">' + data.rows.item(0).Publisher + '</div>';
            newsDiv += '<div class="font3 anchor3 white-space-n">' + data.rows.item(0).PublishedDate + '(IST)</div> </div>	 </div>';
            newsDiv += '<div class="padding5 white-space-n"><p>' + data.rows.item(0).NewsDetails + '</p></div>';
            $("#divNews").append(newsDiv);
            $('#divNews a').addClass('aClass');
            //Google Analytics
            var track = {
                Category: 'News Details', Action: 'News Id = ' + data.rows.item(0).ID , Label: data.rows.item(0).ID, Value: 1
            };
            utils.Analytics.trackEvent(track);

        }
    }
  
var callBack = function (data) {
    if (data != null && data.length > 0) {
        var newsId = localStorage.getItem("NewsId");
        //Get details of the News
        var newsDetails = GetNews(newsId, data);
        BindData(newsDetails);
    }

};
var GetNews = function (newsid, list) {
    for (var i = list.length; i--;) {
        //
        if (newsid != list[i].ID) {
            list.splice(i, 1);
        }

    }
    return list;
};
var BindData = function (data) {
    var newsDiv = '<div class="body7"> <div class="width100 padding5 text-align-c"> <div class="upper-case width100 padding5 white-space-n">';
    newsDiv += data[0].NewsTitle + '</div>';
    newsDiv += '<div class="font3 anchor3 white-space-n">' + data[0].Publisher + '</div>';
    newsDiv += '<div class="font3 anchor3 white-space-n">' + data[0].PublishedDate + '(IST)</div> </div>	 </div>';
    newsDiv += '<div class="padding5 white-space-n"><p>' + data[0].NewsDetails + '</p></div>';
    $("#divNews").append(newsDiv);
    $('#divNews a').addClass('aClass');
};

})();
