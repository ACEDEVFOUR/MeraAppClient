(function () {
    var MyDB = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
    document.addEventListener("deviceready", onDeviceReady, false);


    function onDeviceReady() {
        var user = utils.localStorage().get('user');
        var pageVal = null;
        if (user != null) {
            pageVal = 'Track Page Beneficiary' + ' || User:' + user.userName + ' || StateID: ' + user.StateID + ' || Income:' + user.AnnualIncome ;
        }
        else {
            pageVal = 'Track Page Beneficiary';
        }
        utils.Analytics.trackPage(pageVal);

    }
    $(function () {
        MyDB.transaction(queryCMS, errorCB);
        MyDB.transaction(loadBenStatus, errorCB);
        $("#pending-schemes-view").click(function () {
            $('#trackBeneficiary .track-box').hide();            
            $('#trackBeneficiary .pending').show();
            $('#dashboard-status .floatl').removeClass("scheme-status-bottom-border");
            $(this).addClass("scheme-status-bottom-border");
        });
        $("#inprocess-schemes-view").click(function () {
            $('#trackBeneficiary .track-box').hide();
            $('#trackBeneficiary .inprocess').show();
            $('#dashboard-status .floatl').removeClass("scheme-status-bottom-border");
            $(this).addClass("scheme-status-bottom-border");
        });
        
        $("#approved-schemes-view").click(function () {
            $('#trackBeneficiary .track-box').hide();
            $('#trackBeneficiary .approved').show();
            $('#dashboard-status .floatl').removeClass("scheme-status-bottom-border");
            $(this).addClass("scheme-status-bottom-border");
        });
        $("#rejetced-schemes-view").click(function () {
            $('#trackBeneficiary .track-box').hide();
            $('#trackBeneficiary .reject').show();
            $('#dashboard-status .floatl').removeClass("scheme-status-bottom-border");
            $(this).addClass("scheme-status-bottom-border");
        });
    });
    function errorCB(err) {
         alert("Error fetching Data: " + err.message);
    }
    function loadBenStatus(tx) {
        var queryText = "SELECT b.Id, b.FirstName, b.LastName, s.SchemeName, ba.Status  FROM Beneficiary b , BeneficiaryApplied ba, Scheme s  WHERE b.Id = ba.BeneficiaryId AND ba.SchemeId = s.ID";
        tx.executeSql(queryText, [], querySuccess, errorCB);
    }
    function querySuccess(tx, data) {
        var id = 0;
        var cnt = 0;
        var html = '';
       
       
        $.each(data.rows, function (i, dat) {
            if (id != dat.Id) {
                var status = '';
                var image = '';
                if (dat.Status == 1){
                    status = 'pending';
                    image = 'images/pending-active.png';
                }                    
                else if (dat.Status == 3) {
                    status = 'approved';
                    image = 'images/approved-active.png';

                }                  
                else if (dat.Status == 2) {
                    status = 'reject';
                    image = 'images/rejected-active.png';
                }
                else if (dat.Status == 4) {
                    status = 'inprocess';
                    image = 'images/inprocess-active.png';
                }
                else {
                    status = 'reject';
                    image = 'images/inprocess-active.png';
                }
                    
                html += '<div class="width80 floatl track-box ' + status + '">';
                html += '<div class="floatl width10"><img class="max-width100" src="' + image + '" /></div>';
                html += '<div class="floatl scheme-arrow width100">';
                html += '<div class="width100 overflow-ellipse font3p5" onclick="LoadBeneficiary(' + dat.Id + ')">' + dat.FirstName + ' ' + dat.LastName + '</div>';
                html += '<div class="font3 ' + status+ '-scheme-name width100 overflow-ellipse">' + dat.SchemeName + '</div>';
                html += '</div>';
                //html += '<div class="scheme-arrow1"><img class="max-width70" src="images/scheme-arrow.png"></div>'
                html += '</div>';
                
            }
        });
        $('#trackBeneficiary').html(html);
        $('#trackBeneficiary .reject').hide();
        $('#trackBeneficiary .pending').hide();
        $('#trackBeneficiary .approved').hide();
        $('#trackBeneficiary .inprocess').hide();
        $('#trackBeneficiary .pending').show();
    }
})();
function LoadBeneficiary(Id) {
    utils.localStorage().set('BeneficiaryId', Id);
    var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
    db.transaction(queryLoadBeneficiary, errorCB);
}
function queryLoadBeneficiary(tx) {
    var BeneficiaryId = utils.localStorage().get('BeneficiaryId');
    var queryText = "SELECT  ben.Id, ben.FirstName, ben.LastName,  ben.FathersName, ben.HusbandsName, ben.DOB, ben.IDProof, ben.IDDetails ";
    queryText += ", ben.State, ben.District, ben.Sex, ben.Age, ben.Religion,ben.Socio, ben.Occupation, ben.MaritalStatus, ben.Category, ben.Department, ";
    queryText += " ben.EmploymentStatus, ben.VulGroup, ben.AnnualIncome, ben.Disabilty, ben.Photo, ben.Relationship, ben.Sickness, ben.PercentageDisablity, ben.Beneficiary, ben.Address, ben.EMail, ben.Phone, ben.SoochnaPreneur, ben.Qualification ";

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
                    $('#DivTrackBenHead').html(data.rows.item(i).KeyValue);
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

          


            }

        }

    }
}