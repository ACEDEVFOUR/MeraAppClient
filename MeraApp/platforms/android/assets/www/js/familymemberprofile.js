/// <reference path="jquery-2.2.4.js" />
/// <reference path="utils.js" />
var benId = '';
var cmsCourseSelect = '';
var cmsSchemeApplied = '';
var cmsNoKeyword = '';
var cmsSchemeDeleted = '';
var cmsReadMore = '';
var cmsSchemeNotDeleted = '';
(function () {
    var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
    var cmsKeys = utils.localStorage().get('CMSKey');
    var masterData = utils.localStorage().get('masterDataBeneficiary');
    var subBeneficiary = utils.localStorage().get('subBeneficiary');
    var appWallet = function (tx, data) {
        var html = '';
        if (data.rows.length < 1) {
            var LangId = 1;
            LangId = utils.localStorage().get('LangID');
            html = '<div class="scheme-detail1">';
            html += '<div class="anchor3">' + cmsCourseSelect +'</div>';
            html += '</div>';

        }
        else {
            $.each(data.rows, function (i, dat) {
                html += '<div class="box1 body5 padding-top2">';
                html += '<div class="upper-case">' + dat.ProgramName + '</div>';
                html += '<div class="clearboth"></div>';
                html += '<div class="width100 floatl font3">';
                html += '<div class="width50 floatl dateofjoin">Date of Joining</div>';
                html += '<div class="width50 floatl text-align-c dateofcomp">' + dat.Date.slice(0, 10).replace(/-/g, '/') + '</div>';
                html += '</div>';
                html += '<div class="width100 floatl font3" id="dateofcompletion">';
                html += '<div class="width50 floatl dateofjoin">Date of Completion</div>';
                html += '<div class="width50 floatl text-align-c dateofcomp">' + dat.Date.slice(0, 10).replace(/-/g, '/') + '</div>';
                html += '</div>';
                html += '<div class="width100 floatl font3">';
                html += '<div class="width50 floatl dateofjoin">Status</div>';
                html += '<div class="width50 floatl text-align-c dateofcomp" id="course-status">Running</div>';
                html += '</div>';
                html += '<div class="width100 floatl font3">';
                html += '<div class="width50 floatl text-align-r">';
                html += '<div class="floatr color-w body13" style="padding:5%; margin:5% 3%;" id="dComp">Completed</div>';
                html += '</div>';
                html += '<div class="width50 floatl text-align-l">';
                html += '<div class="floatl color-w body14" style="padding:5%; margin:5% 3%;" id="droppedOut">Dropped out</div>';

                html += '</div>';
                html += '</div>';

                html += '</div><br/>';
            });
        }

        $('#divWallet').html(html);


    }

    var primaryBeneficiary = utils.localStorage().get('primaryBeneficiary');
    var ChangeLanguageForLabels = function (data) {
        $.each(data, function (i, dat) {
            $('#' + dat.KeyName).html(dat.KeyValue);
            switch (dat.KeyName) {
                case 'CmsDOB':
                    $('#DOB').attr("placeholder", dat.KeyValue);

            }
        });
    };
    $(function () {
        LoadSubBeneficiary(masterData, subBeneficiary);
        //utils.ajaxCallUrl(ajaxBenficiaryScheme.url, ajaxBenficiaryScheme.type, ShowBeneficiaryScheme);
        var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
        db.transaction(queryCMS, errorCB);
        db.transaction(queryScheme, errorCB);
        
        setImage('img-subBeneficiary', subBeneficiary.Photo);
        setImage('img-Beneficiary', primaryBeneficiary.Photo);
        $('[data-toggle="popover"]').popover();

        ChangeLanguageForLabels(cmsKeys);
        benId = subBeneficiary.Id;
        db.transaction(queryAppWallet, errorCB);
    });
    var queryAppWallet = function (tx) {
        var langID = utils.localStorage().get('LangID');
        var queryText = "SELECT a.ServiceName, S.ProgramName, a.Date  FROM AppUserWallet a INNER JOIN Services S On a.ServiceTypeId = S.Id WHERE a.ServiceName ='Digital Literacy' AND a.BeneficiaryId =" + benId;
        //+" AND LangID =" + langID;

        tx.executeSql(queryText, [], appWallet, errorCB);
    }
    function errorCB(err) {
      //  alert("Error fetching Data: " + err.message);
    }
    var queryScheme = function (tx) {
        var queryText = " SELECT ba.SchemeId, s.SchemeName, ba.Id, ba.Status as AppliedStatus, s.KeyWords, s.Objective, ba.BeneficiaryId, s.ProcessingFee, LangID ";
        queryText = queryText + " FROM BeneficiaryApplied ba ";
        queryText = queryText + " left outer join Scheme s on s.ID = ba.SchemeId ";

        queryText += "WHERE ba.BeneficiaryId =" + subBeneficiary.Id;

        tx.executeSql(queryText, [], ShowSchemes, errorCB)
    }
    var checkValidDate = function (d) {
        var date = d.split('/');
        if (date[2] >= 1902)
            return d;
        else
            return '';
    };
    var LoadSubBeneficiary = function (parent, child) {
        var LangId = 1;
        LangId = utils.localStorage().get('LangID');
        setItem('name-subBeneficiary', child.FirstName + ' ' + child.LastName);
        if (parent != null) {
            setRelation('Relation', parent.Relationships, child.Relationship);
        }
        else
        {
            setRelation('Relation', '', child.Relationship);
        }
        setItem('SubBenfirstName', child.FirstName);
        setItem('SubBenlastName', child.LastName);
        setItem('SubBenfathersName', child.FathersName);
        setItem('SubBenhusbandsName', child.HusbandsName);
        setItem('SubBenDOB', (child.DOB == null ? '' : checkValidDate(utils.toDate(child.DOB))));
        setItem('SubBenAnnualIncome', utils.zeroToEmpty(child.AnnualIncome));
        setItem('SubBenIDDetails', child.IDDetails);
        setItem('SubBenDisability', utils.zeroToEmpty(child.PercentageDisablity));
        
       
        setItem('SubBenAddress', child.Address);
        setItem('SubBenEMail', child.EMail);
        setItem('SubBenMobileNumber', child.Phone);
        var profile = '';
        if (LangId == 1) {
             profile = primaryBeneficiary.FirstName + ' ' + primaryBeneficiary.LastName + '\'s profile';
        }
        else if (LangId == 2)
        {
            profile = primaryBeneficiary.FirstName + ' ' + primaryBeneficiary.LastName + ' का प्रोफाइल';
        }
        setItem('Beneficiary', profile);
        setData('SubBenRelationship', masterData.Relationships, child.Relationship);
        setData('SubBenIDProof', masterData.IDProofs, child.IDProof);
       // hideDiv('SubBenIDProof', masterData.IDProofs, child.IDProof);
        setData('SubBenAge', masterData.Ages, child.Age);
        setData('SubBenGender', masterData.Sex, child.Sex);
        setData('SubBenReligion', masterData.Religions, child.Religion);
        setData('SubBenEcoStatus', masterData.SocioStatuses, child.Socio);
        setData('SubBenOccupation', masterData.Occupations, child.Occupation);
        setData('SubBenQualification', masterData.Qualifications, child.Qualification);
        setData('SubBenMaritalStatus', masterData.MaritalStatuses, child.MaritalStatus);
        setData('SubBenCategory', masterData.Categories, child.Category);
        setData('SubBenDepartment', masterData.Departments, child.Department);
        setData('SubBenEmpStatus', masterData.EmpStatuses, child.EmploymentStatus);
        setData('SubBenVulGroup', masterData.VulnerableGroups, child.VulGroup);
       
        setData('SubBenTypeDisability', masterData.Disabilities, child.Disabilty);
        setData('SubBenSickness', masterData.Sicknesses, child.Sickness);
        
        
        sState('SubBenState', masterData.States, child.State);
        sDistrict('SubBenDistrict', masterData.Districts, child.District);
        sState('spanSubBenState', masterData.States, child.State);
        sDistrict('spanSubBenDistrict', masterData.Districts, child.District);

    }
    var setItem = function (id, item) {
        $('#' + id).html(item);
    };
    var setRelation = function (id, to, from) {
        if (to != '') {
            for (var i = 0; i < to.length; i++) {
                if (from == to[i].ID) {
                    var value = '(' + to[i].Name + ' Of ' + primaryBeneficiary.FirstName + ')';
                    $('#' + id).html(value);
                    break;
                }
            }
        }
    };
    var setImage = function (id, data) {
        var img = document.getElementById(id);
        img.src = utils.getImage(data);
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
    var setData = function (id, to, from) {
        
        for (var i = 0; i < to.length; i++) {
            if (from == to[i].ID) {
                $('#' + id).html(to[i].Name);
                break;
            }
            else {
                $('#' + id).html('');
            }
        }

    };
    var sState = function (id, to, from) {
        var stateID = 0;
        var LangId = utils.localStorage().get('LangID');

        var user = utils.localStorage().get('user');
        stateID = user.StateID;
        if (LangId == 2) {
            stateID = utils.getState(user.StateID);
        }
        setState(id, to, stateID);
        
    }
    var setState = function (id, to, from) {

        for (var i = 0; i < to.length; i++) {
            if (from == to[i].StateID) {
                $('#' + id).html(to[i].StateName);
                break;
            }
        }

    }
    var sDistrict = function (id, to, from) {
        var districtID = 0;
        var LangId = utils.localStorage().get('LangID');

        var user = utils.localStorage().get('user');
        districtID = user.DistrictID;

        if (LangId == 2) {
            districtID = utils.getDistrict(user.DistrictID);
        }
        setDistrict(id, to, districtID);
    }
    var setDistrict = function (id, to, from) {

        for (var i = 0; i < to.length; i++) {
            if (from == to[i].DistrictID) {
                $('#' + id).html(to[i].DistrictName);
                break;
            }
        }

    };
    var ShowSchemes = function (tx, data) {
        if (data != undefined && data != null && data.rows.length > 0) {
            var popularDiv = '';
            var LangId = 1;
            LangId = utils.localStorage().get('LangID');
            $.each(data.rows, function (i, dat) {
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
                popularDiv += '<div><a class="anchor3" href="javascript:void(0)" onclick="ShowScheme(' + dat.SchemeId + ')" >' + cmsReadMore+'</a></div></div>';
                popularDiv += '</div>';
                popularDiv += '</div>';

            });
            $('#divBenScheme').html(popularDiv);
        }
        else {
            var LangId = 1;
            LangId = utils.localStorage().get('LangID');
            var popularDiv = '<div class="scheme-detail1">';
            popularDiv += '<div class="anchor3">'+ cmsSchemeApplied+'</div>';
            popularDiv += '</div>';
            $('#divBenScheme').html(popularDiv);
        }
        
    };

    var getKeyWords = function (data) {
        var words = '';
        if (data == null || data.length <= 0) {
                words += '<div>' +cmsNoKeyword +'</div>';
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
})();

var ShowScheme = function (id) {
    utils.localStorage().set('SchemeId', id);
    window.location.href = 'schemedetails.html?schemeId=' + id;

};

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
                case 'CmsDigitalLiteracy':
                    $('#DivServices').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsFamilyMemberProfile':
                    $('#DivFamilyMemeberHead').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsSchemes':
                    $('#DivSchemeText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsProfile':
                    $('#DivProfileText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsFamilyOf':
                    $('#DivFamilyText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsDigitalLiteracy':
                    $('#DivServices').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsHome':
                    $('#DivHome').html(data.rows.item(i).KeyValue);
                    break;

                case 'CmsSearch':
                    $('#DivSearch').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsMyAccount':
                    $('#DivMyProfile').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsState':
                    $('#DivStateText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsDistrict':
                    $('#DivDistrictText').html(data.rows.item(i).KeyValue);
                    break;
                
                case 'CmsNoCourse':
                    cmsCourseSelect= (data.rows.item(i).KeyValue);
                    break;
                case 'CmsNoScheme':
                   cmsSchemeApplied= data.rows.item(i).KeyValue;
                    break;
                case 'CmsNoKeyword':
                    cmsNoKeyword= (data.rows.item(i).KeyValue);
                    break;
                case 'CmsSchemeDeleted':
                    cmsSchemeDeleted=(data.rows.item(i).KeyValue);
                    break;
                case 'CmsReadMore':
                    cmsReadMore = (data.rows.item(i).KeyValue);
                    break;
                case 'CmsSchemeNotDeleted':
                    cmsSchemeNotDeleted = (data.rows.item(i).KeyValue);
                    break;
            }

        }
    }
}

var benAppliedId = 0;
function DeleteSchemeFromBen(Id, status) {
    benAppliedId = Id;
    var LangId = 1;
    LangId = utils.localStorage().get('LangID');

    var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
    if (status != '3') {
        $('#AppliedBenId-' + benAppliedId).remove();
        db.transaction(queryDeleteBen, errorCB);
        alert(cmsSchemeDeleted);
    }
    else {
        alert(cmsSchemeNotDeleted);
    }
}


var queryDeleteBen = function (tx) {
    var queryText = " Delete from BeneficiaryApplied where ID = " + benAppliedId + "";
    tx.executeSql(queryText);
    benAppliedId = 0;
};

var ShowSchemeStatus = function (SchemId, BenId, Id, ProcessingFee) {

    var beneficiaryName = $("#name-subBeneficiary").html();
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
