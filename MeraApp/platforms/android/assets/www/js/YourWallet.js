
var LangId = utils.localStorage().get('LangID');
var user = utils.localStorage().get('user');
$(function () {
    var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
    db.transaction(queryCMS, errorCB);
    db.transaction(queryWallet, errorCB);
    document.addEventListener("deviceready", onDeviceReady, false);


    function onDeviceReady() {
        var user = utils.localStorage().get('user');
        var pageVal = null;
        if (user != null) {
            pageVal = 'Wallet Page || ' + 'User:' + user.userName + ' || StateID: ' + user.StateID;
        }
        else {
            pageVal = 'Wallet Page';
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
                case 'CmsTrackBeneficiary':
                    $('#divTrackBeneficiary').html(data.rows.item(i).KeyValue);
                    $('#aTrackBeneficiary').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsAddIncome':
                    $('#aAddRevenue').html(data.rows.item(i).KeyValue);
                    $('#divAddIncome').html(data.rows.item(i).KeyValue);
                    break;

                case 'CmsMyWallet':
                    $('#divMyWallet').html(data.rows.item(i).KeyValue);
                    $('#aRevenue').html(data.rows.item(i).KeyValue);
                    $('#DivRevenueHead').html(data.rows.item(i).KeyValue);
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
                    $('#DivDigitalLiteracy').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsDigitalService':
                    $('#digital-service').html(data.rows.item(i).KeyValue);
                    $('#DivDigitalService').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsSchemeService':
                    $('#scheme-service').html(data.rows.item(i).KeyValue);
                    $('#DivSchemeService').html(data.rows.item(i).KeyValue);
                    break;
                
                case 'CmsTotalIncome':
                    $('#DivTotalEarning').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsMonthEarning':
                    $('#DivMonthEarning').html(data.rows.item(i).KeyValue);
                    break;
                    
                    
            }

        }

    }
}

function queryWallet(tx) {
    var user = utils.localStorage().get('user');
    var LangId = 1;
    LangId = utils.localStorage().get('LangID');
    var queryText = "SELECT Id, ServiceTypeId, ServiceName, Price, Date  FROM AppUserWallet  WHERE UserId ='" + user.userName + "' ORDER BY ServiceName";
    tx.executeSql(queryText, [], queryWalletSuccess, errorCB);
}

function queryWalletSuccess(tx, data) {
    var len = data.rows.length;
    if (len > 0) {
        var SSMonth = 0, SSTotal = 0, DSMonth = 0, DSTotal = 0, DLMonth = 0, DLTotal = 0;
        var today = new Date();
        var CurrentMonth = today.getMonth() + 1;
        var IncomeMonth = 0;
        var GrandMonthIncome = 0;
        var CumTotal = 0;
        for (var i = 0; i < len; i++) {
            var sp = data.rows.item(i).Date.split('-');
            if (sp != null && sp != undefined && sp.length > 1)
            {
                IncomeMonth = 0;
                IncomeMonth = sp[1];
            }
            switch (data.rows.item(i).ServiceName) {
                case 'Scheme Services':
                    
                    //IncomeMonth=data.rows.item(i).Date.getMonth();
                    if (IncomeMonth == CurrentMonth) {
                        SSMonth = SSMonth + data.rows.item(i).Price;
                    }
                    SSTotal = SSTotal + data.rows.item(i).Price;
                    break;

                case 'Digital Literacy':
                   // IncomeMonth = data.rows.item(i).Date.getMonth();
                    if (IncomeMonth == CurrentMonth) {
                        DLMonth = DLMonth + data.rows.item(i).Price;
                    }
                    DLTotal = DLTotal + data.rows.item(i).Price;
                    break;

                case 'Digital Services':
                  //  IncomeMonth = data.rows.item(i).Date.getMonth();
                    if (IncomeMonth == CurrentMonth) {
                        DSMonth = DSMonth + data.rows.item(i).Price;
                    }
                    DSTotal = DSTotal + data.rows.item(i).Price;
                    break;
            }
        }
        GrandMonthIncome = SSMonth + DSMonth + DLMonth;
        CumTotal = SSTotal + DSTotal + DLTotal;

        $('#SpanMonthEarning').html(GrandMonthIncome);

        $('#SpanSSIncome').html(SSMonth);
        $('#SpanDLIncome').html(DLMonth);
        $('#SpanDSIncome').html(DSMonth);
        $('#SpanSSCum').html(SSTotal);
        $('#SpanDLCum').html(DLTotal);
        $('#SpanDSCum').html(DSTotal);
        $('#SpanCumTotal').html(CumTotal);

    }
}