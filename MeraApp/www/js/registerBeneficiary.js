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
var genderReq = 'Gender is required';
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
    $(function () {
        utils.Analytics.trackPage('RegisterBeneficiary');
        document.addEventListener("deviceready", onDeviceReady, false);
        var languageId = utils.localStorage().get('LangID');
        $('#infoMessage').html(mobileReq);
       
    function onDeviceReady() {
            var user = utils.localStorage().get('user');
            var pageVal = null;
            if (user != null) {
                pageVal = 'Register Beneficiary Page || ' + 'User:' + user.userName + ' || StateID: ' + user.StateID;
            }
            else {
                pageVal = 'Register Beneficiary Page';
            }
            utils.Analytics.trackPage(pageVal);

        }
    });
    function errorCB(err) {
        
     //   alert("Error fetching Data: " + err.message);
    }
    var checkValidDate = function (d) {
        
        var date = d.split('/');
        if (date[2] >= 1902)
            return d;
        else
            return '';
    };
    var getCmsKeyVal = function (cmsKeys, key) {
        var keyVal = '';
        $.each(cmsKeys, function (i, dat) {
            
            var cmsKey = 'Cms' + key;
            if (dat.KeyName == cmsKey) {
                
                keyVal = dat.KeyValue;
                if (keyVal != undefined && keyVal != '' && dat.KeyName != 'CmsSpecialGroup' && dat.KeyName != 'CmsDisability' && dat.KeyName != 'CmsSickness')
                keyVal = keyVal + '*';
            }

            switch (dat.KeyName) {
                case 'CmsMobileNumber':
                    $('#Phone').attr("placeholder", dat.KeyValue + ' *');
                    break;
                case 'CmsIdDetails':
                    $('#IdDetails').attr("placeholder", dat.KeyValue);
                    break;
                case 'CmsAddress':
                    $('#Village').attr("placeholder", dat.KeyValue);
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
                case 'CmsProfileSuccess':
                    familySuccess = dat.KeyValue;
                    break;
                case 'CmsAadharLength':
                    aadharLength = dat.KeyValue;
                    break;
                case 'CmsInvalidEmail':
                    cmsInvalidEmail = dat.KeyValue;
                    break;

                case 'CmsConsent':
                    Consent = dat.KeyValue;
                    $('#divConsent').html(Consent);
                    break;

                case 'CmsEULA':
                    EULA = dat.KeyValue;
                    $('#divEULA').html(EULA);
                    break;

                case 'CmsAgree':
                    Agree = dat.KeyValue;
                    $('#divAgree').html(Agree);
                    break;
            }
        });
        return keyVal;
    }
    var filterByLang = function (data) {
        var lang = utils.localStorage().get('LangID');
        var k = 0;
        var obj = new Object();
        $.each(data, function (i, dat) {
            if (dat.LangID == lang || dat.LangId == lang)
            {
                if (dat.Name == undefined || dat.Name == null) {
                    console.log('dat ' + dat);
                }
                else
                if ((lang != 2 && dat.Name.search('Any') < 0) || (lang == 2 && dat.Name.search('कोई') < 0)) {
                    obj[k] = dat;
                }
                k += 1;
            }
                
        });
        return obj;
    };
    var AllData = new Array();
    var callBack = function (data) {
        
        var cmsKeys = utils.localStorage().get('CMSKey');
       // utils.bindDropDown(filterByLang(data.Ages), getCmsKeyVal(cmsKeys, 'Age'), 'Age'); //
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
        
        bindStates(filterByLang(data.States), getCmsKeyVal(cmsKeys, 'State'), 'State'); //

        bindDistricts(filterByLang(data.Districts), getCmsKeyVal(cmsKeys, 'District'), 'District');
        AllData = JSON.parse(JSON.stringify(filterByLang(data.Districts)));
        
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
                else if (type == 'text' || type == 'number' || type == 'tel') {
                    if (id != undefined && id != 'percentageDisability' && id != 'FamilyIncome' && id!='Phone' && id != 'EMail' && id!='TypeofDisability')
                    {
                        dat.KeyValue= dat.KeyValue + ' *';
                    }
                        $('#' + id).attr("placeholder", dat.KeyValue);

                }
                else
                {
                    if (id != undefined && id != 'basicInfo' && id != 'newReistrationHeader' && id != 'registerBeneficiary' && id != 'backgroundInfo') {
                        
                        dat.KeyValue = dat.KeyValue + ' *';
                    }
                    $('#' + id).html(dat.KeyValue);
                }
                if (dat.KeyName == 'CmsIdDetails') {
                    dat.KeyValue = dat.KeyValue.replace('*','');
                    $('#' + id).attr("placeholder", dat.KeyValue);
                }

            });

        }
        var str = $('#Phone').attr("placeholder");
        $('#Phone').attr("placeholder", str + ' *');
    }
    $(function () {
       
        db.transaction(queryCMS, errorCB);
        var masterData = utils.localStorage().get('masterDataBeneficiary');
       
        callBack(masterData);
        
        var LangId = utils.localStorage().get('LangID');
        var image = document.getElementById('imgProfilePic');
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
        $('#RemovePhoto').click(function () {
            
            var LangId = utils.localStorage().get('LangID');
            utils.localStorage().set('setImage', false);
            var image = document.getElementById('imgProfilePic');
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
                        break;
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
    bindStates = function (itemList, obj, dropDown) {
        var stateID = 0;
        var LangId = utils.localStorage().get('LangID');
        
        var user = utils.localStorage().get('user');
        stateID = user.StateID;

        if (LangId != 1) {
            stateID = utils.localStorage().get('HindiStateId');
        }
        $.each(itemList, function (i, data) {
           
            if (data.StateID == stateID) {
                
                
                $('#bindState').html(data.StateName);
                $('#State').html(data.StateID);
                return false;
            }
        });
        
    };
    bindDistricts = function (itemList, obj, dropDown) {
        
        
        var districtID = 0;
        var LangId = utils.localStorage().get('LangID');

        var user = utils.localStorage().get('user');
        districtID = user.DistrictID;

        if (LangId != 1) {
            districtID = utils.getDistrict(user.DistrictID);
        }
        $.each(itemList, function (i, data) {
             
            if (data.DistrictID == districtID) {
                
               // alert(data.StateName);
                $('#bindDistrict').html(data.DistrictName);
                $('#District').html(data.DistrictID);
                return false;
            }
        });
    };

    $('#registerBeneficiary').click(function () {
        var objStats = true;
        var user = utils.localStorage().get('user');
        var image = document.getElementById('imgProfilePic');
        var dataImage = utils.pureBase64(image.src);
        var ajaxObj = {
            url: utils.Urls.AddBeneficiary,
            type: 'POST',
            obj: {
                'Id': utils.randomNum(),
                'ParentId': '0',
                'FirstName': SetValue('FirstName', 'input'),
                'LastName': SetValue('LastName', 'input'),
                'FathersName': SetValue('FathersName', 'input'),
                'HusbandsName': SetValue('HusbandsName', 'input'),
                'DOB': SetValue('DOB', 'date'),
                'IDDetails': SetValue('IdDetails', 'input'),
                'IDProof': SetValue('IDProof', 'dropDown'),
                'Sex': SetValue('Gender', 'dropDown'),
                //'Age': SetValue('Age', 'dropDown'),
                'Religion': SetValue('Religion', 'dropDown'),
                'Socio': SetValue('EconomicSocial', 'dropDown'),
                'Occupation': SetValue('Occupation', 'dropDown'),
                'MaritulStatus': SetValue('MaritalStatus', 'dropDown'),
                'Category': SetValue('Category', 'dropDown'),
                'Department': SetValue('Department', 'dropDown'),
                'EmpStatus': SetValue('EmpStatus', 'dropDown'),
                'VulGroup': SetValue('SpecialGroup', 'dropDown'),
                'AnnualIncome': SetValue('FamilyIncome', 'input'),
                'Disablity': SetValue('TypeofDisability', 'dropDown'),
                'SoochnaPreneur': user.userName,
                'State': user.StateID, //SetValue('State', 'input'),
                'District': user.DistrictID, //SetValue('District', 'input'),
                'Photo': dataImage,
                'Relationship': '0',
                'Sickness': SetValue('Sickness', 'dropDown'),
                'PercentageDisability': SetValue('percentageDisability', 'input'),
                'Address': SetValue('Village', 'input'),
                'Block': SetValue('Block', 'input'),
                'Panchayat': SetValue('Panchayat', 'input'),
                'Village': SetValue('Village', 'input'),
                'EMail': SetValue('EMail', 'input'),
                'Phone': SetValue('Phone', 'input'),
                'Qualifications': SetValue('Qualification', 'dropDown')
            }
        };
        var LangId = 1;
        LangId = utils.localStorage().get('LangID');
        message = photoReq;
        if (objStats) {
            objStats = utils.localStorage().get('setImage');
            if (!objStats) {
                $('#returnMessage').html(message);
                $('#returnMessage').show();
                $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
                return;
            }
            else {
                $('#returnMessage').html('');
                $('#returnMessage').hide();
            }
        }
        //  if (LangId == 1) {
        if (objStats) {
            objStats = ValidateObject(ajaxObj.obj.FirstName, firstNameReq, 'input', 'returnMessage');
        }
        if (objStats) {
            objStats = ValidateObject(ajaxObj.obj.LastName, surNameReq, 'input', 'returnMessage');
        }
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
            objStats = ValidateObject(ajaxObj.obj.EmpStatus, empStatusReq, 'dropDown', 'returnMessage');
        if (objStats)
            objStats = ValidateObject(ajaxObj.obj.Occupation, occupationReq, 'dropDown', 'returnMessage');
        if (objStats)
            objStats = ValidateObject(ajaxObj.obj.Qualifications, qualificationReq, 'dropDown', 'returnMessage');
        if (objStats)
            objStats = ValidateObject(ajaxObj.obj.MaritulStatus, maritalStatusReq, 'dropDown', 'returnMessage');
        if (objStats)
            objStats = ValidateObject(ajaxObj.obj.Category, categoryReq, 'dropDown', 'returnMessage');

        //    objStats = ValidateObject(ajaxObj.obj.State, 'Select the State of Beneficiary', 'dropDown', 'returnMessage');
        //if (objStats)
        //    objStats = ValidateObject(ajaxObj.obj.District, 'Select the District of Beneficiary', 'dropDown', 'returnMessage');
        //  }

        if (objStats) {
            objStats = utils.isPureEnglish(ajaxObj.obj.FirstName);
            objStats = utils.isPureEnglish(ajaxObj.obj.LastName);
            if (ajaxObj.obj.FathersName != undefined && ajaxObj.obj.FathersName.length > 0)
                objStats = utils.isPureEnglish(ajaxObj.obj.FathersName);
            if (!objStats) {
                var message = engNameReq;
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
            CheckBeneficiaryAadhar(ajaxObj);
        }

        //$('#registerConsent').show();

    });

    var ValidateObject = function (data, message, type, idToDisplay) {
        var val = true;
        if (type == 'input') {
            val = utils.validate.empty(data);
            theOffset = $(this).offset();
            if (val == false) {
                $('#' + idToDisplay).html(message);
                $('#' + idToDisplay).show();
                $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55}, 'slow');
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
            var val1 = utils.validate.empty(data) ;
            var val2 = utils.validate.isZero(data) ;
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
            if (data == null) {
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
        if (data != 0) {
            $('#returnMessage').show();
            var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);

            db.transaction(AddBeneficiaryAnalytics, errorCB);

            var LangId = utils.localStorage().get('LangID');
            var benCount = utils.localStorage().get('NewBen');
            if (benCount == undefined || benCount == '' || benCount == 0)
                utils.localStorage().set('NewBen', data);
            else {
                benCount = benCount + ',' + data;
                utils.localStorage().set('NewBen', benCount);
            }
            $('#returnMessage').append(familySuccess);
             setTimeout(function () { window.location = 'myaccount.html'; }, 2000);
        }
    };
    function CheckBeneficiaryAadhar(ajaxObj) {
       
        var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
        db.transaction(function (tx) {
            var aadhar = SetValue('IdDetails', 'input');
            var queryText = "SELECT * FROM Beneficiary WHERE IDDetails = '" + aadhar + "'";
            
            var message = '';
            var LangId = utils.localStorage().get('LangID');
            message = alreadyRegistered;
           
            tx.executeSql(queryText, [], function (tx, data) {
                if (data.rows.length > 0 && utils.validate.empty(aadhar) == true) {
                    $('#returnMessage').html(message);
                    $('#returnMessage').show();
                    $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
                }
                else {
                    $('#returnMessage').html('');
                    $('#returnMessage').hide();
                    $('#myModal').modal('toggle');
                    $(this).hide();
                    var today = new Date();
                    
                    //utils.ajaxCall(ajaxObj.url, ajaxObj.type, ajaxObj.obj, postBack);
                    db.transaction(function (tx) {
                        if (ajaxObj.obj.PercentageDisability == '') ajaxObj.obj.PercentageDisability = null;
                        if (ajaxObj.obj.DOB == 'Invalid Date')
                            ajaxObj.obj.DOB = '';
                        //else {
                        //    //var d = ajaxObj.obj.DOB.getDate();
                        //    //var m = ajaxObj.obj.DOB.getMonth() + 1;
                        //    //var y = ajaxObj.obj.DOB.getFullYear();
                        //    //CurrentDate = utils.toPaddedDate(ajaxObj.obj.DOB);
                        //}
                        var stmt = "INSERT INTO Beneficiary (Id, Beneficiary, FirstName, LastName, FathersName, HusbandsName, DOB, IDProof, IDDetails, State, District, Sex, Age, Religion, Socio, Occupation, MaritalStatus, Category, Department, EmploymentStatus, VulGroup, AnnualIncome, Disabilty, SoochnaPreneur, Photo, Relationship, Sickness, PercentageDisablity, Address, EMail, Phone, IsUpdated, Qualification, DateOfRegistration, Block, Panchayat, Village) VALUES (";
                        stmt += ajaxObj.obj.Id + "," + ajaxObj.obj.ParentId + ",'" + ajaxObj.obj.FirstName + "','" + ajaxObj.obj.LastName + "','" + ajaxObj.obj.FathersName + "','" + ajaxObj.obj.HusbandsName + "','" + ajaxObj.obj.DOB + "'," + ajaxObj.obj.IDProof + ",'" + ajaxObj.obj.IDDetails + "'," + ajaxObj.obj.State + "," + ajaxObj.obj.District + "," + ajaxObj.obj.Sex + "," + ajaxObj.obj.Age + "," + ajaxObj.obj.Religion + "," + ajaxObj.obj.Socio + "," + ajaxObj.obj.Occupation + "," + ajaxObj.obj.MaritulStatus + "," + ajaxObj.obj.Category + "," + ajaxObj.obj.Department + "," + ajaxObj.obj.EmpStatus + "," + ajaxObj.obj.VulGroup + ",'" + ajaxObj.obj.AnnualIncome + "'," + ajaxObj.obj.Disablity + ",'" + ajaxObj.obj.SoochnaPreneur + "','" + ajaxObj.obj.Photo + "'," + ajaxObj.obj.Relationship + ",'" + ajaxObj.obj.Sickness + "','" + ajaxObj.obj.PercentageDisability + "','" + ajaxObj.obj.Address + "','" + ajaxObj.obj.EMail + "','" + ajaxObj.obj.Phone + "','true'," + ajaxObj.obj.Qualifications + ",'" + today.toJSON().slice(0, 10).replace(/-/g, '/') + "','" + ajaxObj.obj.Block + "','" + ajaxObj.obj.Panchayat + "','" + ajaxObj.obj.Village + "')";
                        console.log(stmt);
                        tx.executeSql(stmt);
                        try {
                            var track = {
                                Category: 'RegisterBeneficiary', Action: 'AddBeneficiaryClick', Label: 'Beneficiary', Value: { 'Beneficiary': ajaxObj.obj.FirstName + ajaxObj.obj.LastName, 'SoochnaPreneur': ajaxObj.obj.SoochnaPreneur }
                            };
                            utils.Analytics.trackEvent(track);
                        }
                        catch (e) {
                            console.log(JSON.stringify(e));
                        }
                        postBack(ajaxObj.obj.Id + "$$" + ajaxObj.obj.FirstName);
                    }, errorCB);

                }

            }, errorCB);
        }, errorCB);
     

    }
    function AddBeneficiaryAnalytics(tx) {
        var user = utils.localStorage().get('user');
        var LangId = utils.localStorage().get('LangID');
        var SchemeId = utils.localStorage().get('SchemeId');

        var param1 = new Date();
        var today = (param1.getMonth() + 1) + '/' + param1.getDate() + '/' + param1.getFullYear() + ' ' + param1.getHours() + ':' + param1.getMinutes() + ':' + param1.getSeconds();

        var sqlStmt = "INSERT INTO AnalyticsApp (AnalyticsCode, Feature, SoochnaPreneur, StateId, LangId, ObjectId, ObjectType, FeatureClicked, EventDateTime)  VALUES ";
        sqlStmt += "  ('B0001','Beneficiary','" + user.userName + "'," + user.StateID + "," + LangId + ",'ObjectId','ObjectType','Add Beneficiary','" + today + "')";

        if (sqlStmt != undefined && sqlStmt != null) {
            tx.executeSql(sqlStmt);
        }
    }
})();

function onDeviceReady() {
    window.analytics.startTrackerWithId('UA-98636842-1', 7200);
    try {
        window.analytics.trackView('Register Beneficiary');
    } catch (e) {
        console.log(JSON.stringify(e));
    }
   
    };


