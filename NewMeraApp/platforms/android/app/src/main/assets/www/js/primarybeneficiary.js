/// <reference path="jquery-2.2.4.js" />
/// <reference path="utils.js" />
var benId = '';
var loadSubBeneficiary = function (Id, Beneficiary) {
    //var beneficiary = utils.localStorage().get('subBeneficiaries');
    //for (var j = 0; j < beneficiary.length; j++) {
    //    if (beneficiary[j].Id == Id) {
    //        utils.localStorage().set('subBeneficiary', beneficiary[j]);
    //        window.location.href = 'familymemberprofile.html';
    //        break;
    //    }
    //}
    utils.localStorage().set('FamilyMemberId', Id);
    utils.localStorage().set('BeneficiaryId', Beneficiary);
    var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
    db.transaction(queryFamilyMembers, errorCB);

};
var queryFamilyMembers = function (tx) {
    var BeneficiaryId = utils.localStorage().get('BeneficiaryId');
    var Id = utils.localStorage().get('FamilyMemberId');
    var queryText = "SELECT  ben.Id, ben.FirstName, ben.LastName,  ben.FathersName, ben.HusbandsName, ben.DOB, ben.IDProof, ben.IDDetails ";
    queryText += ", ben.State, ben.District, ben.Sex, ben.Age, ben.Religion,ben.Socio, ben.Occupation, ben.MaritalStatus, ben.Category, ben.Department, ";
    queryText += " ben.EmploymentStatus, ben.VulGroup, ben.AnnualIncome, ben.Disabilty, ben.Photo, ben.Relationship, ben.Sickness,  ben.Beneficiary, ben.Address, ben.PercentageDisablity, ben.EMail, ben.Phone, ben.Qualification";

    queryText += " FROM SubBeneficiary ben ";
    queryText += " WHERE Beneficiary =" + BeneficiaryId;
    queryText += " AND Id =" + Id;//
    tx.executeSql(queryText, [], queryFamilyMembersSuccess, errorCB);
};

var queryFamilyMembersSuccess = function (tx, data) {
    var len = data.rows.length;
    
    if (len > 0) {
        for (var j = 0; j < len; j++) {
            utils.localStorage().set('subBeneficiary', data.rows.item(j));
               // utils.localStorage().set('subBeneficiary', beneficiary[j]);
                window.location.href = 'familymemberprofile.html';
                break;
        }
    }
};

var GetRelation = function (Id) {
   
    var relation = utils.localStorage().get('masterDataBeneficiary');

    for(var j=0; j< relation.Relationships.length; j++){
        if (relation.Relationships[j].ID == Id) {
            return relation.Relationships[j].Name;
        }
    }

};

var benAppliedId = 0;
function DeleteSchemeFromBen(Id, status) {
    benAppliedId = Id;
    var LangId = 1;
    LangId = utils.localStorage().get('LangID');

    var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);

    if (LangId == 1) {

        if (status != '3') {
            $('#AppliedBenId-' + benAppliedId).remove();
            db.transaction(queryDeleteBen, errorCB);
            alert("Scheme deleted successfully !!");
        }
        else {
            alert("Scheme cannot be deleted. It is in Approved Status");
        }

    }
    else if (LangId == 2) {

        if (status != '3') {
            $('#AppliedBenId-' + benAppliedId).remove();
            db.transaction(queryDeleteBen, errorCB);
            alert("योजना को सफलतापूर्वक हटा दिया गया है !!");
        }
        else {
            alert("योजना हटाया नहीं जा सकता. इसे मंजूरी दे दी स्थिति में है");
        }

    }
}


var queryDeleteBen = function (tx) {
    var queryText = " Delete from BeneficiaryApplied where ID = " + benAppliedId + "";
    tx.executeSql(queryText);
    benAppliedId = 0;
};

(function () {
    document.addEventListener("deviceready", onDeviceReady, false);


    function onDeviceReady() {
        var user = utils.localStorage().get('user');
        var pageVal = null;
        if (user != null) {
            pageVal = 'Primary Beneficiary Page' + 'User:' + user.userName + 'StateID: ' + user.StateID;
        }
        else {
            pageVal = 'Primary Beneficiary Page';
        }
        utils.Analytics.trackPage(pageVal);

    }
    var primaryBeneficiary = utils.localStorage().get('primaryBeneficiary');
    var soochnaPreneur = utils.localStorage().get('user');
    var LangId = 1;
    LangId = utils.localStorage().get('LangID');
    var appWallet = function (tx, data) {
        var html = '';
        if (data.rows.length < 1) {
            var LangId = 1;
            LangId = utils.localStorage().get('LangID');
            html = '<div class="scheme-detail1">';
            if (LangId == 1) {
                html += '<div class="anchor3"> No Course selected yet.</div>';
            }
            else if (LangId == 2) {
                html += '<div class="anchor3"> अभी तक कोई कोर्से का चयन नहीं किया गया है।</div>';
            }
            html += '</div>';
           
        }
        else {
              $.each(data.rows, function (i, dat) {
                        html +=  '<div class="box1 body5 padding-top2">';
                        html += '<div class="upper-case">' + dat.ProgramName + '</div>';
                        html +=  '<div class="clearboth"></div>';
                        html +=  '<div class="width100 floatl font3">';
                        html +=  '<div class="width50 floatl dateofjoin">Date of Joining</div>';
                        html += '<div class="width50 floatl text-align-c dateofcomp">' + dat.Date.slice(0, 10).replace(/-/g, '/') + '</div>';
                        html +=  '</div>';
                        html +=  '<div class="width100 floatl font3" id="dateofcompletion">';
                        html +=  '<div class="width50 floatl dateofjoin">Date of Completion</div>';
                        html += '<div class="width50 floatl text-align-c dateofcomp">' + dat.Date.slice(0, 10).replace(/-/g, '/') + '</div>';
                        html +=  '</div>';
                        html +=  '<div class="width100 floatl font3">';
                        html +=  '<div class="width50 floatl dateofjoin">Status</div>';
                        html +=  '<div class="width50 floatl text-align-c dateofcomp" id="course-status">Running</div>';
                        html +=  '</div>';
                        html +=  '<div class="width100 floatl font3">';
                        html +=  '<div class="width50 floatl text-align-r">';
                        html +=  '<div class="floatr color-w body13" style="padding:5%; margin:5% 3%;" id="dComp">Completed</div>';
                        html +=  '</div>';
                        html +=  '<div class="width50 floatl text-align-l">';
                        html +=  '<div class="floatl color-w body14" style="padding:5%; margin:5% 3%;" id="droppedOut">Dropped out</div>';

                        html +=  '</div>';
                        html +=  '</div>';

                        html += '</div><br/>';
                    });
        }
      
        $('#divWallet').html(html);


    }
    var subBeneficiary = function (tx, data) {
        var html = '';
        var len = data.rows.length;
        if (len > 0) {
            for (var j = 0; j < len; j++) {
                var relation = GetRelation(data.rows.item(j).Relationship);
                var Id = data.rows.item(j).Id;
                var FirstName = data.rows.item(j).FirstName;
                var LastName = data.rows.item(j).LastName;
                html += '<div onclick=loadSubBeneficiary("' + Id + '","' + data.rows.item(j).Beneficiary + '")>';
                html += '<div class="width31 margin1 floatl font3 padding3-1 body9 text-align-c"><div class="width100 text-overflow">' + FirstName + '</div><div class="width100 text-overflow">' + LastName + '</div><div class="color-w font2-8 text-overflow">' + relation + '</div></div>';
                html += '</div>';
            }
        }

        html += '<a href="addfamilymember.html"><div class="floatl width31 border-recent padding1 margin1 text-align-c">';
        if (LangId == 1) {
            html += '<div class="width100 padding5" align="center"><div class="colorf29c22 add-member">+</div></div><div class="colorf29c22 font3p5 padding5">Add Member</div></div></a>';
        }
        else if (LangId == 2) {
            html += '<div class="width100 padding5" align="center"><div class="colorf29c22 add-member">+</div></div><div class="colorf29c22 font3p5 padding5">सदस्य जोड़ें</div></div></a>';
        }
        $('#SubBeneficiary').html(html);
    };
    $(function () {
        var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
        db.transaction(queryCMS, errorCB);
        fromLocalStorage(primaryBeneficiary);
        //utils.ajaxCallUrl(ajaxBenficiaryScheme.url, ajaxBenficiaryScheme.type, ShowBeneficiaryScheme);
        db.transaction(queryScheme, errorCB);
        var BeneficiaryDtls = utils.localStorage().get('masterDataBeneficiary');
        profileBeneficiary(BeneficiaryDtls);
        //utils.ajaxCallUrl(ajaxObj.url, ajaxObj.type, profileBeneficiary);
        db.transaction(querySubBeneficiary, errorCB);
        //utils.ajaxCallUrl(ajaxObjSubBeneficiary.url, ajaxObjSubBeneficiary.type, subBeneficiary);
        benId = primaryBeneficiary.Id;
        db.transaction(queryAppWallet, errorCB);
       
        $('[data-toggle="popover"]').popover();
    });
    var queryScheme = function (tx) {
       
        //var queryText = "SELECT SchemeId, SchemeName, Id, AppliedStatus, KeyWords, Objective, BeneficiaryId, LangID FROM BeneficiarySchemes ";
        var LangId = 1;
        LangId = utils.localStorage().get('LangID');
        var queryText = " SELECT ba.SchemeId, s.SchemeName, ba.Id as Id, ba.Status as AppliedStatus, s.KeyWords, s.Objective, s.ProcessingFee, ba.BeneficiaryId, LangID ";
        queryText = queryText + " FROM BeneficiaryApplied ba ";
        queryText = queryText + " left outer join Scheme s on s.ID = ba.SchemeId AND s.LangID=" + LangId;

        queryText += " WHERE ba.BeneficiaryId =" + primaryBeneficiary.Id;
        tx.executeSql(queryText, [],  ShowSchemes, errorCB)
    }
    var queryAppWallet = function (tx) {
        var langID = utils.localStorage().get('LangID');
        var queryText = "SELECT a.ServiceName, S.ProgramName, a.Date  FROM AppUserWallet a INNER JOIN Services S On a.ServiceTypeId = S.Id WHERE a.ServiceName ='Digital Literacy' AND a.BeneficiaryId =" + benId;
        //+" AND LangID =" + langID;

        tx.executeSql(queryText, [], appWallet, errorCB);
    }
    var querySubBeneficiary = function (tx) {
        var queryText = "SELECT  ben.Id as Id, ben.FirstName, ben.LastName,  ben.FathersName, ben.HusbandsName, ben.DOB, ben.IDProof, ben.IDDetails ";
        queryText += ", ben.State, ben.District, ben.Sex, ben.Age, ben.Religion,ben.Socio, ben.Occupation, ben.MaritalStatus, ben.Category, ben.Department, ";
        queryText += " ben.EmploymentStatus, ben.VulGroup, ben.AnnualIncome, ben.Disabilty, ben.Photo, ben.Relationship, ben.Sickness,  ben.Beneficiary, ben.Address, ben.EMail, ben.Phone ";

        queryText += " FROM SubBeneficiary ben ";
        queryText += " WHERE SoochnaPreneur ='" + soochnaPreneur.userName + "'";
        queryText += " AND Beneficiary =" + primaryBeneficiary.Id;
        tx.executeSql(queryText, [], subBeneficiary, errorCB);
    };
    var ShowSchemes = function (tx, data) {
        var popularDiv = '';
        var keyWords = '';
        var LangId = 1;
        LangId = utils.localStorage().get('LangID');
        
        if (data != undefined && data != null && data.rows.length > 0) {
            $.each(data.rows, function (i, dat) {
                if (dat.SchemeName != null && dat.SchemeName != undefined && dat.SchemeName.length > 0) {
                    if (dat.Keywords != null)
                        keyWords = getKeyWords(dat.Keywords);
                    popularDiv += '<div class="scheme-detail1" id="AppliedBenId-' + dat.Id + '">';

                    var Status = 'Pending';

                    if (dat.AppliedStatus == '2') {
                        Status = 'Rejected';
                    }
                    else if (dat.AppliedStatus == '3') {
                        Status = 'Approved';
                    }
                    else if (dat.AppliedStatus == '4') {
                        Status = 'In Process';
                    }

                    //popularDiv += '<div>' + Status + '</div>';
                    popularDiv += '<div class="upper-case margin-top3 padding-r-15" onclick="ShowSchemeStatus(' + dat.SchemeId + ', ' + dat.BeneficiaryId + ', ' + dat.Id + ', ' + dat.ProcessingFee + ')" id="' + dat.SchemeId + '-SchemeName">' + dat.SchemeName + '</div>';
                    popularDiv += '<div class="tags upper-case position-a-4" onclick="ShowSchemeStatus(' + dat.SchemeId + ', ' + dat.BeneficiaryId + ', ' + dat.Id + ', ' + dat.ProcessingFee + ')" id="' + dat.Id + '-Status">' + Status + '</div>';
                    popularDiv += '<div class="delete-fav-box delete-fav-box1 id="btndelfav-' + dat.Id + '" onclick="DeleteFavourite(' + dat.Id + ')"><img class="max-width100" src="images/delete.png"></div>';
                    if (LangId == 1) {
                        popularDiv += '<div class="body2 width90 padding10 position-a-6" id="delfav-' + dat.Id + '"><div class="color-w text-align-c">Are you sure you want to delete this scheme from your beneficiary account?</div>';
                        popularDiv += '<div class="clearboth"></div><div class="padding2 body5 text-align-c" onClick="DeleteSchemeFromBen(' + dat.Id + ', ' + dat.AppliedStatus + ')">Yes, please delete</div>';
                        popularDiv += '<div class="clearboth2"></div><div class="padding2 body5 text-align-c canceldelete" onclick="cancelFavourite(' + dat.Id + ')">No, cancel request</div>';
                    }
                    else if (LangId == 2) {
                        popularDiv += '<div class="body2 width90 padding10 position-a-6" id="delfav-' + dat.Id + '"><div class="color-w text-align-c">क्या आप इस योजना को हटाना चाहते हैं?</div>';
                        popularDiv += '<div class="clearboth"></div><div class="padding2 body5 text-align-c" onClick="DeleteSchemeFromBen(' + dat.Id + ', ' + dat.AppliedStatus + ')">हां, हटाएं</div>';
                        popularDiv += '<div class="clearboth2"></div><div class="padding2 body5 text-align-c canceldelete" onclick="cancelFavourite(' + dat.Id + ')">नहीं, मत हटाएं</div>';

                    }
                    popularDiv += '<div class="arrow-right arrow-right1"></div></div>';
                    popularDiv += '<div class="scheme-detail2">';
                    popularDiv += '<div class="scheme-detail3">';

                    popularDiv += keyWords;
                    popularDiv += '</div>';
                    popularDiv += '<div class="scheme-detail4">';
                    popularDiv += '<div id="' + dat.Id + '-Desc">' + dat.Objective + '</div>';
                    if (LangId == 1) {
                        popularDiv += '<div><a class="anchor3" href="javascript:void(0)" onclick="ShowScheme(' + dat.SchemeId + ')">Read more...</a></div></div>';
                    }
                    else if (LangId == 2) {
                        popularDiv += '<div><a class="anchor3" href="javascript:void(0)" onclick="ShowScheme(' + dat.SchemeId + ')">विवरण पढ़िए...</a></div></div>';
                    }
                    //popularDiv += '<div><div class="anchor3" style="cursor: pointer;" onclick="ShowScheme(' + dat.Id + ')">Read more...</div></div>';
                    popularDiv += '</div>';
                    popularDiv += '</div>';
                }
            });
            $('#divBenScheme').html(popularDiv);
        }
        else {
            var LangId = 1;
            LangId = utils.localStorage().get('LangID');
            var popularDiv = '<div class="scheme-detail1">';
            if (LangId == 1) {
                popularDiv += '<div class="anchor3"> No schemes applied yet.</div>';
            }
            else if (LangId == 2) {
                popularDiv += '<div class="anchor3"> कोई योजनाओं अभी तक लागू नहीं किया गया है।</div>';
            }
            popularDiv += '</div>';
            $('#divBenScheme').html(popularDiv);
        }
    };

   
    var getKeyWords = function (data) {
        var words = '';
        if (data == null || data.length <= 0) {
            var LangId = utils.localStorage().get('LangID');
            if (LangId == 1) {
                words += '<div>No Keywords available</div>';
            }
            else if (LangId == 2) {
                words += '<div> कोई कीवर्ड उपलब्ध नहीं</div>';
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
    var profileBeneficiary = function (data) {
        //utils.localStorage().set('masterData', data);
        setData('BenIDProof', data.IDProofs, primaryBeneficiary.IDProof);
        hideDiv('BenIDProof', data.IDProofs, primaryBeneficiary.IDProof);
        setData('BenAge', data.Ages, primaryBeneficiary.Age);
        setData('BenGender', data.Sex, primaryBeneficiary.Sex);
        setData('BenReligion', data.Religions, primaryBeneficiary.Religion);
        setData('BenEcoStatus', data.SocioStatuses, primaryBeneficiary.Socio);
        setData('BenOccupation', data.Occupations, primaryBeneficiary.Occupation);
        setData('BenQualification', data.Qualifications, primaryBeneficiary.Qualification);
        setData('BenMaritalStatus', data.MaritalStatuses, primaryBeneficiary.MaritalStatus);
        setData('BenCategory', data.Categories, primaryBeneficiary.Category);
        setData('BenDepartment', data.Departments, primaryBeneficiary.Department);
        setData('BenEmpStatus', data.EmpStatuses, primaryBeneficiary.EmploymentStatus);
        setData('BenVulGroup', data.VulnerableGroups, primaryBeneficiary.VulGroup);
        
        setData('BenDisability', data.Disabilities, primaryBeneficiary.Disabilty);
        setData('BenSickness', data.Sicknesses, primaryBeneficiary.Sickness);
        
        setStates('spanBenStateName', data.States, primaryBeneficiary.State, true);
        setDistricts('spanBenDistrictName', data.Districts, primaryBeneficiary.District, true);
        setStates('BenStateName', data.States, primaryBeneficiary.State,false);
        setDistricts('BenDistrictName', data.Districts, primaryBeneficiary.District, false);
        //
        setImage('img-primaryBeneficiary', primaryBeneficiary.Photo);


    };
   
    var fromLocalStorage = function (data) {
        setItem('primaryBeneficiary-Id', data.Id);
        setItem('name-primaryBeneficiary', data.FirstName + ' ' + data.LastName);
        setItem('firstName', data.FirstName);
        setItem('lastName', data.LastName);
        setItem('fathersName', data.FathersName);
        setItem('husbandsName', data.HusbandsName);
        setItem('DOB', (data.DOB == null ? '' : checkValidDate(utils.toDate(data.DOB))));
        setItem('AnnualIncome', data.AnnualIncome!=0? data.AnnualIncome:'');
        setItem('PercentageDisability', data.PercentageDisablity != 0 ? data.PercentageDisablity : '');
        setItem('IDProofDetails', data.IDDetails);
        setItem('Address', data.Address);
        setItem('EMail', data.EMail);
        setItem('MobileNumber', data.Phone);
 
       
       
    };
    var checkValidDate = function (d) {
        var date = d.split('/');
        if (date[2] >= 1902)
            return d;
        else
            return '';
    };
    var setImage = function (id, data) {
        var img = document.getElementById(id);
        img.src = utils.getImage(data);
    };
    var setItem = function (id, item) {
        $('#' + id).html(item);
    };
    var hideDiv = function (id, to, from) {
        for (var i = 0; i < to.length; i++) {
            if (from == to[i].ID) {
                $('#' + id).html(to[i].Name);
                $('#div' + id).show();
                break;
            }
            else {
                $('#div' + id).hide();
            }
        }
    };
    var setData = function(id, to, from){
       
            for(var i=0; i< to.length; i++){
                if(from == to[i].ID){
                    $('#' + id).html(to[i].Name) ;
                    break;
                }
            }
         
    }
    var setStates = function (id, to, from, span) {
        var stateID = 0;
        var LangId = utils.localStorage().get('LangID');

        
        var user = utils.localStorage().get('user');
        stateID = user.StateID;
        if (LangId == 2) {
            stateID = utils.getState(user.StateID);
            }
        setState(id, to, stateID, span);


    }
    var setState = function (id, to, from, span) {
        
        for (var i = 0; i < to.length; i++) {
            if (from == to[i].StateID) {
                if (span == true)
                    $('#' + id).text(to[i].StateName);
                    else
                        $('#' + id).html(to[i].StateName);
                break;
            }
        }

    }
    var setDistricts = function (id, to, from, span) {
        var districtID = 0;
        var LangId = utils.localStorage().get('LangID');

        var user = utils.localStorage().get('user');
        districtID = user.DistrictID;
        

        if (LangId == 2) {
            districtID = utils.getDistrict(user.DistrictID);
        }
        setDistrict(id, to, districtID, span)
    }
    var setDistrict = function (id, to, from, span) {

        for (var i = 0; i < to.length; i++) {
            if (from == to[i].DistrictID) {
                 if (span == true)
                     $('#' +id).text(to[i].DistrictName);
                else
                     $('#' +id).html(to[i].DistrictName);   
                
                break;
            }
        }

    }
})();

var ShowScheme = function (SchemId) {

    utils.localStorage().set('SchemeId', SchemId);
    window.location.href = 'schemedetails.html?schemeId=' + SchemId;
    return false;
};

var ShowSchemeStatus = function (SchemId, BenId, Id, ProcessingFee) {

    var beneficiaryName = $("#name-primaryBeneficiary").html();
    obj = {
        'BenName': beneficiaryName.split(' ')[0] + "'s",
        'SchemeName': $("#" + SchemId + "-SchemeName").html(),
        'Desc': $("#" + Id + "-Desc").html(),
        'Status': $("#" + Id + "-Status").html(),
        'SchemId': SchemId,
        'BenId': BenId,
        'ProcessingFee': ProcessingFee
    }

    utils.localStorage().set('SchemStatusDtls', obj);
    window.location.href = 'stepsinscheme.html';
    return false;
};

function DeleteFavourite(schemeId) {

    $("#delfav-" + schemeId).toggle();

}

function cancelFavourite(schemeId) {

    $("#delfav-" + schemeId).toggle();

}

function errorCB(err) {
    console.log("Error fetching Data:" + err.message);
  //  alert("Error fetching Data: " + err.message);
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
        for (var i = 0; i < len; i++) {
            switch (data.rows.item(i).KeyName) {
                case 'CmsTrackBeneficiary':
                    $('#divTrackBeneficiary').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsAddIncome':
                    $('#divAddIncome').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsDigitalLiteracy':
                    $('#DivServices').html(data.rows.item(i).KeyValue);
                    break;

                case 'CmsMyWallet':
                    $('#divMyWallet').html(data.rows.item(i).KeyValue);
                    break;

                case 'CmsHome':
                    $('#divHome').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsSearch':
                    $('#divSearch').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsMyAccount':
                    $('#divMyAccount').html(data.rows.item(i).KeyValue);
                    break;
            
                case 'CmsBeneficiaryProfile':
                    $('#DivBeneficiaryProfile').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsProfile':
                    $('#DivProfile').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsFamily':
                    $('#DivFamily').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsBasicInformation':
                    $('#DivBasicInfo').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsBackgroungInformation':
                    $('#DivBackInfo').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsMyBeneficiary':
                    $('#divBeneficiary').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsRegisterNewBeneficiary':
                    $('#DivRegisterBeneficiary').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsSchemes':
                    $('#divSchemes').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsQuickSearch':
                    $('#txtSearch').attr("placeholder", data.rows.item(i).KeyValue);
                    break;
                case 'CmsSearchResults':
                    $('#DivSearchSchemesText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsState':
                    $('#DivStateText').html(data.rows.item(i).KeyValue);
                    $('#DivStateNameText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsDistrict':
                    $('#DivDistrictText').html(data.rows.item(i).KeyValue);
                    $('#DivDistrictNameText').html(data.rows.item(i).KeyValue);
                    break;

                case 'CmsFirstName':
                    $('#DivFirstNameText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsLastName':
                    $('#DivSurNameText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsFathersName':
                    $('#DivFatherNameText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsHusbandsName':
                    $('#DivSpouseNameText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsDOB':
                    $('#DivDOBText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsAadhar':
                    $('#BenIDProof').html(data.rows.item(i).KeyValue);
                    break;

                case 'CmsEnterAge':
                    $('#DivAgeText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsDOB':
                    $('#DivDOBText').html(data.rows.item(i).KeyValue);
                    break;
               
                case 'CmspercentageDisability':
                    $('#DivDisabilityPercentText').html(data.rows.item(i).KeyValue);
                    break;

                case 'CmsPrimaryProfile':
                    $('#DivPrimaryProfileText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsReligion':
                    $('#DivReligonText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsCaste':
                    $('#DivCasteText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsIncomeLevel':
                    
                    $('#DivEconomicStatus').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsOccupation':
                    $('#DivOccupationText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsQualification':
                    $('#DivQualificationText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsMarital':
                    $('#DivMaritalStatusText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsCategory':
                    $('#DivCategoryText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsDepartment':
                    $('#DivDepartmentText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsGender':
                    $('#DivGenderText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsEmpStatus':
                    $('#DivEmpStatusText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsSplStatus':
                    $('#DivSplGroupText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsFamilyIncome':
                    $('#DivFamilyIncomeText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsDisability':
                    $('#DivDisabilityTypeText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsSickness':
                    $('#DivSicknessText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsAddress':
                    $('#DivAddress').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsEMail':
                    $('#DivEMail').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsPhone':
                    $('#DivPhone').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsIdDetails':
                    debugger;
                    $('#IDProofDetails').attr("placeholder", data.rows.item(i).KeyValue);
                    break;
            }

        }
    }
    $('#myModal').modal('hide');
}
