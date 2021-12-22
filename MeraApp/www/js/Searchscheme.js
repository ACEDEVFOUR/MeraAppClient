//searchresult.html
$(document).foundation();

var ajaxObj = {
    url: utils.Urls.GetBeneficiaryDtls,
    type: 'GET'
};

var cmsAny = '';
$(function () {
    utils.localStorage().set('criteria', 'profile');
    document.addEventListener("deviceready", onDeviceReady, false);
    var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
    db.transaction(queryCMS, errorCB);
    db.transaction(querySex, errorCB);
    db.transaction(querySexValue, errorCB);
    db.transaction(queryReligion, errorCB);
    db.transaction(queryCategory, errorCB);
    db.transaction(queryIncomelevel, errorCB);
    db.transaction(queryOccupation, errorCB);
    db.transaction(queryQualification, errorCB);
    db.transaction(queryMaritalStatus, errorCB);
    db.transaction(queryDomain, errorCB);
    db.transaction(queryDepartment, errorCB);
    db.transaction(queryVulnerableGroup, errorCB);
    db.transaction(queryEmpStatus, errorCB);
    db.transaction(queryDisablity, errorCB);
    db.transaction(querySickness, errorCB);
    db.transaction(querySearchMapping, errorCB);
    utils.Analytics.trackPage('SearchSchemePage');
    var track = {
        Category: 'SearchScheme', Action: 'SearchSchemeLoad', Label: 'Search Scheme', Value: 1
    };
    utils.Analytics.trackEvent(track);
    function onDeviceReady() {
        var user = utils.localStorage().get('user');
        var pageVal = null;
        if (user != null) {
            pageVal = 'Search Page || ' + 'User:' + user.userName + ' || StateID: ' + user.StateID;
        }
        else {
            pageVal = 'Search Page';
        }
        utils.Analytics.trackPage(pageVal);

    }

});

function querySearchMapping(tx) {
    var LangId = utils.localStorage().get('LangID');
    var queryText = "SELECT Id, LangId,  Name FROM SearchMapping";

    tx.executeSql(queryText, [], querySearchMappingSuccess, errorCB);
}

function querySearchMappingSuccess(tx, data) {
    var len = data.rows.length;
    var SearchMapping = [];
    if (len > 0) {
        for (var i = 0; i < len; i++) {
            SearchMapping.push(data.rows.item(i).Id + ',' + data.rows.item(i).LangId + ',' + data.rows.item(i).Name);
            //switch (data.rows.item(i).Name) {
            //    case 'Disablity':
            //        utils.localStorage().set('AnyDisablityId', data.rows.item(i).Id);
            //        break;
            //    case 'Domain':
            //        utils.localStorage().set('AnyDomainId', data.rows.item(i).Id);
            //        break;
            //    case 'EmpStatus':
            //        utils.localStorage().set('AnyEmpStatusId', data.rows.item(i).Id);
            //        break;
            //    case 'MaritalStatus':
            //        utils.localStorage().set('AnyMaritalStatusId', data.rows.item(i).Id);
            //        break;
            //    case 'Occuppation':
            //        utils.localStorage().set('AnyOccuppationId', data.rows.item(i).Id);
            //        break;
            //    case 'Qualification':
            //        utils.localStorage().set('AnyQualificationId', data.rows.item(i).Id);
            //        break;
            //    case 'Religon':
            //        utils.localStorage().set('AnyReligonId', data.rows.item(i).Id);
            //        break;
            //    case 'Sex':
            //        utils.localStorage().set('AnySexId', data.rows.item(i).Id);
            //        break;
            //    case 'VulnerableGroup':
            //        utils.localStorage().set('AnyVulnerableGroupId', data.rows.item(i).Id);
            //        break;
            //    case 'AnyIncomeLeveld':
            //        utils.localStorage().set('AnyIncomeLeveld', data.rows.item(i).Id);
            //        break;
            //}
            
           
        }
    }
    utils.localStorage().set('SearchMappingObj', SearchMapping);
}
function querySex(tx) {
    var LangId = utils.localStorage().get('LangID');
    var queryText = "SELECT ID, Name FROM Sex  WHERE LangID = '" + LangId + "' AND (Name !='" + cmsAny + "')";  //'Any' AND Name != 'कोई भी') ";

    tx.executeSql(queryText, [], querySexSuccess, errorCB);
}

function querySexSuccess(tx, data) {
    var len = data.rows.length;
    if (len > 0) {
        utils.bindRadioButton(data.rows, 'Gender', 'panel1');
    }
}

function querySexValue(tx) {
    var LangId = utils.localStorage().get('LangID');
    var queryText = "SELECT ID, Name FROM Sex  WHERE LangID = '" + LangId + "' OR Name =='" + cmsAny + "' OR Name == 'Any' OR Name == 'कोई भी'";  //'Any' AND Name != 'कोई भी') ";

    tx.executeSql(queryText, [], querySexValueSuccess, errorCB);
}

function querySexValueSuccess(tx, data) {
    var len = data.rows.length;
    if (len > 0) {
        utils.localStorage().set('SexMappingObj', data.rows);

    }
}

function queryReligion(tx) {
    var LangId = utils.localStorage().get('LangID');
    var queryText = "SELECT ID, Name FROM Religion  WHERE LangID = '" + LangId + "' AND (Name !='" + cmsAny + "')";

    tx.executeSql(queryText, [], queryReligionSuccess, errorCB);
}

function queryReligionSuccess(tx, data) {
    var len = data.rows.length;
    if (len > 0) {
        utils.bindRadioButton(data.rows, 'Religion', 'panel3');
    }
}

function queryCategory(tx) {
    var LangId = utils.localStorage().get('LangID');
    var queryText = "SELECT ID, Name FROM Category  WHERE LangID = '" + LangId + "' AND (Name !='" + cmsAny + "')";

    tx.executeSql(queryText, [], queryCategorySuccess, errorCB);
}

function queryCategorySuccess(tx, data) {
    var len = data.rows.length;
    if (len > 0) {
        utils.bindRadioButton(data.rows, 'Caste', 'panel4');
    }
}

function queryIncomelevel(tx) {
    var LangId = utils.localStorage().get('LangID');
    var queryText = "SELECT ID, Name FROM Incomelevel  WHERE LangID = '" + LangId + "'";

    tx.executeSql(queryText, [], queryIncomelevelSuccess, errorCB);
}

function queryIncomelevelSuccess(tx, data) {
    var len = data.rows.length;
    if (len > 0) {
        utils.bindRadioButton(data.rows, 'Incomelevel', 'panel5');
    }
}

function queryOccupation(tx) {
    var LangId = utils.localStorage().get('LangID');
    var queryText = "SELECT ID, Name FROM Occupation  WHERE LangID = '" + LangId + "' AND (Name !='" + cmsAny + "')  ORDER BY NAME";

    tx.executeSql(queryText, [], queryOccupationSuccess, errorCB);
}

function queryOccupationSuccess(tx, data) {
    var len = data.rows.length;
    if (len > 0) {
        utils.bindRadioButton(data.rows, 'Occupation', 'panel6');
    }
}

function queryQualification(tx) {
    var LangId = utils.localStorage().get('LangID');
    var queryText = "SELECT ID, Name FROM Qualification  WHERE LangID = '" + LangId + "'  AND (Name !=  'Any' AND Name != 'कोई भी') ORDER BY NAME";

    tx.executeSql(queryText, [], queryQualificationSuccess, errorCB);
}

function queryQualificationSuccess(tx, data) {
    var len = data.rows.length;
    if (len > 0) {
        utils.bindRadioButton(data.rows, 'Qualification', 'panel7');
    }
}

function queryMaritalStatus(tx) {
    var LangId = utils.localStorage().get('LangID');
    var queryText = "SELECT ID, Name FROM MaritalStatus  WHERE LangID = '" + LangId + "'  AND (Name !=  'Any' AND Name != 'कोई भी') ORDER BY NAME";

    tx.executeSql(queryText, [], queryMaritalStatusSuccess, errorCB);
}

function queryMaritalStatusSuccess(tx, data) {
    var len = data.rows.length;
    if (len > 0) {
        utils.bindRadioButton(data.rows, 'MaritalStatus', 'panel8');
    }
}

function queryDomain(tx) {
    var LangId = utils.localStorage().get('LangID');
    var queryText = "SELECT ID, Name FROM Domain  WHERE LangID = '" + LangId + "'  AND (Name !=  'Any' AND Name != 'कोई भी') ORDER BY NAME";

    tx.executeSql(queryText, [], queryDomainSuccess, errorCB);
}

function queryDomainSuccess(tx, data) {
    var len = data.rows.length;
    if (len > 0) {
        utils.bindRadioButton(data.rows, 'Domain', 'panel9');
    }
}

function queryDepartment(tx) {
    var LangId = utils.localStorage().get('LangID');
    var user = utils.localStorage().get('user');
    var StateId = utils.localStorage().get('HindiStateId');
    var queryText = '';
    if (LangId == 1) {
         queryText = "SELECT ID, Name FROM Department  WHERE LangID = '" + LangId + "' AND StateId = '" + user.StateID; +"'"
    }
    else {
        queryText = "SELECT ID, Name FROM Department  WHERE LangID = '" + LangId + "' AND StateId = '" + StateId +"'";
    }

    tx.executeSql(queryText, [], queryDepartmentSuccess, errorCB);
}

function queryDepartmentSuccess(tx, data) {
    var len = data.rows.length;
    if (len > 0) {
        utils.bindRadioButton(data.rows, 'Department', 'panel10');
    }
}

function queryEmpStatus(tx) {
    var LangId = utils.localStorage().get('LangID');
    var queryText = "SELECT ID, Name FROM EmpStatus  WHERE LangID = '" + LangId + "' AND (Name !='" + cmsAny + "')";

    tx.executeSql(queryText, [], queryEmpStatusSuccess, errorCB);
}

function queryEmpStatusSuccess(tx, data) {
    var len = data.rows.length;
    if (len > 0) {
        utils.bindRadioButton(data.rows, 'EmploymentStatus', 'panel11');
    }
}

function queryVulnerableGroup(tx) {
    var LangId = utils.localStorage().get('LangID');
    var queryText = "SELECT ID, Name FROM VulnerableGroup  WHERE LangID = '" + LangId + "' AND (Name !='" + cmsAny + "')";

    tx.executeSql(queryText, [], queryVulnerableGroupSuccess, errorCB);
}

function queryVulnerableGroupSuccess(tx, data) {
    var len = data.rows.length;
    if (len > 0) {
        utils.bindRadioButton(data.rows, 'SpecialStatus', 'panel12');
    }
}

function queryDisablity(tx) {
    var LangId = utils.localStorage().get('LangID');
    var queryText = "SELECT ID, Name FROM Disablity  WHERE LangID = '" + LangId + "' AND (Name !='" + cmsAny + "')";

    tx.executeSql(queryText, [], queryDisablitySuccess, errorCB);
}

function queryDisablitySuccess(tx, data) {
    var len = data.rows.length;
    if (len > 0) {
        utils.bindRadioButton(data.rows, 'Disability', 'panel14');
    }
}

function querySickness(tx) {
    var LangId = utils.localStorage().get('LangID');
    var queryText = "SELECT ID, Name FROM Sickness  WHERE LangID = '" + LangId + "' AND (Name !='" + cmsAny + "')";

    tx.executeSql(queryText, [], querySicknessSuccess, errorCB);
}

function querySicknessSuccess(tx, data) {
    var len = data.rows.length;
    if (len > 0) {
        utils.bindRadioButton(data.rows, 'Sickness', 'panel16');
    }
}


function GetSchemesResult() {

    var user = utils.localStorage().get('user');
    var LangId = utils.localStorage().get('LangID');
        var gender = $('input[name=Gender]:checked').val();
        var religion = $('input[name=Religion]:checked').attr("Id");
        var caste = $('input[name=Caste]:checked').attr("Id");
        var incomeLevel = $('input[name=Incomelevel]:checked').attr("Id");
        var occupation = $('input[name=Occupation]:checked').attr("Id");
        var qualification = $('input[name=Qualification]:checked').attr("Id");
        var MaritalStatus = $('input[name=MaritalStatus]:checked').attr("Id");
        var Domain = $('input[name=Domain]:checked').attr("Id");
        var departpartment = $('input[name=Department]:checked').attr("Id");
        var empStatus = $('input[name=EmploymentStatus]:checked').attr("Id");
        var VulnerableGroups = $('input[name=SpecialStatus]:checked').attr("Id");
        var Disability = $('input[name=Disability]:checked').attr("Id");
        var Sickness = $('input[name=Sickness]:checked').attr("Id");
        var SearchCriteria = {
            Gender: gender != undefined && gender != "" ? gender : "",
            Age: $('#EligibilityAge').val() != undefined && $('#EligibilityAge').val() != "" ? $('#EligibilityAge').val() : "",
            Religon_Id: religion != undefined && religion != "" ? religion.split('-')[1] : "",
            Caste_Id: caste != undefined && caste != "" ? caste.split('-')[1] : "",
            IncomeLevel_Id: incomeLevel != undefined && incomeLevel != "" ? incomeLevel.split('-')[1] : "",
            Occupation_Id: occupation != undefined && occupation != "" ? occupation.split('-')[1] : "",
            Qualification_Id: qualification != undefined && qualification != "" ? qualification.split('-')[1] : "",
            MaritalStatus_Id: MaritalStatus != undefined && MaritalStatus != "" ? MaritalStatus.split('-')[1] : "",
            Domain_Id: Domain != undefined && Domain != "" ? Domain.split('-')[1] : "",
            Department_Id: departpartment != undefined && departpartment != "" ? departpartment.split('-')[1] : "",
            EmpStatus_Id: empStatus != undefined && empStatus != "" ? empStatus.split('-')[1] : "",
            VulnerableGroup_Id: VulnerableGroups != undefined && VulnerableGroups != "" ? VulnerableGroups.split('-')[1] : "",
            FamilyIncome: $('#AnnualFamilyIncome').val() != undefined && $('#AnnualFamilyIncome').val() != "" ? $('#AnnualFamilyIncome').val() : "",
            Disablity_Id: Disability != undefined && Disability != "" ? Disability.split('-')[1] : "",
            DisabilityPercent: $('#DisabilityPercentage').val() != undefined && $('#DisabilityPercentage').val() != "" ? $('#DisabilityPercentage').val() : "",
            Sickness_Id: Sickness != undefined && Sickness != "" ? Sickness.split('-')[1] : "",
            Keywords: "",
            userId: user.userName,
            LangId: LangId,
            State_Id: user.State_Id
        };

        utils.localStorage().set('SchemeSearchObj', SearchCriteria);
        utils.localStorage().set('SearchFrom', '1');
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
               
                case 'CmsMyAccount':
                    $('#DivMyAccountText').html(data.rows.item(i).KeyValue);
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
                    $('#DivHomeText').html(data.rows.item(i).KeyValue);
                    $('#aHome').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsSearch':
                    $('#DivSearchText').html(data.rows.item(i).KeyValue);
                    $('#aSearchScheme').html(data.rows.item(i).KeyValue);
                    break;
                 
                case 'CmsQuickSearch':
                    $('#txtKeywords').attr("placeholder", data.rows.item(i).KeyValue);
                    break;
                case 'CmsSearchSchemes':
                    $('#DivSearchSchemesText').html(data.rows.item(i).KeyValue);
                    break;

              
                case 'CmsAge':
                    $('#AgeText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsReligion':
                    $('#ReligonText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsCaste':
                    $('#CasteText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsIncomeLevel':
                    $('#IncomeLevelText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsOccupation':
                    $('#OccupationText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsQualification':
                    $('#QualificationText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsMarital':
                    $('#MaritalStatusText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsCategory':
                    $('#CategoryText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsDepartment':
                    $('#DepartmentText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsGender':
                    $('#GenderText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsEmpStatus':
                    $('#EmpStatusText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsSplStatus':
                    $('#SplStatusText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsFamilyIncome':
                    $('#FamilyIncomeText').html(data.rows.item(i).KeyValue);
                    $('#AnnualFamilyIncome').attr("placeholder", data.rows.item(i).KeyValue);
                    break;
                case 'CmsDisability':
                    $('#DisabilityText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsSickness':
                    $('#SicknessText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsApply':
                    $('#DivApply').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsEnterAge':
                    $('#EligibilityAge').attr("placeholder", data.rows.item(i).KeyValue);
                    break;
                case 'CmsAny':
                    cmsAny= data.rows.item(i).KeyValue;
                    break;
                    
            }

        }
      
    }
}
