var idDetails = [];
var ServiceName = '';
var LangId = utils.localStorage().get('LangID');
var user = utils.localStorage().get('user');

var digitalLiteracyTotalVal = '';
$(function () {
    document.addEventListener("deviceready", onDeviceReady, false);
    var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
    db.transaction(queryCMS, errorCB);
    db.transaction(queryDigitalLiteracy, errorCB);
    db.transaction(queryBeneficiaries, errorCB);
    db.transaction(querySubBeneficiaries, errorCB);
    db.transaction(queryDigitalService, errorCB);
    function onDeviceReady() {
        window.analytics.startTrackerWithId('UA-98636842-1', 7200);
            var pageVal = null;
            if (user != null) {
                pageVal = 'Add Income Page || ' + 'User:' + user.userName + ' || StateID: ' + user.StateID + ' || Income:' + user.AnnualIncome;
            }
            else {
                pageVal = 'Add Income';
            }
            utils.Analytics.trackPage(pageVal);

        }
});

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
                case 'CmsService':
                    $('#CmsService').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsQuantity':
                    $('#CmsQuantity').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsCost':
                    $('#CmsCost').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsTrackBeneficiary':
                    $('#divTrackBeneficiary-AddIncome').html(data.rows.item(i).KeyValue);
                    $('#aTrackBeneficiary').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsAddIncome':
                    $('#aAddRevenue').html(data.rows.item(i).KeyValue);
                    $('#divAddIncomeWallet').html(data.rows.item(i).KeyValue);
                    $('#divAddIncome-AddIncome').html(data.rows.item(i).KeyValue);
                    break;

                case 'CmsMyWallet':
                    $('#divMyWallet-AddIncome').html(data.rows.item(i).KeyValue);
                    $('#aRevenue').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsTerms':
                    $('#divTerms').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsSyncData':
                    $('#divSync').html(data.rows.item(i).KeyValue);
                    break;

                case 'CmsMyAccount':
                    $('#divMyAccount').html(data.rows.item(i).KeyValue);
                    $('#aMyAccount').html(data.rows.item(i).KeyValue);
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

                case 'CmsElgCriteriaSearch':
                    $('#DivSearchElgCriteriaText').html(data.rows.item(i).KeyValue);
                    $('#DivSearchByEligibilty').html('<img class="max-width20" src="images/search-account.png" /> ' + data.rows.item(i).KeyValue);
                    $('#aSearchByCriteria').html(data.rows.item(i).KeyValue);

                    break;
                case 'CmsUserProfileSearch':
                    $('#DivSearchByProfile').html('<img class="max-width20" src="images/search-el.png" /> ' + data.rows.item(i).KeyValue);
                    $('#aSearchByProfile').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsHome':
                    $('#divHome').html(data.rows.item(i).KeyValue);
                    $('#aHome').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsSearch':
                    $('#divSearch').html(data.rows.item(i).KeyValue);
                    $('#aSearchScheme').html(data.rows.item(i).KeyValue);
                    break;

                case 'CmsDigitalLiteracy':
                    $('#digital-literacy').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsDigitalService':
                    $('#digital-service').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsSelectBen':
                    $('#DivLinkToBen').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsLink':
                    $('#LinkBeneficary').val(data.rows.item(i).KeyValue);
                    $('#Donebtn').val(data.rows.item(i).KeyValue);
                    break;
                case 'CmsSelectCourse':
                    $('#DivSelectCourseText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsBenAadhar':
                    $('#idDetailsVal').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsSchemeProcessingFees':
                    $('#WalletAddMsg').html(data.rows.item(i).KeyValue);
                    $('#WalletAdded').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsClose':
                    $('#BtnClose').html(data.rows.item(i).KeyValue);
                    $('#BtnCloseDS').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsBenLinked':
                    $('#digitalLiteracyMsg').html(data.rows.item(i).KeyValue);
                    break;

            }

        }

    }
}

function queryDigitalLiteracy(tx) {
    var queryText = "select s.Id, s.ServiceTypeId, s.ProgramName, st.ServiceName, s.Price, s.LangID from Services s inner join ServiceType st on st.Id = s.ServiceTypeId  where st.ServiceName = 'Digital Literacy' AND s.LangID =" + LangId ;
    tx.executeSql(queryText, [], queryDigitalLiteracySuccess, errorCB);
}

function queryDigitalLiteracySuccess(tx, data) {
    var len = data.rows.length;
    if (len > 0) {
        ServiceName = data.rows[0].ServiceName;

        var listItems = "";
        listItems += "<option value='-1' selected='true' disabled='disabled'>SELECT </option>";
        for (var i = 0; i < data.rows.length; i++) {

            digiVal = data.rows[i].Id + "&&&" + data.rows[i].Price;

            listItems += "<option value='" + digiVal + "'>" + data.rows[i].ProgramName + "</option>";
        }
        $('#DigitalLiteracyOption').html(listItems);
    }
}


function queryBeneficiaries(tx) {
    var queryText = "select Id, FirstName, LastName, IDDetails from Beneficiary where SoochnaPreneur='" + user.userName + "' ";
    tx.executeSql(queryText, [], queryBeneficiariesSuccess, errorCB);
}

function queryBeneficiariesSuccess(tx, data) {
    var len = data.rows.length;
    if (len > 0) {
        var listItems = "";
        listItems += "<option value='-1' selected='true' disabled='disabled'>SELECT</option>";
        for (var i = 0; i < data.rows.length; i++) {
            var fullName = data.rows[i].FirstName + " " + data.rows[i].LastName
            listItems += "<option value='" + data.rows[i].Id + "'>" + fullName + "</option>";

            var idProofDetail = data.rows[i].Id + "&&&" + data.rows[i].IDDetails

            idDetails.push(idProofDetail);
        }
        $('#BeneficiaryOption').html(listItems);
    }
}

function querySubBeneficiaries(tx) {
    var queryText = "select Id, FirstName, LastName, IDDetails from SubBeneficiary where SoochnaPreneur='" + user.userName + "' ";
    tx.executeSql(queryText, [], querySubBeneficiariesSuccess, errorCB);
}

function querySubBeneficiariesSuccess(tx, data) {
    var len = data.rows.length;
    if (len > 0) {
        select = document.getElementById('BeneficiaryOption');
        for (var i = 0; i < data.rows.length; i++) {

            var fullName = data.rows[i].FirstName + " " + data.rows[i].LastName
            var opt = document.createElement('option');
            opt.value = data.rows[i].Id;
            opt.innerHTML = fullName;
            select.appendChild(opt);

            var idProofDetail = data.rows[i].Id + "&&&" + data.rows[i].IDDetails
            idDetails.push(idProofDetail);
        }
    }
}

function errorCB(err) {
        alert("Error fetching Data: " + err.message);
}

function GetIdDetails(idVal)
{
    for (var i = 0; i < idDetails.length; i++) {

        var id = idDetails[i].split("&&&")

        if (id[0] == idVal) {
            $('#idDetailsVal').html(id[1]);
        }

    }

}

function LinkBen() {
    ServiceName = 'Digital Literacy';
    var digitalVal = document.getElementById("DigitalLiteracyOption").value;
    var benVal = document.getElementById("BeneficiaryOption").value
    
    if (digitalVal != "-1" && benVal != "-1") {
        var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
        db.transaction(queryCheckBeneAval, errorCB);

    }
    else {
        alert("All are Mandatory before to link.");
    }
    return false;

}

function queryCheckBeneAval(tx) {
    var digitalVal = document.getElementById("DigitalLiteracyOption").value;
    var benVal = document.getElementById("BeneficiaryOption").value
    var digiVal = digitalVal.split("&&&");

    var queryText = "select * from AppUserWallet where UserId='" + user.userName + "' and ServiceTypeId=" + digiVal[0] + " and BeneficiaryId =" + benVal;
    tx.executeSql(queryText, [], queryCheckBeneAvalSuccess, errorCB);
}

function queryCheckBeneAvalSuccess(tx, data) {
    var len = data.rows.length;
    if (len > 0) {
        alert("Select Beneficiary is already added in wallet");
    }
    else {
        var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
        db.transaction(querySaveAppUserWallet, errorCB);
    }
}

function querySaveAppUserWallet(tx) {

    var digitalVal = document.getElementById("DigitalLiteracyOption").value;
    var benVal = document.getElementById("BeneficiaryOption").value
    var digiVal = digitalVal.split("&&&");
    var today = new Date();
    digitalLiteracyTotalVal = digiVal[1];
    var formattedtoday = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    var queryText = "INSERT INTO AppUserWallet (Id, UserId, ServiceTypeId, BeneficiaryId, ServiceName, Price, Date, LangID ) VALUES (" + utils.randomNum() + ",'" +
        user.userName + "'," + digiVal[0] + "," + benVal + ",'" + ServiceName + "'," + digiVal[1] + ",'" + formattedtoday + "'," +
        LangId + ")";

    tx.executeSql(queryText, [], querySaveAppUserWalletSuccess, errorCB);

}

function querySaveAppUserWalletSuccess(tx, data) {
    var len = data.rows.length;
  //  document.getElementById('digitalLiteracyMsg').innerHTML = "Select Beneficiary Linked.";
    document.getElementById('digitalLiteracyTotalVal').innerHTML = digitalLiteracyTotalVal + " ";
    modal.style.display = "block";
    document.getElementById("DigitalLiteracyOption").value = "-1";
    document.getElementById("BeneficiaryOption").value = "-1";
    document.getElementById('idDetailsVal').innerHTML = "";
    //alert("Select Beneficiary Linked");
    return false;
}


function queryDigitalService(tx) {
    var queryText = "select s.Id, s.ServiceTypeId, s.ProgramName, st.ServiceName, s.Price, s.LangID from Services s inner join ServiceType st on st.Id = s.ServiceTypeId  where st.ServiceName = 'Digital Services' AND s.LangID =" + LangId;
    tx.executeSql(queryText, [], queryDigitalServiceSuccess, errorCB);
}

function queryDigitalServiceSuccess(tx, data) {
    var len = data.rows.length;
    if (len > 0) {
        ServiceName = data.rows[0].ServiceName;
        var listItems = "";
        listItems += "<option value='-1' selected='true' disabled='disabled'>Select</option>";
        for (var i = 0; i < data.rows.length; i++) {

            digiVal = data.rows[i].Id + "&&&" + data.rows[i].Price;

            listItems += "<option value='" + digiVal + "'>" + data.rows[i].ProgramName + "</option>";
        }
        $('#DigitalServiceOption').html(listItems);
    }
}

function UpdateINRVal() {

    var digiVal = document.getElementById("DigitalServiceOption").value;
    if (digiVal != "-1") {
        var quantityVal = document.getElementById("quantityVal").value;
        digiVal = digiVal.split("&&&");
        var totalVal = parseInt(quantityVal) * parseInt(digiVal[1]);
        $('#priceTotalVal').html(totalVal);
    }
    else {
        alert("Select service is mandatory.");
    }
   
    return false;

}

function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

function AddDigitalServiceToWallet() {
    ServiceName = 'Digital Services';
    var digiVal = document.getElementById("DigitalServiceOption").value;
    var quantityVal = document.getElementById("quantityVal").value;

    if (digiVal != "-1" && quantityVal != "") {
        var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
        db.transaction(querySaveServiceToAppUserWallet, errorCB);
    } else {
        alert("All are fields are Mandatory");
    }
    return;
}

function querySaveServiceToAppUserWallet(tx) {

    var digitalVal = document.getElementById("DigitalServiceOption").value;
    var finalPrice = document.getElementById("priceTotalVal").innerText;
    var digiVal = digitalVal.split("&&&");
    var today = new Date();
    var formattedtoday = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var queryText = "INSERT INTO AppUserWallet (Id, UserId, ServiceTypeId, BeneficiaryId, ServiceName, Price, Date, LangID ) VALUES (" + utils.randomNum() + ",'" +
        user.userName + "'," + digiVal[0] + ",0,'" + ServiceName + "'," + finalPrice + ",'" + formattedtoday + "'," +
        LangId + ")";

    tx.executeSql(queryText, [], querySaveServiceToAppUserWalletSuccess, errorCB);

}

function querySaveServiceToAppUserWalletSuccess(tx, data) {
    var len = data.rows.length;
    modal3.style.display = "block";

    document.getElementById('digitalServiceTotalVal').innerHTML = document.getElementById('priceTotalVal').innerText;

    //alert("Digital Service Saved Successfully.");
    document.getElementById("DigitalServiceOption").value = "-1";
    document.getElementById("quantityVal").value = "";
    document.getElementById('priceTotalVal').innerText = '';
    return false;
}

$('#DigitalServiceOption').change(function () {
    document.getElementById('quantityVal').value = '';
    document.getElementById('priceTotalVal').innerText = '';
    return false;
});