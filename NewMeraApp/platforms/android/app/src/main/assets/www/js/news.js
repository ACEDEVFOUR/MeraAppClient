var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
function SyncCall(objData, callBackFn) {
     
    $.ajax({
        url: objData.url,
        type: 'POST',
        data: JSON.stringify(objData.data),
        cache: false,
        contentType: 'application/json',
        crossdomain: true,
        async: false,
        success: function (data) {
            
            callBackFn();
        },
        error: function (error) {
            console.log(error);
        }
    });
}
SyncDataUpload = function () {
   // var txt = $('#SyncUpload');
   //// SyncData();
   // $('#RevSyncModal').modal('show');
   // $('#side-menu').hide("slide", { direction: "left" }, 100);
   // db.transaction(UploadBeneficiary, errorCB);
   // --------------------------------
    $('#side-menu').hide("slide", { direction: "left" }, 100);
    var txt = $('#SyncUpload');
    $('#SyncUpdateProgress').modal('show');

    db.transaction(UploadAnalytics, errorCB);

};
function SyncBackData() {
    SyncData();
}
function UploadAnalytics(tx) {
    
    var queryText = "SELECT  AnalyticsCode, Feature, SoochnaPreneur, StateId, LangId, ObjectId, ObjectType, FeatureClicked, EventDateTime From AnalyticsApp";
    tx.executeSql(queryText, [], function (tx, data) {
        var Req = new Array();
        $.each(data.rows, function (i, dat) {
            Req.push(dat);
        });
        var ajaxObj = {
            url: utils.Urls.AnalyticsPostUrl,
            type: 'POST',
            data: Req
        };
        if (Req.length > 0) {
            SyncCall(ajaxObj, UploadWallet);
        }
        else {
            // db.transaction(UploadWallet, errorCB);
            UploadWallet();
        }
    }, errorCB);
}

//function UploadWallet(tx) {
function UploadWallet() {
    var queryText = "SELECT  Id, UserId, ServiceTypeId, BeneficiaryId, ServiceName, Price, Date, LangID From AppUserWallet";
    db.transaction(function (tx) {
    tx.executeSql(queryText, [], function (tx, data) {
        
        if (data.rows.length > 0) {
            var Req = new Array();
            $.each(data.rows, function (i, dat) {
                Req.push(dat);
            });
            var ajaxObj = {
                url: utils.Urls.WalletPostUrl,
                type: 'POST',
                data: Req
            };
            SyncCall(ajaxObj, UploadBeneficiary);
        }
        else {
            UploadBeneficiary();
                //db.transaction(UploadBeneficiary, errorCB);
            }
        });
   }, errorCB);
}


function UploadBeneficiary() {
    var user = utils.localStorage().get('user');

    var queryText = "SELECT  ben.Id, ben.Beneficiary AS ParentId, ben.FirstName, ben.LastName,  ben.FathersName, ben.HusbandsName, ben.DOB, ben.IDProof, ben.IDDetails, ben.SoochnaPreneur ";
    queryText += ", ben.State, ben.District, ben.Sex, ben.Age, ben.Religion,ben.Socio, ben.Occupation, ben.MaritalStatus, ben.Category, ben.Department, ";
    queryText += " ben.EmploymentStatus, ben.VulGroup, ben.AnnualIncome, ben.Disabilty, ben.Photo, ben.Relationship, ben.Sickness, ben.PercentageDisablity, ben.Beneficiary, ben.Address, ben.EMail, ben.Phone, ";
    queryText += " ben.Qualification, ben.DateOfRegistration FROM Beneficiary ben WHERE IsUpdated = 'true' AND ben.SoochnaPreneur='" + user.userName + "'";
    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS Beneficiary (Id, Beneficiary, FirstName, LastName, FathersName, HusbandsName, DOB, IDProof, IDDetails, State, District, Sex, Age, Religion, Socio, Occupation, MaritalStatus, Category, Department, EmploymentStatus, VulGroup, AnnualIncome, Disabilty, SoochnaPreneur, Photo, Relationship, Sickness, PercentageDisablity, Address, EMail, Phone, IsUpdated, Qualification, DateOfRegistration, EngDistrictId)');
        
    tx.executeSql(queryText, [], function (tx, data) {
        if (data.rows.length > 0) {
            var Beneficiaries = new Array();
            $.each(data.rows, function (i, dat) {
                Beneficiaries.push(dat);
            });

            var ajaxObj = {
                url: utils.Urls.SyncBeneficiary,
                type: 'POST',
                data: Beneficiaries
            };
            SyncCall(ajaxObj, UploadSubBeneficiary);
        }
        else {
            UploadSubBeneficiary();
        }

    });
    }, errorCB);
}

function UploadSubBeneficiary() {
    var queryText = "SELECT  ben.Id, ben.Beneficiary AS ParentId, ben.FirstName, ben.LastName,  ben.FathersName, ben.HusbandsName, ben.DOB, ben.IDProof, ben.IDDetails, ben.SoochnaPreneur ";
    queryText += ", ben.State, ben.District, ben.Sex, ben.Age, ben.Religion,ben.Socio, ben.Occupation, ben.MaritalStatus, ben.Category, ben.Department, ";
    queryText += " ben.EmploymentStatus, ben.VulGroup, ben.AnnualIncome, ben.Disabilty, ben.Photo, ben.Relationship, ben.Sickness, ben.PercentageDisablity, ben.Beneficiary, ben.Address, ben.EMail, ben.Phone, ben.DateOfRegistration ";

    queryText += " FROM SubBeneficiary ben ";
    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS SubBeneficiary (Id, Beneficiary, FirstName, LastName, FathersName, HusbandsName, DOB, IDProof, IDDetails, State, District, Sex, Age, Religion, Socio, Occupation, MaritalStatus, Category, Department, EmploymentStatus, VulGroup, AnnualIncome, Disabilty, SoochnaPreneur, Photo, Relationship, Sickness, PercentageDisablity, Address, EMail, Phone,IsUpdated,DateOfRegistration, EngDistrictId)');
        tx.executeSql(queryText, [], function (tx, data) {

            if (data.rows.length > 0) {
                var Beneficiaries = new Array();
                $.each(data.rows, function (i, dat) {
                    Beneficiaries.push(dat);
                });
                var ajaxObj = {
                    url: utils.Urls.SyncBeneficiary,
                    type: 'POST',
                    data: Beneficiaries
                };
                SyncCall(ajaxObj, UploadBeneficiaryApplied);
            }
            else {
                UploadBeneficiaryApplied();
            }

           
        });

    }, errorCB);
}
function UploadBeneficiaryApplied() {
    var queryText = "SELECT ben.ID, ben.SchemeId, ben.BeneficiaryId, UserId, Status, DateApplied FROM BeneficiaryApplied ben";
    var BeneficiaryApplied = new Array();
    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS BeneficiaryApplied (ID, SchemeId, BeneficiaryId, UserId, Status, DateApplied)');
        tx.executeSql(queryText, [], function (tx, data) {

            if (data.rows.length > 0) {
                var Beneficiaries = new Array();
                $.each(data.rows, function (i, dat) {
                    Beneficiaries.push(dat);
                });
                var ajaxObj = {
                    url: utils.Urls.SyncBeneficiaryApplied,
                    type: 'POST',
                    data: Beneficiaries
                };
                SyncCall(ajaxObj, SyncBackData);
            }
            else {
                SyncBackData();
            }

           
        });

    }, errorCB);

}

$(function () {
        var user = utils.localStorage().get('user');
        document.addEventListener("deviceready", onDeviceReady, false);
        var LangId = utils.localStorage().get('LangID');
        if (user != undefined && user != null && user.LangId!=undefined && user.LangId!=null )
        {
            LangId = user.LangId;
        }
        var ajaxObj = {
            url: utils.Urls.news + '?StateID=' + user.StateID +'&LangID=' +LangId,
            type: 'GET',

        };
        //Get BeneficiaryDetails from DB and store in localStorage
       
        $('#myModal').modal('show');
        // Ajax Call commented for offline logic
        var today = new Date();
        var d = today.getDate();
        var m = today.getMonth() + 1;
        var y = today.getFullYear();
        var CurrentDate = d + '-' + m + '-' + y;
        var lastSyncedDate = utils.localStorage().get('LastSyncedDate');
        
        utils.localStorage().set('ShowPopular', true);
      if (lastSyncedDate != CurrentDate) {
            //Check if internet is available
            $.ajax({
                url: utils.Urls.IsOnline,
                type: 'GET',
                cache: false,
                contentType: 'application/json',
                crossdomain: true,
                async: false,
                success: function (data) {
                    isOnline = true;
                    $('#SyncUpdateProgress').show();
                    //SyncData();
                    SyncDataUpload();
                    utils.localStorage().set('LastSyncedDate', CurrentDate);
                    //$('#myModal').modal('hide');
                    //$('#SyncUpdateProgress').hide();
                },
                error: function (error) {
                   
                   
                }
            });
      }
      var MyDB = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
        //Fetch News from offline Table News
      MyDB.transaction(queryNews, errorCB);
      var ShowPopular = utils.localStorage().get('ShowPopular');
      if (ShowPopular) {
          MyDB.transaction(queryPopularSchemes, errorCB);
      }
        //get popular schemes
        var ajaxObj = {
            url: utils.Urls.GetPopularSchemes + '?langId=' + LangId,
            type: 'GET',
            //obj: { userName: $('#userId').val(), password: $('#password').val() }

        };
        //Ajax call commented for offline data fetch
        //utils.ajaxCallUrl(ajaxObj.url, ajaxObj.type, callBackPopular);
       
        MyDB.transaction(queryCMS, errorCB);
       // if (utils.isMobile() && utils.IsOnline()) {
           
        //  }
        $('#applyRTI').click(function (){
            var pageVal = null;
            if(user != null) {
                pageVal = 'RTI Page' + 'User:' + user.userName + 'StateID: ' + user.StateID;
            }
            else {
                pageVal = 'RTI Page';
            }
            utils.Analytics.trackPage(pageVal);
            window.open("https://rtionline.gov.in/request/request.php", "_blank");
            });
     
    });

$('#toggle-side-menu').click(function () {
    $('#side-menu').show("slide", { direction: "left" }, 100);
});

$('#close-menu').click(function () {
    $('#side-menu').hide("slide", { direction: "left" }, 100);
});
function queryCMS(tx) {
    var user = utils.localStorage().get('user');
    var LangId = utils.localStorage().get('LangID');
    if (user != undefined && user != null && user.LangId != undefined && user.LangId != null) {
        LangId = user.LangId;
    }
    var queryText = "SELECT ApplicationId, CMSKeyId, CMSKeyValueId, KeyName, KeyValue, LanguageId FROM CMS  WHERE LanguageId =" + LangId;
    tx.executeSql(queryText, [], queryCMSSuccess, errorCB);
}

// Query the success callback
function queryCMSSuccess(tx, data) {
    utils.localStorage().set('CMSKey', data.rows);
    var len = data.rows.length;
    if (len > 0) {
        for (var i = 0; i < len; i++) {

            if (data.rows.item(i).KeyName == 'CmsPopularScheme') {
                $('#divPopularScheme').html(data.rows.item(i).KeyValue);
            }
            if (data.rows.item(i).KeyName == 'CmsHome') {
                $('#divHome').html(data.rows.item(i).KeyValue);
                $('#aHome').html(data.rows.item(i).KeyValue);
            }
            if (data.rows.item(i).KeyName == 'CmsSearch') {
                $('#divSearch').html(data.rows.item(i).KeyValue);
                $('#aSearchScheme').html(data.rows.item(i).KeyValue);
            }
            if (data.rows.item(i).KeyName == 'CmsMyAccount') {
                $('#divMyAccount').html(data.rows.item(i).KeyValue);
                $('#aMyAccount').html(data.rows.item(i).KeyValue);
            }
            if (data.rows.item(i).KeyName == 'CmsRTI') {
                $('#divRTI').html('<img class="max-width10" src="images/RTI.png" /> '+ data.rows.item(i).KeyValue +'</div>');
            }
            if (data.rows.item(i).KeyName == 'CmsSync') {
                $('#DivSyncMessage').html(data.rows.item(i).KeyValue);
            }
            if (data.rows.item(i).KeyName == 'CmsGettingNew') {
                $('#divGettingNewsAndSchemes').html(data.rows.item(i).KeyValue);
            }
            if (data.rows.item(i).KeyName == 'CmsGettingNews') {
                $('#DivGettingNews').html(data.rows.item(i).KeyValue);
                $('#HGettingNews').html(data.rows.item(i).KeyValue);
                
            }

            if (data.rows.item(i).KeyName == 'CmsMyWallet') {
                $('#divMyWallet').html(data.rows.item(i).KeyValue);
                //$('#divMyWallet-AddIncome').html(data.rows.item(i).KeyValue);
                //$('#divMyWallet-TB').html(data.rows.item(i).KeyValue);
                $('#aRevenue').html(data.rows.item(i).KeyValue);
            }

            if (data.rows.item(i).KeyName == 'CmsAddIncome') {
                $('#divAddIncome').html(data.rows.item(i).KeyValue);
                //$('#divAddIncomeWallet').html(data.rows.item(i).KeyValue);
                //$('#divAddIncome-AddIncome').html(data.rows.item(i).KeyValue);
                //$('#divAddIncome-TB').html(data.rows.item(i).KeyValue);
                $('#aAddRevenue').html(data.rows.item(i).KeyValue);
            }
            if (data.rows.item(i).KeyName == 'CmsTrackBeneficiary') {
                $('#divTrackBeneficiary').html(data.rows.item(i).KeyValue);
                $('#divTrackBeneficiary-AddIncome').html(data.rows.item(i).KeyValue);
                $('#divTrackYourBenficiaries').html(data.rows.item(i).KeyValue);
                $('#divTrackBeneficiary-TB').html(data.rows.item(i).KeyValue);
                $('#aTrackBeneficiary').html(data.rows.item(i).KeyValue);
            }
            if (data.rows.item(i).KeyName == 'CmsTotalIncome') {
                $('#divTotalIncome').html(data.rows.item(i).KeyValue);
            }
            if (data.rows.item(i).KeyName == 'CmsMonthEarning') {
                $('#divMonthEarning').html(data.rows.item(i).KeyValue);
            }
            if (data.rows.item(i).KeyName == 'CmsSchemeService') {
                $('#divSchemeService').html(data.rows.item(i).KeyValue);
            }
            if (data.rows.item(i).KeyName == 'CmsDigitalLiteracy') {
                $('#divDigitalLiteracy').html(data.rows.item(i).KeyValue);
                $('#DigitalLiteracy').html(data.rows.item(i).KeyValue);
            }
            if (data.rows.item(i).KeyName == 'CmsDigitalService') {
                $('#divDigitalServices').html(data.rows.item(i).KeyValue);
                $('#divDigitalService').html(data.rows.item(i).KeyValue);
            }
            if (data.rows.item(i).KeyName == 'CmsRs') {
                $('#divRs').html(data.rows.item(i).KeyValue);
            }
            
            if (data.rows.item(i).KeyName == 'CmsTerms') {
                $('#divTerms').html(data.rows.item(i).KeyValue);
            }
            if (data.rows.item(i).KeyName == 'CmsSyncData') {
                $('#divSync').html(data.rows.item(i).KeyValue);
            }
            if (data.rows.item(i).KeyName == 'CmsLogout') {
                $('#divLogout').html(data.rows.item(i).KeyValue);
            }
            if (data.rows.item(i).KeyName == 'CmsMyBeneficiary') {
                $('#aMyBeneficiaries').html(data.rows.item(i).KeyValue);
            }
            if (data.rows.item(i).KeyName == 'CmsRegisterNewBeneficiary') {
                $('#aRegisterBeneficiary').html(data.rows.item(i).KeyValue);
            }
            if (data.rows.item(i).KeyName == 'CmsUserProfileSearch') {
                $('#aSearchByProfile').html(data.rows.item(i).KeyValue);
            }
            if (data.rows.item(i).KeyName == 'CmsElgCriteriaSearch') {
                $('#aSearchByCriteria').html(data.rows.item(i).KeyValue);
            }
        }
    }
        $('#myModal').modal('hide');
        //$('#SyncUpdateProgress').hide();
}


// Query the News Table
function queryNews(tx) {
    var user = utils.localStorage().get('user');
        
    var LangId = 1;
    LangId = utils.localStorage().get('LangID');
  
    var today = new Date();
    var queryText ="SELECT N.ID, N.NewsTitle, N.NewsDetails,N.Publisher, N.PublishedDate, N.IsActive FROM News N "; 
    queryText += " WHERE  N.LangID = " + LangId;// + " AND  N.PublishedDate<= " + today ;
    queryText += " AND N.IsActive='true'  AND N.StateID= " + user.StateID;
    console.log(queryText);
  
    tx.executeSql(queryText, [], querySuccess, errorCB);
}

// Query the success callback
function querySuccess(tx, data) {
    
    var len = data.rows.length;
    if (len > 0) {
        var newsDiv = '';
        for (var i = 0; i < len; i++) {
            newsDiv += '<div class="width100 text-align-c items"> <div class="news-item1"> <div class="margin-top3"><img class="max-width15" src="images/news.png" /></div>';
            newsDiv += '<div class="anchor-news analytics" style="cursor: pointer;" onclick=SchemeDetails(' + data.rows.item(i).ID + ')><div class="news-item4 color-w" id=';
            newsDiv += '"divNewsTitle_' + data.rows.item(i).ID + '">';
            newsDiv += data.rows.item(i).NewsTitle;
            newsDiv += '</div></div>';
            newsDiv += '<div class="font3 color-w" id="'
            newsDiv += 'divPublisher_' + data.rows.item(i).ID + '">';
            newsDiv += data.rows.item(i).Publisher + ' </div>';
            newsDiv += '<div class="font3 color-w" id="'
            newsDiv += 'divPublishedDate_' + data.rows.item(i).ID + '">';
            newsDiv += data.rows.item(i).PublishedDate + '</div>';
            newsDiv += '</div><div class="clearboth"></div> </div>';
        }
       
        $("#divNews").append(newsDiv);
    }

}

var callBack = function (data) {
    if (data != null && data.length > 0) {
        BindData(data);
    }
    
    $("#SyncUpdateProgress").hide();

};

var callBackPopular = function (scheme) {
    if (scheme != null && scheme.length > 0) {
        BindPopular(scheme);
    }
    $('#myModal').modal('hide');
    
    $("#SyncUpdateProgress").hide();

};
var BindData = function (data) {
    var newsDiv = '';
    $.each(data, function (i) {
        newsDiv += '<div class="width100 text-align-c items"> <div class="news-item1"> <div class="margin-top3"><img class="max-width15" src="images/news.png" /></div>';
        newsDiv += '<div class="anchor-news analytics"  style="cursor: pointer;" onclick=SchemeDetails(' + data[i].ID + ')><div class="news-item4 color-w" id=';
        newsDiv += '"divNewsTitle_' + data[i].ID + '">';
        newsDiv += data[i].NewsTitle;
        newsDiv += '</div></div>';
        newsDiv += '<div class="font3 color-w" id="'
        newsDiv += 'divPublisher_' + data[i].ID + '">';
        newsDiv += data[i].Publisher + ' </div>';
        newsDiv += '<div class="font3 color-w" id="'
        newsDiv += 'divPublishedDate_' + data[i].ID + '">';
        newsDiv += data[i].PublishedDate + '</div>';
        newsDiv += '</div><div class="clearboth"></div> </div>';

    });
    $("#divNews").append(newsDiv);
};

var BindPopular = function (scheme) {
    $.each(scheme, function (i) {
       var keywords=getKeyWords(scheme[i].Keywords);
       var schemeName = scheme[i].SchemeName;
       if (schemeName != null && schemeName != undefined && schemeName.length > 45)
       {
           schemeName = schemeName.substring(0, 45) + "...";
       }
       var popularDiv = ' <div class="width60 items news-item-box" onclick=ShowScheme(' + scheme[i].ID + ')>';
        popularDiv += '<div class="news-item1">';
        //popularDiv += '<p style="cursor: pointer;" onclick=ShowScheme(' + scheme[i].ID + ')>';
        popularDiv += '<div class="news-item2">';
        popularDiv += schemeName + ' </div>';// </p>';
        popularDiv += '<div class="tags news-item3"><span>';
        popularDiv += keywords + '</span></div> </div> </div>';

        $("#divPopular").append(popularDiv);
    });
    $('#myModal').modal('hide');
};

var SchemeDetails = function (NewsId) {
    utils.localStorage().set('NewsId', NewsId);
    utils.localStorage().set('AnalyticsId', 'divNewsRead');
    var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);

    db.transaction(AddNewsAnalytics, errorCB);

    window.location.href = 'newsdetails.html';
};


var ShowScheme = function (ID) {
    // window.analytics.trackEvent('Scheme Details', ID, 'User ', user.userName);
    var user = utils.localStorage().get('user');
    utils.localStorage().set('SchemeId', ID);
    var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);

    db.transaction(AddSchemeAnalytics, errorCB);
    var track = {
        Category: 'SchemeDetails', Action: user.userName, Label: ID, Value: 1
    };
    // if (utils.isMobile() && utils.IsOnline()) {
    utils.Analytics.trackEvent(track);
    window.location.href = 'schemedetails.html?schemeId=' + ID;
   
  //  }
};

function AddSchemeAnalytics(tx) {
    var user = utils.localStorage().get('user');
    var LangId = utils.localStorage().get('LangID');
    var SchemeId = utils.localStorage().get('SchemeId');
    
    var param1 = new Date();
    var today = (param1.getMonth() + 1) + '/' + param1.getDate() + '/' + param1.getFullYear() + ' ' + param1.getHours() + ':' + param1.getMinutes() + ':' + param1.getSeconds();

    var sqlStmt = "INSERT INTO AnalyticsApp (AnalyticsCode, Feature, SoochnaPreneur, StateId, LangId, ObjectId, ObjectType, FeatureClicked, EventDateTime)  VALUES ";
    sqlStmt += "  ('S0001','Scheme','" + user.userName + "'," + user.StateID + "," + LangId + ",'" + SchemeId + "','SchemeId','Popular Scheme','" + today + "')";

    if (sqlStmt != undefined && sqlStmt != null) {
        tx.executeSql(sqlStmt);
    }
}

var getKeyWords = function (data) {
    var words = '';
    if (data.length <= 0) {
        var LangId = utils.localStorage().get('LangID');
        if (LangId == 1) {
            words += '<div>No Keywords available</div>';
        }
        else if (LangId == 2) {
            words += '<div>कीवर्ड उपलब्ध नहीं है।</div>';
        }
    }
    else {
        var keywords = data.split(',');
        if (keywords != null && keywords.length > 0)
        {
            for (var j = 0; j < keywords.length; j++) {
                words += '#' + $.trim(keywords[j]) + ' ';
            }
        }
        
    }

    return words;
};

function AddNewsAnalytics(tx) {
    var id = utils.localStorage().get('AnalyticsId');
    var user = utils.localStorage().get('user');
    var LangId = utils.localStorage().get('LangID');
    var NewsId = utils.localStorage().get('NewsId');

    //window.analytics.trackEvent('News', NewsId, 'News Click', NewsId);
     var track = {
         Category: 'News', Action: JSON.stringify(NewsId), Label: user.userName, Value: 1
    };
     utils.Analytics.trackEvents(track);
      
    var param1 = new Date();
    var today = (param1.getMonth() + 1) + '/' + param1.getDate() + '/' + param1.getFullYear() + ' ' + param1.getHours() + ':' + param1.getMinutes() + ':' + param1.getSeconds();
    switch (id) {
        case 'divNewsRead':
            var sqlStmt = "INSERT INTO AnalyticsApp (AnalyticsCode, Feature, SoochnaPreneur, StateId, LangId, ObjectId, ObjectType, FeatureClicked, EventDateTime)  VALUES ";
            sqlStmt += "  ('N0001','News','" + user.userName + "'," + user.StateID + "," + LangId + ",'" + NewsId + "','NewsId','Home','" + today + "')";
            break;
    }
    if (sqlStmt != undefined && sqlStmt != null) {
        tx.executeSql(sqlStmt);
    }
}

function onDeviceReady() {
    window.analytics.startTrackerWithId('UA-98636842-1', 7200);
    try {
        window.analytics.trackView('News Page');
    } catch (e) {
        console.log(JSON.stringify(e));
    }
    analytics.Analytics = {
        trackEvents: function (event) {
            try {
                window.analytics.trackEvent(event.Category, event.Action, event.Label, event.Value);
            } catch (e) {
                console.log(JSON.stringify(e));
            }


        },
        trackUser: function (user) {
            try {
                window.analytics.setUserId(user);
            } catch (e) {
                console.log(JSON.stringify(e));
            }
        }
    };


}