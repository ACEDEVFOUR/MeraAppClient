var BenId = 0;
(function () {
    var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
    db.transaction(queryGetBeneficiary, errorCB);
    db.transaction(queryCMS, errorCB);
    document.addEventListener("deviceready", onDeviceReady, false);


    function onDeviceReady() {
        var user = utils.localStorage().get('user');
        var pageVal = null;
        if (user != null) {
            pageVal = 'Search By User || ' + 'User:' + user.userName + ' || StateID: ' + user.StateID;
        }
        else {
            pageVal = 'Search By User';
        }
        utils.Analytics.trackPage(pageVal);

    }
})();

function queryGetBeneficiary(tx) {
    var user = utils.localStorage().get('user');
    var queryText = "SELECT ben.Id, ben.FirstName, ben.LastName,  ben.FathersName,";
    queryText = queryText + "ben.HusbandsName, ben.DOB, ben.IDProof, ben.IDDetails,";
    queryText = queryText + "ben.State, ben.District, ben.Sex, ben.Age, ben.Religion,";
    queryText = queryText + "ben.Socio, ben.Occupation, ben.MaritalStatus, ben.Category, ben.Department,"
    queryText = queryText + "ben.EmploymentStatus, ben.VulGroup, ben.AnnualIncome, ben.Disabilty, ben.Photo, ben.Relationship, ben.Sickness, ben.Beneficiary ";
    queryText = queryText + "FROM Beneficiary ben WHERE [SoochnaPreneur] = '" + user.userName + "' AND [Beneficiary] = 0 ORDER BY ben.Id "; //LIMIT 9
    tx.executeSql(queryText, [], queryGetBeneficiarySuccess, errorCB);
}

// Query the success callback
function queryGetBeneficiarySuccess(tx, data) {
    var len = data.rows.length;
    var html = '';
    var j = 0;
    if (len > 0) {
        for (var i = 0; i < len; i++) {
            j += 1;
            html += '<div onclick="searchbyprofile(' + data.rows.item(i).Id + ');">';

            html += '<div class="width31 margin1 floatl font3 text-align-c padding3-1 body5"><div class="width100 text-overflow">';
            html += data.rows.item(i).FirstName + '</div><div class="width100 text-overflow">' + data.rows.item(i).LastName;
            html += '</div></div>';
            //html += '<img src="' + utils.getImage(data[j].Photo) + '" />';
            html += '</div>';
            //if (i >= 3) {
            //    html += '<div class="clearboth0"></div>';
            //    i = 0;
            //}
        }
        $('#divBeneficiaryNames').html(html);

    }
}


function SearchUser() {
    var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
    db.transaction(querySearchBeneficiary, errorCB);
}

function querySearchBeneficiary(tx) {
    var user = utils.localStorage().get('user');

    var SoochnaPreneur = user.userName;
    var Beneficiary = 0;
    var FirstName = $('#txtName').val();
    var HusbandName = $('#txtHusbandName').val();
    var IDProof = $('#Identity').val();
    if (IDProof == undefined || IDProof == null)
        IDProof = 0;
    var IDDetails = $('#txtIdentity').val();

    var queryText = " SELECT ben.Id, ben.FirstName, ben.LastName FROM Beneficiary ben WHERE [SoochnaPreneur] = '" + SoochnaPreneur + "' ";
    queryText = queryText + " AND [Beneficiary] = " + Beneficiary;
    if (FirstName != undefined && FirstName != '')
    {
        queryText = queryText + " AND (ben.FirstName LIKE '%" + FirstName + "%' OR ben.LastName LIKE '%" + FirstName + "%')";
    }
    if (IDDetails != undefined && IDDetails != '')
    {
        queryText = queryText + " AND ben.IDDetails = '" + IDDetails + "'";
    }
    queryText = queryText + " ORDER BY ben.Id ";
    tx.executeSql(queryText, [], querySearchBeneficiarySuccess, errorCB);

}

// Query the success callback
function querySearchBeneficiarySuccess(tx, data) {
    var len = data.rows.length;
    var html = '';
    var j = 0;
    utils.localStorage().set('primaryBeneficiaries', data.rows);
    if (len > 0) {
        for (var i = 0; i < len; i++) {
            j += 1;
            html += '<div style="cursor: pointer;" onclick="searchbyprofile(' + data.rows.item(i).Id + ')">';
            html += '<div class="width31 margin1 floatl font3 text-align-c padding3-1 body5"><div class="width100 text-overflow">';
            html += data.rows.item(i).FirstName + '</div><div class="width100 text-overflow">' + data.rows.item(i).LastName;
            html += '</div></div>';
            html += '</div>';
        }

        $('#divBeneficiaryNames').html(html);
       
    }
}

var searchbyprofile = function (ID) {
    BenId = ID;
    var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
    db.transaction(queryBeneficiaryProfile, errorCB);
}

function queryBeneficiaryProfile(tx) {
    var queryText = " SELECT * FROM Beneficiary Where Id= " + BenId;
    tx.executeSql(queryText, [], queryBeneficiaryProfileSuccess, errorCB);

}

    // Query the success callback
function queryBeneficiaryProfileSuccess(tx, data) {
    var len = data.rows.length;
    var user = utils.localStorage().get('user');
    var LangId = utils.localStorage().get('LangID');
    utils.localStorage().set('primaryBeneficiaries', data.rows);
    if (len > 0) {

        var SearchCriteria = {
            Gender: data.rows.item(0).Sex != undefined && data.rows.item(0).Sex != 0 ? data.rows.item(0).Sex : "",
            Age: "",
            Religon_Id: data.rows.item(0).Religion != undefined && data.rows.item(0).Religion != 0 ? data.rows.item(0).Religion : "",
            Caste_Id: "",
            IncomeLevel_Id: data.rows.item(0).Socio != undefined && data.rows.item(0).Socio != 0 ? data.rows.item(0).Socio : "",
            Occupation_Id: data.rows.item(0).Occupation != undefined && data.rows.item(0).Occupation != 0 ? data.rows.item(0).Occupation : "",
            Qualification_Id: "",
            MaritalStatus_Id: data.rows.item(0).MaritalStatus != undefined && data.rows.item(0).MaritalStatus != 0 ? data.rows.item(0).MaritalStatus : "",
            Domain_Id: data.rows.item(0).Category != undefined && data.rows.item(0).Category != 0 ? data.rows.item(0).Category : "",
            Department_Id: data.rows.item(0).Department != undefined && data.rows.item(0).Department != 0 ? data.rows.item(0).Department : "",
            EmpStatus_Id: data.rows.item(0).EmploymentStatus != undefined && data.rows.item(0).EmploymentStatus != 0 ? data.rows.item(0).EmploymentStatus : "",
            VulnerableGroup_Id: data.rows.item(0).VulGroup != undefined && data.rows.item(0).VulGroup != 0 ? data.rows.item(0).VulGroup : "",
            FamilyIncome: data.rows.item(0).AnnualIncome != undefined && data.rows.item(0).AnnualIncome != 0 ? data.rows.item(0).AnnualIncome : "",
            Disablity_Id: data.rows.item(0).Disabilty != undefined && data.rows.item(0).Disabilty != "" ? data.rows.item(0).Disabilty : "",
            DisabilityPercent: "",
            Sickness_Id: data.rows.item(0).Sickness != undefined && data.rows.item(0).Sickness != 0 ? data.rows.item(0).Sickness : "",
            Keywords: "",
            userId: user.userName,
            LangId: LangId,
            State_Id: user.State_Id
        };

    }

    utils.localStorage().set('SchemeSearchObj', SearchCriteria);
    utils.localStorage().set('SearchFrom', '2');
    window.location.href = 'searchresult.html';

}

function queryCMS(tx) {
    var user = utils.localStorage().get('user');
    var LangId = 1;
    LangId = utils.localStorage().get('LangID');
    var queryText = "SELECT ApplicationId, CMSKeyId, CMSKeyValueId, KeyName, KeyValue, LanguageId FROM CMS  WHERE LanguageId =" + LangId;
    tx.executeSql(queryText, [], queryCMSSuccess, errorCB);
}

// Query the success callback
function queryCMSSuccess(tx, data) {
    var len = data.rows.length;
    if (len > 0) {
        for (var i = 0; i < len; i++) {
            switch (data.rows.item(i).KeyName) {
                case 'CmsUserProfileSearch':
                    $('#DivSearchUserProfileText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsUserSearchText':
                    $('#DivUserSearchText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsSearch':
                    $('#add-scheme-bene').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsUserListText':
                    $('#DivUserListText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsName':
                    $('#txtName').attr("placeholder", data.rows.item(i).KeyValue);
                    break;
                case 'CmsFatherOrHusbandName':
                    $('#txtHusbandName').attr("placeholder", data.rows.item(i).KeyValue);
                    break;
                case 'CmsIdDetails':
                    $('#txtIdentity').attr("placeholder", data.rows.item(i).KeyValue);
                    break;


            }

        }

    }
}

var loadBeneficiary = function (Id) {
    utils.localStorage().set('BeneficiaryId', Id);
    var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
    db.transaction(queryLoadBeneficiary, errorCB);
};
function queryLoadBeneficiary(tx) {
    var BeneficiaryId = utils.localStorage().get('BeneficiaryId');
    var queryText = "SELECT  ben.Id, ben.FirstName, ben.LastName,  ben.FathersName, ben.HusbandsName, ben.DOB, ben.IDProof, ben.IDDetails ";
    queryText += ", ben.State, ben.District, ben.Sex, ben.Age, ben.Religion,ben.Socio, ben.Occupation, ben.MaritalStatus, ben.Category, ben.Department, ";
    queryText += " ben.EmploymentStatus, ben.VulGroup, ben.AnnualIncome, ben.Disabilty, ben.Photo, ben.Relationship, ben.Sickness,  ben.Beneficiary ";

    queryText += " FROM Beneficiary ben ";
    queryText += " WHERE  ben.Id=" + BeneficiaryId;
    //console.log(queryText);
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