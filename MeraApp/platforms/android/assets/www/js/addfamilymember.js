/// <reference path="jquery-2.2.4.js" />
/// <reference path="utils.js" />
var mobileReq = 'Please enter either Mobile number or Aadhar number.';
var photoReq = 'Photo is required';
var firstNameReq = 'First Name is required';
var surNameReq = 'Last Name is required';
var relationReq = 'Relationship is required';
var phoneLength = 'Phone Number must be of 10 digits';
var addressReq = 'Address is required';
var motherNameReq = 'Mother name is required';
var fatherNameReq = 'Father or Husband Name is required';
var dobReq = 'Date of Birth required';
var genderReq= 'Gender is required';
var ageRangeReq = 'Age Range required';
var religionReq = 'Religion is required';
var ecoStatusReq = 'Economic Status is required';
var occupationReq = 'Occupation is required';
var qualificationReq = 'Qualification is required';
var maritalStatusReq = 'Marital Status is required';
var categoryReq = 'Category is required';
var empStatusReq = 'Emp Status is required';
var engNameReq = 'English Name required';
var alreadyRegistered = 'Aadhar already registered';
var familySuccess = "Added successfully";
var aadharLength = '';
var cmsInvalidEmail = '';

(function () {
    var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
    var cmsKeys = utils.localStorage().get('CMSKey');
    
    var ajaxObj = {
        url: utils.Urls.GetBeneficiaryDtls,
        type: 'GET'
    };
    function errorCB(err) {
        
        //alert("Error fetching Data: " + err.message);
    }
    var getCmsKeyVal = function (cmsKeys, key) {
        var keyVal = '';
        $.each(cmsKeys, function (i, dat) {

            var cmsKey = 'Cms' + key;
            if (dat.KeyName == cmsKey) {

                keyVal = dat.KeyValue;
                if (keyVal != undefined && keyVal != '' && dat.KeyName != 'CmsSpecialGroup' && dat.KeyName != 'CmsDisability' && dat.KeyName!='CmsSickness')
                    keyVal = keyVal + '*';
            }
        });
        return keyVal;
    }
    var filterByLang = function (data) {
        var lang = utils.localStorage().get('LangID');
        var k = 0;
        var obj = new Object();
        $.each(data, function (i, dat) {
            if (dat.LangID == lang || dat.LangId == lang) {
                obj[k] = dat;
                k += 1;
            }

        });
        return obj;
    };
    function queryCMS(tx) {
        var user = utils.localStorage().get('user');
        var LangId = utils.localStorage().get('LangID');
        if (user != undefined && user != null && user.LangId != undefined && user.LangId != null) {
            LangId = user.LangId;
        }
        var queryText = "SELECT ApplicationId, CMSKeyId, CMSKeyValueId, KeyName, KeyValue, LanguageId FROM CMS  WHERE LanguageId =" + LangId;
        tx.executeSql(queryText, [], queryCMSSuccess, errorCB);
    }
    function queryCMSSuccess(tx, data) {
        //utils.localStorage().set('CMSKey', data);
        var len = data.rows.length;
        if (len > 0) {
            $.each(data.rows, function (i, dat) {

                var element = dat.KeyName;
                var id = element.replace("Cms", "");
                var type = $('#' + id).attr('type');
                if ($('#' + id).hasClass("select1")) {

                }
                else if (type == 'text' || type == 'number') {
                    if (id != undefined && id != 'percentageDisability' && id != 'FamilyIncome') {
                        dat.KeyValue = dat.KeyValue + ' *';
                    }
                    $('#' + id).attr("placeholder", dat.KeyValue);
                    
                }
                else {
                    $('#' + id).html(dat.KeyValue);
                }

                switch (dat.KeyName) {
                    case 'CmsMobileNumber':
                        $('#Phone').attr("placeholder", dat.KeyValue);
                        break;
                    case 'CmsIdDetails':
                        $('#IdDetails').attr("placeholder", dat.KeyValue);
                        break;
                    case 'CmsMobileRequired':
                        mobileReq = dat.KeyValue;
                        $('#infoMessage').html(mobileReq);
                       break;
                        //
                    case 'CmsPhotoRequired':
                        photoReq = dat.KeyValue;
                        break;
                    case 'CmsFirstNameRequired':
                        firstNameReq = dat.KeyValue;
                        break;
                    case 'CmsSurNameRequired':
                        surNameReq = dat.KeyValue;
                        break;
                    case 'CmsRelationshipRequired':
                        relationReq = dat.KeyValue;
                        break;
                    case 'CmsPhoneLength':
                        phoneLength = dat.KeyValue;
                        break;
                    case 'CmsAddressRequired':
                        addressReq = dat.KeyValue;
                        break;
                    case 'CmsMotherNameRequired':
                        motherNameReq = dat.KeyValue;
                        break;
                    case 'CmsFatherNameRequired':
                        fatherNameReq = dat.KeyValue;
                        break;
                    case 'CmsDoBRequired':
                        dobReq = dat.KeyValue;
                        break;
                    case 'CmsGenderRequired':
                        genderReq = dat.KeyValue;
                        break;

                    case 'CmsAgeRangeRequired':
                        ageRangeReq = dat.KeyValue;
                        break;
                    case 'CmsReligionRequired':
                        religionReq = dat.KeyValue;
                        break;
                    case 'CmsEcoStatusRequired':
                        ecoStatusReq = dat.KeyValue;
                        break;
                    case 'CmsOccupationRequired':
                        occupationReq = dat.KeyValue;
                        break;
                    case 'CmsQualificationRequired':
                        qualificationReq = dat.KeyValue;
                        break;
                    case 'CmsMaritalStatusRequired':
                        maritalStatusReq = dat.KeyValue;
                        break;
                    case 'CmsCategoryRequired':
                        categoryReq = dat.KeyValue;
                        break;

                        //
                    case 'CmsEmpStatusRequired':
                        empStatusReq = dat.KeyValue;
                        break;
                    case 'CmsEnglishNameRequired':
                        engNameReq = dat.KeyValue;
                        break;
                    case 'CmsAadharAlreadyRegistered':
                        alreadyRegistered = dat.KeyValue;
                        break;
                    case 'CmsFamilySuccess':
                        familySuccess = dat.KeyValue;
                        break;
                    case 'CmsAadharLength':
                        aadharLength = dat.KeyValue;
                        break;
                    case 'CmsInvalidEmail':
                        cmsInvalidEmail = dat.KeyValue;
                        break;
                }
            });
            
           
        }
    }
    var primaryBeneficiary = utils.localStorage().get('primaryBeneficiary');
    var AllData = new Array();
    var callBack = function (data) {
        //utils.bindDropDown(filterByLang(data.Ages), getCmsKeyVal(cmsKeys, 'Age'), 'Age'); //
        utils.bindDropDown(filterByLang(data.Categories), getCmsKeyVal(cmsKeys, 'Category'), 'Category'); //
        utils.bindDropDown(filterByLang(data.Departments), getCmsKeyVal(cmsKeys, 'Department'), 'Department'); //
        utils.bindDropDown(filterByLang(data.EmpStatuses), getCmsKeyVal(cmsKeys, 'EmpStatus'), 'EmpStatus');
        utils.bindDropDown(filterByLang(data.VulnerableGroups), getCmsKeyVal(cmsKeys, 'SpecialGroup'), 'SpecialGroup');
        utils.bindDropDown(filterByLang(data.MaritalStatuses), getCmsKeyVal(cmsKeys, 'Marital'), 'MaritalStatus');
        utils.bindDropDownById(filterByLang(data.IDProofs), getCmsKeyVal(cmsKeys, 'IDProof'), 'IDProof'); //
        utils.bindDropDown(filterByLang(data.Sex), getCmsKeyVal(cmsKeys, 'Sex'), 'Gender');
        utils.bindDropDown(filterByLang(data.Religions), getCmsKeyVal(cmsKeys, 'Religion'), 'Religion');
        utils.bindDropDown(filterByLang(data.Disabilities), getCmsKeyVal(cmsKeys, 'Disability'), 'TypeofDisability');
        utils.bindDropDown(filterByLang(data.Sicknesses), getCmsKeyVal(cmsKeys, 'Sickness'), 'Sickness');
        utils.bindDropDown(filterByLang(data.SocioStatuses), getCmsKeyVal(cmsKeys, 'SocialStatus'), 'EconomicSocial');
        utils.bindDropDown(filterByLang(data.Occupations), getCmsKeyVal(cmsKeys, 'Occupation'), 'Occupation');
        utils.bindDropDown(filterByLang(data.Qualifications), getCmsKeyVal(cmsKeys, 'Qualification'), 'Qualification');
        
        utils.bindDropDown(filterByLang(data. Relationships), getCmsKeyVal(cmsKeys, 'Relationship'), 'Relationship');
        bState(filterByLang(data.States), getCmsKeyVal(cmsKeys, 'State'), 'State'); //
        bDistrict(filterByLang(data.Districts), getCmsKeyVal(cmsKeys, 'District'), 'District');
        AllData = JSON.parse(JSON.stringify(filterByLang(data.Districts)));

    };
    $(function () {
        db.transaction(queryCMS, errorCB);
        var masterData = utils.localStorage().get('masterDataBeneficiary');
        
        var LangId = utils.localStorage().get('LangID');

        var image = document.getElementById('imgProfilePic');
        if (image != null) {
            image.src = 'images/uploadPhoto.png';
            $('#infoMessage').html(mobileReq);
            utils.imageToBase64(image.src, image);

        }
        callBack(masterData);
        $('#RemovePhoto').click(function () {
            var LangId = utils.localStorage().get('LangID');
            var image = document.getElementById('imgProfilePic');
            utils.localStorage().set('setImage', false);
            if (image != null) {
                switch (LangId) {
                    case 1:
                        image.src = 'images/uploadPhoto.png';
                        break;
                    case 2:
                        image.src = 'images/uploadPhotoHindi.png';
                        break;
                    default:
                        image.src = 'images/uploadPhoto.png';
                }

                utils.imageToBase64(image.src, image);
            }
        });
        
    });
    var UniqueDistrict = function (list, StateID) {

        var State = 0;
        for (var i = list.length; i--;) {
            //
            if (StateID != list[i].StateID) {
                list.splice(i, 1);
            }

        }

        return list;
    }
    bState = function (itemList, obj, dropDown) {
        var stateID = 0;
        var LangId = utils.localStorage().get('LangID');

        var user = utils.localStorage().get('user');
        stateID = user.StateID;
        if (LangId == 2) {
            stateID = utils.getState(user.StateID);
        }
        bindStates(itemList, obj, stateID);
    }
    bindStates = function (itemList, obj, dropDown) {


        $.each(itemList, function (i, data) {

            if (data.StateID == dropDown) {


                $('#bindState').html(data.StateName);
                $('#State').html(data.StateID);
                return false;
            }
        });

    };
    bDistrict = function (itemList, obj, dropDown) {
        var districtID = 0;
        var LangId = utils.localStorage().get('LangID');

        var user = utils.localStorage().get('user');
        districtID = user.DistrictID;

        if (LangId == 2) {
          
            districtID = utils.getDistrict(user.DistrictID);

            
        }
        bindDistricts(itemList, obj, districtID)
    }
    bindDistricts = function (itemList, obj, dropDown) {

        //var listItems = "";
        //listItems += "<option value='-1' selected='true' disabled='disabled'>" + obj + "</option>";
        //$.each(itemList, function (i, dat) {
        //    listItems += "<option value='" + dat.DistrictID + "'>" + dat.DistrictName + "</option>";
        //});
        ////for (var i = 0; i < itemList.length; i++) {
        ////    listItems += "<option value='" + itemList[i].DistrictID + "'>" + itemList[i].DistrictName + "</option>";
        ////}
        //$('#' + dropDown).html(listItems);
        //var user = utils.localStorage().get('user');

        $.each(itemList, function (i, data) {

            if (data.DistrictID == dropDown) {

                // alert(data.StateName);
                $('#bindDistrict').html(data.DistrictName);
                $('#District').html(data.DistrictID);
                return false;
            }
        });
    };
    $('#AddBeneficiaryFamily').click(function () {
       
        var objStats = true;
        var user = utils.localStorage().get('user');
        var image = document.getElementById('imgProfilePic');
        var dataImage = utils.pureBase64(image.src);
        var ajaxObj = {
            url: utils.Urls.AddBeneficiary,
            type: 'POST',
            obj: {
                'Id': utils.randomNum(),
                'ParentId': primaryBeneficiary.Id,
                'FirstName': SetValue('FirstName', 'input', false, null),
                'LastName': SetValue('LastName', 'input', false, null),
                'FathersName': SetValue('FathersName', 'input', false, null),
                'HusbandsName': SetValue('HusbandsName', 'input', false, null),
                'DOB': SetValue('DOB', 'date', false, null),
                'IDDetails': SetValue('IdDetails', 'input', false, null),
                'IDProof': SetValue('IDProof', 'dropDown', false, null),
                'Sex': SetValue('Gender', 'dropDown', false, null),
                //'Age': SetValue('Age', 'dropDown', false, null),
                'Religion': SetValue('Religion', 'dropDown', false, null),
                //'Caste': SetValue('Caste', 'dropDown', false, null),
                'Socio': SetValue('EconomicSocial', 'dropDown', false, null),
                'Occupation': SetValue('Occupation', 'dropDown', false, null),
                'MaritalStatus': SetValue('MaritalStatus', 'dropDown', false, null),
                'Category': SetValue('Category', 'dropDown', false, null),
                'Department': SetValue('Department', 'dropDown', false, null),
                'EmploymentStatus': SetValue('EmpStatus', 'dropDown', false, null),
                'VulGroup': SetValue('SpecialGroup', 'dropDown', false, null),
                'AnnualIncome': SetValue('FamilyIncome', 'input', false, null),
                'Disabilty': SetValue('TypeofDisability', 'dropDown', false, null),
                'SoochnaPreneur': user.userName,
                'State': user.StateID, //SetValue('State', 'state', false, null),
                'District': user.DistrictID, //SetValue('District', 'district', false, null),
                'Photo': dataImage,
                'Relationship': SetValue('Relationship', 'dropDown', false, null),
                'Sickness': SetValue('Sickness', 'dropDown', false, null),
                'PercentageDisablity': SetValue('percentageDisability', 'input'),
                'Address': SetValue('Address', 'input'),
                'Block': SetValue('Block', 'input'),
                'Panchayat': SetValue('Panchayat', 'input'),
                'Village': SetValue('Village', 'input'),
                'EMail': SetValue('EMail', 'input'),
                'Phone': SetValue('Phone', 'input'),
                'Qualification': SetValue('Qualification', 'dropDown'),

            }
        };
        var LangId = 1;
        LangId = utils.localStorage().get('LangID');
        message = photoReq;
        //switch (LangId) {
        //    case 1:
        //        message = 'To register a sub beneficiary, it is mandatory to add their photo.';
        //        break;
        //    case 2:
        //        message = 'उप-लाभार्थी को पंजीकृत करने के लिए, उनकी तस्वीर जोड़ने के लिए अनिवार्य है।';
        //        break;
        //}
        if (objStats) {
            objStats = utils.localStorage().get('setImage');
            if (!objStats) {
                $('#returnMessage').html(message);
                $('#returnMessage').show();
                $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
            }
            else {
                $('#returnMessage').html('');
                $('#returnMessage').hide();
            }
        }
        
        //if (LangId == 1) {
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.FirstName,firstNameReq, 'input', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.LastName, surNameReq, 'input', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Relationship, relationReq, 'dropDown', 'returnMessage');

            if (objStats) {
                //objStats = ValidateObject(ajaxObj.obj.Phone, 'Mobile Number is mandatory', 'input', 'returnMessage');
                if (utils.validate.empty(ajaxObj.obj.Phone)) {
                    objStats = utils.matchLength(10, ajaxObj.obj.Phone);
                    if (objStats)
                        objStats = utils.isPureNum(ajaxObj.obj.Phone);

                    var message = phoneLength;
                    if (!objStats) {

                        $('#returnMessage').html(message);
                        $('#returnMessage').show();
                        $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
                    }
                    else {
                        $('#returnMessage').html('');
                        $('#returnMessage').hide();

                    }

                }
            }

            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Address, addressReq, 'input', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.HusbandsName, motherNameReq, 'input', 'returnMessage');
            if (objStats) {
                //objStats = ValidateObject(ajaxObj.obj.EMail, 'EMail Id is mandatory', 'input', 'returnMessage');
                if (utils.validate.empty(ajaxObj.obj.EMail)) {
                    objStats = utils.validate.email(ajaxObj.obj.EMail);
                    var message = cmsInvalidEmail;
                    if (!objStats) {

                        $('#returnMessage').html(message);
                        $('#returnMessage').show();
                        $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
                    }
                    else {
                        $('#returnMessage').html('');
                        $('#returnMessage').hide();

                    }

                }
            }
                
            if (objStats) {
                var val1 = ValidateObject(ajaxObj.obj.FathersName, fatherNameReq, 'input', 'returnMessage');
                var val2 = ValidateObject(ajaxObj.obj.HusbandsName, fatherNameReq, 'input', 'returnMessage');
                if (val1 == false && val2 == false)
                    objStats = false;
            }
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.DOB, dobReq, 'dob', 'returnMessage');

            if (objStats) {
                var getAge = utils.getAge(ajaxObj.obj.DOB);
                switch (true) {
                    case (getAge >= 0 && getAge <= 12):
                        ajaxObj.obj.Age = 1;
                        break;
                    case (getAge >= 13 && getAge <= 20):
                        ajaxObj.obj.Age = 2;
                        break;
                    case (getAge >= 21 && getAge <= 35):
                        ajaxObj.obj.Age = 3;
                        break;
                    case (getAge >= 36 && getAge <= 50):
                        ajaxObj.obj.Age = 4;
                        break;
                    case (getAge >= 51 && getAge <= 65):
                        ajaxObj.obj.Age = 5;
                        break;
                    case (getAge > 65):
                        ajaxObj.obj.Age = 6;
                        break;
                    default:
                        ajaxObj.obj.Age = 1;
                }
            }

            if (objStats) {
                //objStats = ValidateObject(ajaxObj.obj.IDDetails, 'Aadhar Number is mandatory', 'input', 'returnMessage');
                if (utils.validate.empty(ajaxObj.obj.IDDetails)) {
                    objStats = utils.matchLength(12, ajaxObj.obj.IDDetails);
                    if (objStats)
                        objStats = utils.isPureNum(ajaxObj.obj.IDDetails);

                    var message = aadharLength;
                    if (!objStats) {

                        $('#returnMessage').html(message);
                        $('#returnMessage').show();
                        $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
                    }
                    else {
                        $('#returnMessage').html('');
                        $('#returnMessage').hide();

                    }

                }
            }


            if (objStats) {
                var phone = utils.validate.empty(ajaxObj.obj.Phone);
                var aadhar = utils.validate.empty(ajaxObj.obj.IDDetails);
                var message = mobileReq;
                var idToDisplay = 'returnMessage';
                if ((phone == false) && (aadhar == false)) {
                    objStats = false;
                    $('#' + idToDisplay).html(message);
                    $('#' + idToDisplay).show();
                    $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
                }
                else {
                    $('#' + idToDisplay).html('');
                    $('#' + idToDisplay).hide();

                }

            }    

            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Sex, genderReq, 'dropDown', 'returnMessage');
            //if (objStats)
            //    objStats = ValidateObject(ajaxObj.obj.Age, ageRangeReq, 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Religion, religionReq, 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Socio, ecoStatusReq, 'dropDown', 'returnMessage');
             if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Occupation, occupationReq, 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Qualification, qualificationReq, 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.MaritalStatus, maritalStatusReq, 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Category, categoryReq, 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.EmploymentStatus, empStatusReq, 'dropDown', 'returnMessage');
        //}
        //else if (LangId == 2) {
         
        //    if (objStats)
        //        objStats = ValidateObject(ajaxObj.obj.FirstName, 'पहला नाम अनिवार्य है', 'input', 'returnMessage');
        //    if (objStats)
        //        objStats = ValidateObject(ajaxObj.obj.LastName, 'अंतिम नाम अनिवार्य है', 'input', 'returnMessage');
        //    if (objStats)
        //        objStats = ValidateObject(ajaxObj.obj.Relationship, 'संबंध अनिवार्य है', 'dropDown', 'returnMessage');
        //    if (objStats) {
        //        //objStats = ValidateObject(ajaxObj.obj.Phone, 'मोबाइल नंबर अनिवार्य है', 'input', 'returnMessage');
        //        if (utils.validate.empty(ajaxObj.obj.Phone)) {
        //            objStats = utils.matchLength(10, ajaxObj.obj.Phone);
        //            if (objStats)
        //                objStats = utils.isPureNum(ajaxObj.obj.Phone);

        //            var message = 'अमान्य फोन नंबर, 10 अंक होना चाहिए';
        //            if (!objStats) {

        //                $('#returnMessage').html(message);
        //                $('#returnMessage').show();
        //                $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
        //            }
        //            else {
        //                $('#returnMessage').html('');
        //                $('#returnMessage').hide();

        //            }

        //        }
        //    }

        //    if (objStats)
        //        objStats = ValidateObject(ajaxObj.obj.Address, 'पता अनिवार्य है', 'input', 'returnMessage');
        //    if (objStats)
        //        objStats = ValidateObject(ajaxObj.obj.HusbandsName, 'मां का नाम अनिवार्य है।', 'input', 'returnMessage');
        //    if (objStats) {
        //        //objStats = ValidateObject(ajaxObj.obj.EMail, 'ईमेल आईडी अनिवार्य है', 'input', 'returnMessage');
        //        if (utils.validate.empty(ajaxObj.obj.EMail)) {
        //            objStats = utils.validate.email(ajaxObj.obj.EMail);
        //            var message = 'अमान्य ई-मेल आईडी';
        //            if (!objStats) {

        //                $('#returnMessage').html(message);
        //                $('#returnMessage').show();
        //                $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
        //            }
        //            else {
        //                $('#returnMessage').html('');
        //                $('#returnMessage').hide();

        //            }

        //        }
        //    }

        //    if (objStats) {
        //        var val1 = ValidateObject(ajaxObj.obj.FathersName, 'पिता का नाम या पति का नाम अनिवार्य है', 'input', 'returnMessage');
        //       // var val2 = ValidateObject(ajaxObj.obj.HusbandsName, 'पिता का नाम या पति का नाम अनिवार्य है', 'input', 'returnMessage');
        //        if (val1 == false)
        //            objStats = false;
        //    }
        //    if (objStats)
        //        objStats = ValidateObject(ajaxObj.obj.DOB, 'जन्म तिथि अनिवार्य है', 'dob', 'returnMessage');
        //    if (objStats) {
        //       // objStats = ValidateObject(ajaxObj.obj.IDDetails, 'आधार संख्या अनिवार्य है', 'input', 'returnMessage');
        //        if (utils.validate.empty(ajaxObj.obj.IDDetails)) {
        //            objStats = utils.matchLength(12, ajaxObj.obj.IDDetails);
        //            if (objStats)
        //                objStats = utils.isPureNum(ajaxObj.obj.IDDetails);

        //            var message = 'अमान्य आधार संख्या, 12 अंक होना चाहिए';
        //            if (!objStats) {

        //                $('#returnMessage').html(message);
        //                $('#returnMessage').show();
        //                $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
        //            }
        //            else {
        //                $('#returnMessage').html('');
        //                $('#returnMessage').hide();

        //            }

        //        }
        //    }
        //    if (objStats) {
        //        var phone = utils.validate.empty(ajaxObj.obj.Phone);
        //        var aadhar = utils.validate.empty(ajaxObj.obj.IDDetails);
        //        var message = mobileReq;
        //        var idToDisplay = 'returnMessage';
        //        if ((phone == false) && (aadhar == false)) {
        //            objStats = false;
        //            $('#' + idToDisplay).html(message);
        //            $('#' + idToDisplay).show();
        //            $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
        //        }
        //        else {
        //            $('#' + idToDisplay).html('');
        //            $('#' + idToDisplay).hide();

        //        }

        //    }    

        //    if (objStats)
        //        objStats = ValidateObject(ajaxObj.obj.Sex, 'लिंग अनिवार्य है', 'dropDown', 'returnMessage');
        //    if (objStats)
        //        objStats = ValidateObject(ajaxObj.obj.Age, 'आयु की रेंज अनिवार्य है', 'dropDown', 'returnMessage');
        //    if (objStats)
        //        objStats = ValidateObject(ajaxObj.obj.Religion, 'धर्म अनिवार्य है', 'dropDown', 'returnMessage');
        //    if (objStats)
        //        objStats = ValidateObject(ajaxObj.obj.Socio, 'आर्थिक स्थिति अनिवार्य है', 'dropDown', 'returnMessage');
        //    if (objStats)
        //        objStats = ValidateObject(ajaxObj.obj.Occupation, 'व्यवसाय अनिवार्य है', 'dropDown', 'returnMessage');
        //    if (objStats)
        //        objStats = ValidateObject(ajaxObj.obj.Qualification, 'योग्यता अनिवार्य है', 'dropDown', 'returnMessage');
        //    if (objStats)
        //        objStats = ValidateObject(ajaxObj.obj.MaritalStatus, 'वैवाहिक स्थिति अनिवार्य है', 'dropDown', 'returnMessage');
        //    if (objStats)
        //        objStats = ValidateObject(ajaxObj.obj.Category, 'श्रेणी अनिवार्य है', 'dropDown', 'returnMessage');
        //    if (objStats)
        //        objStats = ValidateObject(ajaxObj.obj.EmploymentStatus, 'रोजगार की स्थिति अनिवार्य है', 'dropDown', 'returnMessage');
        //}
        if (objStats) {
            objStats = utils.isPureEnglish(ajaxObj.obj.FirstName);
            objStats = utils.isPureEnglish(ajaxObj.obj.LastName);
            if (ajaxObj.obj.FathersName.length>0)
                objStats = utils.isPureEnglish(ajaxObj.obj.FathersName);
            if (!objStats) {
                var message =engNameReq;
                $('#returnMessage').html(message);
                $('#returnMessage').show();
                $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
            }
            else {
                $('#returnMessage').html('');
                $('#returnMessage').hide();
            }
        }
        if (objStats) {
            if (utils.validate.empty(ajaxObj.obj.IDDetails) == true)
                CheckBeneficiaryAadhar(ajaxObj.obj.IDDetails, ajaxObj);
            else
                AddSubBeneficiary(objStats, ajaxObj);
        }
           

        
       
    });
    var AddSubBeneficiary = function (status, ajaxObj) {
        if (status) {
            $('#myModal').modal('toggle');
            $(this).hide();
            //utils.ajaxCall(ajaxObj.url, ajaxObj.type, ajaxObj.obj, postBack);
            var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
            db.transaction(function (tx) {
                if (ajaxObj.obj.PercentageDisablity == '') ajaxObj.obj.PercentageDisablity = null;
                if (ajaxObj.obj.DOB == 'Invalid Date') ajaxObj.obj.DOB = '';
                else {
                    ajaxObj.obj.DOB = ajaxObj.obj.DOB.toJSON().slice(0, 10).replace(/-/g, '/')
                }

                var today = new Date();
                var stmt = "INSERT INTO SubBeneficiary (Id, Beneficiary, FirstName, LastName, FathersName, HusbandsName, DOB, IDProof, IDDetails, State, District, Sex, Age, Religion, Socio, Occupation, MaritalStatus, Category, Department, EmploymentStatus, VulGroup, AnnualIncome, Disabilty, SoochnaPreneur, Photo, Relationship, Sickness, PercentageDisablity, Address, EMail, Phone, IsUpdated, DateOfRegistration, Qualification, Block, Panchayat, Village ) VALUES (";
                stmt += ajaxObj.obj.Id + "," + ajaxObj.obj.ParentId + ",'" + ajaxObj.obj.FirstName + "','" + ajaxObj.obj.LastName + "','" + ajaxObj.obj.FathersName + "','" + ajaxObj.obj.HusbandsName + "','" + utils.toPaddedDate(ajaxObj.obj.DOB) + "'," + ajaxObj.obj.IDProof + ",'" + ajaxObj.obj.IDDetails + "'," + ajaxObj.obj.State + "," + ajaxObj.obj.District + "," + ajaxObj.obj.Sex + "," + ajaxObj.obj.Age + "," + ajaxObj.obj.Religion + "," + ajaxObj.obj.Socio + "," + ajaxObj.obj.Occupation + "," + ajaxObj.obj.MaritalStatus + "," + ajaxObj.obj.Category + "," + ajaxObj.obj.Department + "," + ajaxObj.obj.EmploymentStatus + "," + ajaxObj.obj.VulGroup + ",'" + ajaxObj.obj.AnnualIncome + "'," + ajaxObj.obj.Disabilty + ",'" + ajaxObj.obj.SoochnaPreneur + "','" + ajaxObj.obj.Photo + "'," + ajaxObj.obj.Relationship + ",'" + ajaxObj.obj.Sickness + "','" + ajaxObj.obj.PercentageDisablity + "','" + ajaxObj.obj.Address + "','" + ajaxObj.obj.EMail + "','" + ajaxObj.obj.Phone + "','true','" + today.toJSON().slice(0, 10).replace(/-/g, '/') + "'," + ajaxObj.obj.Qualification + ",'" + ajaxObj.obj.Block + "','" + ajaxObj.obj.Panchayat + "','" + ajaxObj.obj.Village + "')";
                tx.executeSql(stmt);
                postBack(true);
            }, errorCB);
        }
    };
    var CheckBeneficiaryAadhar = function (aadhar, ajaxObj) {
        var status = true;
        db.transaction(function (tx) {
           
            var queryText = "SELECT * FROM Beneficiary WHERE IDDetails = '" + aadhar + "'";

            var message = alreadyRegistered;
            var LangId = utils.localStorage().get('LangID');
            //switch (LangId) {
            //    case 1:
            //        message = 'This aadhar is already register with another beneficiary';
            //        break;
            //    case 2:
            //        message = 'यह आधार पहले से ही एक अन्य लाभार्थी के साथ पंजीकृत है';
            //        break;
            //}
            tx.executeSql(queryText, [], function (tx, data) {
                if (data.rows.length > 0 && utils.validate.empty(aadhar) == true) {
                    status = false;
                    $('#returnMessage').html(message);
                    $('#returnMessage').show();
                    $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
                    return status;
                }
                else {
                    $('#returnMessage').html('');
                    $('#returnMessage').hide();
                    $('#myModal').modal('toggle');
                    $(this).hide();
                    status = true;
                    AddSubBeneficiary(status, ajaxObj)
                    return status;

                }

            }, errorCB);
        }, errorCB);

            //return status;
       
    };
    var ValidateObject = function (data, message, type, idToDisplay) {
        var val = true;
        if (type == 'input') {
            val = utils.validate.empty(data);

            if (val == false) {
                $('#' + idToDisplay).html(message);
                $('#' + idToDisplay).show();
                $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
            }
            else {
                $('#' + idToDisplay).html('');
                $('#' + idToDisplay).hide();

            }
            return val;
        }
        else if (type == 'dob') {
            val = utils.validate.date(data);

            if (val == false) {
                $('#' + idToDisplay).html(message);
                $('#' + idToDisplay).show();
            }
            else {
                $('#' + idToDisplay).html('');
                $('#' + idToDisplay).hide();

            }
            return val;

        }
        else if (type == 'dropDown') {
            if (typeof data == 'undefined') {
                $('#' + idToDisplay).html(message);
                $('#' + idToDisplay).show();
                $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
                val = false;
            }
            var val1 = utils.validate.empty(data);
            var val2 = utils.validate.isZero(data);
            if (val1 == false || val2 == false) {
                $('#' + idToDisplay).html(message);
                $('#' + idToDisplay).show();
                $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
                val = false;
            }
            else {
                $('#' + idToDisplay).html('');
                $('#' + idToDisplay).hide();
                val = true;

            }
            return val;
        }
    };

    var SetValue = function (id, type) {
        
        if (type == 'input') {
            var data = $('#' + id).val();
            if (data == null || data == '') {
                return '';
            }
            else {
                return $('#' + id).val();
            }

        }
        else if (type == 'date') {
            var txt = $('#' + id).val();
            //var date = new Date(txt);
            return txt;
        }
        else if (type == 'dropDown') {
            var data = $('#' + id).val();
            if (data == null) {
                return '0';
            }
            else {
                return $('#' + id).val();
            }
        }
        else if (type == 'state') {
            return $('#' + id).val();
        }
        else if (type == 'district') {
            return $('#' + id).val();
        }

    };
    var postBack = function (data) {
        if (data == true) {
            $('#returnMessage').show();
            $('#returnMessage').append(familySuccess);
            //var LangId = utils.localStorage().get('LangID');
            //if (LangId == 2)
            //    $('#returnMessage').append('परिवार के सदस्य को सफलता पूर्वक शामिल किया');
            //else
            //    $('#returnMessage').append('Family Member Added Successfully');


            
            setTimeout(function () { window.location = 'primarybeneficiary.html'; }, 2000);
        }
    };
})();