/// <reference path="utils.js" />
/// <reference path="jquery-2.2.4.js" />

function ForceSync() {
    $('#SyncUpdateProgress').show();
    SyncDataUpload();
    $('#SyncUpdateProgress').hide();
}
var loadSubBeneficiary = function (Id) {
    var subbeneficiary = utils.localStorage().get('subBeneficiaries');
    for (var j = 0; j < subbeneficiary.length; j++) {
        if (subbeneficiary[j].Id == Id) {
            utils.localStorage().set('subBeneficiary', subbeneficiary[j]);
            var beneficiary = utils.localStorage().get('primaryBeneficiaries');
            for (var k = 0; k < beneficiary.length; k++) {
                if (beneficiary[k].Id == subbeneficiary[j].Beneficiary) {
                    utils.localStorage().set('primaryBeneficiary', beneficiary[j]);
                   // window.location.href = 'primarybeneficiary.html';
                    break;
                }
            }
            window.location.href = 'familymemberprofile.html';
            
            break;
        }
    }

};
var loadBeneficiary = function (Id) {
   // 
    utils.localStorage().set('BeneficiaryId', Id);
    var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
    db.transaction(queryLoadBeneficiary, errorCB);
    //for (var j = 0; j < beneficiary.length; j++) {
    //    if (beneficiary[j].Id == Id) {
    //        utils.localStorage().set('primaryBeneficiary', beneficiary[j]);
    //        window.location.href = 'primarybeneficiary.html';
    //        break;
    //    }
    //}

};
function getCount(id, table) {
   
    
    var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
    db.transaction(getCnt, errorCB);
    
}
function getCnt(tx) {
    var queryText = "SELECT COUNT(tbl.Id) AS BenCnt FROM Beneficiary tbl";
    var result = function (tx, data) {
        $('#BenCount').text(data.rows.item(0).BenCnt);
    };
    tx.executeSql(queryText, [], result, errorCB);
};
function queryLoadBeneficiary(tx) {
    var BeneficiaryId = utils.localStorage().get('BeneficiaryId');
    var queryText = "SELECT  ben.Id, ben.FirstName, ben.LastName,  ben.FathersName, ben.HusbandsName, ben.DOB, ben.IDProof, ben.IDDetails ";
    queryText += ", ben.State, ben.District, ben.Sex, ben.Age, ben.Religion,ben.Socio, ben.Occupation, ben.MaritalStatus, ben.Category, ben.Department, ";
    queryText += " ben.EmploymentStatus, ben.VulGroup, ben.AnnualIncome, ben.Disabilty, ben.Photo, ben.Relationship, ben.Sickness, ben.PercentageDisablity, ben.Beneficiary, ben.Address, ben.EMail, ben.Phone, ben.SoochnaPreneur, ben.Qualification , ed.ID as hDistrict  ";

    queryText += " FROM Beneficiary ben ";
    queryText += " LEFT OUTER JOIN District ed on ben.District = ed.EngDistrictId ";
    queryText += " WHERE  ben.Id=" + BeneficiaryId;
    console.log(queryText);
    
    tx.executeSql(queryText, [], queryLoadBeneficiarySuccess, errorCB);
}

function queryLoadBeneficiarySuccess(tx, data) {
    var len = data.rows.length;
    
    if (len > 0) {
        for (var i = 0; i < len; i++) {
            utils.localStorage().set('primaryBeneficiary', data.rows.item(i));
            window.location.href = 'primarybeneficiary.html';
            break;
        }
    }
}

var ShowScheme = function (id) {
    utils.localStorage().set('SchemeId', id);
    //Google Analytics
    try{
        var track = {
            Category: 'Scheme Details', Action: 'ShowScheme', Label: 'SchemeDetails', Value: id
            
        };
        utils.Analytics.trackEvent(track);
    }
    catch (e) {
        console.log(JSON.stringify(e));
    }
    var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);

    db.transaction(AddSchemeAnalytics, errorCB);
    window.location.href = 'schemedetails.html?schemeId=' + id;
};

function AddSchemeAnalytics(tx) {
    var user = utils.localStorage().get('user');
    var LangId = utils.localStorage().get('LangID');
    var SchemeId = utils.localStorage().get('SchemeId');

    var param1 = new Date();
    var today = (param1.getMonth() + 1) + '/' + param1.getDate() + '/' + param1.getFullYear() + ' ' + param1.getHours() + ':' + param1.getMinutes() + ':' + param1.getSeconds();

    var sqlStmt = "INSERT INTO AnalyticsApp (AnalyticsCode, Feature, SoochnaPreneur, StateId, LangId, ObjectId, ObjectType, FeatureClicked, EventDateTime)  VALUES ";
    sqlStmt += "  ('S0001','Scheme','" + user.userName + "'," + user.StateID + "," + LangId + ",'" + SchemeId + "','SchemeId','Recent Scheme Search','" + today + "')";

    if (sqlStmt != undefined && sqlStmt != null) {
        tx.executeSql(sqlStmt);
    }
}

(function () {
    var tab = utils.localStorage().get('tab-beneficiary');
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        window.analytics.startTrackerWithId('UA-98636842-1', 7200);
        try {
            var pageVal = null;
            if (user != null) {
                pageVal = 'My Account Page' + ' || User:' + user.userName + ' || StateID: ' + user.StateID;
            }
            else {
                pageVal = 'My Account Page';
            }
            utils.Analytics.trackPage(pageVal);
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

    $("#sp-schemes").click(function () {
        utils.localStorage().set('tab-beneficiary', false);
        $(".sp-beneficiaries-box").hide();
        $(".sp-scheme-box").show();
        $("#sp-schemes").addClass("sp-schemes");
        $("#sp-beneficiaries").removeClass("sp-schemes");

    });
    getCount('BenCount', 'Beneficiary');
    $("#delete-fav").click(function () {
        $("#hide-fav").slideUp();
   });

    $("#top-menu-toggle").click(function () {
        $("#top-menu-hide").show();
    });

    $("#sp-beneficiaries").click(function () {
        utils.localStorage().set('tab-beneficiary', true);
        $(".sp-beneficiaries-box").show();
        $(".sp-scheme-box").hide();
        $("#sp-schemes").removeClass("sp-schemes");
        $("#sp-beneficiaries").addClass("sp-schemes");

    });

    if (tab == true) {
        $("#sp-beneficiaries").trigger("click");
    }
    else {
        $("#sp-schemes").trigger("click");
    }
    var user = utils.localStorage().get('user');
    var ajaxObj = {
        url: utils.Urls.GetSoochnaPreneurDetails + user.userName + '&roleid=' + user.RoleID,
        type: 'GET'
    }
    var ajaxBeneficiary = {
        url: utils.Urls.GetBeneficiary + user.userName + '&Beneficiary=0',
        type: 'GET'
    };

    //var LangId = utils.localStorage().get('LangID');

    var ajaxRecentSearch = {
        url: utils.Urls.GetRecentSearch + user.userName,
        type: 'GET'
    };
   
    $(function () {
        utils.Analytics.trackPage('MyAccountPage');
        $('#BenModal').modal('show');
        utils.localStorage().set('IsSchemeDetails', false);
        //Take Recent Schemes from offline db
        // utils.ajaxCallUrl(ajaxRecentSearch.url, ajaxRecentSearch.type, RecentSearch);
        //utils.ajaxCallUrl(ajaxObj.url, ajaxObj.type, callback);
        // utils.ajaxCallUrl(ajaxBeneficiary.url, ajaxBeneficiary.type, postBeneficiary);
        var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
        db.transaction(queryRecentSchemes, errorCB);
        db.transaction(querySPDetails, errorCB);
        db.transaction(queryFavorite, errorCB);
        db.transaction(queryBeneficiaries, errorCB);
        db.transaction(queryCMS, errorCB);
        //$('#searchBeneficiary').click();
        $('#searchBeneficiary').click(function () {
            var searchString = $('#txtSearch').val().trim();
            var emptyString = '';
            if (searchString.length <= 0) {
                var LangId = utils.localStorage().get('LangID');
                if (LangId == 1)
                    emptyString = 'Please enter the name in the search box';
                else
                    emptyString = 'शीघ्र खोज में नाम दर्ज करें';

                $('#myModal').modal('hide');
                $('#emptyText').html(emptyString);
                return false;
            }
            $('#emptyText').html(emptyString);

            //Search in Offline Table
            $('#returnMessage').html('');
            $('#returnMessage').hide();
            $('#myModal').modal('show');
            
            db.transaction(searchBeneficiary, errorCB);
            db.transaction(searchSubBeneficiary, errorCB, setSearchResult);
        });
        try{
            var track = {
                Category: 'MyAccount', Action: 'MyAccountClick', Label: 'MyAccount', Value: 1
            };
            utils.Analytics.trackEvent(track);
        }
        catch (e){
            console.log(JSON.stringify(e));
        }
    });
    var setSearchResult = function () {
        //utils.localStorage().set('primaryBeneficiaries', data);
        var searchString = $('#txtSearch').val().trim();
        var ben = new Array();
        var subBen = new Array();
        var searchBen = utils.localStorage().get('searchBen');
        var searchSubBen = utils.localStorage().get('searchSubBen');
        var data = new Array();
        var x = 0;
        for (var y = 0; y < searchBen.length; y++) {
            data[x] = searchBen[y];
            x = x + 1;
        }
        for (var z = 0; z < searchSubBen.length; z++) {
            data[x] = searchSubBen[z];
            x = x + 1;
        }

        var html = '';
        var i = 0, k=0, l= 0;
        for (var j = 0; j < data.length; j++) {
            if (data[j].Beneficiary != 0) {
                subBen[k] = data[j];
                k = k + 1;
                html += '<div onclick="loadSubBeneficiary(' + data[j].Id + ');">';
            }
            else {
                ben[l] = data[j];
                l = l + 1;
                html += '<div onclick="loadBeneficiary(' + data[j].Id + ');">';
            }
                

            html += '<div class="width31 margin1 floatl font3 my-beneficiary text-align-c padding3-1">';
            html += '<div class="width100 text-overflow" >[' + data[j].Id + '</div>';
            html += '<div class="width100 text-overflow" >';
            html += data[j].FirstName + '</div><div class="width100 text-overflow">' + data[j].LastName;
            html += '</div></div>';
            //html += '<img src="' + utils.getImage(data[j].Photo) + '" />';
            html += '</div>';
        }
        if(ben.length > 0)
            utils.localStorage().set('primaryBeneficiaries', ben);
        if(subBen.length > 0)
            utils.localStorage().set('subBeneficiaries', subBen);
        $('#myModal').modal('hide');
        // alert(html);
        if (html != '') {
            $('#PrimaryBeneficiary').html(html);
        }
        else {
            var LangId = utils.localStorage().get('LangID');

            if (LangId == 1) {
                var html = '<div class="width80 margin0p10">No beneficiary with this name found</div>'
                $('#PrimaryBeneficiary').html(html);
            }
            else {
                var html = '<div class="width80 margin0p10">इस नाम का कोई लाभार्थी नहीं पाया</div>'
                $('#PrimaryBeneficiary').html(html);
            }
                      
            
        }
    };
    var RecentSearch = function (data) {
        var popularDiv = '';
        $.each(data, function (i) {
            var keyWords = getKeyWords(data[i].Keywords);
            //popularDiv += '<div class="scheme-detail1 scheme-detail5 width90 margin5 padding5 background-fav">';
            popularDiv += ' <div class="width60 items news-item-box" onclick=ShowScheme(' + data[i].ID + ')>';
            popularDiv += '<div class="news-item1">';
            popularDiv += '<div class="news-item2">' +data[i].SchemeName + '</div>';
            //popularDiv += '<div class="delete-fav-box"><img class="max-width8" src="images/delete.png" onmouseover="this.src=\'images/delete-hover.png\'" onmouseout="this.src=\'images/delete.png\'"></div>';
            //popularDiv += '<div class="scheme-detail2">';
            //popularDiv += '<div class="scheme-detail3">';

            //popularDiv += keyWords;
            //popularDiv += '</div>';
            //popularDiv += '<div class="scheme-detail4">';
            //popularDiv += '<div>' + data[i].Objective + '</div>';
            //popularDiv += '<div><div class="anchor3" style="cursor: pointer;" onclick="ShowScheme(' + data[i].ID + ')">Read more...</div></div>';
            //popularDiv += '</div>';
            //popularDiv += '</div>';

            //popularDiv += '</div>';
            popularDiv += '<div class="tags news-item3"><span>';
            popularDiv += keyWords + '</span></div> </div> </div>';


        });

        $("#divRecent").append(popularDiv);
    };
    var callback = function (data) {
        ShowFavourite();
        $('#userType').html('SoochnaPreneur');
        $('#name').html(data.UserDetails[0].FirstName + ' ' + data.UserDetails[0].LastName);
        $('#mobile').html(data.UserDetails[0].Phone);
        $('#mailId').html(data.UserDetails[0].EMail);
        ////$('#userDetails').html(data.UserDetails[0].);
       // $('#password').append(data.UserDetails[0].Password);

    };
    var postBeneficiary = function (data) {
        utils.localStorage().set('primaryBeneficiaries', data);
        var html = '';
        var i = 0;
        
        for (var j = 0; j < data.length; j++) {
            i += 1;
            html += '<div onclick="loadBeneficiary(' + data[j].Id + ');">';
            html += '<div class="width31 margin1 floatl font3 my-beneficiary text-align-c padding3-1">';
            html += '<div class="width100 text-overflow" >[' + data[j].Id + ']</div>';
            html+=  '<div class="width100 text-overflow" >' + data[j].FirstName + '</div > <div class="width100 text-overflow">' + data[j].LastName;
            html += '</div></div>';
            //html += '<img src="' + utils.getImage(data[j].Photo) + '" />';
            html += '</div>';
            //if (i >= 3) {
            //    html += '<div class="clearboth0"></div>';
            //    i = 0;
            //}
        }
        $('#PrimaryBeneficiary').html(html);
        $('#BenModal').modal('hide');
    };
})();
var ShowFavourite = function () {
    var user = utils.localStorage().get('user');
    var LangId = utils.localStorage().get('LangID');
    var ajaxObj = {
        url: utils.Urls.GetFavourite + user.userName + "&LangId=" + LangId,
        type: 'GET'
    }
    utils.ajaxCallUrl(ajaxObj.url, ajaxObj.type, DisplayFavourite);
};
var DisplayFavourite = function (data) {
    var popularDiv = '';
    var LangId = utils.localStorage().get('LangID');
    $.each(data, function (i) {
        var keyWords = getKeyWords(data[i].Keywords);
        popularDiv += '<div class="scheme-detail1 scheme-detail5 width90 margin5 padding5 background-fav">';
        popularDiv += '<div class="upper-case padding-r-15">' + data[i].SchemeName + '</div>';
        popularDiv += '<div class="delete-fav-box" id="btndelfav-' + data[i].ID + '" onclick="DeleteFavourite(' + data[i].ID + ')"><img class="max-width100" src="images/delete.png"></div>';
        if (LangId == 1) {
            popularDiv += '<div class="body2 width85 position-a-6" id="delfav-' + data.rows.item(i).ID + '"><div class="color-w text-align-c">Are you sure you want to delete this scheme from your favourite?</div>';
            popularDiv += '<div class="clearboth"></div><div class="padding2 body5 text-align-c" onclick="MakeFavourite(' + data.rows.item(i).ID + ')">Yes, please delete</div>';
            popularDiv += '<div class="clearboth2"></div><div class="padding2 body5 text-align-c canceldelete" onclick="cancelFavourite(' + data.rows.item(i).ID + ')">No, cancel request</div>';
        }
        else
            if (LangId == 2) {
                popularDiv += '<div class="body2 width85 position-a-6" id="delfav-' + data.rows.item(i).ID + '"><div class="color-w text-align-c">क्या आप इस योजना को अपने पसंद की सूची से हटाना चाहते हैं?</div>';
                popularDiv += '<div class="clearboth"></div><div class="padding2 body5 text-align-c" onclick="MakeFavourite(' + data.rows.item(i).ID + ')">हां, हटाएं</div>';
                popularDiv += '<div class="clearboth2"></div><div class="padding2 body5 text-align-c canceldelete" onclick="cancelFavourite(' + data.rows.item(i).ID + ')">नहीं, मत हटाएं</div>';
            }
        popularDiv += '<div class="arrow-right"></div></div>';
        popularDiv += '<div class="scheme-detail2">';
        popularDiv += '<div class="scheme-detail3">';

        popularDiv += keyWords;
        popularDiv += '</div>';
        popularDiv += '<div class="scheme-detail4">';
        popularDiv += '<div>' + data[i].Objective + '</div>';
        if (LangId == 1) {
            popularDiv += '<div><div class="anchor3" style="cursor: pointer;" onclick="ShowScheme(' + data[i].ID + ')">Read more...</div></div>';
        }
        else if (LangId == 2) {
            popularDiv += '<div><div class="anchor3" style="cursor: pointer;" onclick="ShowScheme(' + data[i].ID + ')">विवरण पढ़िए...</div></div>';
        }
        popularDiv += '</div>';
        popularDiv += '</div>';

        popularDiv += '</div>';


    });

    if (data != undefined && data != null && data.length == 0)
    {
        var LangId = 1;
        LangId = utils.localStorage().get('LangID');
        if (LangId == 1) {
            popularDiv = '<div class="width97 margin-left3" id="divFavourite">No Favorite schemes</div>';
        }
        else if (LangId == 2) {
            popularDiv = '<div class="width97 margin-left3" id="divFavourite"> पसंदीदा योजना नहीं मिला </div>';
        }
    }
    $("#divFavourite").append(popularDiv);
};
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
        if (keywords != null && keywords.length > 0) {
            for (var j = 0; j < keywords.length; j++) {
                words += '#' + $.trim(keywords[j]) + ' ';
            }
        }

    }

    return words;
};

var FavoriteCallback = function (data) {
    if (data == true) {
        var isFav = $("#divFav").html();
        if (isFav == '<img class="max-width35 fav-icon" src="images/fav.png">') {
            $("#divFav").html(isFav.replace('<img class="max-width35 fav-icon" src="images/fav.png">', '<img class="max-width35 fav-icon" src="images/fav-plain.png">'));
        }
        else {
            if (isFav == '<img class="max-width35 fav-icon" src="images/fav-plain.png">') {
                $("#divFav").html(isFav.replace('<img class="max-width35 fav-icon" src="images/fav-plain.png">', '<img class="max-width35 fav-icon" src="images/fav.png">'));
            }
        }
        location.reload();
        // alert('Saved successfully.');
    }
    //else
    //{
    //    alert('Problem making this scheme favourite. Please retry after some time.');
    //}
};

function DeleteFavourite(schemeId) {
   
    $("#delfav-" + schemeId).toggle();
    
}

function cancelFavourite(schemeId) {

    $("#delfav-" + schemeId).toggle();
}


//Get Beneficiaries
function queryBeneficiaries(tx) {
    
    var user = utils.localStorage().get('user');
   
   var queryText = "SELECT  ben.Id, ben.FirstName, ben.LastName,  ben.FathersName, ben.HusbandsName, ben.DOB, ben.IDProof, ben.IDDetails ";
   queryText += ", ben.State, ben.District, ben.Sex, ben.Age, ben.Religion,ben.Socio, ben.Occupation, ben.MaritalStatus, ben.Category, ben.Department, ";
   queryText += " ben.EmploymentStatus, ben.VulGroup, ben.AnnualIncome, ben.Disabilty, ben.Photo, ben.Relationship, ben.Sickness, ben.Beneficiary, ben.Address, ben.EMail, ben.Phone , ed.ID as hDistrict  ";
    
   queryText += " FROM Beneficiary ben ";
   queryText += " LEFT OUTER JOIN  District ed on ben.District = ed.EngDistrictId ";
    queryText += " WHERE SoochnaPreneur ='" + user.userName + "' AND Beneficiary= 0 ORDER BY ben.Id LIMIT 0,9 ";
    //console.log(queryText);
    tx.executeSql(queryText, [], queryBeneficiariesSuccess, errorCB);
}

function queryBeneficiariesSuccess(tx, data) {
    try{
        var track = {
            Category: 'Benficiary', Action: 'BenficiarySearch', Label: 'Benficiary', Value: 1
        };
        utils.Analytics.trackEvent(track);
    }
    catch (e) {
        console.log(JSON.stringify(e));
    }
    var html = '';
    var len = data.rows.length;
    if (len > 0) {
        utils.localStorage().set('primaryBeneficiaries', data);
       
        for (var i = 0; i < len; i++) {
            html += '<div onclick="loadBeneficiary(' + data.rows.item(i).Id + ');">';
            html += '<div class="width31 margin1 floatl font3 my-beneficiary text-align-c padding3-1">';
            html += '<div class="width100 text-overflow" >[' + data.rows.item(i).Id + ']</div>';
            html += '<div class="width100 text-overflow" > ' + data.rows.item(i).FirstName + '</div > <div class="width100 text-overflow">' + data.rows.item(i).LastName;
            html += '</div></div>';
            //html += '<img src="' + utils.getImage(data[j].Photo) + '" />';
            html += '</div>';
         
        }
       
    }
    else {
        html = '<div class="width31 margin1 floatl font3  text-align-c padding3-1">परिणाम नहीं मिला </div>';
    }
        $('#PrimaryBeneficiary').html(html);
        $('#BenModal').modal('hide');
        $('#myModal').modal('hide');
        $('#NoRecordsBeneficiary').css('display', 'none');
    }

//Query User table to get Soochna Preneur Details
function querySPDetails(tx) {
    var user = utils.localStorage().get('user');
    var RoleID = 0;
    if (user != undefined && user != null && user.RoleID != undefined && user.RoleID != null) {
        RoleID = user.RoleID;
    }
    var queryText = "SELECT Address, CreatedDate, DeviceID, DistrictID, EMail, FirstName, LastName, Organization,  ";
    queryText += " MobileNumber AS Phone, Photo, PinCode, StateID, Status, UserName ";
    queryText += " FROM USERS ";
    queryText += " WHERE UserName ='" + user.userName + "' AND RoleID=" + RoleID;
    //console.log(queryText);
    tx.executeSql(queryText, [], querySPDetailsSuccess, errorCB);
}

//querySPDetailsSuccess
function querySPDetailsSuccess(tx, data)
{
    var len = data.rows.length;
    if (len>0)
    {
      //  ShowFavourite();
        for (var i = 0; i < len; i++) {
            $('#userType').html('SoochnaPreneur');
            $('#name').html(data.rows.item(i).FirstName + ' ' + data.rows.item(i).LastName);
            $('#mobile').html(data.rows.item(i).Phone);
            $('#mailId').html(data.rows.item(i).EMail);
        }
    }
}
// Query the Scheme Table to get popular schemes
function queryRecentSchemes(tx) {
    var user = utils.localStorage().get('user');
    //;
    var LangId = 1;
    LangId = utils.localStorage().get('LangID');
    if (user != undefined && user != null && user.LangId != undefined && user.LangId != null) {
        LangId = user.LangId;
    }
    var queryText = "SELECT ID, Keywords, Objective, SchemeName, UnSchemeId FROM RecentSchemes ";
   queryText += " WHERE  LangID = " + LangId + " order by rowId desc limit 10";
   // console.log(queryText);
    tx.executeSql(queryText, [], queryRecentSchemesSuccess, errorCB);
}
// Query the queryRecentSchemesSuccess callback
function queryRecentSchemesSuccess(tx, scheme) {
    var popularDiv = '';
    var len = scheme.rows.length;
    if (len > 0) {
        for (var i = 0; i < len; i++) {
            var keywords = getKeyWords(scheme.rows.item(i).Keywords);
            var schemeName = scheme.rows.item(i).SchemeName;
            if (schemeName != null && schemeName != undefined && schemeName.length > 45) {
                schemeName = schemeName.substring(0, 45) + "...";
            }
            popularDiv += ' <div class="width60 items news-item-box" onclick=ShowScheme(' + scheme.rows.item(i).ID + ')>';
            popularDiv += '<div class="news-item1">';
            popularDiv += '<div class="news-item2">' + scheme.rows.item(i).SchemeName + '</div>';
            popularDiv += '<div class="tags news-item3"><span>';
            popularDiv += keywords + '</span></div> </div> </div>';

        }
        $("#divRecent").append(popularDiv);
        $('#myModal').modal('hide');

    }
   
}
//searchBeneficiary
function searchBeneficiary(tx) {
    var user = utils.localStorage().get('user');
    var searchString = $('#txtSearch').val().trim();
    var FirstName = '';
    var LastName = '';
    var res = searchString.split(" ");
    if (res.length == 1) {
        FirstName = searchString;
    }
    else {
        if (res.length == 2) {
            FirstName = res[0];
            LastName = res[1];
        }
        else {
            FirstName = res[0];
            for (var i = 1; i < res.length; i++) {
                if (res[i] != '') {
                    LastName = res[i];
                    break;
                }
            }
        }
    }
    var queryText = "SELECT  ben.Id, ben.FirstName, ben.LastName,  ben.FathersName, ben.HusbandsName, ben.DOB, ben.IDProof, ben.IDDetails ";
    queryText += ", ben.State, ben.District, ben.Sex, ben.Age, ben.Religion,ben.Socio, ben.Occupation, ben.MaritalStatus, ben.Category, ben.Department, ";
    queryText += " ben.EmploymentStatus, ben.VulGroup, ben.AnnualIncome, ben.Disabilty, ben.Photo, ben.Relationship, ben.Sickness,  ben.Beneficiary, ben.Address, ben.EMail, ben.Phone, ed.ID as hDistrict ";

    queryText += " FROM Beneficiary ben ";
    queryText += " LEFT OUTER JOIN  District ed on ben.District = ed.EngDistrictId ";
    queryText += " WHERE SoochnaPreneur ='" + user.userName;
    if (LastName == '') {
        queryText += "' AND (FirstName LIKE '%" + FirstName + "%' OR LastName LIKE '%" + FirstName + "%')";
    }
    else {
        queryText += "' AND (FirstName LIKE '%" + FirstName + "%' AND LastName LIKE '%" + LastName + "%')";
    }
    queryText += " ORDER BY ben.Id LIMIT 0,9 ";
    //console.log(queryText);

    tx.executeSql(queryText, [], function (tx, results) {
        var tab = [];
        for (i = 0; i < results.rows.length; i++) {
            tab.push(results.rows.item(i))
        }
        utils.localStorage().set('searchBen', tab);
    }, errorCB);

}

//searchSubBeneficiary
function searchSubBeneficiary(tx) {
    var user = utils.localStorage().get('user');
    var searchString = $('#txtSearch').val().trim();
    var FirstName = '';
    var LastName = '';
    var res = searchString.split(" ");
    if (res.length == 1) {
        FirstName = searchString;
    }
    else {
        if (res.length == 2) {
            FirstName = res[0];
            LastName = res[1];
        }
        else {
            FirstName = res[0];
            for (var i = 1; i < res.length; i++) {
                if (res[i] != '') {
                    LastName = res[i];
                    break;
                }
            }
        }
    }
    var queryText = "SELECT  ben.Id, ben.FirstName, ben.LastName,  ben.FathersName, ben.HusbandsName, ben.DOB, ben.IDProof, ben.IDDetails ";
    queryText += ", ben.State, ben.District, ben.Sex, ben.Age, ben.Religion,ben.Socio, ben.Occupation, ben.MaritalStatus, ben.Category, ben.Department, ";
    queryText += " ben.EmploymentStatus, ben.VulGroup, ben.AnnualIncome, ben.Disabilty, ben.Photo, ben.Relationship, ben.Sickness,  ben.Beneficiary, ben.Address, ben.EMail, ben.Phone, ben.DateOfRegistration , ed.ID as hDistrict  ";

    queryText += " FROM SubBeneficiary ben ";
    queryText += " LEFT OUTER JOIN  District ed on ben.District = ed.EngDistrictId ";
    queryText += " WHERE SoochnaPreneur ='" + user.userName;
    if (LastName == '') {
        queryText += "' AND (FirstName LIKE '%" + FirstName + "%' OR LastName LIKE '%" + FirstName + "%')";
    }
    else {
        queryText += "' AND (FirstName LIKE '%" + FirstName + "%' AND LastName LIKE '%" + LastName + "%')";
    }
    queryText += " ORDER BY ben.Id LIMIT 0,9 ";
    console.log(queryText);
    tx.executeSql(queryText, [], function (tx, results) {
        var tab = [];
        for (i = 0; i < results.rows.length; i++) {
            tab.push(results.rows.item(i))
        }
        utils.localStorage().set('searchSubBen', tab);
    }, errorCB);

}
//querySearchForBeneficiary
function querySearchForBeneficiary(tx) {
    var user = utils.localStorage().get('user');
    var searchString = $('#txtSearch').val().trim();
    var FirstName = '';
    var LastName = '';
    var res = searchString.split(" ");
    if (res.length == 1)
    {
        FirstName = searchString;
    }
    else {
        if (res.length==2)
        {
            FirstName = res[0];
            LastName = res[1];
        }
        else {
            FirstName = res[0];
            for (var i = 1; i < res.length; i++)
            {
                if(res[i]!='')
                {
                    LastName = res[i];
                    break;
                }
            }
        }
    }
    $('#returnMessage').html('');
    $('#returnMessage').hide();
    $('#myModal').modal('show');

    //var user = utils.localStorage().get('user');

    var queryText = "SELECT  ben.Id, ben.FirstName, ben.LastName,  ben.FathersName, ben.HusbandsName, ben.DOB, ben.IDProof, ben.IDDetails ";
    queryText += ", ben.State, ben.District, ben.Sex, ben.Age, ben.Religion,ben.Socio, ben.Occupation, ben.MaritalStatus, ben.Category, ben.Department, ";
    queryText += " ben.EmploymentStatus, ben.VulGroup, ben.AnnualIncome, ben.Disabilty, ben.Photo, ben.Relationship, ben.Sickness,  ben.Beneficiary, ben.Address, ben.EMail, ben.Phone , ed.ID as hDistrict ";

    queryText += " FROM Beneficiary ben ";
    queryText += " LEFT OUTER JOIN  District ed on ben.District = ed.EngDistrictId ";
    queryText += " WHERE SoochnaPreneur ='" + user.userName;
    if (LastName == '') {
        queryText +=  "' AND (FirstName LIKE '%" + FirstName + "%' OR LastName LIKE '%" + FirstName + "%')";
    }
    else
    {
        queryText +=  "' AND (FirstName LIKE '%" + FirstName + "%' AND LastName LIKE '%" + LastName + "%')";
    }
    queryText += " ORDER BY ben.Id LIMIT 0,9 ";
    //console.log(queryText);
    tx.executeSql(queryText, [], queryBeneficiariesSuccess, errorCB);
}

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
    var len = data.rows.length;
    if (len > 0) {
        $.each(data.rows, function (i, dat) {
           
            var element = dat.KeyName;
            var id = element.replace("CmsKey", "div");
            $('#' + id).html(dat.KeyValue);

        });
        for (var i = 0; i < len; i++) {
            switch (data.rows.item(i).KeyName) {
                case 'CmsTrackBeneficiary':
                    $('#divTrackBeneficiary').html(data.rows.item(i).KeyValue);
                    $('#aTrackBeneficiary').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsAddIncome':
                    $('#aAddRevenue').html(data.rows.item(i).KeyValue);
                    $('#divAddRevenue').html(data.rows.item(i).KeyValue);
                    break;

                case 'CmsMyWallet':
                    $('#divMyWallet').html(data.rows.item(i).KeyValue);
                    $('#aRevenue').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsTerms':
                    $('#divTerms').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsSyncData':
                    $('#divSync').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsHome':
                    $('#divHome').html(data.rows.item(i).KeyValue);
                    $('#aHome').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsSearch':
                    $('#aSearchScheme').html(data.rows.item(i).KeyValue);
                    $('#divSearch').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsMyAccount':
                    $('#divMyAccount').html(data.rows.item(i).KeyValue);
                    $('#aMyAccount').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsMyAccount':
                    $('#hMyAccount').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsSyncUpload':
                    $('#DivSyncMessage').html(data.rows.item(i).KeyValue);
                    $('#spanUpload').text(data.rows.item(i).KeyValue);
                    break;
                case 'CmsLogout':
                    $('#divLogout').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsMyBeneficiary':
                    $('#divBeneficiary').html(data.rows.item(i).KeyValue);
                    $('#divMyBeneficiary').html(data.rows.item(i).KeyValue);
                    $('#aMyBeneficiaries').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsRegisterNewBeneficiary':
                    $('#DivRegisterBeneficiary').html(data.rows.item(i).KeyValue);
                    $('#aRegisterBeneficiary').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsUserProfileSearch':
                    $('#aSearchByProfile').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsElgCriteriaSearch':
                    $('#aSearchByCriteria').html(data.rows.item(i).KeyValue);
                    break;

                case 'CmsFavorite':
                    $('#DivFavSchemes').html(data.rows.item(i).KeyValue);
                    break;
                
               
                case 'CmsSchemes':
                    $('#divSchemes').html(data.rows.item(i).KeyValue);
                    break;
               
                case 'CmsRecentSchemes':
                    $('#DivRecentSchemes').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsBenCount':
                    $('#divBenCount').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsQuickSearch':
                    $('#txtSearch').attr("placeholder", data.rows.item(i).KeyValue);
                    break;
                case 'CmsSync':
                    $('#DivSyncMessage').html(data.rows.item(i).KeyValue);
                    break;
                   

            }

        }
    }
    $('#myModal').modal('hide');

    
}