$(function () {
   
});
function GetSubAppSchemesResult(criteria) {
    utils.localStorage().set('criteria', criteria);
    utils.localStorage().set('FirstLoad', '1');
    var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
   // db.transaction(queryStateId, errorCB);
    db.transaction(queryDepartment, errorCB);
}
function queryDepartment(tx) {
    var LangId = utils.localStorage().get('LangID');
    var HindiStateId = utils.localStorage().get('HindiStateId');
    var criteria = utils.localStorage().get('criteria');
    var user = utils.localStorage().get('user'); //user.StateID
    var queryText = 'SELECT ID, Name FROM Domain ';
    switch (criteria) {
        case 'Health':
            var health = utils.localStorage().get('Health');
            queryText += " WHERE Name = '" + health + "'";
            //if (LangId == 1)
            //    queryText += " WHERE Name = 'Health'";
            //else if (LangId == 2) {
            //    queryText += " WHERE Name = 'स्वास्थ्य' ";
            //}
            break;
        case 'Education':
            var education = utils.localStorage().get('Education');
            queryText += " WHERE Name = '" + education + "'";
            //if (LangId == 1) {
            //    queryText += " WHERE Name = 'Education'";
            //}
            //else if (LangId == 2) {
            //    queryText += " WHERE Name = 'शिक्षा'";
            //}
            break;
        case 'Empowerment':
            var empowerment = utils.localStorage().get('Empowerment');
            queryText += " WHERE Name = '" + empowerment + "'";
            //if (LangId == 1) {
            //    queryText += " WHERE Name = 'Female'";
            //}
            //else if (LangId == 2) {
            //    queryText += " WHERE Name Like '%महिला%'";;
            //}
            break;
        case 'Agriculture':
            var agriculture = utils.localStorage().get('Agriculture');
            queryText += " WHERE Name = '" + agriculture + "'";
            //if (LangId == 1) {
            //    queryText += " WHERE Name = 'Agriculture'";
            //}
            //else if (LangId == 2) {
            //    queryText += " WHERE Name = 'कृषि'";
            //}
            break;
        case 'Legal':
           // var legal = utils.localStorage().get('Legal');
            queryText += " WHERE EngId=1033";
            break;
        case 'Disability':
            var Disability = utils.localStorage().get('Disability');
            queryText += " WHERE Name Like '%" + Disability + "%'";
            break;
    }
    //if (LangId == 1) {
    //    queryText = queryText + " AND StateId = '" + user.StateID + "'";
    //}
    //else {
    //    queryText = queryText + " AND StateId = '" + HindiStateId+ "'";
    //}
    tx.executeSql(queryText, [], queryDepartmentSuccess, errorCB);
}

function queryDepartmentSuccess(tx, data) {
    var len = data.rows.length;
    var LangId = utils.localStorage().get('LangID');
    var user = utils.localStorage().get('user');
    var SearchCriteria = {
        Gender: "",
        Age: "",
        Religon_Id: "",
        Caste_Id: "",
        IncomeLevel_Id: "",
        Occupation_Id: "",
        Qualification_Id: "",
        MaritalStatus_Id: "",
        Domain_Id: "",
        Department_Id: -1,
        EmpStatus_Id: "",
        VulnerableGroup_Id: "",
        FamilyIncome: "",
        Disablity_Id: "",
        DisabilityPercent: "",
        Sickness_Id: "",
        Keywords: "",
        userId: user.userName,
        LangId: LangId,
        State_Id: user.StateID
    };
    if (len > 0) {
        
         SearchCriteria = {
            Gender: "",
            Age: "",
            Religon_Id: "",
            Caste_Id: "",
            IncomeLevel_Id: "",
            Occupation_Id: "",
            Qualification_Id: "",
            MaritalStatus_Id: "",
            Domain_Id: data.rows.item(0).ID,
            Department_Id: "",
            EmpStatus_Id: "",
            VulnerableGroup_Id: "",
            FamilyIncome: "",
            Disablity_Id: "",
            DisabilityPercent: "",
            Sickness_Id: "",
            Keywords: "",
            userId: user.userName,
            LangId: LangId,
            State_Id: user.StateID
        };

       
    }
    var criteria = utils.localStorage().get('criteria');
    if (criteria == 'Empowerment') {
        //if (LangId == 1) {
        //    SearchCriteria.Gender = "Female";
        //    SearchCriteria.Department_Id = "";
        //}
        //else if (LangId == 2) {
        //    SearchCriteria.Gender = "महिला";
        //    SearchCriteria.Department_Id = "";
        //}
        var gender = utils.localStorage().get('Female');
        SearchCriteria.Gender = gender;
        SearchCriteria.Department_Id = "";
    }
    utils.localStorage().set('SchemeSearchObj', SearchCriteria);
    utils.localStorage().set('SearchFrom', '2');
    getState(tx);
    
}

function getState(tx) {
    
    var user = utils.localStorage().get('user');
    var LangId = utils.localStorage().get('LangID');
    var queryText = 'SELECT ID FROM State WHERE EngStateId=' + user.StateID + ' AND LangID = ' + LangId;
    tx.executeSql(queryText, [], queryStateSuccess, errorCB);
    
}
function queryStateSuccess(tx, data) {
    var len = data.rows.length;
    utils.localStorage().set('SearchFrom', '2');
    var searchSchemeObj = utils.localStorage().get('SchemeSearchObj');
    if (len > 0) {
        searchSchemeObj.State_Id = data.rows.item(0).ID;
    }
    else {
        searchSchemeObj.State_Id = '';
    }
    utils.localStorage().set('SchemeSearchObj', searchSchemeObj);
    var FirstLoad = utils.localStorage().get('FirstLoad');
    if (FirstLoad == 1) {
        window.location.href = 'searchresult.html';
    }
}



