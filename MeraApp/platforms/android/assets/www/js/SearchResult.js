//searchresult.html
$(document).foundation();

$(function () {

    // 1: Search from Criteria
    // 2: UserProfile
    // 3: Keywords

    var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
    db.transaction(querySearchResult, errorCB);
    db.transaction(queryRecentSearch, errorCB);
    utils.Analytics.trackPage('SearchResult');
    document.addEventListener("deviceready", onDeviceReady, false);
    

    function onDeviceReady() {
        var user = utils.localStorage().get('user');
        var pageVal = null;
        if (user != null) {
            pageVal = 'Search Result Page || ' + 'User:' + user.userName + ' || StateID: ' + user.StateID;
        }
        else {
            pageVal = 'Search Result Page';
        }
        utils.Analytics.trackPage(pageVal);

    }
});

function GetSchemeSearch(searchSchemeObj, benSearchCrta, searchKeyword) {
    var user = utils.localStorage().get('user');
    var LangId = utils.localStorage().get('LangID');
  
    $('#myModal').modal('show');
    var ajaxObj = "";
    var keywords = "";
    var objsearch = benSearchCrta;

    if (searchSchemeObj != "" && searchSchemeObj != undefined) {
        ajaxObj = searchSchemeObj;
    }
    else if (searchKeyword != "" && searchKeyword != undefined) {

        var ajaxkeywordObj = {
            url: utils.Urls.SearchScheme,
            type: 'POST',
            obj: {
                'Gender': "",
                'Age': "",
                'Religon_Id': "",
                'Caste_Id': "",
                'IncomeLevel_Id': "",
                'Occupation_Id': "",
                'Qualification_Id': "",
                'MaritalStatus_Id': "",
                'Domain_Id': "",
                'Department_Id': "",
                'EmpStatus_Id': "",
                'VulnerableGroup_Id': "",
                'FamilyIncome': "",
                'Disablity_Id': "",
                'DisabilityPercent': "",
                'Sickness_Id': "",
                'Keywords': searchKeyword.replace(' ', ','),
                'userId': user.userName,
                'LangId': LangId
            }
        }
        ajaxObj = ajaxkeywordObj;

    }
    else if (benSearchCrta != "" && benSearchCrta != undefined) {
        ajaxObj = benSearchCrta;
    }
    utils.ajaxCall(ajaxObj.url, ajaxObj.type, ajaxObj.obj, callBackSearchScheme);

    return false;
};

function querySearchResult(tx) {
    utils.localStorage().set('FirstLoad', '2');
    $('#myModal').modal('show');
    var user = utils.localStorage().get('user');
    var searchFrom = utils.localStorage().get('SearchFrom');

    var searchSchemeObj = utils.localStorage().get('SchemeSearchObj');
    var BenSearchCriteria = utils.localStorage().get('BenSearchCriteria');
    var searchKeywords = utils.localStorage().get('SearchKeywords');

    var queryText = "SELECT s.ID, s.SchemeName, s.SchemeStatus, s.Sex, uo.FirstName as OperatorName, s.SubmissionDate, s.IsSchemeActive, ua.FirstName as ApproverName, s.Keywords, s.Objective FROM Scheme s ";
    queryText = queryText + " left outer join Users uo on uo.Username = s.OperatorName ";
    queryText = queryText + " left outer join Users ua on ua.Username = s.ApproverName ";

    var whereClause = '';

    if (searchFrom != undefined && searchFrom != "") {
        if (searchSchemeObj != "" && searchSchemeObj != undefined) {
            //GetSchemeSearch(searchSchemeObj, '', '')

            whereClause = ' s.LangId = ' + searchSchemeObj.LangId + ' ';

            if (searchSchemeObj.State_Id != '' && searchSchemeObj.State_Id != undefined) {
                var stateQuery = " (',' || s.StateId  || ',') LIKE '%," + searchSchemeObj.State_Id + ",%' ";
                if (whereClause != '') {
                    whereClause = whereClause + ' AND (' + stateQuery + ') ';
                }
                else {
                    whereClause = ' (' + stateQuery + ') ';
                }
            }

            if (searchSchemeObj.District_Id != '' && searchSchemeObj.District_Id != undefined) {
                var districtQuery = " (',' || s.DistrictId  || ',') LIKE '%," + searchSchemeObj.District_Id + ",%' ";
                if (whereClause != '') {
                    whereClause = whereClause + ' AND (' + districtQuery + ') '
                }
                else {
                    whereClause = ' (' + districtQuery + ') ';

                }
            }

            var AnyDepartmentId = getSearchMappingId('department');
            if (searchSchemeObj.Department_Id != '' && searchSchemeObj.Department_Id != undefined && searchSchemeObj.Department_Id != AnyDepartmentId) {
                var deptQuery = ' s.DepartmentId =' + searchSchemeObj.Department_Id + ' ';
                //var AnyDepartmentId = utils.localStorage().get('AnyDepartmentId');
                var OrQuery = " (',' || s.DepartmentId  || ',') LIKE '%," + AnyDepartmentId + ",%' ";
                if (whereClause != '') {
                    if (AnyDepartmentId != undefined && AnyDepartmentId != null) {

                        whereClause = whereClause + ' AND (' + deptQuery + ' OR ' + OrQuery + ') ';
                    }
                    else {
                        whereClause = whereClause + ' AND (' + deptQuery + ') ';
                    }
                }
                else {
                    if (AnyDepartmentId != undefined && AnyDepartmentId != null) {
                        whereClause = ' (' + deptQuery + ' OR ' + OrQuery + ') ';
                    }
                    else {
                        whereClause = ' (' + deptQuery + ') ';
                    }
                }
            }

            var qualificationAnyId = getSearchMappingId('qualification');
            if (searchSchemeObj.Qualification_Id != '' && searchSchemeObj.Qualification_Id != undefined && searchSchemeObj.Qualification_Id != qualificationAnyId) {
                var QualificationQuery = " (',' || s.QualificationId  || ',') LIKE '%," + searchSchemeObj.Qualification_Id + ",%' ";
                var AnyQualificationId = utils.localStorage().get('AnyQualificationId');
                var OrQuery = " (',' || s.QualificationId  || ',') LIKE '%," + qualificationAnyId + ",%' ";
                if (whereClause != '') {
                    if (qualificationAnyId != undefined || qualificationAnyId != null) {

                        whereClause = whereClause + ' AND (' + QualificationQuery + ' OR ' + OrQuery + ') ';
                    }
                    else {
                        whereClause = whereClause + ' AND (' + QualificationQuery + ') ';
                    }
                }
                else {
                    if (qualificationAnyId != undefined || qualificationAnyId != null) {
                        whereClause = ' (' + QualificationQuery + ' OR ' + OrQuery + ') ';
                    }
                    else {
                        whereClause = ' (' + QualificationQuery + ') ';
                    }
                }
            }

            var SexAnyId = getSexMappingId(getSearchMappingId('sex'));
            var criteria = utils.localStorage().get('criteria');
            if (criteria == 'Empowerment') {
                var GenderQuery = "  s.Sex  = '" + searchSchemeObj.Gender + "' ";
                whereClause = ' (' + GenderQuery + ') ';
            }
            else {
                if (searchSchemeObj.Gender != '' && searchSchemeObj.Gender != undefined && searchSchemeObj.Gender != 'any' && searchSchemeObj.Gender != SexAnyId && searchSchemeObj.Gender != 'कोई भी') {

                    if (searchFrom != undefined && searchFrom == "2") {
                        searchSchemeObj.Gender = getSexMappingId(searchSchemeObj.Gender);
                    }

                    var GenderQuery = " (',' || s.Sex  || ',') LIKE '%," + searchSchemeObj.Gender + ",%' ";
                    var AnySexId = utils.localStorage().get('AnySexId');
                    var OrQuery = " (',' || s.Sex  || ',') LIKE '%," + SexAnyId + ",%' OR (',' || s.Sex  || ',') LIKE '%,कोई भी,%' OR (',' || s.Sex  || ',') LIKE '%,any,%' ";
                    if (whereClause != '') {
                        if (SexAnyId != undefined || SexAnyId != null) {

                            whereClause = whereClause + ' AND (' + GenderQuery + ' OR ' + OrQuery + ') ';
                        }
                        else {
                            whereClause = whereClause + ' AND (' + GenderQuery + ') ';
                        }
                    }
                    else {
                        if (SexAnyId != undefined || SexAnyId != null) {
                            whereClause = ' (' + GenderQuery + ' OR ' + OrQuery + ') ';
                        }
                        else {
                            whereClause = ' (' + GenderQuery + ') ';
                        }
                    }
                }
            }

            var IncomeAnyId = getSearchMappingId('IncomeLevel');
            if (searchSchemeObj.IncomeLevel_Id != '' && searchSchemeObj.IncomeLevel_Id != undefined && searchSchemeObj.IncomeLevel_Id != IncomeAnyId) {
                var IncomeLevelQuery = " (',' || s.IncomeId  || ',') LIKE '%," + searchSchemeObj.IncomeLevel_Id + ",%' ";
                //var AnyIncomeLeveld = utils.localStorage().get('AnyIncomeLeveld');
                var OrQuery = " (',' || s.IncomeId  || ',') LIKE '%," + IncomeAnyId + ",%' ";
                if (whereClause != '') {
                    if (IncomeAnyId != undefined && IncomeAnyId != null) {

                        whereClause = whereClause + ' AND (' + IncomeLevelQuery + ' OR ' + OrQuery + ') ';
                    }
                    else {
                        whereClause = whereClause + ' AND (' + IncomeLevelQuery + ') ';
                    }
                }
                else {
                    if (IncomeAnyId != undefined && IncomeAnyId != null) {
                        whereClause = ' (' + IncomeLevelQuery + ' OR ' + OrQuery + ') ';
                    }
                    else {
                        whereClause = ' (' + IncomeLevelQuery + ') ';
                    }
                }
            }

            var MaritalStatusAnyId = getSearchMappingId('maritalstatus');

            if (searchSchemeObj.MaritalStatus_Id != '' && searchSchemeObj.MaritalStatus_Id != undefined && searchSchemeObj.MaritalStatus_Id != MaritalStatusAnyId) {
                var MaritalStatusQuery = " (',' || s.MaritalStatusID  || ',') LIKE '%," + searchSchemeObj.MaritalStatus_Id + ",%' ";
                var AnyMaritalStatusId = utils.localStorage().get('AnyMaritalStatusId');
                var OrQuery = " (',' || s.MaritalStatusID  || ',') LIKE '%," + MaritalStatusAnyId + ",%' ";
                if (whereClause != '') {
                    if (MaritalStatusAnyId != undefined || MaritalStatusAnyId != null) {

                        whereClause = whereClause + ' AND (' + MaritalStatusQuery + ' OR ' + OrQuery + ') ';
                    }
                    else {
                        whereClause = whereClause + ' AND (' + MaritalStatusQuery + ') ';
                    }
                }
                else {
                    if (MaritalStatusAnyId != undefined || MaritalStatusAnyId == null) {
                        whereClause = ' (' + MaritalStatusQuery + ' OR ' + OrQuery + ') ';
                    }
                    else {
                        whereClause = ' (' + MaritalStatusQuery + ') ';
                    }
                }
            }

            var OccupationAnyId = getSearchMappingId('occuppation');

            if (searchSchemeObj.Occupation_Id != '' && searchSchemeObj.Occupation_Id != undefined && searchSchemeObj.Occupation_Id != OccupationAnyId) {
                var OccupationQuery = " (',' || s.OccupationId  || ',') LIKE '%," + searchSchemeObj.Occupation_Id + ",%' ";

                var AnyOccupationId = utils.localStorage().get('AnyOccupationId');
                var OrQuery = " (',' || s.OccupationId  || ',') LIKE '%," + AnyOccupationId + ",%' ";
                if (whereClause != '') {
                    if (OccupationAnyId != undefined || OccupationAnyId != null) {

                        whereClause = whereClause + ' AND (' + OccupationQuery + ' OR ' + OrQuery + ') ';
                    }
                    else {
                        whereClause = whereClause + ' AND (' + OccupationQuery + ') ';
                    }
                }
                else {
                    if (OccupationAnyId != undefined || OccupationAnyId != null) {
                        whereClause = ' (' + OccupationQuery + ' OR ' + OrQuery + ') ';
                    }
                    else {
                        whereClause = ' (' + OccupationQuery + ') ';
                    }
                }

            }

            var ReligonAnyId = getSearchMappingId('religon');

            if (searchSchemeObj.Religon_Id != '' && searchSchemeObj.Religon_Id != undefined && searchSchemeObj.Religon_Id != ReligonAnyId) {
                var ReligonQuery = " (',' || s.ReligonID  || ',') LIKE '%," + searchSchemeObj.Religon_Id + ",%' ";
                var OrQuery = " (',' || s.ReligonID  || ',') LIKE '%," + ReligonAnyId + ",%' ";
                if (whereClause != '') {
                    if (ReligonAnyId != undefined && ReligonAnyId != null) {

                        whereClause = whereClause + ' AND (' + ReligonQuery + ' OR ' + OrQuery + ') ';
                    }
                    else {
                        whereClause = whereClause + ' AND (' + ReligonQuery + ') ';
                    }
                }
                else {
                    if (ReligonAnyId != undefined && ReligonAnyId != null) {
                        whereClause = ' (' + ReligonQuery + ' OR ' + OrQuery + ') ';
                    }
                    else {
                        whereClause = ' (' + ReligonQuery + ') ';
                    }
                }


            }

            var EmpStatusAnyId = getSearchMappingId('empstatus');
            if (searchSchemeObj.EmpStatus_Id != '' && searchSchemeObj.EmpStatus_Id != undefined && searchSchemeObj.EmpStatus_Id != EmpStatusAnyId) {
                var EmpStatusQuery = " (',' || s.EmpStatusID  || ',') LIKE '%," + searchSchemeObj.EmpStatus_Id + ",%' ";
                var AnyEmpStatusId = utils.localStorage().get('AnyEmpStatusId');
                var OrQuery = " (',' || s.EmpStatusID  || ',') LIKE '%," + EmpStatusAnyId + ",%' ";
                if (whereClause != '') {
                    if (EmpStatusAnyId != undefined || EmpStatusAnyId != null) {

                        whereClause = whereClause + ' AND (' + EmpStatusQuery + ' OR ' + OrQuery + ') ';
                    }
                    else {
                        whereClause = whereClause + ' AND (' + EmpStatusQuery + ') ';
                    }
                }
                else {
                    if (EmpStatusAnyId != undefined || EmpStatusAnyId != null) {
                        whereClause = ' (' + EmpStatusQuery + ' OR ' + OrQuery + ') ';
                    }
                    else {
                        whereClause = ' (' + EmpStatusQuery + ') ';
                    }
                }

            }

            if (searchSchemeObj.IsSchemeActive != '' && searchSchemeObj.IsSchemeActive != undefined) {
                if (whereClause != '') {
                    whereClause = whereClause + " AND s.IsSchemeActive = '" + searchSchemeObj.IsSchemeActive + "' ";
                }
                else {
                    whereClause = " s.IsSchemeActive = '" + searchSchemeObj.IsSchemeActive + "'";
                }
            }

            if (searchSchemeObj.SchemeStatus != '' && searchSchemeObj.SchemeStatus != undefined) {
                if (whereClause != '') {
                    whereClause = whereClause + " AND s.SchemeStatus = '" + searchSchemeObj.SchemeStatus + "' ";
                }
                else {
                    whereClause = " s.SchemeStatus = '" + searchSchemeObj.SchemeStatus + "' ";
                }
            }

            if (searchSchemeObj.Age != '' && searchSchemeObj.Age != undefined) {
                var MinAgeQuery = ' ' + searchSchemeObj.Age + ' >= MinAge and ' + searchSchemeObj.Age + ' <= MaxAge ';

                if (whereClause != '') {
                    whereClause = whereClause + ' AND (' + MinAgeQuery + ') ';
                }
                else {
                    whereClause = ' (' + MinAgeQuery + ') ';
                }
            }

            var casteAnyId = getSearchMappingId('Category');
            if (searchSchemeObj.Caste_Id != '' && searchSchemeObj.Caste_Id != undefined && searchSchemeObj.casteAnyId != casteAnyId) {
                var CasteQuery = " (',' || s.CategoryId  || ',') LIKE '%," + searchSchemeObj.Caste_Id + ",%' ";

                if (whereClause != '') {
                    whereClause = whereClause + ' AND (' + CasteQuery + ') ';
                }
                else {
                    whereClause = ' (' + CasteQuery + ') ';
                }
            }

            var DomainAnyId = getSearchMappingId('domain');
            var criteria = utils.localStorage().get('criteria');
            if (criteria != undefined && (criteria == 'Health' || criteria == 'Education' || criteria == 'Agriculture') || criteria == 'Legal') {
                var DomainQuery = " s.DomainId =" + searchSchemeObj.Domain_Id + " ";
                whereClause = ' (' + DomainQuery + ') ';
            }
            else {
                if (searchSchemeObj.Domain_Id != '' && searchSchemeObj.Domain_Id != undefined && searchSchemeObj.Domain_Id != DomainAnyId) {
                    var DomainQuery = " s.DomainId =" + searchSchemeObj.Domain_Id + " ";
                    var AnyDomainId = utils.localStorage().get('AnyDomainId');
                    //var OrQuery = " (',' || s.DomainId  || ',') LIKE '%," + DomainAnyId + ",%' ";
                    if (whereClause != '') {
                        //if (DomainAnyId != undefined || DomainAnyId != null) {

                        //    whereClause = whereClause + ' AND (' + DomainQuery + ' OR ' + OrQuery + ') ';
                        //}
                        //else {
                            whereClause = whereClause + ' AND (' + DomainQuery + ') ';
                        //}
                    }
                    else {
                        if (DomainAnyId != undefined || DomainAnyId != null) {
                            whereClause = ' (' + DomainQuery + ' OR ' + OrQuery + ') ';
                        }
                        else {
                            whereClause = ' (' + DomainQuery + ') ';
                        }
                    }
                }
            }
            var VulnerableGroupAnyId = getSearchMappingId('vulnerablegroup');
            if (searchSchemeObj.VulnerableGroup_Id != '' && searchSchemeObj.VulnerableGroup_Id != undefined && searchSchemeObj.VulnerableGroup_Id != VulnerableGroupAnyId) {
                var VulnerableGroupQuery = " (',' || s.VulnerableID  || ',') LIKE '%," + searchSchemeObj.VulnerableGroup_Id + ",%' ";
                var AnyVulnerableGroupId = utils.localStorage().get('AnyVulnerableGroupId');
                var OrQuery = " (',' || s.VulnerableID  || ',') LIKE '%," + VulnerableGroupAnyId + ",%' ";
                if (whereClause != '') {
                    if (VulnerableGroupAnyId != undefined || VulnerableGroupAnyId != null) {

                        whereClause = whereClause + ' AND (' + VulnerableGroupQuery + ' OR ' + OrQuery + ') ';
                    }
                    else {
                        whereClause = whereClause + ' AND (' + VulnerableGroupQuery + ') ';
                    }
                }
                else {
                    if (VulnerableGroupAnyId != undefined || VulnerableGroupAnyId != null) {
                        whereClause = ' (' + VulnerableGroupQuery + ' OR ' + OrQuery + ') ';
                    }
                    else {
                        whereClause = ' (' + VulnerableGroupQuery + ') ';
                    }
                }

            }

            var DisablityAnyId = getSearchMappingId('disablity');
            if (searchSchemeObj.Disablity_Id != '' && searchSchemeObj.Disablity_Id != undefined && searchSchemeObj.Disablity_Id != DisablityAnyId) {
                var DisablitQuery = " (',' || s.DisabilityID  || ',') LIKE '%," + searchSchemeObj.Disablity_Id + ",%' ";
                var AnyDisablityId = utils.localStorage().get('AnyDisablityId');
                var OrQuery = " (',' || s.DisabilityID  || ',') LIKE '%," + DisablityAnyId + ",%' ";
                if (whereClause != '') {
                    if (DisablityAnyId != undefined || DisablityAnyId != null) {

                        whereClause = whereClause + ' AND (' + DisablitQuery + ' OR ' + OrQuery + ') ';
                    }
                    else {
                        whereClause = whereClause + ' AND (' + DisablitQuery + ') ';
                    }
                }
                else {
                    if (DisablityAnyId != undefined || DisablityAnyId != null) {
                        whereClause = ' (' + DisablitQuery + ' OR ' + OrQuery + ') ';
                    }
                    else {
                        whereClause = ' (' + DisablitQuery + ') ';
                    }
                }
            }

            if (searchSchemeObj.DisabilityPercent != '' && searchSchemeObj.DisabilityPercent != undefined) {
                var DisabilityPercentQuery = " s.DisabilityPercent like '%" + searchSchemeObj.DisabilityPercent + "%' ";

                if (whereClause != '') {
                    whereClause = whereClause + ' AND (' + DisabilityPercentQuery + ') ';
                }
                else {
                    whereClause = ' (' + DisabilityPercentQuery + ') ';
                }
            }

            var SicknessAnyId = getSearchMappingId('sickness');
            if (searchSchemeObj.Sickness_Id != '' && searchSchemeObj.Sickness_Id != undefined && searchSchemeObj.Sickness_Id != SicknessAnyId) {
                var SicknessQuery = " (',' || s.SicknessID  || ',') LIKE '%," + searchSchemeObj.Sickness_Id + ",%' ";
                var OrQuery = " (',' || s.SicknessID  || ',') LIKE '%," + SicknessAnyId + ",%' ";
                if (whereClause != '') {
                    if (SicknessAnyId != undefined && SicknessAnyId != null) {

                        whereClause = whereClause + ' AND (' + SicknessQuery + ' OR ' + OrQuery + ') ';
                    }
                    else {
                        whereClause = whereClause + ' AND (' + SicknessQuery + ') ';
                    }
                }
                else {
                    if (SicknessAnyId != undefined && SicknessAnyId != null) {
                        whereClause = ' (' + SicknessQuery + ' OR ' + OrQuery + ') ';
                    }
                    else {
                        whereClause = ' (' + SicknessQuery + ') ';
                    }
                }
            }

            if (searchFrom != undefined && searchFrom == "3") {

                var query = '';
                if (searchSchemeObj.Keywords != '') {

                    var KeywordQuery = " s.Keywords like '%" + searchSchemeObj.Keywords + "%' ";

                    if (whereClause != '') {
                        whereClause = whereClause + ' AND (' + KeywordQuery + ') ';
                    }
                    else {
                        whereClause = ' (' + KeywordQuery + ') ';
                    }

                   
                }
            }





        }
        else if (searchFrom != undefined && searchFrom == '3') {
            if (searchKeywords != "" && searchKeywords != undefined) {
                GetSchemeSearch('', '', searchKeywords)
            }
        }

        if (whereClause != '')
            queryText = queryText + ' where ' + whereClause;
        
        queryText = queryText + ' ORDER By s.ID DESC '
        tx.executeSql(queryText, [], querySearchResultSuccess, errorCB);
    }
}

function querySearchResultSuccess(tx, data) {
    var len = data.rows.length;
    if (len > 0) {
        for (var i = 0; i < len; i++) {
            $("#divSchemeDtls").html(data.rows.item(i).Details);
        }
    }
    else {
        $("#mainSchemeDtls").hide();
        $("#btnBenefits").hide();
    }
 

    $("#searchScheme").hide();
    $("#searchResult").show();
    var criteria = utils.localStorage().get('criteria');
    if (criteria == 'Education') {
        $('#divOpportunity').html(getCMSValue('CmsViewOpportunities'));
        $("#divOpportunity").css("display", "block");
    }
    if (len > 0) {
        var searchResultData = "";
        var LangId = 1;
        LangId = utils.localStorage().get('LangID');
        for (var i = 0; i < len; i++) {
            var objective = data.rows.item(i).Objective.replace('<ul>', '');
            objective = objective.replace('<li>', '');
            objective = objective.replace('</ul>', '');
            objective = objective.replace('</li>', '');
            objective = objective.replace('<p>', '');
            objective = objective.replace('</p>', '');
            searchResultData = searchResultData + "<div class=\"scheme-detail1 scheme-detail5\">";
            searchResultData = searchResultData + "<div class=\"upper-case\"  class=\"anchor3\" onclick=\"ShowScheme('" + data.rows.item(i).ID + "')\" >" + data.rows.item(i).SchemeName + "</div>";
            searchResultData = searchResultData + "<div class=\"scheme-detail2\">";
            var keywords = getKeyWords(data.rows.item(i).Keywords);
            searchResultData = searchResultData + "<div class=\"scheme-detail3\">" + keywords + "</div>";
            searchResultData = searchResultData + "<div class=\"scheme-detail4\">";
            searchResultData = searchResultData + "<div>" + objective + "</div>";
            var text = getCMSValue('CmsReadMore');
            $('#divSearchResultText').html(getCMSValue('CmsSearchResult'));
            $('#txtSearch').val(getCMSValue('CmsSearch'));

            searchResultData = searchResultData + '<div><div class="anchor3" style="cursor: pointer;" onclick="ShowScheme(' + data.rows.item(i).ID + ')">' + text + '</div></div>';
            searchResultData = searchResultData + "</div>";
            searchResultData = searchResultData + "</div>";
            searchResultData = searchResultData + "</div>";
        }

        $("#searchResultData").html(searchResultData);

    }
    else {
        var LangId = utils.localStorage().get('LangID');
        if (LangId == 1) {
            $("#searchResultData").html("<div class=\"scheme-detail1 scheme-detail5\" style=\"border-bottom: 0 !important\"><div class=\"upper-case\">No Result Found</div></div>");
        }
        else if (LangId == 2) {
            $("#searchResultData").html("<div class=\"scheme-detail1 scheme-detail5\" style=\"border-bottom: 0 !important\"><div class=\"upper-case\">परिणाम नहीं मिला</div></div>");
            $("#divSearchResultText").html('खोज के परिणाम');
        }
    }

    $('#myModal').modal('hide');


}

function queryRecentSearch(tx) {

    var user = utils.localStorage().get('user');
    var searchFrom = utils.localStorage().get('SearchFrom');
    LangId = utils.localStorage().get('LangID');
    var searchSchemeObj = utils.localStorage().get('SchemeSearchObj');
    var BenSearchCriteria = utils.localStorage().get('BenSearchCriteria');
    var searchKeywords = utils.localStorage().get('SearchKeywords');

    var queryRecentSearchText = "insert INTO RecentSchemes (ID, Keywords, Objective, SchemeName, UnSchemeId, LangId) ";
    queryRecentSearchText = queryRecentSearchText + " SELECT s.ID, s.Keywords, s.Objective, s.SchemeName, s.UnSchemeId, " + LangId + " FROM Scheme s ";
    queryRecentSearchText = queryRecentSearchText + " left outer join Users uo on uo.Username = s.OperatorName ";
    queryRecentSearchText = queryRecentSearchText + " left outer join Users ua on ua.Username = s.ApproverName ";

    var whereClause = '';

    if (searchFrom != undefined && searchFrom != "") {
        if (searchSchemeObj != "" && searchSchemeObj != undefined) {
            //GetSchemeSearch(searchSchemeObj, '', '')

            whereClause = ' s.LangId = ' + searchSchemeObj.LangId + ' ';

            if (searchSchemeObj.State_Id != '' && searchSchemeObj.State_Id != undefined) {
                var stateQuery = " (',' || s.StateId  || ',') LIKE '%," + searchSchemeObj.State_Id + ",%' ";
                if (whereClause != '') {
                    whereClause = whereClause + ' AND (' + stateQuery + ') ';
                }
                else {
                    whereClause = ' (' + stateQuery + ') ';
                }
            }

            if (searchSchemeObj.District_Id != '' && searchSchemeObj.District_Id != undefined) {
                var districtQuery = " (',' || s.DistrictId  || ',') LIKE '%," + searchSchemeObj.District_Id + ",%' ";
                if (whereClause != '') {
                    whereClause = whereClause + ' AND (' + districtQuery + ') '
                }
                else {
                    whereClause = ' (' + districtQuery + ') ';

                }
            }

            if (searchSchemeObj.Department_Id != '' && searchSchemeObj.Department_Id != undefined) {
                var deptQuery = ' s.DepartmentId =' + searchSchemeObj.Department_Id + ' ';

                if (whereClause != '') {
                    whereClause = whereClause + ' AND (' + deptQuery + ') ';
                }
                else {
                    whereClause = ' (' + deptQuery + ') ';

                }
            }

            if (searchSchemeObj.Qualification_Id != '' && searchSchemeObj.Qualification_Id != undefined) {
                var QualificationQuery = " (',' || s.QualificationId  || ',') LIKE '%," + searchSchemeObj.Qualification_Id + ",%' ";

                if (whereClause != '') {
                    whereClause = whereClause + ' AND (' + QualificationQuery + ') ';
                }
                else {
                    whereClause = ' (' + QualificationQuery + ') ';
                }
            }

            if (searchSchemeObj.Gender != '' && searchSchemeObj.Gender != undefined) {
                var GenderQuery = " (',' || s.Sex  || ',') LIKE '%," + searchSchemeObj.Gender + ",%' ";
                if (whereClause != '') {
                    whereClause = whereClause + ' AND (' + GenderQuery + ') ';
                }
                else {
                    //whereClause = ' (' + GenderQuery + ') ';
                    whereClause = ' ' + GenderQuery + ' ';
                }
            }

            if (searchSchemeObj.IncomeLevel_Id != '' && searchSchemeObj.IncomeLevel_Id != undefined) {
                var IncomeLevelQuery = " (',' || s.IncomeId  || ',') LIKE '%," + searchSchemeObj.IncomeLevel_Id + ",%' ";
                if (whereClause != '') {
                    whereClause = whereClause + ' AND (' + IncomeLevelQuery + ') ';
                }
                else {
                    whereClause = ' (' + IncomeLevelQuery + ') ';
                }
            }

            if (searchSchemeObj.MaritalStatus_Id != '' && searchSchemeObj.MaritalStatus_Id != undefined) {
                var MaritalStatusQuery = " (',' || s.MaritalStatusID  || ',') LIKE '%," + searchSchemeObj.MaritalStatus_Id + ",%' ";
                if (whereClause != '') {
                    whereClause = whereClause + ' AND (' + MaritalStatusQuery + ') ';
                }
                else {
                    whereClause = ' (' + MaritalStatusQuery + ') ';
                }
            }

            if (searchSchemeObj.Occupation_Id != '' && searchSchemeObj.Occupation_Id != undefined) {
                var OccupationQuery = " (',' || s.OccupationId  || ',') LIKE '%," + searchSchemeObj.Occupation_Id + ",%' ";
                if (whereClause != '') {
                    whereClause = whereClause + ' AND (' + OccupationQuery + ') ';
                }
                else {
                    whereClause = ' (' + OccupationQuery + ') '
                }
            }

            if (searchSchemeObj.Religon_Id != '' && searchSchemeObj.Religon_Id != undefined) {
                var ReligonQuery = " (',' || s.ReligonID  || ',') LIKE '%," + searchSchemeObj.Religon_Id + ",%' ";
                if (whereClause != '') {
                    whereClause = whereClause + ' AND (' + ReligonQuery + ') ';
                }
                else {
                    whereClause = ' (' + ReligonQuery + ') ';
                }
            }

            if (searchSchemeObj.EmpStatus_Id != '' && searchSchemeObj.EmpStatus_Id != undefined) {
                var EmpStatusQuery = " (',' || s.EmpStatusID  || ',') LIKE '%," + searchSchemeObj.EmpStatus_Id + ",%' ";

                if (whereClause != '') {
                    whereClause = whereClause + ' AND (' + EmpStatusQuery + ') ';
                }
                else {
                    whereClause = ' (' + EmpStatusQuery + ') '
                }
            }

            if (searchSchemeObj.IsSchemeActive != '' && searchSchemeObj.IsSchemeActive != undefined) {
                if (whereClause != '') {
                    whereClause = whereClause + " AND s.IsSchemeActive = '" + searchSchemeObj.IsSchemeActive + "' ";
                }
                else {
                    whereClause = " s.IsSchemeActive = '" + searchSchemeObj.IsSchemeActive + "'";
                }
            }

            if (searchSchemeObj.SchemeStatus != '' && searchSchemeObj.SchemeStatus != undefined) {
                if (whereClause != '') {
                    whereClause = whereClause + " AND s.SchemeStatus = '" + searchSchemeObj.SchemeStatus + "' ";
                }
                else {
                    whereClause = " s.SchemeStatus = '" + searchSchemeObj.SchemeStatus + "' ";
                }
            }

            if (searchSchemeObj.Age != '' && searchSchemeObj.Age != undefined) {
                var MinAgeQuery = ' ' + searchSchemeObj.Age + ' >= MinAge and ' + searchSchemeObj.Age + ' <= MaxAge ';

                if (whereClause != '') {
                    whereClause = whereClause + ' AND (' + MinAgeQuery + ') ';
                }
                else {
                    whereClause = ' (' + MinAgeQuery + ') ';
                }
            }

            if (searchSchemeObj.Caste_Id != '' && searchSchemeObj.Caste_Id != undefined) {
                var CasteQuery = " (',' || s.CategoryId  || ',') LIKE '%," + searchSchemeObj.Caste_Id + ",%' ";

                if (whereClause != '') {
                    whereClause = whereClause + ' AND (' + CasteQuery + ') ';
                }
                else {
                    whereClause = ' (' + CasteQuery + ') ';
                }
            }

            if (searchSchemeObj.Domain_Id != '' && searchSchemeObj.Domain_Id != undefined) {
                var DomainQuery = " s.DomainId ='" + searchSchemeObj.Domain_Id + "' ";

                if (whereClause != '') {
                    whereClause = whereClause + ' AND (' + DomainQuery + ') ';
                }
                else {
                    whereClause = ' (' + DomainQuery + ') ';
                }
            }

            if (searchSchemeObj.VulnerableGroup_Id != '' && searchSchemeObj.VulnerableGroup_Id != undefined) {
                var VulnerableGroupQuery = " (',' || s.VulnerableID  || ',') LIKE '%," + searchSchemeObj.VulnerableGroup_Id + ",%' ";

                if (whereClause != '') {
                    whereClause = whereClause + ' AND (' + VulnerableGroupQuery + ') ';
                }
                else {
                    whereClause = ' (' + VulnerableGroupQuery + ') ';
                }
            }

            if (searchSchemeObj.Disablity_Id != '' && searchSchemeObj.Disablity_Id != undefined) {
                var DisablitQuery = " (',' || s.DisabilityID  || ',') LIKE '%," + searchSchemeObj.Disablity_Id + ",%' ";

                if (whereClause != '') {
                    whereClause = whereClause + ' AND (' + DisablitQuery + ') ';
                }
                else {
                    whereClause = ' (' + DisablitQuery + ') ';
                }
            }

            if (searchSchemeObj.DisabilityPercent != '' && searchSchemeObj.DisabilityPercent != undefined) {
                var DisabilityPercentQuery = " s.DisabilityPercent like '%" + searchSchemeObj.DisabilityPercent + "%' ";

                if (whereClause != '') {
                    whereClause = whereClause + ' AND (' + DisabilityPercentQuery + ') ';
                }
                else {
                    whereClause = ' (' + DisabilityPercentQuery + ') ';
                }
            }

            if (searchSchemeObj.Sickness_Id != '' && searchSchemeObj.Sickness_Id != undefined) {
                var SicknessQuery = " (',' || s.SicknessID  || ',') LIKE '%," + searchSchemeObj.Sickness_Id + ",%' ";

                if (whereClause != '') {
                    whereClause = whereClause + ' AND (' + SicknessQuery + ') ';
                }
                else {
                    whereClause = ' (' + SicknessQuery + ') ';
                }
            }

            var query = '';
            if (searchSchemeObj.Keywords != '') {

                var KeywordQuery = " s.Keywords like '%" + searchSchemeObj.Keywords + "%' ";

                if (whereClause != '') {
                    whereClause = whereClause + ' AND (' + KeywordQuery + ') ';
                }
                else {
                    whereClause = ' (' + KeywordQuery + ') ';
                }
            }
        }
        else if (searchFrom != undefined && searchFrom == '3') {
            if (searchKeywords != "" && searchKeywords != undefined) {
                GetSchemeSearch('', '', searchKeywords)
            }
        }

        if (whereClause != '')
            queryRecentSearchText = queryRecentSearchText + ' where ' + whereClause;

        var queryDeleteRecentSearchText = "Delete From RecentSchemes WHERE ID IN ( ";
        queryDeleteRecentSearchText = queryDeleteRecentSearchText + " SELECT s.ID FROM Scheme s ";
        queryDeleteRecentSearchText = queryDeleteRecentSearchText + " left outer join Users uo on uo.Username = s.OperatorName ";
        queryDeleteRecentSearchText = queryDeleteRecentSearchText + " left outer join Users ua on ua.Username = s.ApproverName ";

        if (whereClause != '') {
            queryDeleteRecentSearchText = queryDeleteRecentSearchText + ' where ' + whereClause + " and RecentSchemes.ID = s.ID )";
        }

        tx.executeSql(queryDeleteRecentSearchText);

        tx.executeSql(queryRecentSearchText);

    }
}

function queryRecentSearchSuccess(tx, data) {
    var len = data.rows.length;
    if (len > 0) {

    }
    else {

    }
}


function callBackSearchScheme(data) {
    $("#searchScheme").hide();
    $("#searchResult").show();
    if (data != null && data.SchemeDtls != null && data.SchemeDtls.length > 0) {
        var LangId = 1;
        LangId = utils.localStorage().get('LangID');
        var searchResultData = "";
        for (var i = 0; i < data.SchemeDtls.length; i++) {

            searchResultData = searchResultData + "<div class=\"scheme-detail1 scheme-detail5\">";
            searchResultData = searchResultData + "<div class=\"upper-case\"  class=\"anchor3\" onclick=\"ShowScheme('" + data.SchemeDtls[i].SchemeID + "')\" >" + data.SchemeDtls[i].SchemeName + "</div>";
            searchResultData = searchResultData + "<div class=\"scheme-detail2\">";
            var keywords = getKeyWords(data.SchemeDtls[i].Keywords);
            searchResultData = searchResultData + "<div class=\"scheme-detail3\">" + keywords + "</div>";
            searchResultData = searchResultData + "<div class=\"scheme-detail4\">";
            searchResultData = searchResultData + "<div>" + data.SchemeDtls[i].Objective + "</div>";
            if (LangId == 1) {
                searchResultData = searchResultData + '<div><div class="anchor3" style="cursor: pointer;" onclick="ShowScheme(' + data.SchemeDtls[i].SchemeID + ')">Read more...</div></div>';
            }
            else if (LangId == 2) {
                searchResultData = searchResultData + '<div><div class="anchor3" style="cursor: pointer;" onclick="ShowScheme(' + data.SchemeDtls[i].SchemeID + ')">विवरण पढ़िए...</div></div>';
            }
            searchResultData = searchResultData + "</div>";
            searchResultData = searchResultData + "</div>";
            searchResultData = searchResultData + "</div>";
        }

        $("#searchResultData").html(searchResultData);



    }
    else {
        var LangId = utils.localStorage().get('LangID');
        if (LangId == 1) {
            $("#searchResultData").html("<div class=\"scheme-detail1 scheme-detail5\" style=\"border-bottom: 0 !important\"><div class=\"upper-case\">No Result Found</div></div>");
        }
        else if (LangId == 2) {
            $("#searchResultData").html("<div class=\"scheme-detail1 scheme-detail5\" style=\"border-bottom: 0 !important\"><div class=\"upper-case\">परिणाम नहीं मिला</div></div>");
            $("#divSearchResultText").html('खोज के परिणाम');
        }
    }

    //utils.localStorage().set('BenSearchCriteria', '');
    //utils.localStorage().set('SearchKeywords', '');

    $('#myModal').modal('hide');
}

function getCMSValue(cmsKey) {
    var cmsKeys = utils.localStorage().get('CMSKey');
    var langId = utils.localStorage().get('LangID');
    
    for (var i = 0; i < Object.keys(cmsKeys).length; i++) {
        if (cmsKey == cmsKeys[i].KeyName && langId == cmsKeys[i].LanguageId) {
            return cmsKeys[i].KeyValue;
        }
    }

};
var ShowScheme = function (id) {
    utils.localStorage().set('SchemeId', id);
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
    sqlStmt += "  ('S0001','Scheme','" + user.userName + "'," + user.StateID + "," + LangId + ",'" + SchemeId + "','SchemeId','Scheme Search','" + today + "')";

    if (sqlStmt != undefined && sqlStmt != null) {
        tx.executeSql(sqlStmt);
    }
}

var getKeyWords = function (data) {
    var words = '';
    if (data == null || data.length <= 0) {
        var LangId = utils.localStorage().get('LangID');
        if (LangId == 1) {
            words += '<div>No Keywords available</div>';
        }
        else if (LangId == 2) {
            words += '<div> कीवर्ड उपलब्ध नहीं है।</div>';
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

function getSearchMappingId(table) {
    var LangId = utils.localStorage().get('LangID');
    var SearchMapping = utils.localStorage().get('SearchMappingObj');
    var SearchMappingId = '';
    if (SearchMapping != null && SearchMapping != undefined) {
        for (var i = 0; i < SearchMapping.length; i++) {
            var splitVal = SearchMapping[i].split(',');
            if (splitVal != null && splitVal != undefined) {
                if (splitVal[1] == LangId && splitVal[2].toLowerCase() == table.toLowerCase()) {
                    SearchMappingId = splitVal[0];
                    break;
                }
            }
        }
    }

    return SearchMappingId;

}

function getSexMappingId(Id) {
    var SearchMapping = utils.localStorage().get('SexMappingObj');
    var SearchMappingId = '';
    if (SearchMapping != null && SearchMapping != undefined) {
        //for (var i = 0; i < SearchMapping.length; i++) {

        //    if(SearchMapping[i].ID == Id )
        //    {
        //        SearchMappingId = SearchMapping[i].Name;
        //        break;
        //    }

        //}
        $.each(SearchMapping, function (i, dat) {
            if (dat.ID == Id)
            {
                SearchMappingId = dat.Name;
                return SearchMappingId;
            }
        })
    }

    return SearchMappingId;
}



