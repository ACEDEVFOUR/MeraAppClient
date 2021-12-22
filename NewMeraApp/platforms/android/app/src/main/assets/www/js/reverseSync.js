/// <reference path="jquery.js" />
/// <reference path="utils.js" />
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
        timeout: 0,
        success: function (data) {
            callBackFn();
        },
        error: function (error) {
            console.log(error);
        }
    });
}
SyncDataUpload = function () {
    $('#side-menu').hide("slide", { direction: "left" }, 100);
    var txt = $('#SyncUpload');
    $('#SyncUpdateProgress').modal('show');

    db.transaction(UploadAnalytics, errorCB);
   // SyncData();

};
function RefreshPage() {
    //window.location.reload();
    //window.location.href = 'myaccount.html';
    $('#RevSyncModal').modal('hide');
}

function DeleteAnalyticsApp(tx) {
    tx.executeSql('DELETE FROM  AnalyticsApp');

    SyncData();
  //  setInterval(function () {
  //      debugger;
  //      RefreshPage();
  //  },
  //15000);
}

function SyncBackData() {
    db.transaction(DeleteAnalyticsApp, errorCB);
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
        SyncCall(ajaxObj, UploadWallet);
    }, errorCB);
}

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
            }
        });
    }, errorCB);
}
function UploadBeneficiary() {
    var user = utils.localStorage().get('user');
    
    var queryText = "SELECT  ben.Id, ben.Beneficiary AS ParentId, ben.FirstName, ben.LastName,  ben.FathersName, ben.HusbandsName, ben.DOB, ben.IDProof, ben.IDDetails, ben.SoochnaPreneur ";
    queryText += ", ben.State, ben.District, ben.Sex, ben.Age, ben.Religion,ben.Socio, ben.Occupation, ben.MaritalStatus, ben.Category, ben.Department, ";
    queryText += " ben.EmploymentStatus, ben.VulGroup, ben.AnnualIncome, ben.Disabilty, ben.Photo, ben.Relationship, ben.Sickness, ben.PercentageDisablity, ben.Beneficiary, ben.Address, ben.EMail, ben.Phone, ben.DateOfRegistration ";
    queryText += " FROM Beneficiary ben WHERE IsUpdated = 'true' AND ben.SoochnaPreneur='" + user.userName + "'";
    
    db.transaction(function (tx) {
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

    queryText += " FROM SubBeneficiary ben WHERE IsUpdated = 'true'";
    
    db.transaction(function (tx) {

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

                SyncCall(ajaxObj, UploadBeneficiaryApplied)
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

        tx.executeSql(queryText, [], function (tx, data) {
            
            if (data.rows.length > 0) {

                var Beneficiaries = new Array();
                $.each(data.rows, function (i, dat) {
                    Beneficiaries.push(dat);
                });
                var ajaxObj = {
                    url: utils.Urls.SyncBeneficiaryApplied,
                    type: 'POST',
                    async: false,
                    data: Beneficiaries
                };
                SyncCall(ajaxObj, SyncBackData)
            }
            else {
                SyncBackData();
            }
        });

    }, errorCB);

}